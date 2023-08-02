const apiSettings = {
  baseUrl: "https://api.haargos.smartrezydencja.pl",
  userId: "07957eee-0d3d-4e09-8d25-465bb1a82806",
  token: "ba4d8180-88b1-4645-9d0b-d4980a86be05",
};
const baseHeaders = new Headers({
  "x-user-id": apiSettings.userId,
  "x-token": apiSettings.token,
});

export { apiSettings, baseHeaders };
