'use client';
import { AddonsApiResponseAddon, UserAlarmConfiguration } from '@/app/types';

export function createAlarmConfigurationName(
  alarmConfiguration: UserAlarmConfiguration,
  addons: AddonsApiResponseAddon[],
) {
  let name: string = `${alarmConfiguration.name}`;
  const olderThan = alarmConfiguration.configuration?.olderThan;
  const configAddons = alarmConfiguration.configuration?.addons;

  if (olderThan) {
    name += ` ${olderThan.componentValue} ${olderThan.timeComponent.toLocaleLowerCase()}`;
  }

  if (configAddons && configAddons.length > 0) {
    name += ` for ${(alarmConfiguration.configuration?.addons ?? [])
      .map(a => {
        const matchingResponseAddon = addons.find(
          responseAddon => a.slug == responseAddon.slug,
        );

        if (matchingResponseAddon) {
          return matchingResponseAddon.name;
        } else {
          return a.slug;
        }
      })
      .join(', ')}`;
  }

  if (alarmConfiguration.configuration?.datapointCount) {
    name += ` [${alarmConfiguration.configuration.datapointCount}dp]`;
  }

  return name;
}
