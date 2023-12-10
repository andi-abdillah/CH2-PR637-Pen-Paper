import { Link } from "react-router-dom";
import { dateFormater } from "../utils/dateFormater";
import { useEffect, useState } from "react";
import axios from "axios";

const Card = ({
  token,
  authenticatedUsername,
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

  const [totalLikes, setTotalLikes] = useState(0);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const result = await axios.get(
          `http://localhost:9000/article/${articleId}/likes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const foundLikes = result.data.data.likes;

        setTotalLikes(foundLikes.length);

        const userHasLiked = foundLikes.some((like) => {
          return like.username === authenticatedUsername;
        });

        setIsLiked(userHasLiked);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLikes();
  }, [token, authenticatedUsername, articleId]);

  const likeArticle = async () => {
    try {
      await axios.post(
        `http://localhost:9000/article/likes`,
        { articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalLikes((prevLikes) => prevLikes + 1);
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  const unlikeArticle = async () => {
    try {
      await axios.delete(`http://localhost:9000/article/likes`, {
        data: { articleId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalLikes((prevLikes) => prevLikes - 1);
      setIsLiked(false);
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
              <Link
                to={`/dashboard/user-profile/${userId}`}
                className="text-lg"
              >
                @{username}
              </Link>
            </h2>
          )}

          <h1 className="text-3xl mb-2">{title}</h1>

          <p className="mb-2">{slicedDescriptions}</p>

          <span className="font-semibold text-black/70">
            - {dateFormater(createdAt)}
          </span>
        </div>

        <div className="card-actions justify-between">
          <Link
            to={`/dashboard/story-details/${articleId}`}
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
            <button onClick={isLiked ? unlikeArticle : likeArticle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isLiked ? "oklch(var(--s))" : "transparent"}
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current text-secondary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </button>
            <div className="text-2xl font-semibold">{totalLikes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
