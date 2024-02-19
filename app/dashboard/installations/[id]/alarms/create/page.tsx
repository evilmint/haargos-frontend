'use client';

import { useAlarmsStore } from '@/app/services/stores/alarms';
import { useInstallationStore } from '@/app/services/stores/installation';
import { useTabStore } from '@/app/services/stores/tab';
import {
  AlarmType,
  UserAlarmConfigurationConfiguration,
  UserAlarmConfigurationRequest,
} from '@/app/types';
import { PrimaryButton } from '@/components/primary-button';
import { Card } from '@/components/ui/card';
import { useHaargosRouter } from '@/lib/haargos-router';
import { CardContent, CardHeader } from '@/registry/new-york/ui/card';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BackButton } from '../../components/back-button';
import { FullWidthConditionalLoading } from '../../components/full-width-conditional-loading';
import { PageWrapper } from '../../components/page-wrapper';
import { isAlarmCreationPossible } from '../alarm-creation';
import { AlarmTypeOptionPicker } from './alarm-type-option-picker';
import { AlarmTypePicker } from './alarm-type-picker';

interface AlarmCreatePageProps {
  params: { id: string };
}

export default function AlarmCreatePage({ params }: AlarmCreatePageProps) {
  const observations = useInstallationStore(state => state.observations[params.id]);

  const alarmConfigurations = useAlarmsStore(state => state.alarmConfigurations).filter(
    a => {
      if (!a.requires_supervisor || !observations || observations.length == 0) {
        return true;
      }

      return observations[0].agent_type == 'addon';
    },
  );

  const fetchAlarmConfigurations = useAlarmsStore(state => state.fetchAlarms);
  const createUserAlarmConfiguration = useAlarmsStore(state => state.createUserAlarm);
  const setCurrentTab = useTabStore(state => state.setCurrentTab);

  const [alarmType, setAlarmType] = useState<AlarmType | null>(null);
  const [alarmOptions, setAlarmOptions] = useState<UserAlarmConfigurationRequest | null>(
    null,
  );

  const [alarmCreationDisabled, setAlarmCreationDisabled] = useState<boolean>(true);

  const router = useHaargosRouter(useRouter());

  const alarmTypeSelected = (alarm: AlarmType | null) => {
    setAlarmType(alarm);
    setAlarmCreationDisabled(
      !isAlarmCreationPossible(alarm?.category, alarmOptions?.configuration),
    );
  };

  const { getAccessTokenSilently } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchAlarmConfigurations(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [getAccessTokenSilently]);

  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const asyncFetchObservations = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(params.id, token, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetchObservations();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    params.id,
  ]);

  const onAlarmOptionsChanged = (options: UserAlarmConfigurationConfiguration) => {
    if (alarmType == null) {
      return;
    }

    setAlarmCreationDisabled(!isAlarmCreationPossible(alarmType.category, options));
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

  function onCreateAlarmClicked() {
    if (alarmOptions == null) {
      return;
    }

    const asyncCreate = async function () {
      const token = await getAccessTokenSilently();
      try {
        await createUserAlarmConfiguration(token, alarmOptions);

        toast.success('Alarm has been created.');
        setCurrentTab('alarms');
        router.navigateToInstallation(params.id);
      } catch {
        toast.error('Failed to create an alarm. Try again.');
      }
    };
    asyncCreate();
  }

  return (
    <PageWrapper installationId={params.id}>
      <div>
        <BackButton href={`/dashboard/installations/${params.id}`} />
      </div>
      <Card>
        <CardHeader>
          <h1 className="font-semibold text-2xl">Alarm type</h1>
        </CardHeader>
        <CardContent>
          <FullWidthConditionalLoading isLoaded={observations != null}>
            <div>
              <div className="flex flex-col pb-4">
                <AlarmTypePicker
                  onAlarmSelected={alarmTypeSelected}
                  configurations={alarmConfigurations}
                />
              </div>
              {alarmType && (
                <div>
                  <AlarmTypeOptionPicker
                    installationId={params.id}
                    alarm={alarmType}
                    onAlarmOptionsChanged={onAlarmOptionsChanged}
                  />
                  <PrimaryButton
                    disabled={alarmCreationDisabled}
                    className="h-[45px] w-[150px]"
                    onClick={onCreateAlarmClicked}
                  >
                    Create Alarm
                  </PrimaryButton>
                </div>
              )}
            </div>
          </FullWidthConditionalLoading>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
