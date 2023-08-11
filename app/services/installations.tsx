import { Installation, InstallationApiResponse, InstallationBody } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function getInstallations(token: string): Promise<InstallationBody> {
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

  const response = await fetch(`${apiSettings.baseUrl}/installations`, requestOptions);
  let data: InstallationApiResponse = await response.json();

  data.body.items = data.body.items.sort(
    (a, b) => new Date(b.last_agent_connection).getTime() - new Date(a.last_agent_connection).getTime(),
  );

  return data.body;
}
