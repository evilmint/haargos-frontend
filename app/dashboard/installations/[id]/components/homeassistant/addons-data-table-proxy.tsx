'use client';

import { useAddonsStore } from '@/app/services/stores/addons';
import { useInstallationStore } from '@/app/services/stores/installation';
import { AddonsApiResponseAddon } from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { AddonTableView, columns } from './addons-data-table-columns';

export function AddonDataTableProxy({ ...params }) {
  const { installationId } = params;

  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == installationId,
  );
  const addons = useAddonsStore(
    state => state.addonsByInstallationId[installationId],
  )?.sort((a: AddonsApiResponseAddon, b: AddonsApiResponseAddon) => {
    if (a.update_available) {
      return -1;
    }
    if (b.update_available) {
      return 1;
    }

    return 0;
  });

  const fetchAddonsForInstallation = useAddonsStore(state => state.fetchAddons);
  const { getAccessTokenSilently, user } = useAuth0();
  const clearAndReloadObservationsForInstallation = useInstallationStore(
    state => state.clearAndReloadObservationsForInstallation,
  );
  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchAddonsForInstallation(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [getAccessTokenSilently, fetchAddonsForInstallation, installationId, user]);

  const addonViews = addons?.map(addon => mapToTableView(addon, installationId)) ?? [];

  return (
    <GenericDataTable
      columns={columns}
      pluralEntityName="addons"
      filterColumnName="name"
      defaultColumnVisibility={{
        description: false,
        detached: false,
        advanced: false,
        homeassistant: false,
        available: false,
        stage: false,
        build: false,
        slug: false,
      }}
      columnVisibilityKey="AddonDataTable_columnVisibility"
      data={addonViews}
      linkColumnName="name"
      link={(addon: AddonTableView) => {
        if (!installation?.urls?.instance?.url) {
          return null;
        }

        return installation?.urls?.instance?.url + `/hassio/addon/${addon.slug}/info`;
      }}
      reload={async () => {
        const token = await getAccessTokenSilently();
        clearAndReloadObservationsForInstallation(installationId, token);
      }}
    />
  );
}

function mapToTableView(
  addon: AddonsApiResponseAddon,
  installationId: string,
): AddonTableView {
  return {
    slug: addon.slug,
    name: addon.name,
    action: {
      addonSlug: addon.slug,
      installationId: installationId,
      actionsAvailable: !addon.isHaargos,
      isStopped: addon.state != 'started',
      isRunning: addon.state == 'started',
      isUpdateAvailable: addon.update_available,
    },
    version: addon.version,
    state: addon.state,
    update_available: {
      updateAvailable: addon.update_available,
      addonSlug: addon.slug,
      installationId: installationId,
    },
    advanced: addon.advanced,
    available: addon.available,
    build: addon.build,
    description: addon.description,
    detached: addon.detached,
    homeassistant: addon.homeassistant,
    repository: addon.repository,
    stage: addon.stage,
    repo_url: addon.url,
    version_latest: {
      version: addon.version_latest,
      isLatest: addon.version_latest == addon.version,
    },
  };
}
