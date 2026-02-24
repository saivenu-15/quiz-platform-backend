import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(0);

    useEffect(() => {
        // Only connect if user is logged in
        if (user) {
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
            const newSocket = io(socketUrl, {
                withCredentials: true,
                transports: ['websocket'],
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to Socket.io');
            });

            // Global event listener for online user count (optional but cool)
            newSocket.on('onlineCount', (count) => {
                setOnlineUsers(count);
            });

            return () => {
                newSocket.disconnect();
            };
        } else {
            // Disconnect if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return ctx;
};
