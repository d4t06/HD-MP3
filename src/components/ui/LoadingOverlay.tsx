export default function LoadingOverlay() {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-full flex items-center justify-center bg-white/60">
      <div
        style={{ borderRightColor: 'var-(--primary-cl)' }}
        className={`w-9 h-9 animate-spin rounded-full border border-4`}
      ></div>
    </div>
  );
}
