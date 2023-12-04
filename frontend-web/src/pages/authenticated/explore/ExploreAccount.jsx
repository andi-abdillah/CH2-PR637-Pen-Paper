import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../provider/AuthContext";
import PrimaryButton from "../../../components/PrimaryButton";
import Loading from "../../../components/Loading";
import axios from "axios";

const ExploreAccount = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { authenticatedUser } = useAuth();

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        try {
          const foundUsers = await axios.get(
            `http://localhost:9000/users/search?query=${searchQuery}`
          );

          const users = foundUsers.data.data.users;

          const filteredUsers = users.filter(
            (user) => user.userId !== authenticatedUser.userId
          );

          setUsersList(filteredUsers);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setUsersList([]);
    }
  }, [searchQuery, authenticatedUser.userId]);

  useEffect(() => {
    setSearchQuery(searchParams.get("query"));
  }, [searchParams]);

  if (loading && searchQuery) {
    return <Loading />;
  }

  if (usersList?.length === 0 && searchQuery) {
    return (
      <p>
        We couldn't find any accounts matching "<b>{searchQuery}</b>".
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {usersList?.map((user, index) => (
        <Link
          to={`/dashboard/user-profile/${user.userId}`}
          key={index}
          className="w-max"
        >
          <PrimaryButton>{user.username}</PrimaryButton>
        </Link>
      ))}
    </div>
  );
};

export default ExploreAccount;