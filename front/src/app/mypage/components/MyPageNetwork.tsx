import { useState } from 'react';

import { SelectButton } from '@/app/(auth)/signup/components/Button';
import { NETWORKS } from '@/constants/user';
import { useUpdateNetworksMutation } from '@/services/user/hooks';
import { Network } from '@/types/user';

import { EditIcon } from './EditIcon';

interface MyPageNetworkProps {
  networks: Network[] | null;
}

export function MyPageNetwork({ networks }: MyPageNetworkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNetworks, setTempNetworks] = useState<Network[]>(networks || []);
  const { mutate: updateNetworks } = useUpdateNetworksMutation();

  const networkOptions = Object.entries(NETWORKS).map(([key, { label }]) => ({
    value: Number(key) as Network,
    label,
  }));

  const handleEditClick = () => {
    if (isEditing) {
      updateNetworks(
        { networks: tempNetworks },
        {
          onSuccess: () => setIsEditing(false),
        },
      );
    } else {
      setIsEditing(true);
    }
  };

  const handleNetworkClick = (value: Network) => {
    const isSelected = tempNetworks.includes(value);
    if (isSelected && tempNetworks.length === 1) {
      return;
    }

    const newNetworks = isSelected
      ? tempNetworks.filter((v) => v !== value)
      : [...tempNetworks, value];
    setTempNetworks(newNetworks);
  };

  return (
    <section>
      <div className="mb-2 flex items-center gap-1">
        <label className="body1 text-custom-realblack">네트워크 목적</label>
        <EditIcon isEditing={isEditing} onClick={handleEditClick} />
      </div>
      {isEditing ? (
        <div className="flex flex-wrap gap-2">
          {networkOptions.map((item) => (
            <SelectButton
              key={item.value}
              label={item.label}
              isSelected={tempNetworks.includes(item.value)}
              onClick={() => handleNetworkClick(item.value)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tempNetworks && tempNetworks.length > 0 ? (
            tempNetworks
              .sort((a, b) => a - b)
              .map((n) => (
                <SelectButton
                  key={n}
                  label={NETWORKS[n]?.label}
                  isSelected={true}
                  onClick={() => {}}
                  className="cursor-default"
                />
              ))
          ) : (
            <span className="subhead2 text-custom-realblack px-1">선택 안 함</span>
          )}
        </div>
      )}
    </section>
  );
}
