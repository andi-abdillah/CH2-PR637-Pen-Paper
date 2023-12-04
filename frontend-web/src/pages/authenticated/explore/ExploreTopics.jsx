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

  const [filteredItems, setFilteredItems] = useState([]);

  const [visibleItems, setVisibleItems] = useState(4);

  const [loading, setLoading] = useState(true);

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);
  };

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        try {
          const foundArticles = await axios.get(
            `http://localhost:9000/articles/search?query=${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const articles = foundArticles.data.data.articles;

          const filteredArticles = articles.filter(
            (article) => article.userId !== user.userId
          );

          setFilteredItems(filteredArticles);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setFilteredItems([]);
    }
  }, [token, searchQuery, user.userId]);

  useEffect(() => {
    setSearchQuery(searchParams.get("query"));
  }, [searchParams]);

  if (loading && searchQuery) {
    return <Loading />;
  }

  if (filteredItems?.length === 0 && searchQuery) {
    return (
      <p>
        No articles found matching "<b>{searchQuery}</b>". Try a different
        search term or check for typos.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-between">
      {filteredItems.slice(0, visibleItems).map((item, index) => (
        <Card key={index} {...item} />
      ))}
      {visibleItems < filteredItems.length && (
        <PrimaryButton className="m-auto" onClick={handleLoadMore}>
          Load More<Icon>arrow_circle_down</Icon>
        </PrimaryButton>
      )}
    </div>
  );
};

export default ExploreTopics;
