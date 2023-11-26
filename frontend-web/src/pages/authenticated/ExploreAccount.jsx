import { Link } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";

const ExploreAccount = ({ usersList, search }) => {
  if (usersList?.length === 0) {
    return (
      <p>
        We couldn't find any accounts matching "<b>{search}</b>".
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {usersList?.map((user, index) => (
        <Link
          to={`/dashboard/user-profile/${user.userID}`}
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
