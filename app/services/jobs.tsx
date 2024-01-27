import { ApiResponse, Job, JobsApiResponse } from '../types';
import { apiSettings, baseHeaders } from './api-settings';

export async function scheduleJob(
  token: string,
  installationId: string,
  type: string,
  context: any,
): Promise<Response> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const mergedHeaders = new Headers({
    ...Object.fromEntries(baseHeaders),
    ...Object.fromEntries(additionalHeaders),
  });

  const requestBody = JSON.stringify({
    type: type,
    context: context,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: mergedHeaders,
    body: requestBody,
    redirect: 'follow',
  };

  const response = await fetch(
    `${apiSettings.baseUrl}/installations/${installationId}/jobs`,
    requestOptions,
  );

  return await response;
}

export async function fetchJobs(token: string, installationId: string): Promise<Job[]> {
  const additionalHeaders = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
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
    `${apiSettings.baseUrl}/installations/${installationId}/jobs`,
    requestOptions,
  );

  const data: ApiResponse<JobsApiResponse> = await response.json();

  return data.body.jobs;
}
