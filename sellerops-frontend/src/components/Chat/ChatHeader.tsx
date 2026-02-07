type Props = {
  title?: string;
};

export default function ChatHeader({ title = "Sales Assistant" }: Props) {
  return (
    <div className="h-14 border-b border-gray-700 px-4 flex items-center justify-between text-sm">
      <span className="truncate">{title}</span>
      <button className="text-gray-400 hover:text-white">Share</button>
    </div>
  );
}
