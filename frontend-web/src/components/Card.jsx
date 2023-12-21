import { useState } from "react";
import { Link } from "react-router-dom";
import { dateFormater } from "../utils/dateFormater";
import { formatNumber } from "../utils/formatNumber";
import { API_URL } from "../api/api";
import axios from "axios";

const Card = ({
  token,
  articleId,
  username,
  isMyArticle,
  title,
  slug,
  descriptions,
  createdAt,
  isLiked,
  likesTotal,
  commentsTotal,
}) => {
  const maxDescriptionsLength = 180;

  const slicedDescriptions =
    descriptions.length > maxDescriptionsLength
      ? `${descriptions.slice(0, maxDescriptionsLength)}...`
      : descriptions;

  const [totalLikes, setTotalLikes] = useState(likesTotal || 0);

  const [hasLiked, setHasLiked] = useState(isLiked);

  const likeArticle = async () => {
    try {
      await axios.post(
        `${API_URL}/article/likes`,
        { articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalLikes((prevLikes) => prevLikes + 1);
      setHasLiked(true);
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const unlikeArticle = async () => {
    try {
      await axios.delete(`${API_URL}/article/likes`, {
        data: { articleId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalLikes((prevLikes) => prevLikes - 1);
      setHasLiked(false);
    } catch (error) {
      console.error("Error unliking article:", error);
    }
  };

  return (
    <div className="card max-w-[525px] w-full text-black mb-10 bg-neutral-50 rounded-3xl drop-shadow-card">
      <div className="card-body">
        <div className="h-full mb-4">
          {!isMyArticle && (
            <h2 className="mb-2">
              <Link to={`/dashboard/profile/@${username}`} className="text-lg">
                @{username}
              </Link>
            </h2>
          )}

          <h1 className="text-3xl mb-2">{title}</h1>

          <p className="mb-2">{slicedDescriptions}</p>

          <span className="font-semibold text-black/70">
            - {createdAt ? dateFormater(createdAt) : null}
          </span>
        </div>

        <div className="card-actions justify-between">
          <Link
            to={`/dashboard/story-details/${slug}`}
            className="flex h-full items-center text-lg text-primary font-semibold transition duration-100 ease-in-out hover:scale-[1.05]"
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

          <div className="flex gap-2 items-center md:ml-4">
            <div className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                className="transform w-5 sm:w-7 h-5 sm:h-7 -scale-x-100"
              >
                <path d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z" />
              </svg>

              <span className="text-lg sm:text-xl">
                {commentsTotal ? formatNumber(commentsTotal) : "0"}
              </span>
            </div>

            <button onClick={hasLiked ? unlikeArticle : likeArticle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={hasLiked ? "rgb(255,0,0)" : "transparent"}
                viewBox="0 0 24 24"
                className={`inline-block w-6 sm:w-8 h-6 sm:h-8 stroke-current ${
                  hasLiked ? "text-[rgb(255,0,0)]" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </button>
            <div className="text-lg sm:text-xl">
              {totalLikes ? formatNumber(totalLikes) : "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
