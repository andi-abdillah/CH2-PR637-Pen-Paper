import { Helmet, HelmetProvider } from "react-helmet-async";
import TextInput from "../../components/TextInput";
import Divider from "../../components/Divider";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { debounce, shuffle } from "lodash";
import PrimaryButton from "../../components/PrimaryButton";
import ExploreTopics from "./ExploreTopics";
import ExploreAccount from "./ExploreAccount";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search"));
  const [filteredItems, setFilteredItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(4);
  const [selectedTab, setSelectedTab] = useState("topics");
  const [usersList, setUsersList] = useState([]);

  const { loggedInUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:9000/users");
        const usersData = usersResponse.data.data.users;

        const articlesResponse = await axios.get(
          "http://localhost:9000/articles"
        );
        const articlesData = articlesResponse.data.data.articles;

        if (selectedTab === "topics") {
          const filteredArticles =
            articlesData && articlesData.length
              ? articlesData
                  .filter((article) => article.userId !== loggedInUser.userId)
                  .filter((article) =>
                    searchQuery
                      ? article.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        article.content
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true
                  )
              : [];
          setFilteredItems(shuffle(filteredArticles));
        } else {
          if (searchQuery) {
            const filteredUsers =
              usersData && usersData.length
                ? usersData
                    .filter(
                      (user) => user.usersetSearchID !== loggedInUser.userId
                    )
                    .filter((user) =>
                      searchQuery
                        ? user.username
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true
                    )
                : [];
            setUsersList(filteredUsers);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery, selectedTab, loggedInUser.userId]);

  const debouncedSearch = debounce(
    (value) => setSearchQuery(value.trim()),
    1000
  );

  const handleChange = (e) => debouncedSearch(e.target.value);

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);
  };

  const handleTabChange = (tab) => {
    setSelectedTab((prevTab) => (prevTab === tab ? prevTab : tab));
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Explore</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <h1 className="text-3xl xs:text-5xl mb-8">Explore</h1>
        <Divider />
        <div className="relative my-5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <TextInput
            id="search"
            name="search"
            type="text"
            defaultValue={searchQuery}
            className="pl-12 capitalize"
            placeholder={`Search ` + selectedTab}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3">
          <PrimaryButton
            onClick={() => handleTabChange("topics")}
            disabled={selectedTab === "topics"}
          >
            Topics
          </PrimaryButton>
          <PrimaryButton
            onClick={() => handleTabChange("account")}
            disabled={selectedTab === "account"}
          >
            Account
          </PrimaryButton>
        </div>

        <div className="mt-6">
          {selectedTab === "topics" && (
            <ExploreTopics
              filteredItems={filteredItems}
              visibleItems={visibleItems}
              handleLoadMore={handleLoadMore}
              search={searchQuery}
            />
          )}
          {selectedTab === "account" && searchQuery && (
            <ExploreAccount usersList={usersList} search={searchQuery} />
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;
