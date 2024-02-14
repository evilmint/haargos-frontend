import {
  AlarmConfigurationResponse,
  UserAlarmConfiguration,
  UserAlarmConfigurationRequest,
  UserAlarmConfigurationResponse,
  UserAlarmConfigurationsResponse,
} from '../types'; // Adjust the import to match your project structure
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

export async function deleteAlarmConfiguration(
  token: string,
  alarmId: string,
): Promise<Response> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
  });
  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: mergedHeaders,
    redirect: 'follow',
  };

  const response = await fetch(
    `${apiSettings.baseUrl}/alarms/${alarmId}`,
    requestOptions,
  );

  if (!response.ok) {
    throw new Error('Failed to delete alarm');
  }
  return response;
}

export async function fetchUserAlarmConfigurations(
  token: string,
): Promise<UserAlarmConfigurationsResponse> {
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

  const data: UserAlarmConfigurationsResponse = await response.json();

  return data;
}

export async function createUserAlarmConfiguration(
  token: string,
  alarmConfiguration: UserAlarmConfigurationRequest,
): Promise<UserAlarmConfiguration> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify(alarmConfiguration);
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: mergedHeaders,
    redirect: 'follow',
    body: requestBody,
  };
  let response = await fetch(`${apiSettings.baseUrl}/alarms`, requestOptions);

  if (!response.ok) {
    throw new Error('Failed to delete account');
  }

  return ((await response.json()) as UserAlarmConfigurationResponse).body;
}

export async function updateUserAlarmConfiguration(
  token: string,
  alarmId: string,
  alarmConfiguration: UserAlarmConfigurationRequest,
): Promise<UserAlarmConfiguration> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify(alarmConfiguration);
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: mergedHeaders,
    redirect: 'follow',
    body: requestBody,
  };
  let response = await fetch(`${apiSettings.baseUrl}/alarms/${alarmId}`, requestOptions);

  if (!response.ok) {
    throw new Error('Failed to delete account');
  }

  return ((await response.json()) as UserAlarmConfigurationResponse).body;
}
