import { useInstallationStore } from '@/app/services/stores/installation';
import { Script } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

interface ScriptOption extends EntityOption {}

export interface ScriptPickerProps {
  installationId: string;
  initialScripts?: ScriptOption[] | undefined;
  onScriptsSelected: (scripts: Script[]) => void;
}

export function ScriptPicker({
  installationId,
  initialScripts: initialAddons,
  onScriptsSelected,
}: ScriptPickerProps) {
  const observations =
    useInstallationStore(state => state.observations[installationId]) ?? [];

  const fetchInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const scripts = (observations ?? []).length > 0 ? observations[0].scripts : [];
  const scriptOptions: ScriptOption[] = scripts
    .filter(s => !!s.unique_id)
    .map(script => ({
      id: script.unique_id!,
      displayName: script.alias,
    }));

  const [selectedScripts, setSelectedScripts] = useState<ScriptOption[]>(
    initialAddons ?? [],
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
    onScriptsSelected(
      scripts.filter(script =>
        selectedScripts.map(a => a.id).includes(script.unique_id!),
      ),
    );
  }, [selectedScripts]);

  return (
    <EntityPicker
      label="Script"
      entities={scriptOptions}
      selectedEntities={selectedScripts}
      onSelect={setSelectedScripts}
    />
  );
}
