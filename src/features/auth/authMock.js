export const DEFAULT_LOGIN_FORM = {
  email: "baon7311@gmail.com",
  password: "12345678",
  demoRole: "Spectator"
};

export const DEFAULT_REGISTER_FORM = {
  fullName: "New Racing User",
  phone: "0900000000",
  email: "new-user@stalliongate.ai",
  password: "Password@123",
  role: "Spectator"
};

export function getRegisteredDemoUser(form, status) {
  return { ...form, id: "new-demo", status, balance: 0 };
}
