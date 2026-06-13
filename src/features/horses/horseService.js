import { USE_MOCK_DATA } from "../../services/apiClient";
import { horses } from "../../mocks/horses.mock";

export async function getHorses() {
  if (USE_MOCK_DATA) return horses;
  return horses;
}
