import { SupervisorInfoResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function fetchSupervisorInfo(
  installationId: string,
  token: string,
): Promise<SupervisorInfoResponse> {
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
    `${apiSettings.baseUrl}/installations/${installationId}/supervisor`,
    requestOptions,
  );

  const data: SupervisorInfoResponse = await response.json();
  return data;
}
