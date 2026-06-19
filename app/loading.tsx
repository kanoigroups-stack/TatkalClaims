export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin" aria-hidden="true" />
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
