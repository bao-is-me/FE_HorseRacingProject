import { USE_MOCK_DATA } from "../../services/apiClient";
import { prizes, raceResults } from "../../mocks/results.mock";

export async function getRaceResults() {
  if (USE_MOCK_DATA) return raceResults;
  return raceResults;
}

export async function getPrizes() {
  if (USE_MOCK_DATA) return prizes;
  return prizes;
}
