import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../provider/AuthContext";
import Divider from "../../components/Divider";
import BackButton from "../../components/BackButton";
import Icon from "../../components/Icon";
import StoryDeleteAlert from "../../components/StoryDeleteAlert";
import Loading from "../../components/Loading";
import { dateFormater } from "../../utils/dateFormater";
import axios from "axios";

const StoryDetails = () => {
  const { slug } = useParams();

  const { token, user } = useAuth();

  const [isMyArticle, setIsMyArticle] = useState(false);

  const navigate = useNavigate();

  const [author, setAuthor] = useState({});

  const [article, setArticle] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [totalLikes, setTotalLikes] = useState(0);

  const [isLiked, setIsLiked] = useState(false);

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

  useEffect(() => {
    if (article) {
      const fetchLikes = async () => {
        try {
          const result = await axios.get(
            `http://localhost:9000/article/${article.articleId}/likes`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const foundLikes = result.data.data.likes;

          setTotalLikes(foundLikes.length);

          const userHasLiked = foundLikes.some(
            (like) => like.userId === user.userId
          );
          setIsLiked(userHasLiked);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchLikes();
    }
  }, [article, token, user.userId]);

  const likeArticle = async () => {
    try {
      await axios.post(
        `http://localhost:9000/article/likes`,
        { articleId: article.articleId },
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
        data: { articleId: article.articleId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalLikes((prevLikes) => prevLikes - 1);
      setIsLiked(false);
    } catch (error) {
      console.error("Error unliking article:", error);
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

          {isMyArticle && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0}>
                <Icon className="text-4xl cursor-pointer">more_horiz</Icon>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] py-4 text-center font-semibold drop-shadow-card bg-base-100 rounded-box w-max list-none"
              >
                <li className="mx-5 mb-2 cursor-pointer">
                  <Link to={`/dashboard/your-stories/${slug}/edit`}>
                    Edit story
                  </Link>
                </li>
                <Divider />
                <li className="mx-5 mt-2 text-red-500 cursor-pointer">
                  <span onClick={openAlert}>Delete story</span>
                </li>
              </ul>
            </div>
          )}
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
          {!isMyArticle && (
            <Link
              to={`/dashboard/profile/@${author.username}`}
              className="text-grey-600 text-2xl w-max font-semibold"
            >
              @{author.username}
            </Link>
          )}
          <h3 className="text-gray-700 font-semibold">
            {dateFormater(article.createdAt)}
          </h3>
          <h3 className="text-gray-500 font-semibold">
            {article.descriptions}
          </h3>
          <p
            className="prose max-w-3xl"
            dangerouslySetInnerHTML={createMarkup(article.content)}
          />
        </div>
      </div>
    </>
  );
};

export default StoryDetails;
