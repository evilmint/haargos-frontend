'use client';

import { updateUserAlarmConfiguration } from '@/app/services/alarms';
import { useAlarmsStore } from '@/app/services/stores/alarms';
import { useTabStore } from '@/app/services/stores/tab';
import {
  AlarmType,
  UserAlarmConfigurationConfiguration,
  UserAlarmConfigurationRequest,
} from '@/app/types';
import { PrimaryButton } from '@/components/primary-button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { useHaargosRouter } from '@/lib/haargos-router';
import { Card } from '@/registry/new-york/ui/card';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BackButton } from '../../../components/back-button';
import { PageWrapper } from '../../../components/page-wrapper';
import { isAlarmCreationPossible } from '../../alarm-creation';
import { AlarmTypeOptionPicker } from '../../create/alarm-type-option-picker';

export default function EditAlarmPage({
  params,
}: {
  params: { id: string; alarmId: string };
}) {
  const alarmConfigurations = useAlarmsStore(state => state.alarmConfigurations);
  const userAlarmConfiguration = useAlarmsStore(
    state => state.userAlarmConfigurations,
  ).find(a => a.id == params.alarmId);
  const fetchAlarmConfigurations = useAlarmsStore(state => state.fetchAlarms);
  const fetchUserAlarmConfigurations = useAlarmsStore(state => state.fetchUserAlarms);
  const [alarmType, setAlarmType] = useState<AlarmType | null>(null);
  const [alarmOptions, setAlarmOptions] = useState<UserAlarmConfigurationRequest | null>(
    null,
  );
  const setCurrentTab = useTabStore(state => state.setCurrentTab);

  let alarmConfigurationTypes = alarmConfigurations.map(a => a.alarmTypes).flat();

  const [alarmSavingDisabled, setAlarmSavingDisabled] = useState<boolean>(true);

  const router = useHaargosRouter(useRouter());

  const { getAccessTokenSilently } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchUserAlarmConfigurations(token);
      await fetchAlarmConfigurations(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (userAlarmConfiguration) {
      const datapoint =
        alarmConfigurationTypes.find(a => a.type == userAlarmConfiguration.type)
          ?.datapoints ?? 'MISSING';

      setAlarmType({ ...userAlarmConfiguration, datapoints: datapoint, disabled: false });
    }
  }, [alarmConfigurations]);

  const onAlarmOptionsChanged = (options: UserAlarmConfigurationConfiguration) => {
    if (alarmType == null) {
      return;
    }

    setAlarmSavingDisabled(!isAlarmCreationPossible(alarmType.category, options));

    setAlarmOptions({
      category: alarmType.category,
      type: alarmType.type,
      configuration: {
        datapointCount: options.datapointCount,
        notificationMethod: options.notificationMethod,
        ...(alarmType.category === 'ADDON' ? { addons: options.addons } : {}),
      },
    });
  };

  function onSaveAlarmClicked() {
    if (alarmOptions == null) {
      return;
    }

    const asyncCreate = async function () {
      const token = await getAccessTokenSilently();
      try {
        console.log(`Sending ${alarmOptions.configuration.datapointCount ?? -1}`);
        await updateUserAlarmConfiguration(token, params.alarmId, alarmOptions);

        toast.success('Alarm has been created.');

        setCurrentTab('alarms');
        router.navigateToInstallation(params.id);
      } catch {
        toast.error('Failed to update alarm. Try again.');
      }
    };
    asyncCreate();
  }

  return (
    <PageWrapper installationId={params.id}>
      <div>
        <BackButton href={`/dashboard/installations/${params.id}`} />
      </div>

      {alarmConfigurations.length > 0 && userAlarmConfiguration && (
        <Card>
          <CardHeader>
            <h1 className="font-semibold text-2xl">
              {`${
                (alarmType?.category[0] ?? '') +
                (alarmType?.category.substring(1).toLocaleLowerCase() ?? '')
              } - ${alarmType?.name}`}
            </h1>
          </CardHeader>
          <CardContent>
            {alarmType && (
              <div>
                <AlarmTypeOptionPicker
                  installationId={params.id}
                  alarm={alarmType}
                  initialAlarmOptions={{
                    ...userAlarmConfiguration.configuration,
                    notificationMethod: 'E-mail',
                  }}
                  onAlarmOptionsChanged={onAlarmOptionsChanged}
                />
                <PrimaryButton
                  disabled={alarmSavingDisabled}
                  className="h-[45px] w-[150px]"
                  onClick={onSaveAlarmClicked}
                >
                  Save
                </PrimaryButton>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageWrapper>
  );
}
