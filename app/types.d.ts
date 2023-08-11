interface Log {
  raw: string;
  time: string;
  type: string;
  thread: string;
  log: string;
}

interface Environment {
  cpu: {
    model_name: string;
    load: number;
    cpu_mhz: string;
    architecture: string;
  };
  memory: {
    available: number;
    shared: number;
    total: number;
    buff_cache: number;
    used: number;
    free: number;
  };
  storage: Array<Storage>;
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
}

interface Zigbee {
  devices: ZigbeeDevice[];
}

interface ZigbeeDevice {
  ieee: string;
  last_updated: string;
  entity_name: string;
  name_by_user: string | null;
  brand: string;
  lqi: number;
  battery_level: number | null;
  power_source: string | null;
  integration_type: string;
}

interface ObservationApiResponse {
  body: {
    items: Observation[];
  };
}

interface InstallationUrls {
  instance: string;
}

interface Installation {
  urls: InstallationUrls;
  healthy: boolean;
  userId: string;
  issues: string[];
  notes: string;
  last_agent_connection: string;
  id: string;
  name: string;
}

interface InstallationBody {
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
  InstallationApiResponse,
  Installation,
  ObservationApiResponse,
  Log,
  Environment,
  DockerContainer,
  Observation,
  UserApiResponse,
  Zigbee,
  ZigbeeDevice,
  User,
  Storage,
};
