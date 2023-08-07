import { Installation, InstallationApiResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function getInstallations(token: string): Promise<Installation[]> {
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
  const data: InstallationApiResponse = await response.json();

  return data.body.items.sort(
    (a, b) => new Date(b.last_agent_connection).getTime() - new Date(a.last_agent_connection).getTime(),
  );
}
