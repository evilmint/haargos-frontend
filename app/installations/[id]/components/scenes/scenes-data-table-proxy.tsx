'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Observation, Automation, Scene } from '@/app/types';
import { SceneDataTable, SceneTableView } from './scenes-data-table';

export function SceneDataTableProxy({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchInstallations, getAccessTokenSilently, fetchObservationsForInstallation, installationId, user]);

  const scenes =
    observations?.length > 0 ? (observations[0].scenes ?? []).map(a => mapToTableView(a, observations[0])) : [];

  return <SceneDataTable data={scenes} />;
}

function mapToTableView(scene: Scene, observation: Observation): SceneTableView {
  return {
    id: scene.id,
    name: scene.name,
    state: scene.state ?? 'n/a',
    friendly_name: scene.friendly_name ?? 'n/a',
  };
}
