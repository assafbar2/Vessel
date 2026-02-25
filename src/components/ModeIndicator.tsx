import useTransientStore from "../stores/transientStore";

const ModeIndicator = () => {
  const mode = useTransientStore((s) => s.mode);
  const symbol = mode === "transient" ? "~" : "\u2022";

  return <span className="mode-indicator">{symbol}</span>;
};

export default ModeIndicator;
