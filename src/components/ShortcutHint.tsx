const isMac =
  typeof navigator !== "undefined" && navigator.platform.startsWith("Mac");
const mod = isMac ? "\u2318" : "Ctrl";

const ShortcutHint = () => {
  return (
    <div className="shortcut-hint">
      <span>{mod}+T</span> mode
      <span className="shortcut-hint-sep">/</span>
      <span>{mod}+Shift+D</span> ash
      <span className="shortcut-hint-sep">/</span>
      <span>{mod}+Shift+V</span> vault
      <span className="shortcut-hint-sep">/</span>
      <span>{mod}+?</span> help
    </div>
  );
};

export default ShortcutHint;
