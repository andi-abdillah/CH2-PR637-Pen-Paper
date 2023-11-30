import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";

const Stories = () => {
  const { loggedInUser } = useAuth();

  const user = loggedInUser;

  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/articles`);
        const allArticles = response.data.data.articles;

        const filteredArticles = allArticles.filter(
          (article) => article.userId === user.userId
        );

        setArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, [user.userId]);

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

export default Stories;
