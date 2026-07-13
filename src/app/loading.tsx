export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center pointer-events-none">
      <div className="text-white font-futura-bold tracking-[0.2em] animate-pulse">
        INITIALIZING...
      </div>
    </div>
  );
}
