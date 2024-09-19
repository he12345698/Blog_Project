package com.example.blog;

import java.io.IOException;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

//public class MyWebSocketHandler extends TextWebSocketHandler {
//
//    @Override
//    public void handleTextMessage(WebSocketSession session, TextMessage message) {
//        // 处理来自客户端的消息
//        System.out.println("Received message: " + message.getPayload());
//
//        // 发送回客户端的消息
//        try {
//            session.sendMessage(new TextMessage("Message received"));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//}
public class MyWebSocketHandler extends TextWebSocketHandler {
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        // 处理接收到的消息
        System.out.println("Received message: " + message.getPayload());
        
        // 响应客户端
        try {
			session.sendMessage(new TextMessage("Message received: " + message.getPayload()));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}