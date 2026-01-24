type Props = {
  name?: string;
  onClick: () => void;
};

export default function Avatar({ name, onClick }: Props) {
  const letter = name?.charAt(0).toUpperCase() ?? "U";

  return (
    <button
      onClick={onClick}
      className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
    >
      {letter}
    </button>
  );
}
