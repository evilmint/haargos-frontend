import { User } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function deleteAccount(token: string): Promise<void> {
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

  const response = await fetch(`${apiSettings.baseUrl}/account`, requestOptions);

  if (!response.ok) {
    throw new Error('Failed to delete account');
  }

  return await response.json().then(() => {});
}

export async function updateAccount(token: string, data: any): Promise<void> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify(data);

  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: mergedHeaders,
    body: requestBody,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/account`, requestOptions);

  if (!response.ok) {
    throw new Error('Failed to update account');
  }

  return await response.json().then(() => {});
}

export async function createAccount(token: string, userFullName: string): Promise<User> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify({
    userFullName: userFullName,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: mergedHeaders,
    body: requestBody,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/account`, requestOptions);

  if (!response.ok) {
    throw new Error('Failed to create account');
  }

  return await response.json().then(res => res.body);
}
