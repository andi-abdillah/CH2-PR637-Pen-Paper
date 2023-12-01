import { Routes, Route, Navigate } from "react-router-dom";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import GuestLayout from "./layouts/GuestLayout";
import Home from "./pages/authenticated/Home";
import Explore from "./pages/authenticated/Explore";
import MyProfile from "./pages/authenticated/MyProfile";
import YourStories from "./pages/authenticated/YourStories";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/guest/Login";
import Register from "./pages/guest/Register";
import UserStories from "./pages/authenticated/UserStories";
import CreateStory from "./pages/authenticated/CreateStory";
import EditStory from "./pages/authenticated/EditStory";
import StoryDetails from "./pages/authenticated/StoryDetails";
import OtherUserProfile from "./pages/authenticated/OtherUserProfile";
import { AuthProvider } from "./auth/AuthContext";
import WelcomePage from "./pages/guest/WelcomePage";
import UserDescriptions from "./pages/authenticated/UserDescriptions";
import ExploreTopics from "./pages/authenticated/ExploreTopics";
import ExploreAccount from "./pages/authenticated/ExploreAccount";
import EditUserProfileLayout from "./pages/authenticated/EditUserProfileLayout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/dashboard" element={<AuthenticatedLayout />}>
          <Route index element={<Home />} />
          <Route path="my-profile" element={<MyProfile />}>
            <Route index element={<UserDescriptions />} />
            <Route path="edit" element={<EditUserProfileLayout />} />
          </Route>

          <Route path="your-stories" element={<YourStories />}>
            <Route index element={<UserStories />} />
            <Route path="create" element={<CreateStory />} />
            <Route path=":id/edit" element={<EditStory />} />
          </Route>

          <Route path="explore" element={<Explore />}>
            <Route index element={<Navigate to="topics" />} />
            <Route path="topics" element={<ExploreTopics />} />
            <Route path="account" element={<ExploreAccount />} />
          </Route>

          <Route path="story-details/:id" element={<StoryDetails />} />
          <Route path="user-profile/:id" element={<OtherUserProfile />} />
        </Route>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="sign-in" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
