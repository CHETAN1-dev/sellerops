type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  messages: Message[];
  loading: boolean;
};

export default function ChatMessages({ messages, loading }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
      {messages.length === 0 && !loading && (
        <AIMessage text="Welcome to SellerOps. Upload your CSV to begin." />
      )}

      {messages.map((msg) =>
        msg.role === "assistant" ? (
          <AIMessage key={msg.id} text={msg.content} />
        ) : (
          <UserMessage key={msg.id} text={msg.content} />
        )
      )}

      {loading && <AIMessage text="Loading..." />}
    </div>
  );
}

export function AIMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white">
        S
      </div>
      <div className="text-gray-200 max-w-2xl whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

export function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex gap-4 justify-end">
      <div className="max-w-2xl bg-blue-600 text-white px-4 py-2 rounded-lg">
        {text}
      </div>
    </div>
  );
}
