export default function InputLabel({
  value,
  className = "",
  children,
  ...props
}) {
  return (
    <label
      {...props}
      className={
        `block font-medium text-md text-gray-700 mt-5 mb-1` + className
      }
    >
      {value ? value : children}
    </label>
  );
}
