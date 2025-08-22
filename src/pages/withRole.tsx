import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: string[]
) => {
  return (props: P) => {
    const userRole = useSelector((state: RootState) => {
      return state.authSlice.user?.role;
    });
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to='/not-authorized' replace />;
    }

    return <Component {...props} />;
  };
};

export default withRole;
