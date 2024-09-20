import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client = null;

export const connectWebSocket = (userId, onMessage) => {
  const socket = new SockJS('http://niceblog.myvnc.com:8080/blog/notifications');
  client = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      // Optional headers for connection
    },
    debug: (str) => {
      console.log('STOMP debug:', str);
    },
    onConnect: (frame) => {
      console.log('Connected:', frame);
      // Subscribe to user-specific topic
      client.subscribe(`/topic/notifications/${userId}`, (message) => {
        console.log('userId at websocket is', userId);
        if (onMessage) {
          onMessage(message.body);
        } else {
          console.log('else is', userId);
        }
      });
    },
    onDisconnect: (frame) => {
      console.log('Disconnected:', frame);
    },
  });

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
  }
};
