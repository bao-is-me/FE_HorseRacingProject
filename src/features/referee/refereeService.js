import { USE_MOCK_DATA } from "../../services/apiClient";
import { reports } from "../../mocks/referee.mock";

export async function getRefereeReports() {
  if (USE_MOCK_DATA) return reports;
  return reports;
}
