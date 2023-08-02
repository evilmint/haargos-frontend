import { Installation, InstallationApiResponse } from "../types";
import { apiSettings, baseHeaders } from "./apiSettings";

export async function getInstallations(): Promise<Installation[]> {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: baseHeaders,
    redirect: "follow",
  };

  const response = await fetch(`${apiSettings.baseUrl}/installations`, requestOptions);
  const data: InstallationApiResponse = await response.json();

  return data.body.items.sort(
    (a, b) => new Date(b.last_agent_connection).getTime() - new Date(a.last_agent_connection).getTime()
  );
}
