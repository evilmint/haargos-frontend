'use client';
import {
  AddonsApiResponseAddon,
  Automation,
  LogTypeIdentifier,
  LtGtThanOption,
  OlderThanOption,
  Scene,
  Script,
  StatFunction,
  Storage,
  TextMatcherOption,
  UserAlarmConfiguration,
  ZigbeeDevice,
} from '@/app/types';

export function createAlarmConfigurationName(
  alarmConfiguration: UserAlarmConfiguration,
  addons: AddonsApiResponseAddon[],
  scripts: Script[],
  scenes: Scene[],
  storages: Storage[],
  automations: Automation[],
  zigbeeDevices: ZigbeeDevice[],
) {
  let name = alarmConfiguration.name;

  const { olderThan, textCondition, logTypes, ltGtThan, statFunction, datapointCount } =
    alarmConfiguration.configuration ?? {};

  if (olderThan) {
    name += appendOlderThan(olderThan);
  }

  if (ltGtThan) {
    name += appendLtGtThan(ltGtThan);
  }

  if (datapointCount && datapointCount > 1 && statFunction) {
    name += appendStatFunction(statFunction);
  }

  if (textCondition && logTypes) {
    name += appendTextCondition(logTypes, textCondition);
  }

  name += appendConfigEntities(
    alarmConfiguration,
    addons,
    scripts,
    scenes,
    storages,
    automations,
    zigbeeDevices,
  );

  if (datapointCount) {
    name += ` for ${datapointCount} observation${datapointCount == 1 ? '' : 's'}`;
  }

  return name;
}

function appendTextCondition(
  logTypes: LogTypeIdentifier[],
  textMatcherOption: TextMatcherOption,
) {
  const logTypeText = logTypes.map(l => l.logType).join(', ');
  let condition: string = '';

  if (textMatcherOption.matcher === 'contains') {
    condition = 'containing';
  } else if (textMatcherOption.matcher === 'exactly') {
    condition = 'being exactly';
  } else if (textMatcherOption.matcher === 'prefix') {
    condition = 'starting with';
  } else if (textMatcherOption.matcher === 'suffix') {
    condition = 'ending with';
  }

  return ` - ${logTypeText} logs ${condition} "${textMatcherOption.text}" ${
    !textMatcherOption.caseSensitive ? '[case insensitive]' : '[case sensitive]'
  }`;
}

function appendStatFunction(statFunction: StatFunction) {
  return ` f(x)=${statFunction.function}`;
}

function appendOlderThan(olderThan: OlderThanOption) {
  return ` ${
    olderThan.componentValue
  } ${olderThan.timeComponent.toLocaleLowerCase()} ago`;
}

function appendLtGtThan(ltGtThan: LtGtThanOption) {
  const valueType = ltGtThan.valueType == 'p' ? '%' : '';
  let comparator = '';

  if (ltGtThan.comparator == 'gt') {
    comparator = '>';
  } else if (ltGtThan.comparator == 'lt') {
    comparator = '<';
  } else if (ltGtThan.comparator == 'lte') {
    comparator = '<=';
  } else if (ltGtThan.comparator == 'gte') {
    comparator = '>=';
  }

  return ` ${comparator} ${ltGtThan.value}${valueType}`;
}

function appendConfigEntities(
  alarmConfiguration: UserAlarmConfiguration,
  addons: AddonsApiResponseAddon[],
  scripts: Script[],
  scenes: Scene[],
  storages: Storage[],
  automations: Automation[],
  zigbeeDevices: ZigbeeDevice[],
) {
  const configAddons = alarmConfiguration.configuration?.addons ?? [];
  const configScripts = alarmConfiguration.configuration?.scripts ?? [];
  const configStorages = alarmConfiguration.configuration?.storages ?? [];
  const configScenes = alarmConfiguration.configuration?.scenes ?? [];
  const configAutomations = alarmConfiguration.configuration?.automations ?? [];
  const configZigbeeDevices = alarmConfiguration.configuration?.zigbee ?? [];

  if (configAddons.length > 0) {
    return ` for ${getNameFromEntities(configAddons, addons, 'slug', 'name')}`;
  } else if (configStorages.length > 0) {
    return ` in ${getNameFromEntities(configStorages, storages, 'name', 'name')}`;
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
