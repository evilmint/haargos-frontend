'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { Script } from '@/app/types';
import { HALink } from '@/components/ha-link';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { ScriptTableView, columns } from './scripts-data-table-columns';

export function ScriptsDataTableProxy({ ...params }) {
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

  let scripts: ScriptTableView[] = [];

  if (observations && observations.length > 0) {
    scripts = observations[0].scripts.map(mapToTableView);
  }

  return (
    <>
      {installation?.urls.instance?.success_url && (
        <HALink
          installationName={installation?.name}
          actionName="Scripts"
          instanceHost={installation.urls.instance.success_url}
          domain="scripts"
        />
      )}

      <GenericDataTable
        columns={columns}
        pluralEntityName="scripts"
        filterColumnName="alias"
        columnVisibilityKey="ScriptsDataTableColumns"
        data={scripts}
        linkColumnName="alias"
        link={(script: ScriptTableView) => {
          if (!installation?.urls?.instance?.url) {
            return null;
          }

          return (
            installation?.urls?.instance?.url + '/config/script/edit/' + script.unique_id
          );
        }}
      />
    </>
  );
}

function mapToTableView(script: Script): ScriptTableView {
  return {
    alias: script.alias,
    unique_id: script.unique_id,
    name: script.friendly_name ?? '',
    state: script.state ?? 'n/a',
    last_triggered: script.last_triggered,
  };
}
