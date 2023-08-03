import { User, UserApiResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function getUserMe(): Promise<User> {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: baseHeaders,
    redirect: 'follow',
  };

  const response = await fetch(`${apiSettings.baseUrl}/users/me`, requestOptions);

  const data: UserApiResponse = await response.json();
  return data.body;
}
