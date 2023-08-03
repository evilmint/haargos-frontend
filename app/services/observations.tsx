import { ObservationApiResponse, Observation } from '../types';
import { apiSettings, baseHeaders } from './apiSettings';

export async function getObservations(installationId: string): Promise<Observation[]> {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: baseHeaders,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/observations?installation_id=${installationId}`, requestOptions);

  const data: ObservationApiResponse = await response.json();
  return data.body.items;
}
