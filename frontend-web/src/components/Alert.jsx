import { useEffect, useState } from "react";

const Alert = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const backgroundColor = type === "success" ? "bg-primary" : "bg-red-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return isVisible ? (
    <div className="fixed right-5 bottom-5 flex items-center justify-end z-50">
      <div className="chat chat-end">
        <div
          className={`chat-bubble ${backgroundColor} text-white text-xs md:text-lg px-4 drop-shadow-card`}
        >
          {message}
        </div>
      </div>
    </div>
  ) : null;
};

export default Alert;
