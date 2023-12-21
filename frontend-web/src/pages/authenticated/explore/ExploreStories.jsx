import { useEffect, useState } from "react";
import Card from "../../../components/Card";
import PrimaryButton from "../../../components/PrimaryButton";
import Icon from "../../../components/Icon";
import Loading from "../../../components/Loading";
import { API_URL } from "../../../api/api";
import axios from "axios";

const ExploreStories = ({ token, searchQuery }) => {
  const [articles, setArticles] = useState([]);

  const [visibleArticles, setVisibleArticles] = useState(8);

  const [loading, setLoading] = useState(true);

  const handleLoadMore = () => {
    setVisibleArticles((prevVisibleArticles) => prevVisibleArticles + 8);
  };

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        try {
          const result = await axios.get(
            `${API_URL}/articles/search?query=${searchQuery}`,
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
  }, [token, searchQuery]);

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
        <Card key={index} token={token} {...item} />
      ))}
      {visibleArticles < articles.length && (
        <PrimaryButton className="m-auto" onClick={handleLoadMore}>
          Load More<Icon>arrow_circle_down</Icon>
        </PrimaryButton>
      )}
    </div>
  );
};

export default ExploreStories;
