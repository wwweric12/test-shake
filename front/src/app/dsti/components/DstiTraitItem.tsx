interface TraitItemProps {
  type: string;
  label: string;
  copy: string;
  desc: string;
  tags: string[];
}

export default function TraitItem({ type, label, copy, desc, tags }: TraitItemProps) {

  const isOrangeType = ['E', 'B', 'W', 'U'].includes(type);
  const typeColorClass = isOrangeType 
    ? 'bg-orange-100 text-orange-600' 
    : 'bg-custom-blue/10 text-custom-blue';

  return (
    <div className="flex flex-col gap-4 p-4">
      
      <div className="flex items-center gap-3">
        <div className={`${typeColorClass} flex h-[30px] w-[30px] items-center justify-center rounded-md text-[12px] font-bold`}>
          {type}
        </div>
        <p className="text-[20px] font-bold text-custom-realblack leading-tight">{label}</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <p className="text-[16px] font-bold text-custom-realblack leading-tight">
          {copy}
        </p>
        <p className="text-[14px] text-custom-deepgray/70 leading-relaxed">
          {desc}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map((tag, index) => (
          <span 
            key={`${tag}-${index}`} 
            className="bg-[#F1F3F5] text-[#868E96] text-[12px] font-medium rounded-[6px] px-2.5 py-1"
          >
            {tag.startsWith('#') ? tag : `#${tag}`}
          </span>
        ))}
      </div>
    </div>
  );
}