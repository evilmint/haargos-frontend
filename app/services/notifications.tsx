import { NotificationsApiResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function fetchNotifications(
  installationId: string,
  token: string,
): Promise<NotificationsApiResponse> {
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

  const response = await fetch(
    `${apiSettings.baseUrl}/installations/${installationId}/notifications`,
    requestOptions,
  );

  const data: NotificationsApiResponse = await response.json();

  return data;
}
