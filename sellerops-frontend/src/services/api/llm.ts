import { apiRequest } from "../api";

export type LLMChatResponse = {
  response: string;
};

export function sendLLMMessage(message: string) {
  return apiRequest<LLMChatResponse>("/llm/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
