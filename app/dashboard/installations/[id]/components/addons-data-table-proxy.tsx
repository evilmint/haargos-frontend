'use client';

import { useAddonsStore, useInstallationStore } from '@/app/services/stores';
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
  const addons = useAddonsStore(state => state.addonsByInstallationId[installationId]);
  const fetchAddonsForInstallation = useAddonsStore(state => state.fetchAddons);
  const { getAccessTokenSilently, user } = useAuth0();

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

  const addonViews = addons?.map(addon => mapToTableView(addon)) ?? [];

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
    />
  );
}

function mapToTableView(addon: AddonsApiResponseAddon): AddonTableView {
  return {
    slug: addon.slug,
    name: addon.name,
    version: addon.version,
    state: addon.state,
    update_available: addon.update_available,
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
