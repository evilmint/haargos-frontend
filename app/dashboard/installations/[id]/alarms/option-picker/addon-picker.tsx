import { useAddonsStore } from '@/app/services/stores/addons';
import { AddonsApiResponseAddon } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

interface AddonOption extends EntityOption {
  slug: string;
}

export interface AddonPickerProps {
  installationId: string;
  initialAddons?: AddonOption[] | undefined;
  onAddonsSelected: (addons: AddonsApiResponseAddon[]) => void;
}

export function AddonPicker({
  installationId,
  initialAddons,
  onAddonsSelected,
}: AddonPickerProps) {
  // Fetch addons and transform them into AddonOption[] if needed
  const addons =
    useAddonsStore(state => state.addonsByInstallationId[installationId]) ?? [];

  const fetchAddons = useAddonsStore(state => state.fetchAddons);

  const addonOptions: AddonOption[] = addons.map(addon => ({
    id: addon.slug,
    displayName: addon.name,
    slug: addon.slug,
  }));

  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>(
    initialAddons ?? [],
  );

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetch = async () => {
      const token = await getAccessTokenSilently();
      fetchAddons(installationId, token);
    };

    fetch();
  });

  useEffect(() => {
    onAddonsSelected(
      addons.filter(addon => selectedAddons.map(a => a.id).includes(addon.slug)),
    );
  }, [selectedAddons]);

  return (
    <EntityPicker
      label="Addon"
      entities={addonOptions}
      selectedEntities={selectedAddons}
      onSelect={setSelectedAddons}
    />
  );
}
