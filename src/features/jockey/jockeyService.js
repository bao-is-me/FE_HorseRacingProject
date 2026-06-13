import { USE_MOCK_DATA } from "../../services/apiClient";
import { demoAccounts } from "../../mocks/accounts.mock";

export async function getJockeyAccounts() {
  const jockeys = demoAccounts.filter((account) => account.role === "Jockey");
  if (USE_MOCK_DATA) return jockeys;
  return jockeys;
}
