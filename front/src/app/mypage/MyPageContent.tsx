'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { useLogoutMutation } from '@/services/auth/hooks';
import { useUserProfile } from '@/services/user/hooks';

import { MyPageCareer } from './components/MyPageCareer';
import { MyPageDSTI } from './components/MyPageDSTI';
import { MyPageExperience } from './components/MyPageExperience';
import { MyPageGithub } from './components/MyPageGithub';
import { MyPageNetwork } from './components/MyPageNetwork';
import { MyPagePositions } from './components/MyPagePositions';
import { MyPageProfile } from './components/MyPageProfile';
import { MyPageSelfIntro } from './components/MyPageSelfIntro';
import { MyPageTechSkills } from './components/MyPageTechSkills';

export default function MyPageContent() {
  const router = useRouter();
  const { data: userData, isLoading } = useUserProfile();
  const { mutate: logout } = useLogoutMutation();

  if (isLoading || !userData?.data) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  const { nickname, profileImageUrl, dsti, experience, career, positions, techSkills, networks } =
    userData.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/login');
      },
    });
  };

  const handleWithdraw = () => {
    // TODO: 회원탈퇴 API 호출
  };

  return (
    <div className="bg-custom-white flex min-h-screen w-full flex-col items-center">
      <header className="flex w-full flex-col items-center justify-center py-5">
        <h1 className="body2 text-custom-realblack">마이페이지</h1>
      </header>
      <MyPageProfile
        nickname={nickname}
        profileImageUrl={profileImageUrl}
        onLogout={handleLogout}
        dsti={dsti}
      />
      <div className="flex w-full flex-col items-baseline gap-5 px-5 pt-5 pb-30">
        <MyPageDSTI dsti={dsti} />

        <MyPageExperience experience={experience} />

        <MyPageCareer career={career} />

        <MyPagePositions positions={positions} />

        <MyPageTechSkills techSkills={techSkills} />

        <MyPageNetwork networks={networks} />

        <MyPageGithub githubId={userData.data.githubId} />

        <MyPageSelfIntro selfIntro={userData.data.selfIntro} />

        <hr className="w-full border-gray-100" />

        <div className="flex w-full">
          <Button
            className="body2 bg-custom-white w-full border-1 border-gray-400 py-7 text-red-600 opacity-50"
            variant="secondary"
            size="sm"
            onClick={handleWithdraw}
          >
            회원탈퇴
          </Button>
        </div>
      </div>
    </div>
  );
}
