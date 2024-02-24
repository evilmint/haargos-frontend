import { useInstallationStore } from '@/app/services/stores/installation';
import { Scene } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

interface SceneOption extends EntityOption {
  id: string;
}

export interface ScenePickerProps {
  installationId: string;
  initialScenes?: SceneOption[] | undefined;
  onScenesSelected: (scripts: Scene[]) => void;
}

export function ScenePicker({
  installationId,
  initialScenes,
  onScenesSelected,
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

  const [selectedScenes, setSelectedScenes] = useState<SceneOption[]>(
    initialScenes ?? [],
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
    onScenesSelected(
      scenes.filter(scene => selectedScenes.map(a => a.id).includes(scene.id)),
    );
  }, [selectedScenes]);

  return (
    <EntityPicker
      label="Scene"
      entities={scriptOptions}
      selectedEntities={selectedScenes}
      onSelect={setSelectedScenes}
    />
  );
}
