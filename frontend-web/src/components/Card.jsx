import { Link } from "react-router-dom";
import { dateFormater } from "../utils/dateFormater";

const Card = ({
  articleId,
  userId,
  username,
  isMyArticle,
  title,
  descriptions,
  createdAt,
}) => {
  const maxDescriptionsLength = 180;

  const slicedDescriptions =
    descriptions.length > maxDescriptionsLength
      ? `${descriptions.slice(0, maxDescriptionsLength)}...`
      : descriptions;

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <div className="card max-w-[525px] w-full text-black mb-10 bg-neutral-50 rounded-3xl drop-shadow-card">
      <div className="card-body justify-between">
        <div className="flex flex-col gap-2">
          {!isMyArticle && (
            <Link
              to={`/dashboard/user-profile/${userId}`}
              className="text-lg w-max"
            >
              @{username}
            </Link>
          )}

          <h1 className="card-title text-3xl">{title}</h1>

          <p dangerouslySetInnerHTML={createMarkup(slicedDescriptions)} />

          <span className="font-semibold text-black/70">
            - {dateFormater(createdAt)}
          </span>
        </div>

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
