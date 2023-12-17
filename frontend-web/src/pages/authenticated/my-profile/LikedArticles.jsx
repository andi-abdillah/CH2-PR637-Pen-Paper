import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../../provider/AuthContext";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import BackButton from "../../../components/BackButton";
import Divider from "../../../components/Divider";
import { API_URL } from "../../../api/api";
import axios from "axios";

const LikedArticles = () => {
  const { token } = useAuth();

  const [likedArticles, setLikedArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedArticles = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/user/liked-articles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const foundLikedArticles = response.data.data.likedArticles;

        setLikedArticles(foundLikedArticles);
      } catch (error) {
        console.error("Error fetching liked articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedArticles();
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Liked Articles – Pen & Paper</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">Liked Articles</h1>

        <Divider />

        <BackButton />

        <div className="flex flex-wrap justify-between mt-8">
          {likedArticles && likedArticles.length ? (
            likedArticles.map((article) => (
              <Card key={article.articleId} token={token} {...article} />
            ))
          ) : (
            <p className="md:text-xl font-semibold">
              You haven't liked any articles yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default LikedArticles;
