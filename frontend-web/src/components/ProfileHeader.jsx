import { dateFormater } from "../utils/dateFormater";
import Divider from "./Divider";

const ProfileHeader = ({ fullName, username, createdAt }) => {
  return (
    <div>
      <div className="text-lg px-3 xs:px-8 py-8 font-semibold">
        <h2>{fullName}</h2>
        <h2 className="text-black/70">@{username}</h2>
        <h2 className="text-primary">Joined since {dateFormater(createdAt)}</h2>
      </div>

      <Divider />
    </div>
  );
};

export default ProfileHeader;
