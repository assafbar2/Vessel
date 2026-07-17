import { useEffect } from "react";
import useTransientStore from "../stores/transientStore";

type NoticeContent = {
  heading: string;
  subtitle: string;
};

const NOTICES: Record<string, NoticeContent> = {
  permanent: {
    heading: "Permanent",
    subtitle: "Only what remains will be kept.",
  },
  transient: {
    heading: "Transient",
    subtitle: "Words dissolve. Write without holding on.",
  },
};

const TransientNotice = () => {
  const showNotice = useTransientStore((s) => s.showNotice);
  const noticeMode = useTransientStore((s) => s.noticeMode);
  const setShowNotice = useTransientStore((s) => s.setShowNotice);
  const content = noticeMode ? NOTICES[noticeMode] : null;

  useEffect(() => {
    if (showNotice && content) {
      const timer = setTimeout(() => {
        setShowNotice(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotice, content, setShowNotice]);

  if (!showNotice || !content) return null;

  return (
    <div className="transient-notice">
      <span className="transient-notice-heading">{content.heading}</span>
      <span className="transient-notice-subtitle">{content.subtitle}</span>
    </div>
  );
};

export default TransientNotice;
