'use client';

import { useInstallationStore } from '@/app/services/stores';
import { Observation, Scene } from '@/app/types';
import { HALink } from '@/components/ha-link';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { SceneTableView, columns } from './scenes-data-table-columns';

export function SceneDataTableProxy({ ...params }) {
  const { installationId } = params;

  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == installationId,
  );
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  const scenes =
    observations?.length > 0
      ? (observations[0].scenes ?? []).map(a => mapToTableView(a, observations[0]))
      : [];

  return (
    <>
      <HALink
        installationName={installation?.name}
        actionName="Scenes"
        instanceHost={installation?.urls.instance?.url}
        domain="scenes"
      />
      <GenericDataTable
        columns={columns}
        pluralEntityName="scenes"
        filterColumnName="friendly_name"
        columnVisibilityKey="SceneDataTable_columnVisibility"
        data={scenes}
      />
    </>
  );
}

function mapToTableView(scene: Scene, observation: Observation): SceneTableView {
  return {
    id: scene.id,
    name: scene.name,
    state: scene.state ?? 'n/a',
    friendly_name: scene.friendly_name ?? 'n/a',
  };
}
