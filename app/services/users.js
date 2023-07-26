export function getUserMe() {
  let myHeaders = new Headers();
  myHeaders.append("x-user-iD", "07957eee-0d3d-4e09-8d25-465bb1a82806");
  myHeaders.append("X-TOKEN", "ba4d8180-88b1-4645-9d0b-d4980a86be05");
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    "https://api.haargos.smartrezydencja.pl/users/me",
    requestOptions
  )
}
