import { useInstallationStore } from '@/app/services/stores/installation';
import { ZigbeeDevice } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { EntityOption, EntityPicker } from './entity-picker';

interface ZigbeeOption extends EntityOption {
  ieee: string;
}

export interface ZigbeeDevicePickerProps {
  installationId: string;
  initialZigbeeDevices?: ZigbeeOption[] | undefined;
  onZigbeeDevicesSelected: (zigbeeDevices: ZigbeeDevice[]) => void;
}

export function ZigbeeDevicePicker({
  installationId,
  initialZigbeeDevices,
  onZigbeeDevicesSelected,
}: ZigbeeDevicePickerProps) {
  const observations =
    useInstallationStore(state => state.observations[installationId]) ?? [];

  const fetchInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const zigbeeDevices =
    ((observations ?? []).length > 0 ? observations[0].zigbee?.devices : []) ?? [];
  const zigbeeOptions: ZigbeeOption[] = zigbeeDevices.map(d => ({
    ieee: d.ieee,
    displayName: d.name_by_user ?? d.entity_name,
    id: d.ieee,
  }));

  const [selectedZigbeeOptions, setSelectedZigbeeOptions] = useState<ZigbeeOption[]>(
    initialZigbeeDevices ?? [],
  );

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetch = async () => {
      const token = await getAccessTokenSilently();
      fetchInstallation(installationId, token, false);
    };

    fetch();
  });

  useEffect(() => {
    onZigbeeDevicesSelected(
      zigbeeDevices.filter(zigbeeDevice =>
        selectedZigbeeOptions.map(a => a.ieee).includes(zigbeeDevice.ieee),
      ),
    );
  }, [selectedZigbeeOptions]);

  return (
    <EntityPicker
      label="Zigbee device"
      entities={zigbeeOptions}
      selectedEntities={selectedZigbeeOptions}
      onSelect={setSelectedZigbeeOptions}
    />
  );
}
