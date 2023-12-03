import { Link } from "react-router-dom";
import { dateFormater } from "../utils/dateFormater";
import { useAuth } from "../provider/AuthContext";

const Card = ({ articleId, userId, username, title, content, createdAt }) => {
  const maxContentLength = 200;

  const { authenticatedUser } = useAuth();

  const slicedContent =
    content.length > maxContentLength
      ? `${content.slice(0, maxContentLength)}...`
      : content;

  return (
    <div className="card max-w-[525px] w-full text-black mb-10 bg-neutral-50 rounded-3xl drop-shadow-card">
      <div className="card-body">
        {userId !== authenticatedUser.userId && (
          <Link
            to={`/dashboard/user-profile/${userId}`}
            className="text-lg w-max"
          >
            {username}
          </Link>
        )}

        <h1 className="card-title text-3xl">{title}</h1>

        <p>
          <b>{slicedContent}</b> - {dateFormater(createdAt)}
        </p>

        <div className="card-actions">
          <Link
            to={`/dashboard/story-details/${articleId}`}
            className="flex items-center text-lg text-primary font-semibold transition duration-100 ease-in-out hover:scale-[1.05]"
          >
            Read
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
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
