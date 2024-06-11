import { Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./redux/userSlice";
import RegisterPage from "./pages/auth/register/RegisterPage";
import { authAPI } from "./routes";
import ForgetPassword from "./pages/forget-password/ForgetPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";

axios.defaults.withCredentials = true;

function App() {
  const { authUser } = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const fetchAuthUserData = async () => {
      try {
        const res = await axios.get(`${authAPI}/me`);
        dispatch(setAuthUser(res.data));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/forget-password"
          element={!authUser ? <ForgetPassword /> : <Navigate to="/" />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
