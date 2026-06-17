import { useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_BASE_URL, USE_MOCK_DATA, getAuthToken } from "../../../services/apiClient";

const HUB_URL = `${API_BASE_URL}/racehub`;

export function useRaceConnection() {
  const connectionRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [liveData, setLiveData] = useState(null);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      connectionRef.current = null;
    }
    setConnected(false);
    setLiveData(null);
  }, []);

  const connect = useCallback(
    async (raceId) => {
      await disconnect();

      if (USE_MOCK_DATA || !raceId) {
        setConnected(false);
        return;
      }

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => getAuthToken() || "",
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 1000, 2000, 5000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      connection.on("RaceUpdate", (data) => setLiveData(data));
      connection.onreconnected(() => setConnected(true));
      connection.onreconnecting(() => setConnected(false));
      connection.onclose(() => setConnected(false));

      try {
        await connection.start();
        await connection.invoke("JoinRace", raceId);
        connectionRef.current = connection;
        setConnected(true);
      } catch (error) {
        console.error("Race hub connection failed:", error);
        setConnected(false);
      }
    },
    [disconnect]
  );

  useEffect(() => () => connectionRef.current?.stop(), []);

  return { connected, liveData, connect, disconnect };
}
