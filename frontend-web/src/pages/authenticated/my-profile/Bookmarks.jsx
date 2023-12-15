import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useAuth } from "../../../provider/AuthContext";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import BackButton from "../../../components/BackButton";
import axios from "axios";
import Divider from "../../../components/Divider";

const Bookmarks = () => {
  const { token } = useAuth();

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get("http://localhost:9000/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foundBookmarks = response.data.data.bookmarks;

        setArticles(foundBookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>My Bookmarks – Pen & Paper</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">My Bookmarks</h1>

        <Divider />

        <BackButton />

        <div className="flex flex-wrap justify-between mt-8">
          {articles && articles.length ? (
            articles.map((article) => (
              <Card key={article.articleId} token={token} {...article} />
            ))
          ) : (
            <p className="md:text-xl font-semibold">
              You haven't added any bookmarks yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
