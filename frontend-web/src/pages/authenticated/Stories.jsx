import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";
import articles from "../../utils/articles.json";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const Stories = () => {
  const { loggedInUser } = useAuth();

  const navigate = useNavigate();
  const [myArticles, setMyArticles] = useState([]);

  useEffect(() => {
    const foundArticles = articles.filter(
      (article) => article.userID === loggedInUser.userID
    );
    setMyArticles(foundArticles);
  }, [loggedInUser.userID]);

  return (
    <>
      <PrimaryButton onClick={() => navigate("create")}>
        Start Writing<Icon>stylus_note</Icon>
      </PrimaryButton>

      <div className="flex flex-wrap justify-between mt-8">
        {myArticles.map((article, index) => (
          <Card key={index} {...article} />
        ))}
      </div>
    </>
  );
};

export default Stories;
