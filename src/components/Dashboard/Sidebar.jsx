export default function EmptyState({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <span className="text-8xl mb-6">{icon}</span>
      <h3 className="text-3xl font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md italic">Module integrated. Waiting for production API data.</p>
    </div>
  );
}