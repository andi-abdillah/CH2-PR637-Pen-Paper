import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import Divider from "../../../components/Divider";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query"));

  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const selectedTab = pathArray.includes("account") ? "Account" : "Topics";

  const navigate = useNavigate();

  const debouncedSearch = debounce((value) => setSearchQuery(value), 1500);

  const handleChange = (e) => {
    const value = e.target.value.trim();
    debouncedSearch(value);

    if (!value) {
      const tabPath = `/dashboard/explore/${selectedTab}`;
      navigate(`${tabPath}`);
    }
  };

  const handleTabChange = (tab) => {
    const tabPath = `/dashboard/explore/${tab}`;
    navigate(tabPath);
  };

  useEffect(() => {
    if (searchQuery) {
      const tabPath = `/dashboard/explore/${selectedTab}`;
      navigate(`${tabPath}?query=${searchQuery}`);
    }
  }, [searchQuery, selectedTab, navigate]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`Explore ${selectedTab} – Pen & Paper`}</title>
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
            className="pl-12"
            placeholder={`Search ${selectedTab}`}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3">
          <PrimaryButton
            onClick={() => handleTabChange("topics")}
            disabled={selectedTab === "Topics"}
          >
            Topics
          </PrimaryButton>
          <PrimaryButton
            onClick={() => handleTabChange("account")}
            disabled={selectedTab === "Account"}
          >
            Account
          </PrimaryButton>
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Explore;
