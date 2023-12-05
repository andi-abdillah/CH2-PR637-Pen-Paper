import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../provider/AuthContext";
import Card from "../../../components/Card";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import Loading from "../../../components/Loading";
import axios from "axios";

const ExploreTopics = () => {
  const { token, user } = useAuth();

  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(null);

  const [articles, setArticles] = useState([]);

  const [visibleArticles, setVisibleArticles] = useState(4);

  const [loading, setLoading] = useState(true);

  const handleLoadMore = () => {
    setVisibleArticles((prevVisibleArticles) => prevVisibleArticles + 4);
  };

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        try {
          const result = await axios.get(
            `http://localhost:9000/articles/search?query=${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const foundArticles = result.data.data.articles;

          setArticles(foundArticles);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setArticles([]);
    }
  }, [token, searchQuery, user.userId]);

  useEffect(() => {
    setSearchQuery(searchParams.get("query"));
  }, [searchParams]);

  if (loading && searchQuery) {
    return <Loading />;
  }

  if (articles?.length === 0 && searchQuery) {
    return (
      <p>
        No articles found matching "<b>{searchQuery}</b>". Try a different
        search term or check for typos.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-between">
      {articles.slice(0, visibleArticles).map((item, index) => (
        <Card key={index} {...item} />
      ))}
      {visibleArticles < articles.length && (
        <PrimaryButton className="m-auto" onClick={handleLoadMore}>
          Load More<Icon>arrow_circle_down</Icon>
        </PrimaryButton>
      )}
    </div>
  );
};

export default ExploreTopics;
