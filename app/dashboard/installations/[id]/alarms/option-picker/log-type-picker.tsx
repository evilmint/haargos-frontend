import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

export interface LogTypeOption extends EntityOption {
  logType: string;
}

export interface LogTypePickerProps {
  initialLogTypes?: LogTypeOption[] | undefined;
  hasSupervisorLogTypes: boolean;
  onLogTypesSelected: (logTypes: LogTypeOption[]) => void;
}

export function LogTypePicker({
  initialLogTypes,
  hasSupervisorLogTypes,
  onLogTypesSelected,
}: LogTypePickerProps) {
  let logTypeOptions: LogTypeOption[] = [
    { displayName: 'Core', id: 'core', logType: 'core' },
  ];

  if (hasSupervisorLogTypes) {
    logTypeOptions.push({ displayName: 'Host', id: 'host', logType: 'host' });
    logTypeOptions.push({ displayName: 'Audio', id: 'audio', logType: 'audio' });
    logTypeOptions.push({
      displayName: 'Supervisor',
      id: 'supervisor',
      logType: 'supervisor',
    });
    logTypeOptions.push({
      displayName: 'Multicast',
      id: 'multicast',
      logType: 'multicast',
    });
    logTypeOptions.push({ displayName: 'DNS', id: 'dns', logType: 'dns' });
  }

  const [selectedLogTypes, setSelectedLogTypes] = useState<LogTypeOption[]>(
    initialLogTypes ?? [],
  );

  useEffect(() => {
    onLogTypesSelected(selectedLogTypes);
  }, [selectedLogTypes]);

  return (
    <EntityPicker
      label="Log type"
      entities={logTypeOptions}
      selectedEntities={selectedLogTypes}
      onSelect={setSelectedLogTypes}
    />
  );
}
