import { useEffect, useState } from 'react';

import {
  useActionMutation,
  useCandidates,
  useResetPreferencesMutation,
  useSubmitSurveyMutation,
} from '@/services/recommendation/hooks';
import { UserInfo } from '@/types/user';

export const useRecommendationController = () => {
  const [cards, setCards] = useState<UserInfo[]>([]);
  const [exposureId, setExposureId] = useState<number | null>(null);
  const [remainingSwipes, setRemainingSwipes] = useState<number>(20);

  // 대화상자 제어 상태
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);

  // 설문 및 데이터 갱신 관련 상태
  const [isSurveyTarget, setIsSurveyTarget] = useState(false); // 소진 문구 깜빡임 방지용
  const [isSurveyRefetching, setIsSurveyRefetching] = useState(false);
  const [wasSatisfied, setWasSatisfied] = useState<boolean | null>(null);
  const [extraSurveyStatus, setExtraSurveyStatus] = useState<'BEFORE_SURVEY' | 'AFTER_SURVEY'>(
    'BEFORE_SURVEY',
  );

  const { data: candidateData, isLoading, isError, refetch } = useCandidates(6);
  const actionMutation = useActionMutation();
  const resetMutation = useResetPreferencesMutation();
  const surveyMutation = useSubmitSurveyMutation();

  // 1. 후보자 데이터 수신 시 카드 스택 업데이트
  useEffect(() => {
    if (candidateData?.data) {
      const { cards: newCards, exposureId, remainingSwipes: serverRemaining } = candidateData.data;

      setRemainingSwipes(serverRemaining);

      if (newCards.length > 0) {
        setCards((prev) => {
          const existingNicknames = new Set(prev.map((c) => c.nickname));
          const uniqueNewCards = newCards.filter((c) => !existingNicknames.has(c.nickname));
          return [...uniqueNewCards, ...prev];
        });
        setExposureId(exposureId);
      }
    }
  }, [candidateData]);

  // 2. 스와이프 액션 핸들러
  const handleSwipe = async (direction: 'left' | 'right', card: UserInfo) => {
    const nextCards = cards.slice(0, -1);
    setCards(nextCards); // UI 즉시 반영

    if (exposureId !== null) {
      try {
        const response = await actionMutation.mutateAsync({
          exposureId,
          userId: card.userId,
          actionType: direction === 'right' ? 'LIKE' : 'PASS',
        });

        const currentStatus = response.data.extraSurveyStatus;
        const updatedRemaining = remainingSwipes - 1;

        setExtraSurveyStatus(currentStatus);
        setRemainingSwipes(updatedRemaining);

        // [AFTER_SURVEY] 2장 남았을 때 미리 카드 보충
        if (nextCards.length === 2 && currentStatus === 'AFTER_SURVEY' && updatedRemaining > 0) {
          refetch();
        }

        // [BEFORE_SURVEY] 카드 소진 시 설문 트리거
        if (nextCards.length === 0 && currentStatus === 'BEFORE_SURVEY') {
          setIsSurveyTarget(true); // 소진 문구 노출 차단
          setShowSurveyDialog(true);
        }
      } catch (e) {
        console.error('Action failed', e);
      }
    }
  };

  // 3. 초기화 로직
  const handleReset = () => setShowResetDialog(true);

  const confirmReset = async () => {
    try {
      await resetMutation.mutateAsync();
      setCards([]);
      refetch();
    } catch (e) {
      console.error('Reset failed', e);
    } finally {
      setShowResetDialog(false);
    }
  };

  // 4. 설문 제출 및 피드백 반영 리프레시
  const handleSurveySubmit = async (isSatisfied: boolean, metaInfoType?: string) => {
    try {
      setWasSatisfied(isSatisfied);
      setIsSurveyRefetching(true);

      await surveyMutation.mutateAsync({ isSatisfied, metaInfoType });
      setShowSurveyDialog(false);

      // 최소 1.5초 로딩 보장 (사용자 피드백 인지 시간 확보)
      setCards([]);
      await Promise.all([refetch(), new Promise((resolve) => setTimeout(resolve, 1500))]);
    } catch (e) {
      console.error('Survey flow failed', e);
    } finally {
      setIsSurveyRefetching(false);
      setIsSurveyTarget(false);
    }
  };

  return {
    cards,
    isLoading,
    isError,
    showResetDialog,
    setShowResetDialog,
    showSurveyDialog,
    setShowSurveyDialog,
    handleSwipe,
    handleReset,
    confirmReset,
    handleSurveySubmit,
    refetch,
    isSurveyRefetching,
    wasSatisfied,
    isSurveyTarget,
  };
};
