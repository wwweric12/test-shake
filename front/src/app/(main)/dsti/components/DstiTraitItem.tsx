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
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2.5">
        <div
          className={`${typeColorClass} flex h-[20px] w-[20px] items-center justify-center rounded-md text-[12px] font-bold`}
        >
          {type}
        </div>
        <p className="body1 text-custom-realblack leading-tight font-bold">{label}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-custom-realblack subhead1 leading-tight font-bold">{copy}</p>
        <p className="text-custom-deepgray footnote leading-relaxed">{desc}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-0.5">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="caption1 text-custom-deepgray bg-custom-catskillwhite rounded-[6px] px-2.5 py-1 font-medium"
          >
            {tag.startsWith('#') ? tag : `#${tag}`}
          </span>
        ))}
      </div>
    </div>
  );
}
