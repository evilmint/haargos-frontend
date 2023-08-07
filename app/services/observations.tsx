import { ObservationApiResponse, Observation } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function getObservations(installationId: string, token: string): Promise<Observation[]> {
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

  const response = await fetch(`${apiSettings.baseUrl}/observations?installation_id=${installationId}`, requestOptions);

  const data: ObservationApiResponse = await response.json();
  return data.body.items;
}
