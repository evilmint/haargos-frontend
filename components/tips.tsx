import { useAddonsStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Callout, Card, Title } from '@tremor/react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Icons } from './icons';

type Tip = { title: string; description: string };

type TipsParams = {
  installationId: string;
};

export function HaargosTips(params: TipsParams) {
  let tips: Tip[] = [
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

  const fetchAddons = useAddonsStore(state => state.fetchAddons);
  const addons = useAddonsStore(
    state => state.addonsByInstallationId[params.installationId],
  );

  const addonsToUpdate = addons?.filter(a => a.update_available) ?? [];

  if (addonsToUpdate.length > 0) {
    const nameList = addonsToUpdate.map(a => `${a.name} (${a.version} -> ${a.version_latest})`).join("\r\n");
    tips.push({
      title: `Update addons`,
      description: nameList,
    });
  }

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<boolean>(false);

  const { getAccessTokenSilently } = useAuth0();

  const update = async () => {
    const token = await getAccessTokenSilently();
    await fetchAddons(params.installationId, token);
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
    setCurrentTipIndex(prevIndex => (prevIndex + 1) % tips.length);
  };

  const previousTip = () => {
    setCurrentTipIndex(prevIndex => (prevIndex - 1 + tips.length) % tips.length);
  };

  return tips.length == 0 ? (
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
      {tips.map(t => {
        return (
          <Callout
            className="mt-4"
            title={`${addonsToUpdate.length} addon update${
              addonsToUpdate.length == 1 ? '' : 's'
            } available`}
            icon={Icons.helpCircle}
            color="blue"
          >
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
