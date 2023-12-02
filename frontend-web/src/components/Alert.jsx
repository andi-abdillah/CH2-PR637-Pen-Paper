import { useEffect, useState } from "react";

const Alert = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const backgroundColor = type === "success" ? "bg-emerald-500" : "bg-red-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return isVisible ? (
    <div className="fixed right-5 bottom-5 flex items-center justify-end w-full z-50">
      <div className="chat chat-end">
        <div
          className={`chat-bubble ${backgroundColor} text-xs md:text-lg px-4 drop-shadow-card`}
        >
          {message}
        </div>
      </div>
    </div>
  ) : null;
};

export default Alert;
