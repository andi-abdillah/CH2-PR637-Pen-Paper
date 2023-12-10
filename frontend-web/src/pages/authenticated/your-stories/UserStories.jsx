import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import Loading from "../../../components/Loading";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";
import axios from "axios";

const UserStories = () => {
  const { token, user } = useAuth();

  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const isMyArticle = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:9000/articles/user/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const foundArticles = result.data.data.articles;

        setArticles(foundArticles);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.userId, token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PrimaryButton onClick={() => navigate("create")}>
        Start Writing<Icon>stylus_note</Icon>
      </PrimaryButton>

      <div className="flex flex-wrap justify-between mt-8">
        {articles.map((article, index) => (
          <Card
            key={index}
            token={token}
            authenticatedUsername={user.username}
            {...article}
            isMyArticle={isMyArticle}
          />
        ))}
      </div>
    </>
  );
};

export default UserStories;
