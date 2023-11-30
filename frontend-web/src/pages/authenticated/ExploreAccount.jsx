import { Link } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";

const ExploreAccount = () => {
  // if (usersList?.length === 0) {
  //   return (
  //     <p>
  //       We couldn't find any accounts matching "<b>{search}</b>".
  //     </p>
  //   );
  // }
  return (
    <div className="flex flex-col gap-3">
      Explore Account
      {/* {usersList?.map((user, index) => (
        <Link
          to={`/dashboard/user-profile/${user.userId}`}
          key={index}
          className="w-max"
        >
          <PrimaryButton>{user.username}</PrimaryButton>
        </Link>
      ))} */}
    </div>
  );
};

export default ExploreAccount;
