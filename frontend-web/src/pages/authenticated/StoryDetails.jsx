import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../provider/AuthContext";
import Divider from "../../components/Divider";
import BackButton from "../../components/BackButton";
import Icon from "../../components/Icon";
import StoryDeleteAlert from "../../components/StoryDeleteAlert";
import Loading from "../../components/Loading";
import axios from "axios";

const StoryDetails = () => {
  const { id } = useParams();
  const { authenticatedUser } = useAuth();
  const [isMyArticle, setIsMyArticle] = useState(false);
  const [user, setUser] = useState({});
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleResponse = await axios.get(
          `http://localhost:9000/articles/${id}`
        );
        const userId = articleResponse.data.data.article.userId;

        const userResponse = await axios.get(
          `http://localhost:9000/users/${userId}`
        );

        setArticle(articleResponse.data.data.article);
        setUser(userResponse.data.data.user);

        if (user.userId === authenticatedUser.userId) {
          setIsMyArticle(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, authenticatedUser.userId, user.userId]);

  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!article) {
    return (
      <div className="mx-4 mt-12">
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
          <title>Story Details</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">{article.title}</h1>
        <Divider />

        <div className="flex justify-between items-center">
          <BackButton />
          {isMyArticle && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0}>
                <Icon className="text-4xl cursor-pointer">more_horiz</Icon>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] py-4 text-center font-semibold drop-shadow-card bg-base-100 rounded-box w-max"
              >
                <li className="mx-5 mb-2 cursor-pointer">
                  <Link to={`/dashboard/your-stories/${id}/edit`}>
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
          isOpen={alertOpen}
          onClose={closeAlert}
          navigate={navigate}
          articleId={article.articleId}
        />

        <div className="flex flex-col gap-6 max-w-2xl xs:mx-8 mt-8 text-lg font-semibold">
          {user.userId !== authenticatedUser.userId && (
            <Link
              to={`/dashboard/user-profile/${user.userId}`}
              className="text-black text-2xl w-max"
            >
              {user.username}
            </Link>
          )}
          <h3 className="text-gray-700">{article.date}</h3>
          <h3 className="text-gray-500">Article Description</h3>
          <p>{article.content}</p>
        </div>
      </div>
    </>
  );
};

export default StoryDetails;
