'use client';
import { AlarmCategory, UserAlarmConfigurationConfiguration } from '@/app/types';

export function isAlarmCreationPossible(
  category: AlarmCategory | undefined | null,
  configuration: UserAlarmConfigurationConfiguration | undefined | null,
): boolean {
  if (!category || !configuration) {
    return false;
  }

  if (category !== 'ADDON') {
    return true;
  }

  return (configuration.addons ?? []).length > 0;
}
