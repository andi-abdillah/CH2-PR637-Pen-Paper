import { Helmet, HelmetProvider } from "react-helmet-async";
import Divider from "../../components/Divider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import { dateFormater } from "../../utils/dateFormater";
import axios from "axios";

const OtherUserProfile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [userArticles, setUserArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundUser = await axios.get(`http://localhost:9000/users/${id}`);
        const userData = foundUser.data.data.user;

        const foundArticles = await axios.get(
          `http://localhost:9000/articles/user/${id}`
        );
        const articles = foundArticles.data.data.articles;

        setUserArticles(articles);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
          <title>User Profile</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <BackButton />

        <h2 className="text-xl font-semibold my-8">
          {user.descriptions ? user.descriptions : "No descriptions yet"}
        </h2>

        <Divider />

        <div className="text-lg px-3 xs:px-8 py-8 font-semibold">
          <h2>{user.username}</h2>
          <h2 className="text-primary">
            Joined since {dateFormater(user.createdAt)}
          </h2>
        </div>

        <Divider />

        <div className="flex flex-wrap justify-between mt-6">
          {userArticles.length > 0 ? (
            userArticles.map((userArticle, index) => (
              <Card key={index} {...userArticle} />
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
