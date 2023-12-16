import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../provider/AuthContext";
import { useAlert } from "../../provider/AlertProvider";
import Divider from "../../components/Divider";
import BackButton from "../../components/BackButton";
import Icon from "../../components/Icon";
import StoryDeleteAlert from "../../components/StoryDeleteAlert";
import Loading from "../../components/Loading";
import { dateFormater } from "../../utils/dateFormater";
import { formatNumber } from "../../utils/formatNumber";
import CommentSection from "./comments/CommentSection";
import axios from "axios";

const StoryDetails = () => {
  const { slug } = useParams();

  const { token, user } = useAuth();

  const { showAlert } = useAlert();

  const [isMyArticle, setIsMyArticle] = useState(false);

  const navigate = useNavigate();

  const [author, setAuthor] = useState({});

  const [article, setArticle] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [totalLikes, setTotalLikes] = useState(0);

  const [hasLiked, setHasLiked] = useState(false);

  const [hasBookmarked, setHasBookmarked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleResult = await axios.get(
          `http://localhost:9000/articles/${slug}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const foundArticle = articleResult.data.data.article;

        if (foundArticle.userId === user.userId) {
          setIsMyArticle(true);
        }

        setArticle(foundArticle);

        setHasLiked(foundArticle.isLiked);

        setHasBookmarked(foundArticle.isBookmarked);

        setTotalLikes(foundArticle.likesTotal);

        const username = foundArticle.username;

        const userResult = await axios.get(
          `http://localhost:9000/users/username/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const foundUser = userResult.data.data.user;

        setAuthor(foundUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, user.userId, user]);

  const likeArticle = async () => {
    try {
      await axios.post(
        `http://localhost:9000/article/likes`,
        { articleId: article.articleId },
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
      await axios.delete(`http://localhost:9000/article/likes`, {
        data: { articleId: article.articleId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalLikes((prevLikes) => prevLikes - 1);
      setHasLiked(false);
    } catch (error) {
      console.error("Error unliking article:", error);
    }
  };

  const addBookmark = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9000/bookmarks`,
        { articleId: article.articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { message, status } = response.data;

      showAlert(message, status);

      setHasBookmarked(true);
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const removeBookmark = async () => {
    try {
      const response = await axios.delete(`http://localhost:9000/bookmarks`, {
        data: { articleId: article.articleId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const { message, status } = response.data;

      showAlert(message, status);

      setHasBookmarked(false);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  if (loading) {
    return <Loading />;
  }

  if (!article) {
    return (
      <div className="mx-4 mt-12">
        <HelmetProvider>
          <Helmet>
            <title>Article Not Found – Pen & Paper</title>
          </Helmet>
        </HelmetProvider>
        <BackButton />
        <p className="mt-20 text-center text-2xl font-semibold">
          Article not found
        </p>
      </div>
    );
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            {`${article.title} | by ${author.fullName} | Pen & Paper`}
          </title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">{article.title}</h1>
        <Divider />

        <div className="flex justify-between items-center my-5">
          <div className="flex gap-2 items-center md:ml-4">
            <button onClick={hasLiked ? unlikeArticle : likeArticle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={hasLiked ? "oklch(var(--s))" : "transparent"}
                viewBox="0 0 24 24"
                className={`inline-block w-8 h-8 stroke-current ${
                  hasLiked ? "text-secondary" : ""
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
            <div className="text-2xl">{formatNumber(totalLikes)}</div>
          </div>

          <div className="dropdown dropdown-end">
            <label tabIndex={0}>
              <Icon className="text-4xl cursor-pointer">more_horiz</Icon>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] py-4 text-center font-semibold drop-shadow-card bg-base-100 rounded-box w-max list-none"
            >
              {isMyArticle ? (
                <>
                  <li className="mx-5 mb-2 cursor-pointer">
                    <Link to={`/dashboard/your-stories/${slug}/edit`}>
                      Edit story
                    </Link>
                  </li>
                  <Divider />
                  <li className="mx-5 mt-2 text-red-500 cursor-pointer">
                    <span onClick={openAlert}>Delete story</span>
                  </li>
                </>
              ) : (
                <div className="px-4">
                  {hasBookmarked ? (
                    <button
                      onClick={() => removeBookmark()}
                      className="text-red-500"
                    >
                      Remove from bookmark
                    </button>
                  ) : (
                    <button
                      onClick={() => addBookmark()}
                      className="text-primary"
                    >
                      Add to bookmark
                    </button>
                  )}
                </div>
              )}
            </ul>
          </div>
        </div>
        <Divider />

        <StoryDeleteAlert
          token={token}
          isOpen={alertOpen}
          onClose={closeAlert}
          navigate={navigate}
          slug={article.slug}
        />

        <div className="flex flex-col gap-6 max-w-3xl xs:mx-8 mt-8 text-lg">
          {isMyArticle ? (
            <h2 className="text-grey-600 text-2xl w-max font-semibold">You</h2>
          ) : (
            <Link
              to={`/dashboard/profile/@${author.username}`}
              className="text-grey-600 text-2xl w-max font-semibold"
            >
              @{author.username}
            </Link>
          )}
          <h3 className="text-gray-700 font-semibold">
            {article.createdAt ? dateFormater(article.createdAt) : null}
          </h3>
          <h3 className="text-gray-500 font-semibold">
            {article.descriptions}
          </h3>
          <p
            className="prose max-w-3xl"
            dangerouslySetInnerHTML={createMarkup(article.content)}
          />
        </div>

        <CommentSection articleId={article.articleId} />
      </div>
    </>
  );
};

export default StoryDetails;
