import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import Loading from "../../../components/Loading";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";
import axios from "axios";

const UserStories = () => {
  const { authenticatedUser } = useAuth();

  const user = authenticatedUser;

  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/articles");
        const allArticles = response.data.data.articles;

        const filteredArticles = allArticles.filter(
          (article) => article.userId === user.userId
        );

        setArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.userId]);

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
          <Card key={index} {...article} />
        ))}
      </div>
    </>
  );
};

export default UserStories;
