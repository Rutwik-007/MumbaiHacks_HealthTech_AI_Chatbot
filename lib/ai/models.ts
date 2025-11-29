export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "GPT-5",
    description:
      "OpenAI's most advanced model with superior multilingual capabilities and coding excellence",
  },
  {
    id: "chat-model-reasoning",
    name: "GPT-5 Reasoning",
    description:
      "Advanced reasoning model with built-in thinking for complex multilingual problems and agentic tasks",
  },
];
