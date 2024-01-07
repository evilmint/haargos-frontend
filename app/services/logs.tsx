import { LogsApiResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function fetchLogs(
  installationId: string,
  type: string,
  token: string,
): Promise<LogsApiResponse> {
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
    `${apiSettings.baseUrl}/installations/${installationId}/logs/${type}`,
    requestOptions,
  );

  const data: LogsApiResponse = await response.json();

  return data;
}
