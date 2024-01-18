import {
  useAddonsStore,
  useInstallationStore,
  useNotificationsStore,
} from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Callout, Card, Title } from '@tremor/react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Icons } from './icons';

type Insight = { title: string; description: string };

type InsightParams = {
  installationId: string;
};

export function HaargosInsights(params: InsightParams) {
  let insights: Insight[] = [
    // {
    //   title: 'Maximize Haargos Insights',
    //   description:
    //     'Regularly review Haargos dashboards for deep insights into your Home Assistant performance and usage patterns.',
    // },
    // {
    //   title: 'Monitor Add-on Health with Haargos',
    //   description:
    //     'Use Haargos to keep track of the health and status of your Home Assistant add-ons for a smoother experience.',
    // },
    // {
    //   title: 'Utilize Haargos for Pre-update Checks',
    //   description:
    //     'Before updating Home Assistant or add-ons, use Haargos to review system stability and performance metrics.',
    // },
    // {
    //   title: 'Read Release Notes',
    //   description:
    //     'Always read the release notes for each add-on update to understand changes and required actions.',
    // },
    // {
    //   title: 'Backup Before Updating',
    //   description:
    //     'Take a backup of your Home Assistant configuration before applying updates to safeguard your setup.',
    // },
    // {
    //   title: 'Regularly Review HA Logs',
    //   description:
    //     "Regularly check Home Assistant core and supervisor logs through Haargos for any anomalies or issues, ensuring your system's stability and performance.",
    // },
    // {
    //   title: 'Leverage Haargos for Secure Updates',
    //   description:
    //     'Ensure secure and smooth updates by using Haargos to identify potential risks or compatibility issues in advance.',
    // },
    // {
    //   title: 'Monitor Notifications',
    //   description:
    //     'Stay informed of critical events and updates by checking notifications from your installations in Haargos.',
    // },
    // {
    //   title: 'Use Haargos for System Backups',
    //   description:
    //     'Regularly back up your Home Assistant configuration using Haargos’ backup features to prevent data loss.',
    // },
    // {
    //   title: 'Customize Haargos Settings',
    //   description:
    //     'Customize Haargos settings to match your specific monitoring and management needs for an optimized smart home experience.',
    // },
    // {
    //   title: 'Engage with the Haargos Community',
    //   description:
    //     'Join the Haargos community forums to share insights, get tips, and stay updated with the latest features.',
    // },
  ];

  const observations = useInstallationStore(
    state => state.observations[params.installationId],
  );
  const latestHaRelease = useInstallationStore(state => state.latestHaRelease);
  const fetchNotifications = useNotificationsStore(state => state.fetchNotifiactions);
  const notifications = useNotificationsStore(
    state => state.notificationsByInstallationId[params.installationId],
  );
  const haVersion = observations?.length > 0 && observations[0].ha_config?.version;
  const isHAUpdateAvailable =
    latestHaRelease != null && haVersion != null && haVersion != latestHaRelease;
  const fetchAddons = useAddonsStore(state => state.fetchAddons);
  const addons = useAddonsStore(
    state => state.addonsByInstallationId[params.installationId],
  );

  const addonsToUpdate = addons?.filter(a => a.update_available) ?? [];

  if (addonsToUpdate.length > 0) {
    const nameList = addonsToUpdate
      .map(a => `${a.name} (${a.version} -> ${a.version_latest})`)
      .join('\r\n');
    insights.push({
      title: `Update ${addonsToUpdate.length} addon${
        addonsToUpdate.length == 1 ? '' : 's'
      }`,
      description: nameList,
    });
  }

  if (isHAUpdateAvailable) {
    insights.push({
      title: `Update Home Assistant`,
      description: `An upgrade to Home Assistant ${latestHaRelease} is available`,
    });
  }

  if (notifications?.length ?? 0 > 0) {
    insights.push({
      title: `Notifications available`,
      description: `Resolve ${notifications.length} notification${
        notifications.length == 1 ? '' : 's'
      }`,
    });
  }

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<boolean>(false);

  const { getAccessTokenSilently } = useAuth0();

  const update = async () => {
    const token = await getAccessTokenSilently();
    await fetchAddons(params.installationId, token);
    await fetchNotifications(params.installationId, token);
  };

  useEffect(() => {
    const dismissed = Cookies.get('dismissedTips');
    if (dismissed == 'true') {
      setDismissedTips(true);
    }

    update();
  }, []);

  const dismissTips = () => {
    Cookies.set('dismissedTips', 'true', { expires: 30 });
    setDismissedTips(true);
  };

  const nextTip = () => {
    setCurrentTipIndex(prevIndex => (prevIndex + 1) % insights.length);
  };

  const previousTip = () => {
    setCurrentTipIndex(prevIndex => (prevIndex - 1 + insights.length) % insights.length);
  };

  return insights.length == 0 ? (
    <></>
  ) : (
    <Card className="2xl:max-w-[30%]">
      <div className="flex justify-between align-right">
        <Title>Insights</Title>
        {/* <div>
          <button className="text-sm font-semibold" onClick={dismissTips}>
            Dismiss
          </button>
        </div> */}
      </div>
      {insights.map(t => {
        return (
          <Callout className="mt-4" title={t.title} icon={Icons.helpCircle} color="blue">
            {t.description}
          </Callout>
        );
      })}

      {/* <div className="flex gap-1 mt-2 font-semibold justify-between">
        <div></div>
        <div className="flex gap-1">
          <button className="text-sm" onClick={previousTip}>
            Previous
          </button>
          <button className="text-sm" onClick={nextTip}>
            Next
          </button>
        </div>
      </div> */}
    </Card>
  );
}
