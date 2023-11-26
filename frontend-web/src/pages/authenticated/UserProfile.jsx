import { Helmet, HelmetProvider } from "react-helmet-async";
import Divider from "../../components/Divider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import Card from "../../components/Card";
import users from "../../utils/users.json";
import articles from "../../utils/articles.json";

const UserProfile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [userArticles, setUserArticles] = useState([]);

  useEffect(() => {
    const foundUser = users.find((user) => user.userID === parseInt(id));

    if (foundUser) {
      setUser(foundUser);

      const foundArticles = articles.filter(
        (article) => article.userID === foundUser.userID
      );

      if (foundArticles) {
        setUserArticles(foundArticles);
      }
    }
  }, [id]);

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
          <h2 className="text-primary">Joined since {user.joined_at}</h2>
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

export default UserProfile;
