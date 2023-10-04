interface Log {
  raw: string;
  time: Date;
  type: string;
  thread: string;
  log: string;
}

interface NetworkInterfaceData {
  bytes: number;
  packets: number;
}

interface NetworkInterface {
  name: string;
  rx: NetworkInterfaceData;
  tx: NetworkInterfaceData;
}

interface Network {
  interfaces: NetworkInterface[];
}

interface Environment {
  cpu: {
    model_name: string;
    load: number;
    cpu_mhz: string;
    architecture: string;
    temp: string | null;
  } | null;
  boot_time: string | null;
  memory: {
    available: number;
    shared: number;
    total: number;
    buff_cache: number;
    used: number;
    free: number;
    swap_used: number | null;
    swap_total: number | null;
  } | null;
  storage: Array<Storage>;
  network?: Network | null;
}

interface Storage {
  name: string;
  available: string;
  use_percentage: string;
  used: string;
  size: string;
  mounted_on: string;
}

interface DockerContainer {
  running: boolean;
  image: string;
  restarting: boolean;
  finished_at: string;
  name: string;
  started_at: string;
  state: string;
  status: string;
}

interface Observation {
  environment: Environment;
  logs: string;
  agent_version: string;
  docker: {
    containers: DockerContainer[];
  };
  installation_id: string;
  userId: string;
  timestamp: string;
  dangers: string[];
  id: string;
  zigbee: Zigbee | null;
  ha_config: HAConfig | null;
  automations: Automation[];
  scenes: Scene[];
  scripts: Script[];
  has_low_memory: boolean;
  has_low_storage: boolean;
  has_high_cpu_load: boolean;
}

interface Automation {
  last_triggered: string | null;
  id: string;
  state: string | null;
  alias: string;
  friendly_name: string | null;
}

interface Scene {
  name: string;
  id: string;
  state: string | null;
  friendly_name: string | null;
}

interface Script {
  state: string | null;
  alias: string;
  friendly_name: string | null;
  last_triggered: string | null;
}

interface HAConfig {
  version: string | null;
}

interface Zigbee {
  devices: ZigbeeDevice[];
}

type BatteryType = {
  type: 'N/A' | 'AA' | 'AAA' | 'CR 123A' | 'CR 1632' | 'CR 2032' | 'CR 2450';
  count: number | null;
};

interface ZigbeeDevice {
  ieee: string;
  last_updated: string;
  entity_name: string;
  name_by_user: string | null;
  brand: string;
  battery: BatteryType | null;
  lqi: number;
  battery_level: number | null;
  power_source: 'Mains' | 'Battery' | null;
  integration_type: 'zha' | 'z2m';
  has_low_battery: boolean;
  has_low_lqi: boolean;
}

interface ObservationApiResponse {
  body: {
    items: Observation[];
  };
}

interface InstallationUrls {
  instance?: {
    url: string;
    is_verified: boolean;
    verification_status: 'PENDING' | 'FAILED' | 'SUCCESS';
    subdomain?: string;
    subdomain_value?: string;
  };
}

interface Installation {
  urls: InstallationUrls;
  userId: string;
  issues: string[];
  notes: string;
  last_agent_connection: string;
  id: string;
  health_statuses: HealthStatus[];
  name: string;
  agent_token: string;
}

interface HealthStatus {
  time: number;
  is_up: boolean;
  timestamp: string;
}

interface InstallationBody {
  latest_ha_release: string | null;
  items: Installation[];
}

interface InstallationApiResponse {
  body: InstallationBody;
}

interface UserApiResponse {
  body: User;
}

interface User {
  userId: string;
  full_name: string;
  email: string;
}

export {
  Automation,
  BatteryType,
  DockerContainer,
  Environment,
  Installation,
  InstallationApiResponse,
  InstallationBody,
  Log,
  Network,
  NetworkInterface,
  NetworkInterfaceData,
  Observation,
  ObservationApiResponse,
  Scene,
  Script,
  Storage,
  User,
  UserApiResponse,
  Zigbee,
  ZigbeeDevice,
};
