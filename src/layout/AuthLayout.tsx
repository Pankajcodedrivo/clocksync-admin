import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AuthLayout = () => {
  const location = useLocation();
  const { isLoggedIn, user } = useSelector(
    (state: RootState) => state.authSlice
  );
  const role = user?.role;

  // Redirect paths based on role
  const roleBasedRedirects: Record<string, string> = {
    admin: "/admin/dashboard",
  };

  // If user is logged in and role is recognized, render `Outlet` (child routes)
  if (isLoggedIn) {
    if (role && roleBasedRedirects[role]) {
      // Redirect to role-specific default page if user tries to access the root `/`
      if (location.pathname === "/") {
        return <Navigate to={roleBasedRedirects[role]} replace />;
      }
      return <Outlet />;
    }
    // If role is unrecognized, block access
    return <Navigate to='/not-authorized' replace />;
  }

  // If user is not logged in, redirect to login page
  return (
    <Navigate
      to='/login'
      replace
      state={{ from: location }} // Pass current location for redirection after login
    />
  );
};

export default AuthLayout;
