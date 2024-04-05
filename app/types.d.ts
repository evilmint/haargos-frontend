interface Log {
  raw: string;
  time: Date | null;
  type: string;
  thread: string;
  log: string;
  color?: string;
}

type LogSource = 'host' | 'supervisor' | 'core' | 'dns' | 'audio' | 'multicast';

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

interface EnvironmentCPU {
  model_name: string;
  load: number;
  cpu_mhz: string;
  architecture: string;
  temp: string | null;
}

interface Environment {
  cpu: EnvironmentCPU | null;
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
  restarting: string;
  finished_at: string;
  name: string;
  started_at: string;
  state: string;
  status: string;
}

interface Observation {
  environment: Environment;
  logs?: string;
  agent_version: string;
  agent_type?: 'addon' | 'bin' | 'docker';
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
  unique_id?: string;
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
  device_id?: string;
  name_by_user: string | null;
  brand: string;
  battery?: BatteryType | null;
  lqi?: number;
  battery_level: number | null;
  power_source: 'Mains' | 'Battery' | null;
  integration_type: 'zha' | 'z2m';
  has_low_battery: boolean;
  has_low_lqi: boolean;
}

interface ObservationApiResponse {
  body: {
    Items: Observation[];
    logs: string;
  };
}

interface LogsApiResponse {
  body: {
    content: string;
  };
}

interface AddonsApiResponse {
  body: {
    addons: AddonsApiResponseAddon[];
  };
}

interface AlarmConfigurationResponse {
  body: {
    configurations: AlarmConfiguration[];
  };
}

interface AlarmHistory {
  triggered_at: string;
  installation_id: string;
  alarm_configuration: string;
  processed: number;
  state: { state: 'OK' | 'NO_DATA' | 'IN_ALARM'; date: string; };
}

interface AlarmHistoryResponse {
  body: {
    history: AlarmHistory[];
  };
}

interface UserAlarmConfigurationsResponse {
  body: {
    configurations: UserAlarmConfiguration[];
  };
}

interface UserAlarmConfigurationResponse {
  body: UserAlarmConfiguration;
}

interface AddonsApiResponseAddon {
  name: string;
  slug: string;
  description: string;
  advanced: boolean;
  stage: string;
  isHaargos: boolean;
  version: string;
  version_latest: string;
  update_available: boolean;
  available: boolean;
  detached: boolean;
  homeassistant: string | null;
  state: string;
  repository: string;
  build: boolean;
  url: string;
  icon: boolean;
  logo: boolean;
}

interface OSInfoResponse {
  body: OSInfo;
}

interface OSInfo {
  version: string;
  version_latest: string;
  update_available: boolean;
  board: string;
  boot: string;
  data_disk: string;
}

interface SupervisorInfo {
  version: string;
  version_latest: string;
  update_available: boolean;
  arch: string;
  channel: string;
  timezone: string;
  healthy: boolean;
  supported: boolean;
  logging: string;
  ip_address: string;
  wait_boot: number;
  debug: boolean;
  debug_block: boolean;
  diagnostics: null | any; // Replace 'any' with a more specific type if possible
  addons_repositories: string[];
  auto_update: boolean;
}

interface SupervisorInfoResponse {
  body: SupervisorInfo | null;
}

interface NotificationsApiResponse {
  body: {
    notifications: NotificationsApiResponseNotification[];
  };
}

interface NotificationsApiResponseNotification {
  message: string;
  created_at: string;
  installation_id: string;
  title: string;
  notification_id: string;
}

interface InstallationUrls {
  instance?: {
    url: string;
    url_type?: 'PUBLIC' | 'PRIVATE';
    is_verified: boolean;
    verification_status: 'PENDING' | 'FAILED' | 'SUCCESS' | 'EMPTY';
    subdomain?: string;
    subdomain_value?: string;
    success_url?: string;
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

interface ApiResponse<T> {
  body: T;
}

interface JobsApiResponse {
  jobs: Job[];
}

interface Job {
  created_at: string;
  updated_at?: string;
  installation_id: string;
  status_installation_id: string;
  id: string;
  type: string;
}

type Tier = 'Expired' | 'Explorer' | 'Navigator' | 'Pro' | 'Enterprise';

interface Subscription {
  activated_on: string;
  expires_on: string;
}

interface User {
  userId: string;
  full_name: string;
  email: string;
  tier: Tier;
  subscription: Subscription | null;
}

interface AlarmType {
  name: string;
  type: string;
  category: AlarmCategory;
  description: string;
  datapoints: 'NONE' | 'MISSING' | 'PRESENT';
  disabled: boolean;
  components: { type: 'older_than_picker' }[];
}

type TimeComponent = 'Months' | 'Days' | 'Hours' | 'Minutes';

interface OlderThanOption {
  timeComponent: TimeComponent;
  componentValue: number;
}

type TextMatcher = 'contains' | 'prefix' | 'suffix' | 'exactly';
type LtGtComparator = 'lt' | 'gt' | 'lte' | 'gte';
type LtGtValueType = 'f' | 'p'; // flat / percentage

interface LtGtThanOption {
  comparator: LtGtComparator;
  value: number;
  valueType: LtGtValueType;
}

interface TextMatcherOption {
  text: string;
  matcher: TextMatcher;
  caseSensitive: boolean;
}

interface AlarmConfiguration {
  name: string;
  requires_supervisor: boolean;
  alarmTypes: AlarmType[];
}

type AlarmCategory =
  | 'ADDON'
  | 'CORE'
  | 'NETWORK'
  | 'DEVICE'
  | 'ZIGBEE'
  | 'LOGS'
  | 'AUTOMATIONS'
  | 'SCRIPTS'
  | 'SCENES'
  | 'PING';

interface AddonIdentifier {
  slug: string;
}

interface SceneIdentifier {
  id: string;
}

interface AutomationIdentifier {
  id: string;
  name: string;
}

interface ScriptIdentifier {
  unique_id: string;
}

interface ZigbeeIdentifier {
  ieee: string;
}

export interface LogTypeIdentifier {
  logType: string;
}

interface StorageIdentifier {
  name: string;
}

export interface StatFunction {
  function: string;
}

interface UserAlarmConfigurationConfiguration {
  datapointCount?: number;
  addons?: AddonIdentifier[];
  scenes?: SceneIdentifier[];
  statFunction?: StatFunction;
  logTypes?: LogTypeIdentifier[];
  scripts?: ScriptIdentifier[];
  storages?: StorageIdentifier[];
  ltGtThan?: LtGtThanOption;
  textCondition?: TextMatcherOption;
  automations?: AutomationIdentifier[];
  zigbee?: ZigbeeIdentifier[];
  olderThan?: OlderThanOption;
  notificationMethod: 'E-mail';
}

interface UserAlarmConfigurationRequest {
  name: string;
  type: string;
  category: AlarmCategory;
  configuration: UserAlarmConfigurationConfiguration;
}

type UserAlarmConfigurationState = 'IN_ALARM' | 'NO_DATA' | 'OK';

interface UserAlarmConfiguration {
  id: string;
  name: string;
  description: string;
  type: string;
  state: UserAlarmConfigurationState;
  category: AlarmCategory;
  created_at: string;
  updated_at: string;
  configuration: UserAlarmConfigurationConfiguration;
}

export {
  AddonIdentifier,
  AddonsApiResponse,
  AddonsApiResponseAddon,
  AlarmCategory,
  AlarmConfiguration,
  AlarmConfigurationResponse,
  AlarmHistory,
  AlarmHistoryResponse,
  AlarmType,
  ApiResponse,
  Automation,
  AutomationIdentifier,
  BatteryType,
  DockerContainer,
  Environment,
  Installation,
  InstallationApiResponse,
  InstallationBody,
  Job,
  JobsApiResponse,
  Log,
  LogSource,
  LogsApiResponse,
  LtGtComparator,
  LtGtThanOption,
  LtGtValueType,
  Network,
  NetworkInterface,
  NetworkInterfaceData,
  NotificationsApiResponse,
  NotificationsApiResponseNotification,
  OSInfo,
  OSInfoResponse,
  Observation,
  ObservationApiResponse,
  OlderThanOption,
  Scene,
  SceneIdentifier,
  Script,
  ScriptIdentifier,
  Storage,
  SupervisorInfo,
  SupervisorInfoResponse,
  TextMatcher,
  TextMatcherOption,
  Tier,
  TimeComponent,
  User,
  UserAlarmConfiguration,
  UserAlarmConfigurationConfiguration,
  UserAlarmConfigurationRequest,
  UserAlarmConfigurationResponse,
  UserAlarmConfigurationState,
  UserAlarmConfigurationsResponse,
  UserApiResponse,
  Zigbee,
  ZigbeeDevice,
  ZigbeeIdentifier
};

