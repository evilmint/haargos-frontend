'use client';
import {
  AddonsApiResponseAddon,
  Automation,
  OlderThanOption,
  Scene,
  Script,
  UserAlarmConfiguration,
  ZigbeeDevice,
} from '@/app/types';

export function createAlarmConfigurationName(
  alarmConfiguration: UserAlarmConfiguration,
  addons: AddonsApiResponseAddon[],
  scripts: Script[],
  scenes: Scene[],
  automations: Automation[],
  zigbeeDevices: ZigbeeDevice[],
) {
  let name = alarmConfiguration.name;

  const { olderThan, datapointCount } = alarmConfiguration.configuration ?? {};

  if (olderThan) {
    name += appendOlderThan(olderThan);
  }

  name += appendConfigEntities(
    alarmConfiguration,
    addons,
    scripts,
    scenes,
    automations,
    zigbeeDevices,
  );

  if (datapointCount) {
    name += ` [${datapointCount}dp]`;
  }

  return name;
}

function appendOlderThan(olderThan: OlderThanOption) {
  return ` ${
    olderThan.componentValue
  } ${olderThan.timeComponent.toLocaleLowerCase()} ago`;
}

function appendConfigEntities(
  alarmConfiguration: UserAlarmConfiguration,
  addons: AddonsApiResponseAddon[],
  scripts: Script[],
  scenes: Scene[],
  automations: Automation[],
  zigbeeDevices: ZigbeeDevice[],
) {
  const configAddons = alarmConfiguration.configuration?.addons ?? [];
  const configScripts = alarmConfiguration.configuration?.scripts ?? [];
  const configScenes = alarmConfiguration.configuration?.scenes ?? [];
  const configAutomations = alarmConfiguration.configuration?.automations ?? [];
  const configZigbeeDevices = alarmConfiguration.configuration?.zigbee ?? [];

  if (configAddons.length > 0) {
    return ` for ${getNameFromEntities(configAddons, addons, 'slug', 'name')}`;
  } else if (configScripts.length > 0) {
    return ` for ${getNameFromEntities(configScripts, scripts, 'alias', 'alias')}`;
  } else if (configScenes.length > 0) {
    return ` for ${getNameFromEntities(configScenes, scenes, 'id', 'friendly_name')}`;
  } else if (configAutomations.length > 0) {
    return ` for ${getNameFromEntities(
      configAutomations,
      automations,
      'id',
      'friendly_name',
    )}`;
  } else if (configZigbeeDevices.length > 0) {
    return ` for ${getNameFromEntities(
      configZigbeeDevices,
      zigbeeDevices,
      'ieee',
      'name_by_user',
    )}`;
  }

  return '';
}

function getNameFromEntities(
  configEntities: any,
  entities: any,
  idField: any,
  nameField: any,
) {
  return configEntities
    .map((configEntity: any) => {
      const matchingEntity = entities.find(
        (entity: any) => configEntity[idField] === entity[idField],
      );
      return matchingEntity
        ? matchingEntity[nameField] || configEntity[idField]
        : configEntity[idField];
    })
    .join(', ');
}
