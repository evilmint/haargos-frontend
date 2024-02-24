'use client';
import { AlarmCategory, UserAlarmConfigurationConfiguration } from '@/app/types';

export function isAlarmCreationPossible(
  category: AlarmCategory | undefined | null,
  configuration: UserAlarmConfigurationConfiguration | undefined | null,
): boolean {
  if (!category || !configuration) {
    return false;
  }

  if (category === 'ADDON') {
    return (configuration.addons ?? []).length > 0;
  } else if (category === 'SCRIPTS') {
    return (configuration.scripts ?? []).length > 0;
  } else if (category === 'AUTOMATIONS') {
    return (configuration.automations ?? []).length > 0;
  } else if (category === 'SCENES') {
    return (configuration.scenes ?? []).length > 0;
  } else if (category === 'ZIGBEE') {
    return (configuration.zigbee ?? []).length > 0;
  }

  return true;
}
