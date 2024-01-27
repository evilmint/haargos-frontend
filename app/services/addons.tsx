import { AddonsApiResponse } from '../types'; // Adjust the import to match your project structure
import { apiSettings, baseHeaders } from './api-settings';

export async function fetchAddons(
  installationId: string,
  token: string,
): Promise<AddonsApiResponse> {
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
    `${apiSettings.baseUrl}/installations/${installationId}/addons`,
    requestOptions,
  );

  const data: AddonsApiResponse = await response.json();

  data.body.addons.forEach(addon => {
    addon.isHaargos = addon.slug.indexOf('haargos') !== -1;
  });

  return data;
}
