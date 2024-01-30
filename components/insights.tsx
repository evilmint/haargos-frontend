import { useAddonsStore } from '@/app/services/stores/addons';
import { useInstallationStore } from '@/app/services/stores/installation';
import { useNotificationsStore } from '@/app/services/stores/notifications';
import { useTabStore } from '@/app/services/stores/tab';
import {
  AddonsApiResponseAddon,
  NotificationsApiResponseNotification,
} from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { Callout, Card, Title } from '@tremor/react';
import Link from 'next/link';
import { ReactElement, useEffect, useMemo } from 'react';
import { Icons } from './icons';
import { InstallationLink } from './installation-link';
import { RemoteAction } from './remote-action';

type Insight = { title: string; description: string | ReactElement };

type InsightParams = {
  installationId: string;
};

export function HaargosInsights(params: InsightParams) {
  const { getAccessTokenSilently } = useAuth0();

  const setTab = useTabStore(state => state.setCurrentTab);
  const { latestHaRelease, observations } = useInstallationStore(state => ({
    latestHaRelease: state.latestHaRelease,
    observations: state.observations[params.installationId],
  }));

  const { addons, fetchAddons } = useAddonsStore(state => ({
    addons: state.addonsByInstallationId[params.installationId],
    fetchAddons: state.fetchAddons,
  }));

  const { notifications, fetchNotifications } = useNotificationsStore(state => ({
    notifications: state.notificationsByInstallationId[params.installationId],
    fetchNotifications: state.fetchNotifiactions,
  }));

  const insights = useMemo(() => {
    const addonsToUpdate = addons?.filter(a => a.update_available) ?? [];
    const haVersion = observations?.length > 0 && observations[0].ha_config?.version;
    const isHAUpdateAvailable =
      latestHaRelease != null && haVersion != null && haVersion != latestHaRelease;
    const isAddonInstallation = observations?.[0]?.agent_type == 'addon';

    return [
      createAddonUpdateInsight(addonsToUpdate, params.installationId, setTab),
      createHAUpdateInsight(
        isHAUpdateAvailable,
        latestHaRelease,
        params.installationId,
        isAddonInstallation,
      ),
      createNotificationsInsight(notifications),
    ].filter(Boolean) as Insight[];
  }, [addons, latestHaRelease, notifications, observations]);

  useEffect(() => {
    const update = async () => {
      try {
        const token = await getAccessTokenSilently();
        if (observations?.[0].agent_type === 'addon') {
          await fetchAddons(params.installationId, token);
        }
        await fetchNotifications(params.installationId, token);
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    };
    update();
  }, [
    getAccessTokenSilently,
    fetchAddons,
    fetchNotifications,
    params.installationId,
    observations,
  ]);

  if (!insights.length) return null;

  return (
    <Card className="2xl:max-w-[30%]">
      <div className="flex justify-between align-right">
        <Title>Insights</Title>
      </div>
      {insights.map(t => {
        return (
          <Callout
            className="mt-4"
            key={t.title}
            title={t.title}
            icon={Icons.helpCircle}
            color="blue"
          >
            {t.description}
          </Callout>
        );
      })}
    </Card>
  );
}

const createAddonUpdateInsight = (
  addonsToUpdate: AddonsApiResponseAddon[],
  installationId: string,
  setTab: (value: string) => void,
): Insight | null => {
  if (addonsToUpdate.length === 0) return null;

  const title = `Update ${addonsToUpdate.length} addon${
    addonsToUpdate.length === 1 ? '' : 's'
  }`;

  const description = addonsToUpdate.map(addon => {
    const isRemoteUpdateAvailable = addon.slug.indexOf('haargos') === -1;

    return (
      <div className="[&:not(:last-child)]:mb-2">
        <InstallationLink
          key={addon.slug}
          installationId={installationId}
          path={`/hassio/addon/${addon.slug}/info`}
        >
          {`${addon.name} (${addon.version} -> ${addon.version_latest})`}
        </InstallationLink>

        {isRemoteUpdateAvailable && (
          <RemoteAction
            type="addon_update"
            context={{ addon_id: addon.slug }}
            installationId={installationId}
          />
        )}
      </div>
    );
  });

  return { title, description: <div>{description}</div> };
};

const createHAUpdateInsight = (
  isHAUpdateAvailable: boolean,
  latestHaRelease: string | null,
  installationId: string,
  isAddonInstallation: boolean,
): Insight | null => {
  if (!isHAUpdateAvailable || !latestHaRelease) return null;

  const dockerDescription = (
    <Link href="https://github.com/home-assistant/core/releases" target="_blank">
      {`An upgrade to Home Assistant ${latestHaRelease} is available`}
    </Link>
  );
  const addonDescription = (
    <div>
      <InstallationLink installationId={installationId} path="/config/updates">
        {`An upgrade to Home Assistant ${latestHaRelease} is available`}
      </InstallationLink>

      <RemoteAction installationId={installationId} type="update_core" />
    </div>
  );

  return {
    title: 'Update Home Assistant',
    description: isAddonInstallation ? addonDescription : dockerDescription,
  };
};

const createNotificationsInsight = (
  notifications: NotificationsApiResponseNotification[],
): Insight | null => {
  if (!notifications?.length) return null;

  return {
    title: `Notifications available`,
    description: (
      <ul className="pl-4 list-disc">
        {notifications.map(n => {
          return <li>{n.title}</li>;
        })}
      </ul>
    ),
  };
};
