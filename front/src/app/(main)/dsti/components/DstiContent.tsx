interface DstiSectionProps {
  id: string;
  title: string;
  label: string;
  children: React.ReactNode;
}

export default function DstiContent({ id, title, label, children }: DstiSectionProps) {
  return (
    <div className="mb-3.5 overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm">
      <div className="bg-custom-catskillwhite flex items-center justify-between border-b border-slate-50 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="subhead1 text-custom-darkgray">{id}</span>
          <h2 className="subhead1 text-custom-realblack">{title}</h2>
        </div>
        <span className="footout text-custom-deepgray/70">{label}</span>
      </div>

      <div className="flex flex-col divide-y divide-dashed divide-slate-100">{children}</div>
    </div>
  );
}
