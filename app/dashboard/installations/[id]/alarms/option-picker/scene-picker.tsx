import { useInstallationStore } from '@/app/services/stores/installation';
import { Scene } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

interface SceneOption extends EntityOption {
  alias: string;
}

export interface ScenePickerProps {
  installationId: string;
  initialScripts?: SceneOption[] | undefined;
  onScriptsSelected: (scripts: Scene[]) => void;
}

export function ScenePicker({
  installationId,
  initialScripts: initialAddons,
  onScriptsSelected,
}: ScenePickerProps) {
  const observations =
    useInstallationStore(state => state.observations[installationId]) ?? [];

  const fetchInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const scenes = (observations ?? []).length > 0 ? observations[0].scenes : [];
  const scriptOptions: SceneOption[] = scenes.map(script => ({
    id: script.id,
    displayName: script.friendly_name ?? script.id,
    alias: script.id,
  }));

  const [selectedScripts, setSelectedScripts] = useState<SceneOption[]>(
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
      scenes.filter(script => selectedScripts.map(a => a.alias).includes(script.id)),
    );
  }, [selectedScripts]);

  return (
    <EntityPicker
      label="Scene"
      entities={scriptOptions}
      selectedEntities={selectedScripts}
      onSelect={setSelectedScripts}
    />
  );
}
