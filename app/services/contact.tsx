import { User } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function contact(
  name: string,
  email: string,
  message: string,
): Promise<void> {
  const additionalHeaders = new Headers({
    'Content-Type': 'application/json',
  });

  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify({ name, email, message });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: mergedHeaders,
    body: requestBody,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/contact`, requestOptions);

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
