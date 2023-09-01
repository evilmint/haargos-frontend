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
    (a, b) =>
      new Date(b.last_agent_connection).getTime() -
      new Date(a.last_agent_connection).getTime(),
  );

  return data.body;
}

export async function createInstallation(
  token: string,
  instance: string,
  name: string,
): Promise<Installation> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify({
    instance,
    name,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: mergedHeaders,
    body: requestBody,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/installations`, requestOptions);

  if (!response.ok) {
    throw new Error('Failed to create installation');
  }

  const data: Installation = await response.json();
  return data;
}
