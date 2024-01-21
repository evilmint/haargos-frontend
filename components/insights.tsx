import { useAddonsStore } from '@/app/services/stores/addons';
import { useInstallationStore } from '@/app/services/stores/installation';
import { useNotificationsStore } from '@/app/services/stores/notifications';
import { useAuth0 } from '@auth0/auth0-react';
import { Callout, Card, Title } from '@tremor/react';
import { ReactNode, useEffect, useMemo } from 'react';
import { Icons } from './icons';

type Insight = { title: string; description: ReactNode };

type InsightParams = {
  installationId: string;
};

export function HaargosInsights(params: InsightParams) {
  const { getAccessTokenSilently } = useAuth0();

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

    return [
      createAddonUpdateInsight(addonsToUpdate),
      createHAUpdateInsight(isHAUpdateAvailable, latestHaRelease),
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

const createAddonUpdateInsight = (addonsToUpdate: any[]): Insight | null => {
  if (addonsToUpdate.length === 0) return null;

  const title = `Update ${addonsToUpdate.length} addon${
    addonsToUpdate.length === 1 ? '' : 's'
  }`;
  const description = addonsToUpdate
    .map(addon => `${addon.name} (${addon.version} -> ${addon.version_latest})`)
    .join('\r\n');

  return { title, description };
};

const createHAUpdateInsight = (
  isHAUpdateAvailable: boolean,
  latestHaRelease: string | null,
): Insight | null => {
  if (!isHAUpdateAvailable || !latestHaRelease) return null;

  return {
    title: 'Update Home Assistant',
    description: (
      <a href="www.wp.pl">{`An upgrade to Home Assistant ${latestHaRelease} is available`}</a>
    ),
  };
};

const createNotificationsInsight = (notifications: any[]): Insight | null => {
  if (!notifications?.length) return null;

  return {
    title: `Notifications available`,
    description: `Resolve ${notifications.length} notification${
      notifications.length === 1 ? '' : 's'
    }`,
  };
};
