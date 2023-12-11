import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import { AlertProvider } from "./provider/AlertProvider";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import GuestLayout from "./layouts/GuestLayout";

import Home from "./pages/authenticated/Home";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/guest/Login";
import Register from "./pages/guest/Register";
import ForgotPassword from "./pages/guest/ForgotPassword";
import StoryDetails from "./pages/authenticated/StoryDetails";
import OtherUserProfile from "./pages/authenticated/OtherUserProfile";
import WelcomePage from "./pages/guest/WelcomePage";

import MyProfile from "./pages/authenticated/my-profile/MyProfile";
import UserDescriptions from "./pages/authenticated/my-profile/UserDescriptions";
import EditUserProfileLayout from "./pages/authenticated/my-profile/EditUserProfileLayout";
import YourStories from "./pages/authenticated/your-stories/YourStories";
import UserStories from "./pages/authenticated/your-stories/UserStories";
import CreateStory from "./pages/authenticated/your-stories/CreateStory";
import EditStory from "./pages/authenticated/your-stories/EditStory";
import Explore from "./pages/authenticated/explore/Explore";
import ExploreTopics from "./pages/authenticated/explore/ExploreTopics";
import ExploreAccount from "./pages/authenticated/explore/ExploreAccount";

function App() {
  return (
    <AlertProvider>
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
              <Route path=":slug/edit" element={<EditStory />} />
            </Route>

            <Route path="explore" element={<Explore />}>
              <Route index element={<Navigate to="topics" />} />
              <Route path="topics" element={<ExploreTopics />} />
              <Route path="account" element={<ExploreAccount />} />
            </Route>

            <Route path="story-details/:slug" element={<StoryDetails />} />
            <Route path="profile/:username" element={<OtherUserProfile />} />
          </Route>
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="sign-in" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
