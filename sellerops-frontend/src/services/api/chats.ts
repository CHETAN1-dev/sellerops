import { apiRequest } from "../api";

export type Chat = {
  id: string;
  title: string;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export function createChat(title: string) {
  return apiRequest<Chat>("/chats", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function listChats() {
  return apiRequest<Chat[]>("/chats", {
    method: "GET",
  });
}

export function getMessages(chatId: string) {
  return apiRequest<ChatMessage[]>(`/chats/${chatId}/messages`, {
    method: "GET",
  });
}

export function sendMessage(chatId: string, content: string) {
  return apiRequest<ChatMessage>(`/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}


export function getChat(chatId: string) {
  return apiRequest<Chat>(`/chats/${chatId}`, {
    method: "GET",
  });
}
