'use client';

import { Card } from '@/components/ui/card';
import { CardContent, CardHeader } from '@/registry/new-york/ui/card';
import { useEffect, useState } from 'react';
import { PageWrapper } from '../../components/page-wrapper';
import { AlarmTypePicker } from './alarm-type-picker';

import { createUserAlarmConfiguration } from '@/app/services/alarms';
import { useAlarmsStore } from '@/app/services/stores/alarms';
import {
  AlarmType,
  UserAlarmConfigurationConfiguration,
  UserAlarmConfigurationRequest,
} from '@/app/types';
import { PrimaryButton } from '@/components/primary-button';
import { useAuth0 } from '@auth0/auth0-react';
import { BackButton } from '../../components/back-button';
import { AlarmTypeOptionPicker } from './alarm-type-option-picker';

interface AlarmCreatePageProps {
  params: { id: string };
}

export default function AlarmCreatePage({ params }: AlarmCreatePageProps) {
  const alarmConfigurations = useAlarmsStore(state => state.alarmConfigurations);
  const fetchAlarmConfigurations = useAlarmsStore(state => state.fetchAlarms);
  const [alarmType, setAlarmType] = useState<AlarmType | null>(null);
  const [alarmOptions, setAlarmOptions] = useState<UserAlarmConfigurationRequest | null>(
    null,
  );

  const alarmTypeSelected = (alarm: AlarmType | null) => {
    setAlarmType(alarm);
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

  const onAlarmOptionsChanged = (options: UserAlarmConfigurationConfiguration) => {
    if (alarmType == null) {
      return;
    }

    setAlarmOptions({
      category: alarmType.category,
      type: alarmType.type,
      configuration: {
        datapointCount: options.datapointCount,
        notificationMethod: options.notificationMethod,
        addons: options.addons,
      },
    });
  };

  function onCreateAlarmClicked(): void {
    if (alarmOptions == null) {
      return;
    }

    const asyncCreate = async function () {
      const token = await getAccessTokenSilently();
      await createUserAlarmConfiguration(token, alarmOptions);
    };

    asyncCreate();
  }

  return (
    <PageWrapper installationId={params.id}>
      <div>
        <BackButton />
      </div>
      <Card>
        <CardHeader>
          <h1 className="font-semibold text-2xl">Alarm type</h1>
        </CardHeader>
        <CardContent>
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
                className="h-[45px] w-[150px]"
                onClick={onCreateAlarmClicked}
              >
                Create Alarm
              </PrimaryButton>
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
