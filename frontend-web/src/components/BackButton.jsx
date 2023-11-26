import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center gap-1.5 my-8 text-lg text-primary font-semibold transition duration-100 ease-in-out hover:scale-[1.025]"
      onClick={() => navigate(-1)}
    >
      <svg
        className="w-3.5 h-3.5 ml-1"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 5H1m0 0l4-4m-4 4l4 4"
        />
      </svg>
      Back
    </button>
  );
};

export default BackButton;
