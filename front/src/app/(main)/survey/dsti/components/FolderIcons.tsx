'use client';

import { StaticImageData } from 'next/image';

import EmptyFolderIcon from '@/assets/icon/empty-folder.svg';
import FullFolderIcon from '@/assets/icon/full-folder.svg';

export default function FolderIcons() {
  const emptyIcon = EmptyFolderIcon as StaticImageData;
  const fullIcon = FullFolderIcon as StaticImageData;

  return (
    <div className="mb-3 flex justify-start gap-[18px] pl-[16px]">
      <div
        className="bg-custom-blue h-6 w-6"
        style={{
          mask: `url(${emptyIcon.src}) no-repeat center / contain`,
          WebkitMask: `url(${emptyIcon.src}) no-repeat center / contain`,
        }}
      />
      <div
        className="bg-custom-blue h-6 w-6"
        style={{
          mask: `url(${fullIcon.src}) no-repeat center / contain`,
          WebkitMask: `url(${fullIcon.src}) no-repeat center / contain`,
        }}
      />
      <div
        className="bg-custom-purple h-6 w-6"
        style={{
          mask: `url(${emptyIcon.src}) no-repeat center / contain`,
          WebkitMask: `url(${emptyIcon.src}) no-repeat center / contain`,
        }}
      />
      <div
        className="bg-custom-purple h-6 w-6"
        style={{
          mask: `url(${fullIcon.src}) no-repeat center / contain`,
          WebkitMask: `url(${fullIcon.src}) no-repeat center / contain`,
        }}
      />
    </div>
  );
}
