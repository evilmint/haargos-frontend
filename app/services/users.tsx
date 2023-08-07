import { User, UserApiResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function getUserMe(token: string): Promise<User> {
  const additionalHeaders = new Headers({
    'Authorization': `Bearer ${token}`,
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

  const response = await fetch(`${apiSettings.baseUrl}/users/me`, requestOptions);

  const data: UserApiResponse = await response.json();
  return data.body;
}
