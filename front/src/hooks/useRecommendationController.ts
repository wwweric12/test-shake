import { useEffect, useState } from 'react';

import {
  useActionMutation,
  useCandidates,
  useResetPreferencesMutation,
} from '@/services/recommendation/hooks';
import { UserInfo } from '@/types/user';

export const useRecommendationController = () => {
  const [cards, setCards] = useState<UserInfo[]>([]);
  const [exposureId, setExposureId] = useState<number | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const { data: candidateData, isLoading, isError, refetch } = useCandidates(6);
  const actionMutation = useActionMutation();
  const resetMutation = useResetPreferencesMutation();

  useEffect(() => {
    if (candidateData?.data) {
      const newCards = candidateData.data.cards;
      if (newCards.length > 0) {
        setCards((prev) => {
          const existingNicknames = new Set(prev.map((c) => c.nickname));
          const uniqueNewCards = newCards.filter((c) => !existingNicknames.has(c.nickname));

          return [...uniqueNewCards, ...prev];
        });
        setExposureId(candidateData.data.exposureId);
      }
    }
  }, [candidateData]);

  const handleSwipe = async (direction: 'left' | 'right', card: UserInfo) => {
    const remainingCards = cards.slice(0, -1);
    setCards(remainingCards);

    if (remainingCards.length <= 2 && !isLoading && !isError) {
      refetch();
    }

    if (exposureId !== null) {
      try {
        await actionMutation.mutateAsync({
          exposureId,
          userId: card.userId,
          actionType: direction === 'right' ? 'LIKE' : 'PASS',
        });
      } catch (e) {
        console.error('Action failed', e);
      }
    }
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

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

  return {
    cards,
    isLoading,
    isError,
    showResetDialog,
    setShowResetDialog,
    handleSwipe,
    handleReset,
    confirmReset,
    refetch,
  };
};
