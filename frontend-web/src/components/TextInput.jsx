import { forwardRef, useEffect, useRef } from "react";

const TextInput = forwardRef(
  ({ type = "text", className = "", isFocused = false, ...props }, ref) => {
    const inputRef = useRef();

    useEffect(() => {
      if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    useEffect(() => {
      if (isFocused) {
        inputRef.current.focus();
      }
    }, [isFocused]);

    return (
      <div className="flex flex-col items-start">
        <input
          {...props}
          type={type}
          className={`block w-full py-1.5 px-5 rounded-full border-[1.5px] border-gray-300 transition duration-300 focus:outline-none focus:border-transparent focus:ring focus:ring-2 focus:ring-primary ${className}`}
          ref={inputRef}
        />
      </div>
    );
  }
);

export default TextInput;
