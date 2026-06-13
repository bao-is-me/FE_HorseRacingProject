import { notifications } from "../../mocks/notifications.mock";
import { roles } from "../../mocks/roles.mock";

export function getNotificationRows(role) {
  return notifications
    .filter((item) => item.role === role || role === "Admin")
    .map((item) => ({
      Title: item.title,
      Role: roles[item.role] || item.role,
      Severity: item.severity,
      Message: item.message
    }));
}
