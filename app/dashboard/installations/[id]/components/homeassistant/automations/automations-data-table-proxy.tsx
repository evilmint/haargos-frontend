'use client';
import { useInstallationStore } from '@/app/services/stores/installation';
import { Automation } from '@/app/types';
import { HALink } from '@/components/ha-link';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { AutomationTableView, columns } from './automations-data-table-columns';

function mapToTableView(automation: Automation): AutomationTableView {
  return {
    id: automation.id,
    name: automation.friendly_name ?? '',
    state: automation.state ?? 'n/a',
    last_triggered: automation.last_triggered,
  };
}

export function AutomationsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == installationId,
  );
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const clearAndReloadObservationsForInstallation = useInstallationStore(
    state => state.clearAndReloadObservationsForInstallation,
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

  let automations: AutomationTableView[] = [];

  if (observations && observations.length > 0) {
    automations = observations[0].automations.map(mapToTableView);
  }

  return (
    <>
      {installation?.urls.instance?.success_url && (
        <HALink
          installationName={installation?.name}
          actionName="Automations"
          instanceHost={installation?.urls.instance?.url}
          domain="automations"
        />
      )}
      <GenericDataTable
        pluralEntityName="automations"
        filterColumnName="name"
        columns={columns}
        columnVisibilityKey="AutomationDataTable_columnVisibility"
        data={automations}
        linkColumnName="name"
        link={(automation: AutomationTableView) => {
          if (!installation?.urls?.instance?.url) {
            return null;
          }

          return (
            installation?.urls?.instance?.url + '/config/automation/edit/' + automation.id
          );
        }}
        reload={async () => {
          const token = await getAccessTokenSilently();
          clearAndReloadObservationsForInstallation(installationId, token);
        }}
      />
    </>
  );
}
