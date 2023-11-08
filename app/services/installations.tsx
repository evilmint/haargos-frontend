import { UpgradeTierError } from '@/lib/errors';
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
    if (response.status == 409) {
      throw new UpgradeTierError('Upgrade Tier');
    }

    throw new Error('Failed to create installation');
  }

  const data: Installation = await response.json();
  return data;
}

export async function updateInstallation(
  token: string,
  id: string,
  instance: string,
  name: string,
  notes: string,
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
    id,
    instance,
    name,
    notes,
  });

  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: mergedHeaders,
    body: requestBody,
    redirect: 'follow',
  };

  const response = await fetch(
    `${apiSettings.baseUrl}/installations/${id}`,
    requestOptions,
  );

  if (!response.ok) {
    throw new Error('Failed to update installation');
  }

  const data: Installation = await response.json();
  return data;
}

export async function deleteInstallation(
  token: string,
  id: string,
): Promise<Installation> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
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
    `${apiSettings.baseUrl}/installations/${id}`,
    requestOptions,
  );

  if (!response.ok) {
    throw new Error(`Failed to delete installation ${id}`);
  }

  const data = await response.json();
  return data;
}
