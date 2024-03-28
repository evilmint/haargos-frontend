'use client';
import { useInstallationStore } from '@/app/services/stores/installation';
import {
  AddonsApiResponseAddon,
  AlarmType,
  Automation,
  AutomationIdentifier,
  LtGtComparator,
  LtGtThanOption,
  LtGtValueType,
  OlderThanOption,
  Scene,
  Script,
  TextMatcherOption,
  UserAlarmConfigurationConfiguration,
  ZigbeeDevice,
  ZigbeeIdentifier,
} from '@/app/types';
import { Input } from '@/registry/new-york/ui/input';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { AddonPicker } from './addon-picker';
import { AutomationPicker } from './automation-picker';
import { LogTypeOption, LogTypePicker } from './log-type-picker';
import { LtGtThanInput } from './lt-gt-than';
import { NotificationMethodPicker } from './notification-method-picker';
import { OlderThanPicker } from './older-than-picker';
import { ScenePicker } from './scene-picker';
import { ScriptPicker } from './script-picker';
import { StatOption, StatisticalFunctionPicker } from './stat-function-picker';
import { StorageOption, StoragePicker } from './storage-picker';
import { TextInputWithMatcher } from './text-with-condition';
import { ZigbeeDevicePicker } from './zigbee-device-picker';

export interface AlarmTypeOptionPickerProps {
  alarm: AlarmType;
  name: string;
  installationId: string;
  initialAlarmOptions?: UserAlarmConfigurationConfiguration;
  onAlarmChanged: (options: any, name: string) => void;
}

type LtGtThanAvailableOption = {
  alarmType: string;
  valueType: LtGtValueType;
  defaultValue: number;
  defaultComparator: LtGtComparator;
  maskValue?: string;
};

type StatFunctionOption = {
  alarmType: string;
  defaultFunction: 'max' | 'min' | 'p90' | 'avg' | 'median' | 'sum';
};

export function AlarmTypeOptionPicker(params: AlarmTypeOptionPickerProps) {
  const isAddonOptionPickerAvailable = params.alarm.category === 'ADDON';
  const isScriptOptionPickerAvailable = params.alarm.category === 'SCRIPTS';
  const isAutomationOptionPickerAvailable = params.alarm.category === 'AUTOMATIONS';
  const isSceneOptionPickerAvailable = params.alarm.category === 'SCENES';
  const isZigbeeOptionPickerAvailable = params.alarm.category === 'ZIGBEE';
  const isStorageOptionPickerAvailable = params.alarm.type === 'host_disk_usage';
  const isLogTypePickerAvailable = params.alarm.category === 'LOGS';
  const textInputWithMatcher =
    params.alarm.category === 'LOGS'
      ? { initialOption: params.initialAlarmOptions?.textCondition, entityName: 'Log' }
      : null;

  const alarmTypesWithStatisticalFx: StatFunctionOption[] = [
    {
      alarmType: 'addon_memory_usage',
      defaultFunction: 'max',
    },
    {
      alarmType: 'frontend_ping_latency',
      defaultFunction: 'max',
    },
    {
      alarmType: 'addon_cpu_usage',
      defaultFunction: 'max',
    },
    {
      alarmType: 'zigbee_device_battery_percentage',
      defaultFunction: 'min',
    },
    {
      alarmType: 'host_disk_usage',
      defaultFunction: 'max',
    },
    {
      alarmType: 'host_cpu_usage',
      defaultFunction: 'max',
    },
    {
      alarmType: 'host_memory_usage',
      defaultFunction: 'max',
    },
    {
      alarmType: 'zigbee_device_lqi',
      defaultFunction: 'min',
    },
  ];

  const isStatFxPickerAvailable = alarmTypesWithStatisticalFx
    .map(a => a.alarmType)
    .includes(params.alarm.type);
  const observations = useInstallationStore(
    state => state.observations[params.installationId],
  );
  const hasSupervisor =
    observations && observations.length > 0
      ? observations[0].agent_type == 'addon'
      : false;

  const ltGtThanAvailableOptions: LtGtThanAvailableOption[] = [
    {
      alarmType: 'host_cpu_usage',
      valueType: 'p',
      defaultValue: 80,
      defaultComparator: 'gte',
    },
    {
      alarmType: 'host_disk_usage',
      valueType: 'p',
      defaultValue: 80,
      defaultComparator: 'gte',
    },
    {
      alarmType: 'host_memory_usage',
      valueType: 'p',
      defaultValue: 80,
      defaultComparator: 'gte',
    },
    {
      alarmType: 'addon_cpu_usage',
      valueType: 'p',
      defaultValue: 80,
      defaultComparator: 'gte',
    },
    {
      alarmType: 'addon_memory_usage',
      valueType: 'p',
      defaultValue: 80,
      defaultComparator: 'gte',
    },
    {
      alarmType: 'zigbee_device_lqi',
      valueType: 'f',
      defaultValue: 15,
      defaultComparator: 'lt',
    },
    {
      alarmType: 'zigbee_device_battery_percentage',
      valueType: 'p',
      defaultValue: 20,
      defaultComparator: 'lt',
    },
    {
      alarmType: 'frontend_ping_latency',
      valueType: 'f',
      defaultValue: 2000,
      defaultComparator: 'gte',
      maskValue: 'ms',
    },
  ];

  const ltGtOption = ltGtThanAvailableOptions.find(o => o.alarmType == params.alarm.type);
  const defaultLtGtThanOption = ltGtOption
    ? {
        comparator: ltGtOption.defaultComparator,
        value: ltGtOption.defaultValue,
        valueType: ltGtOption.valueType,
      }
    : undefined;

  const isOlderThanPickerAvailable =
    (params.alarm.components ?? []).map(a => a.type).indexOf('older_than_picker') !== -1;

  const [selectedOptions, setSelectedOptions] =
    useState<UserAlarmConfigurationConfiguration>({
      addons: params.initialAlarmOptions?.addons ?? [],
      scenes: params.initialAlarmOptions?.scenes ?? [],
      scripts: params.initialAlarmOptions?.scripts ?? [],
      logTypes: params.initialAlarmOptions?.logTypes,
      ltGtThan: params.initialAlarmOptions?.ltGtThan,
      storages: params.initialAlarmOptions?.storages,
      statFunction: params.initialAlarmOptions?.statFunction,
      automations: params.initialAlarmOptions?.automations ?? [],
      zigbee: params.initialAlarmOptions?.zigbee ?? [],
      olderThan: params.initialAlarmOptions?.olderThan,
      datapointCount: params.initialAlarmOptions?.datapointCount ?? 1,
      notificationMethod: params.initialAlarmOptions?.notificationMethod ?? 'E-mail', // Default value, adjust if needed
    });

  const [nameValue, setNameValue] = useState<string>(params.name ?? '');
  const [dataPointsValue, setDataPointsValue] = useState<number>(
    params.initialAlarmOptions?.datapointCount ?? 1,
  );

  const handleNameChange = (name: string) => {
    setNameValue(name);
  };

  const handleAddonsSelected = (addons: AddonsApiResponseAddon[]) => {
    const mappedAddons = addons.map(a => {
      return {
        slug: a.slug,
      };
    });

    setSelectedOptions(prevOptions => ({ ...prevOptions, addons: mappedAddons }));
  };

  const handleScriptsSelected = (scripts: Script[]) => {
    const mappedScripts = scripts.map(s => {
      return {
        alias: s.alias,
      };
    });

    setSelectedOptions(prevOptions => ({ ...prevOptions, scripts: mappedScripts }));
  };

  const handleZigbeeDevicesSelected = (zigbeeDevices: ZigbeeDevice[]) => {
    const mappedZigbeeDevices: ZigbeeIdentifier[] = zigbeeDevices.map(s => {
      return {
        ieee: s.ieee,
      };
    });

    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      zigbee: mappedZigbeeDevices,
    }));
  };

  const handleAutomationsSelected = (automations: Automation[]) => {
    const mappedAutomations: AutomationIdentifier[] = automations.map(s => {
      return {
        id: s.id,
        name: s.friendly_name ?? s.alias,
      };
    });
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      automations: mappedAutomations,
    }));
  };

  const handleLogTypesSelected = (logTypes: LogTypeOption[]) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      logTypes: logTypes.map(l => {
        return { logType: l.logType };
      }),
    }));
  };

  const handleScenesSelected = (scenes: Scene[]) => {
    const mappedScenes = scenes.map(a => {
      return {
        id: a.id,
      };
    });
    setSelectedOptions(prevOptions => ({ ...prevOptions, scenes: mappedScenes }));
  };

  const handleStoragesSelected = (storages: StorageOption[]) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      storages: storages.map(s => {
        return { name: s.name };
      }),
    }));
  };

  const handleLtGtThanOptionSelected = (ltGtThanOption: LtGtThanOption) => {
    setSelectedOptions(prevOptions => ({ ...prevOptions, ltGtThan: ltGtThanOption }));
  };

  useEffect(() => {
    params.onAlarmChanged(selectedOptions, nameValue);
  }, [selectedOptions, nameValue]);

  const handleDataPointsChange: ChangeEventHandler<HTMLInputElement> = h => {
    let value = Math.min(5, Math.max(1, parseInt(h.target.value)));

    if (Number.isNaN(value)) {
      value = 1;
    }

    setDataPointsValue(value);
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      datapointCount: value,
    }));
  };

  const handleStatOptionSelected = (statOption: StatOption) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      statFunction: {
        function: statOption.function,
      },
    }));
  };

  const textInputWithMatcherChanged = (textMatcherOption: TextMatcherOption) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      textCondition: textMatcherOption,
    }));
  };

  const handleNotificationMethodChange = (method: 'E-mail') => {
    setSelectedOptions(prevOptions => ({ ...prevOptions, notificationMethod: method }));
  };

  const onOlderThanSelected = (option: OlderThanOption) => {
    setSelectedOptions(prevOptions => ({ ...prevOptions, olderThan: option }));
  };

  return (
    <div className="mb-8 w-full">
      <div className="mt-2">
        <div className="flex flex-col md:flex-row max-w-[470px]">
          <p className="w-[240px] mt-2 font-medium">Name</p>

          <Input
            type="text"
            value={nameValue}
            onChange={e => {
              handleNameChange(e.target.value);
            }}
          />
        </div>
      </div>

      {isAddonOptionPickerAvailable && (
        <AddonPicker
          initialAddons={(params.initialAlarmOptions?.addons ?? []).map(a => {
            return {
              id: a.slug,
              slug: a.slug,
              displayName: '',
            };
          })}
          onAddonsSelected={handleAddonsSelected}
          installationId={params.installationId}
        />
      )}

      {isZigbeeOptionPickerAvailable && (
        <ZigbeeDevicePicker
          initialZigbeeDevices={(params.initialAlarmOptions?.zigbee ?? []).map(a => {
            return {
              ieee: a.ieee,
              id: a.ieee,
              displayName: '',
            };
          })}
          onZigbeeDevicesSelected={handleZigbeeDevicesSelected}
          installationId={params.installationId}
        />
      )}

      {isAutomationOptionPickerAvailable && (
        <AutomationPicker
          initialAutomations={(params.initialAlarmOptions?.automations ?? []).map(a => {
            return {
              id: a.id,
              name: a.name,
              displayName: '',
            };
          })}
          onAutomationsSelected={handleAutomationsSelected}
          installationId={params.installationId}
        />
      )}

      {isLogTypePickerAvailable && (
        <LogTypePicker
          hasSupervisorLogTypes={hasSupervisor}
          initialLogTypes={(params.initialAlarmOptions?.logTypes ?? []).map(l => {
            return {
              displayName: l.logType,
              id: l.logType,
              logType: l.logType,
            };
          })}
          onLogTypesSelected={handleLogTypesSelected}
        />
      )}

      {textInputWithMatcher && (
        <TextInputWithMatcher
          initialMatcherOption={textInputWithMatcher.initialOption}
          onMatcherOptionSelected={textInputWithMatcherChanged}
          entityName={textInputWithMatcher.entityName}
        />
      )}

      {isSceneOptionPickerAvailable && (
        <ScenePicker
          initialScenes={(params.initialAlarmOptions?.scenes ?? []).map(s => {
            return {
              id: s.id,
              displayName: '',
            };
          })}
          onScenesSelected={handleScenesSelected}
          installationId={params.installationId}
        />
      )}

      {ltGtOption && (
        <LtGtThanInput
          onLtGtThanOptionSelected={handleLtGtThanOptionSelected}
          initialLtGtThanOption={
            params.initialAlarmOptions?.ltGtThan ?? defaultLtGtThanOption
          }
          valueType={ltGtOption.valueType}
          valueMask={ltGtOption.maskValue}
          entityName={params.alarm.name}
        />
      )}

      {isStorageOptionPickerAvailable && (
        <StoragePicker
          initialStorages={(params.initialAlarmOptions?.storages ?? []).map(s => {
            return {
              id: s.name,
              name: s.name,
              displayName: s.name,
            };
          })}
          onStoragesSelected={handleStoragesSelected}
          installationId={params.installationId}
        />
      )}

      {isScriptOptionPickerAvailable && (
        <ScriptPicker
          initialScripts={(params.initialAlarmOptions?.scripts ?? []).map(s => {
            return {
              id: s.alias,
              alias: s.alias,
              displayName: '',
            };
          })}
          onScriptsSelected={handleScriptsSelected}
          installationId={params.installationId}
        />
      )}

      {isOlderThanPickerAvailable && (
        <OlderThanPicker
          name={params.alarm.name}
          onOlderThanSelected={onOlderThanSelected}
          initialOlderThanOption={params.initialAlarmOptions?.olderThan}
        />
      )}

      {isStatFxPickerAvailable && (
        <StatisticalFunctionPicker
          initialStatFunction={
            params?.initialAlarmOptions?.statFunction?.function ??
            alarmTypesWithStatisticalFx.find(a => a.alarmType == params.alarm.type)
              ?.defaultFunction
          }
          installationId={params.installationId}
          onStatOptionSelected={handleStatOptionSelected}
        />
      )}

      {params.alarm.datapoints != 'NONE' && (
        <div className="mt-2">
          <div className="flex flex-col md:flex-row max-w-[470px]">
            <p className="w-[240px] mt-2 font-medium">
              {params.alarm.datapoints == 'MISSING'
                ? 'Missing observations'
                : 'Observations'}
            </p>

            <Input
              type="number"
              value={dataPointsValue}
              max={5}
              min={1}
              onChange={handleDataPointsChange}
            />
          </div>
        </div>
      )}

      <NotificationMethodPicker
        onNotificationMethodChange={handleNotificationMethodChange}
      />
    </div>
  );
}
