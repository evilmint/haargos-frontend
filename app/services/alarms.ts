import { AlarmConfigurationResponse, UserAlarmConfigurationResponse } from '../types'; // Adjust the import to match your project structure
import { apiSettings, baseHeaders } from './api-settings';

export async function fetchAlarmConfigurations(
  token: string,
): Promise<AlarmConfigurationResponse> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: mergedHeaders,
    redirect: 'follow',
  };

  const response = await fetch(
    `${apiSettings.baseUrl}/alarms/configurations`,
    requestOptions,
  );

  const data: AlarmConfigurationResponse = await response.json();

  return data;
}

export async function fetchUserAlarmConfigurations(
  token: string,
): Promise<UserAlarmConfigurationResponse> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: mergedHeaders,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/alarms`, requestOptions);

  const data: UserAlarmConfigurationResponse = await response.json();

  return data;
}
