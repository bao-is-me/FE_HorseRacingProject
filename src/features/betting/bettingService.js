import { USE_MOCK_DATA } from "../../services/apiClient";
import { bets, payments } from "../../mocks/betting.mock";

export async function getBets() {
  if (USE_MOCK_DATA) return bets;
  return bets;
}

export async function getPayments() {
  if (USE_MOCK_DATA) return payments;
  return payments;
}
