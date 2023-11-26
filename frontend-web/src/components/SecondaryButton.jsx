const SecondaryButton = ({
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex justify-center items-center gap-1 px-4 py-1 text-lg font-semibold border-[1.5px] rounded-full transition duration-300 ease-in-out  ${
        disabled
          ? "bg-amber-500/80 text-white"
          : "hover:scale-[1.025] hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:drop-shadow-button"
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
