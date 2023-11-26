import { Helmet, HelmetProvider } from "react-helmet-async";
import Divider from "../../components/Divider";
import BackButton from "../../components/BackButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import articles from "../../utils/articles.json";
import users from "../../utils/users.json";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icon";
import DeleteAlert from "../../components/DeleteAlert";

const StoryDetails = () => {
  const { id } = useParams();

  const { loggedInUser } = useAuth();

  const [isMyArticle, setIsMyArticle] = useState(false);

  const [user, setUser] = useState({});

  const [article, setArticle] = useState(null);

  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);

  const openAlert = () => {
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    const foundArticle = articles.find(
      (article) => article.id === parseInt(id)
    );

    if (foundArticle) {
      setArticle(foundArticle);
      const findUser = users.find(
        (user) => user.userID === foundArticle.userID
      );
      setUser(findUser);

      if (findUser.userID === loggedInUser.userID) {
        setIsMyArticle(true);
      }
    }
  }, [id, loggedInUser.userID]);

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

  const handleEditStory = () => {
    navigate(`/dashboard/your-stories/${id}/edit`);
  };

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
                  <span onClick={handleEditStory}>Edit story</span>
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

        <DeleteAlert
          isOpen={alertOpen}
          onClose={closeAlert}
          navigate={navigate}
        />

        <div className="flex flex-col gap-6 max-w-2xl xs:mx-8 mt-8 text-lg font-semibold">
          {user.userID !== loggedInUser.userID && (
            <Link
              to={`/dashboard/user-profile/${user.userID}`}
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
