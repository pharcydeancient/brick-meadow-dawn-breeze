export function WinClose({
  onClick,
  label = "Close",
  corner = false,
}: {
  onClick: () => void;
  label?: string;
  corner?: boolean;
}) {
  return (
    <button type="button" className={corner ? "win-x" : "win-close"} aria-label={label} onClick={onClick}>
      {corner ? "×" : null}
    </button>
  );
}
