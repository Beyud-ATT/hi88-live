import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import Duration from "dayjs/plugin/duration";
import dayjs from "dayjs";
import { UserType } from "../utils/constant";
import { useQueryClient } from "@tanstack/react-query";
dayjs.extend(Duration);
import * as MsgPack from "@microsoft/signalr-protocol-msgpack";

const signalRStatus = {
  Disconnected: false,
  Connected: true,
};

const SignalRContext = createContext();

const SignalRProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, fpHash, logout, refeshToken } = useAuth();
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    signalRStatus.Disconnected
  );
  const [liveMessages, setLiveMessages] = useState([]);
  const [viewer, setViewer] = useState(0);
  const [newPinnedMsg, setNewPinnedMsg] = useState(null);
  const [streamsInfo, setStreamsInfo] = useState(null);
  const currentHubConnection = useRef(false);

  /**
   * Create a new SignalR connection with custom retry logic -> If retry fails, set connectionStatus to Disconnected
   * Start connection function use for separation of concerns ( create settings and starting connection )
   * Manually reconnect if connectionStatus is Disconnected ( this is an API provide for any needed consumer )
   */

  const createConnection = useCallback(() => {
    const SIGNALR_URL =
      import.meta.env.VITE_SIGNALR_URL + "?timestamp=" + Date.now();

    return (
      new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL, {
          withCredentials: false,
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        // .configureLogging(signalR.LogLevel.Debug)
        .withHubProtocol(new MsgPack.MessagePackHubProtocol())
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            setConnectionStatus(signalRStatus.Disconnected);
            if (retryContext.previousRetryCount > 5) {
              return "Retried 5 times !!!";
            }

            // Retry delay in milliseconds, and create a backoff sequence not to exceed the array length
            const delayArray = [0, 2000, 5000, 10000, 30000];
            const nextDelay =
              delayArray[
                Math.min(retryContext.previousRetryCount, delayArray.length - 1)
              ];
            return nextDelay;
          },
        })
        .build()
    );
  }, []);

  const startConnection = useCallback(
    async (connection) => {
      try {
        await connection.start();
        connection.on("RecvChat", (data) => {
          // console.log("RecvChat: ", data);
          setLiveMessages((state) => [...state, data]);
        });
        connection.on("RecvViewer", (data) => {
          // console.log("RecvViewer: ", data);
          setViewer(data);
        });
        connection.on("CallerTokenInvalid", () => {
          refeshToken();
        });
        connection.on("CallerTokenRevoked", () => {
          logout();
        });
        connection.on("CallerChatBlocked", (msg) => {
          toast.warning(msg);
        });
        connection.on("RecvCode", (code) => {
          // console.log("RecvCode: ", code);
          setNewPinnedMsg(code);
        });
        connection.on("RecvStreamInfo", (streamInfo) => {
          queryClient.invalidateQueries({ queryKey: ["live-hot"] });

          const data = streamInfo.map((item) => JSON.parse(item));
          const reponse = Array.isArray(data) ? [...data] : [data];
          setStreamsInfo(reponse);
          Array.isArray(reponse)
            ? reponse.map((item) => {
                if (!item?.IsStreaming) {
                  localStorage.removeItem(`${item.Group}-chat`);
                }
              })
            : localStorage.removeItem(`${data.Group}-chat`);
        });
        connection.on("RecvRemoveCode", (data) => {
          queryClient.invalidateQueries({
            queryKey: ["live-detail", data],
          });
        });
        connection.on("CallerJoinGroup", (data) => {
          if (data.includes("Ok")) {
            currentHubConnection.current = true;
          }
        });
        connection.on("CallerLeaveGroup", (data) => {
          if (data.includes("Ok")) {
            currentHubConnection.current = false;
          }
        });

        setConnectionStatus(signalRStatus.Connected);
        setConnection(connection);
      } catch (err) {
        // console.error("SignalR Connection Error: ", err);
        setConnectionStatus(signalRStatus.Disconnected);
        setConnection(null);
        return false;
      }
      return true;
    },
    [logout, refeshToken, queryClient]
  );

  const manualReconnect = useCallback(async () => {
    try {
      const newConnection = createConnection();
      const success = await startConnection(newConnection);

      if (success) {
        if (connection) {
          try {
            await connection.stop();
          } catch (err) {
            console.warn("Error stopping old connection:", err);
          }
        }
        setConnection(newConnection);
        setConnectionStatus(signalRStatus.Connected);
      }
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setConnectionStatus(signalRStatus.Disconnected);
    }
  }, [connection, createConnection, startConnection]);

  /**
   * hub is streamId or userCode
   * => both can be get in getDetailLivestream
   */
  const joinGroup = useCallback(
    ({ hub }) => {
      if (connection) {
        connection.invoke(
          "JoinGroup",
          hub,
          localStorage.getItem("token"),
          fpHash
        );
      }
    },
    [connection, fpHash]
  );

  /**
   * hub is streamId or userCode
   * => both can be get in getDetailLivestream
   */
  const leaveGroup = useCallback(
    ({ hub }) => {
      if (connection) {
        connection.invoke("LeaveGroup", hub);
      }
    },
    [connection]
  );

  const sendChatMessage = useCallback(
    ({ hub, message }) => {
      if (connection) {
        connection.invoke(
          "SendChat",
          hub,
          {
            displayName: localStorage.getItem("displayName"),
            message,
            userType:
              localStorage.getItem("userType") === UserType.IDOL
                ? "special_user"
                : "user",
          },
          localStorage.getItem("token")
        );
      }
    },
    [connection]
  );

  const sendCode = useCallback(
    ({ hub, message }) => {
      if (connection) {
        connection.invoke(
          "SendCode",
          hub,
          {
            code: message,
            userType:
              localStorage.getItem("userType") === UserType.IDOL
                ? "special_user"
                : "user",
          },
          localStorage.getItem("token")
        );
      }
    },
    [connection]
  );

  const resetLiveMessages = useCallback(() => {
    setLiveMessages([]);
  }, []);

  const resetNewPinnedMsg = useCallback(() => {
    setNewPinnedMsg(null);
  }, []);

  useEffect(() => {
    if (connection) {
      connection?.onclose((error) => {
        // console.log("SignalR Connection Closed", error);
        // You can add custom logic here to handle the disconnection
        // For example, you can attempt to manually reconnect
        if (error) {
          console.error("Connection closed due to error:", error);
        }

        setConnectionStatus(signalRStatus.Disconnected);
      });

      connection?.onreconnected((connectionId) => {
        // console.log("SignalR Reconnected. Connection ID:", connectionId);
        // You can add custom logic here to handle the reconnection
        setConnectionStatus(signalRStatus.Connected);
      });
    }
  }, [connection]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        manualReconnect();
      } else {
        if (connection) {
          connection.stop();
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [manualReconnect, connection]);

  useEffect(() => {
    const newConnection = createConnection();
    startConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [createConnection, startConnection]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLiveMessages([]);
    }
  }, [isAuthenticated]);

  const changeLittle = useMemo(() => {
    return {
      connection,
      connectionStatus,
      streamsInfo,
      currentHubConnection,
      manualReconnect,
      joinGroup,
      leaveGroup,
      sendChatMessage,
      sendCode,
      resetLiveMessages,
      resetNewPinnedMsg,
      setLiveMessages,
    };
  }, [
    connection,
    connectionStatus,
    streamsInfo,
    currentHubConnection,
    manualReconnect,
    joinGroup,
    leaveGroup,
    sendChatMessage,
    sendCode,
    resetLiveMessages,
    resetNewPinnedMsg,
    setLiveMessages,
  ]);

  const changeALot = useMemo(() => {
    return {
      liveMessages,
      viewer,
      newPinnedMsg,
    };
  }, [liveMessages, viewer, newPinnedMsg]);

  const contextValue = useMemo(() => {
    return {
      ...changeALot,
      ...changeLittle,
    };
  }, [changeALot, changeLittle]);

  return (
    <SignalRContext.Provider value={contextValue}>
      {children}
    </SignalRContext.Provider>
  );
};

const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};

export { SignalRProvider, useSignalR };
