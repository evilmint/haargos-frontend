import { useInstallationStore } from '@/app/services/stores/installation';
import { Automation } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

interface AutomationOption extends EntityOption {
  name: string;
}

export interface ScriptPickerProps {
  installationId: string;
  initialScripts?: AutomationOption[] | undefined;
  onScriptsSelected: (scripts: Automation[]) => void;
}

export function AutomationPicker({
  installationId,
  initialScripts: initialAddons,
  onScriptsSelected,
}: ScriptPickerProps) {
  const observations =
    useInstallationStore(state => state.observations[installationId]) ?? [];

  const fetchInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const scripts = (observations ?? []).length > 0 ? observations[0].automations : [];
  const scriptOptions: AutomationOption[] = scripts.map(script => ({
    id: script.alias,
    name: script.friendly_name ?? script.id,
    displayName: script.friendly_name ?? script.id,
  }));

  const [selectedScripts, setSelectedScripts] = useState<AutomationOption[]>(
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
      scripts.filter(script => selectedScripts.map(a => a.name).includes(script.alias)),
    );
  }, [selectedScripts]);

  return (
    <EntityPicker
      label="Automation"
      entities={scriptOptions}
      selectedEntities={selectedScripts}
      onSelect={setSelectedScripts}
    />
  );
}
