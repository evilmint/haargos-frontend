'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
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
      {installation?.urls.instance?.success_url && (
        <HALink
          installationName={installation?.name}
          actionName="Scenes"
          instanceHost={installation.urls.instance.success_url}
          domain="scenes"
        />
      )}
      <GenericDataTable
        columns={columns}
        pluralEntityName="scenes"
        filterColumnName="friendly_name"
        columnVisibilityKey="SceneDataTable_columnVisibility"
        data={scenes}
        linkColumnName="friendly_name"
        link={(scene: SceneTableView) => {
          if (!installation?.urls?.instance?.url) {
            return null;
          }

          return installation?.urls?.instance?.url + '/config/scene/edit/' + scene.id;
        }}
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
