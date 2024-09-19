package com.example.blog;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class NotificationWebSocketHandler extends TextWebSocketHandler {

    // 用于存储 WebSocket 会话的 Map，key 是用户 ID，value 是 WebSocket 会话
    private final Map<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 这里你可以通过获取用户信息（如 token）来管理会话
        // 假设用户 ID 是通过 WebSocket 会话的 URI 或者通过消息的某个字段来确定
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) {
            sessionMap.put(userId, session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // 清理关闭的会话
        String userId = (String) session.getAttributes().get("userId");
        if (userId != null) {
            sessionMap.remove(userId);
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        // 处理来自客户端的消息
        // 你可以根据消息内容执行不同的操作
        System.out.println("Received message: " + message.getPayload());
    }

    public void sendNotification(String userId, String message) {
        WebSocketSession session = sessionMap.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

