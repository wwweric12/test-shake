import BottomNavigation from '@/components/common/BottomNavigation';
import Header from '@/components/common/Header';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      {children}
      <BottomNavigation />
    </div>
  );
}
