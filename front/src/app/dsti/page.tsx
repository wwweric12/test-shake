import DstiContent from '@/app/dsti/components/DstiContent';
import DstiHeader from '@/app/dsti/components/DstiHeader';
import DstiTraitItem from '@/app/dsti/components/DstiTraitItem';
import { DSTI_INDICATORS, DSTI_INFO } from '@/constants/dsti';

export default function DstiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <DstiHeader />
      <main className="p-5">
        {DSTI_INDICATORS.map((indicator, index) => (
        <DstiContent 
          key={indicator.title}
          id={String(index + 1).padStart(2, '0')} // "01", "02" ...
          title={indicator.title}
          label={indicator.label}
        >
          {indicator.types.map((type) => {
            const info = DSTI_INFO[type];
            return (
              <DstiTraitItem 
                key={type}
                type={type}
                {...info} // label, copy, desc, tags 자동 전달
              />
            );
          })}
        </DstiContent>
      ))}
      </main>
    </div>
  );
}