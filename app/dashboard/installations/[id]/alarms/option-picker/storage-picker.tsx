import { useInstallationStore } from '@/app/services/stores/installation';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

export interface StorageOption extends EntityOption {
  name: string;
}

export interface StoragePickerProps {
  installationId: string;
  initialStorages?: StorageOption[] | undefined;
  onStoragesSelected: (storages: StorageOption[]) => void;
}

export function StoragePicker({
  installationId,
  initialStorages,
  onStoragesSelected,
}: StoragePickerProps) {
  const observations =
    useInstallationStore(state => state.observations[installationId]) ?? [];

  const fetchInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const storages =
    (observations ?? []).length > 0 ? observations[0].environment.storage : [];
  const storageOptions: StorageOption[] = storages.map(storage => ({
    id: storage.name,
    displayName: storage.name,
    name: storage.name,
  }));

  const [selectedStorages, setSelectedStorages] = useState<StorageOption[]>(
    initialStorages ?? [],
  );

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetch = async () => {
      const token = await getAccessTokenSilently();
      fetchInstallation(installationId, token, false);
    };

    fetch();
  });

  useEffect(() => {
    onStoragesSelected(selectedStorages);
  }, [selectedStorages]);

  return (
    <EntityPicker
      label="Storage"
      entities={storageOptions}
      selectedEntities={selectedStorages}
      onSelect={setSelectedStorages}
    />
  );
}
