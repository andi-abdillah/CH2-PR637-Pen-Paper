const TextArea = ({
  className = "",
  cols = "30",
  rows = "10",
  children,
  ...props
}) => {
  return (
    <div>
      <div className="flex flex-col items-start">
        <textarea
          {...props}
          className={`block w-full py-1.5 px-5 rounded-xl border-[1.5px] border-gray-300 transition duration-300 focus:outline-none focus:border-transparent focus:ring focus:ring-2 focus:ring-primary ${className}`}
          cols={cols}
          rows={rows}
        >
          {children}
        </textarea>
      </div>
    </div>
  );
};

export default TextArea;
