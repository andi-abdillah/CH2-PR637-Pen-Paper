import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import { dateFormater } from "../../utils/dateFormater";
import Divider from "../../components/Divider";
import BackButton from "../../components/BackButton";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import { API_URL } from "../../api/api";
import axios from "axios";

const OtherUserProfile = () => {
  const { username } = useParams();

  const cleanedUsername = username.replace("@", "");

  const { token } = useAuth();

  const [user, setUser] = useState(null);

  const [userArticles, setUserArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const isAuthorArticle = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundUser = await axios.get(
          `${API_URL}/users/username/${cleanedUsername}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = foundUser.data.data.user;

        const foundArticles = await axios.get(
          `${API_URL}/articles/user/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const articles = foundArticles.data.data.articles;

        setUser(userData);

        setUserArticles(articles);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cleanedUsername, token]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="mx-4 mt-12">
        <BackButton />
        <p className="mt-20 text-center text-2xl font-semibold">
          User not found
        </p>
      </div>
    );
  }

  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{`${user.fullName} – Pen & Paper`}</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <BackButton />

        <h2 className="text-xl font-semibold my-8">
          {user.descriptions ? user.descriptions : "No descriptions yet"}
        </h2>

        <Divider />

        <div className="text-lg px-3 xs:px-8 py-8 font-semibold">
          <h2>{user.fullName}</h2>
          <h2 className="text-black/70">@{user.username}</h2>
          <h2 className="text-primary">
            Joined since {user.createdAt ? dateFormater(user.createdAt) : null}
          </h2>
        </div>

        <Divider />

        <div className="flex flex-wrap justify-between mt-6">
          {userArticles.length > 0 ? (
            userArticles.map((userArticle, index) => (
              <Card
                key={index}
                token={token}
                {...userArticle}
                isMyArticle={isAuthorArticle}
              />
            ))
          ) : (
            <p className="mx-auto mt-12 text-2xl font-semibold">
              No articles yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfile;
