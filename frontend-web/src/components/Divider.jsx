export default function Divider({ className = "" }) {
  return (
    <hr className={`border-[1.2px] border-gray-300 blur-[.5px] ${className}`} />
  );
}
