import { Installation, InstallationApiResponse } from "../types";

export async function getInstallations(): Promise<Installation[]> {
  let myHeaders = new Headers();
  myHeaders.append("x-user-iD", "07957eee-0d3d-4e09-8d25-465bb1a82806");
  myHeaders.append("X-TOKEN", "ba4d8180-88b1-4645-9d0b-d4980a86be05");
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.haargos.smartrezydencja.pl/installations",
    requestOptions
  )

  return await response
    .json()
    .then((r: any)  => r as InstallationApiResponse)
    .then((response: InstallationApiResponse) =>
      response.body.items.sort(
        (b: any, a: any) =>
          new Date(a.last_agent_connection).getTime() -
          new Date(b.last_agent_connection).getTime()
      )
    );
}
