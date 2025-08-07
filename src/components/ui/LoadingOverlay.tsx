export default function LoadingOverlay() {
  return (
    <div className="absolute z-[999] left-0 top-0 bottom-0 w-full flex items-center justify-center bg-white/60">
      <div
        className={`w-9 h-9 animate-spin rounded-full border-r-[--primary-cl] border-4`}
      ></div>
    </div>
  );
}
