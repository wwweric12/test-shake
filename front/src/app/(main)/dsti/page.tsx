import DstiContent from '@/app/(main)/dsti/components/DstiContent';
import DstiHeader from '@/app/(main)/dsti/components/DstiHeader';
import DstiTraitItem from '@/app/(main)/dsti/components/DstiTraitItem';
import { DSTI_INDICATORS, DSTI_INFO } from '@/constants/dsti';

export default function DstiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DstiHeader />
      <main className="p-5">
        {DSTI_INDICATORS.map((indicator, index) => (
          <DstiContent
            key={indicator.title}
            id={String(index + 1).padStart(2, '0')}
            title={indicator.title}
            label={indicator.label}
          >
            {indicator.types.map((type) => {
              const info = DSTI_INFO[type];
              return <DstiTraitItem key={type} type={type} {...info} />;
            })}
          </DstiContent>
        ))}
      </main>
    </div>
  );
}
