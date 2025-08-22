import React from "react";
import { Outlet } from "react-router-dom";
import Login from "../pages/Login";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);

  return isLoggedIn ? <Outlet /> : <Login />;
};

export default ProtectedRoute;
