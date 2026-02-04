export default function ChartSlide({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-full snap-center">
      <div className="bg-white rounded-xl shadow p-6 h-[420px]">
        <h3 className="font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}
