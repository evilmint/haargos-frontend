'use client';

import { useAddonsStore } from '@/app/services/stores/addons';
import { useAlarmsStore } from '@/app/services/stores/alarms';
import { useInstallationStore } from '@/app/services/stores/installation';
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
import { createAlarmConfigurationName } from '../../../components/alarms/alarm-configuration-name';
import { BackButton } from '../../../components/back-button';
import { PageWrapper } from '../../../components/page-wrapper';
import { isAlarmCreationPossible } from '../../alarm-creation';
import { AlarmTypeOptionPicker } from '../../option-picker/alarm-type-option-picker';

export default function EditAlarmPage({
  params,
}: {
  params: { id: string; alarmId: string };
}) {
  const addons = useAddonsStore(state => state.addonsByInstallationId[params.id]) ?? [];
  const scripts =
    useInstallationStore(state => state.observations[params.id])?.[0]?.scripts ?? [];
  const scenes =
    useInstallationStore(state => state.observations[params.id])?.[0]?.scenes ?? [];
  const storages =
    useInstallationStore(state => state.observations[params.id])?.[0]?.environment
      .storage ?? [];
  const automations =
    useInstallationStore(state => state.observations[params.id])?.[0]?.automations ?? [];
  const zigbeeDevices =
    useInstallationStore(state => state.observations[params.id])?.[0]?.zigbee?.devices ??
    [];
  const alarmConfigurations = useAlarmsStore(state => state.alarmConfigurations);
  const userAlarmConfiguration = useAlarmsStore(
    state => state.userAlarmConfigurations,
  ).find(a => a.id == params.alarmId);
  const fetchAlarmConfigurations = useAlarmsStore(state => state.fetchAlarms);
  const fetchUserAlarmConfigurations = useAlarmsStore(state => state.fetchUserAlarms);
  const updateUserAlarmConfiguration = useAlarmsStore(state => state.updateUserAlarm);
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

      setAlarmType({
        ...userAlarmConfiguration,
        components:
          alarmConfigurationTypes.find(a => a.type == userAlarmConfiguration.type)
            ?.components ?? [],
        datapoints: datapoint,
        disabled: false,
      });
    }
  }, [alarmConfigurations]);

  const onAlarmOptionsChanged = (
    options: UserAlarmConfigurationConfiguration,
    name: string,
  ) => {
    if (alarmType == null) {
      return;
    }

    setAlarmSavingDisabled(
      !isAlarmCreationPossible(name, alarmType.category, alarmType.type, options),
    );

    setAlarmOptions({
      category: alarmType.category,
      type: alarmType.type,
      name: name,
      configuration: {
        datapointCount: options.datapointCount,
        olderThan: options.olderThan,
        textCondition: options.textCondition,
        notificationMethod: options.notificationMethod,
        ltGtThan: options.ltGtThan,
        statFunction: options.statFunction,
        storages: options.storages,
        logTypes: options.logTypes,
        ...(alarmType.category === 'ADDON' ? { addons: options.addons } : {}),
        ...(alarmType.category === 'ADDON' ? { addons: options.addons } : {}),
        ...(alarmType.category === 'SCRIPTS' ? { scripts: options.scripts } : {}),
        ...(alarmType.category === 'SCENES' ? { scenes: options.scenes } : {}),
        ...(alarmType.category === 'AUTOMATIONS'
          ? { automations: options.automations }
          : {}),
        ...(alarmType.category === 'ZIGBEE' ? { zigbee: options.zigbee } : {}),
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
        await updateUserAlarmConfiguration(token, params.alarmId, alarmOptions);

        toast.success('Alarm has been updated.');

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
            <h1 className="font-semibold text-lg md:text-2xl">
              {createAlarmConfigurationName(
                {
                  ...alarmOptions!!,
                  created_at: '',
                  updated_at: '',
                  name: userAlarmConfiguration.name,
                  description: userAlarmConfiguration.description,
                  state: 'OK',
                  id: '',
                },
                addons,
                scripts,
                scenes,
                storages,
                automations,
                zigbeeDevices,
              )}
            </h1>
          </CardHeader>
          <CardContent>
            {alarmType && (
              <div>
                <AlarmTypeOptionPicker
                  name={userAlarmConfiguration.name}
                  installationId={params.id}
                  alarm={alarmType}
                  initialAlarmOptions={{
                    ...userAlarmConfiguration.configuration,
                    notificationMethod: 'E-mail',
                  }}
                  onAlarmChanged={onAlarmOptionsChanged}
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
