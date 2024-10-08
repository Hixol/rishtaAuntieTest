import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socketEvents } from "../utility/SocketHelper";
import io from "socket.io-client";

export const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
  const { userId } = useSelector(store => store.userReducer);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      const socket = io.connect("https://api.rishtaauntie.link", {
        reconnection: true,
        reconnectionDelay: 5000,
        query: {
          userId: userId ? userId : 1
        }
      });
      console.log("Socket Connection", socket);
      socketEvents(socket);

      setSocket(socket);
    }
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
