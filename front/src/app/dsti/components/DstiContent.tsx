interface DstiSectionProps {
  id: string;
  title: string;
  label: string;
  children: React.ReactNode;
}

export default function DstiContent({ id, title, label, children }: DstiSectionProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm">
      {/* 섹션 헤더: 텍스트 간격과 색상 강조 */}
      <div className="bg-custom-catskillwhite flex items-center justify-between border-b border-slate-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="body1 text-slate-200">{id}</span>
          <h2 className="body1 text-custom-realblack">{title}</h2>
        </div>
        <span className="footout text-slate-400">{label}</span>
      </div>
      
      {/* 섹션 내용: 내부 아이템들이 점선으로 구분되도록 설정 */}
      <div className="flex flex-col divide-y divide-dashed divide-slate-100">
        {children}
      </div>
    </div>
  );
}