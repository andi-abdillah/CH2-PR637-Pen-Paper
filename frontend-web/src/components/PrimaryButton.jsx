const PrimaryButton = ({
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
          ? "bg-primary/80 text-white"
          : "hover:scale-[1.025] hover:bg-primary hover:text-white hover:border-primary hover:drop-shadow-button"
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
