import { Icon } from "@iconify/react";
import { useWindowSize } from "usehooks-ts";
import SearchBox from "./searchBox/SearchBox";
import TopNavRightBox from "./rightBox/TopNavRightBox";

import classes from "./TopNav.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { handleBar } from "../../store/sidebar.store";
import { logOut, setSwitchedUser, setUser } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function TopNav() {
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const isSwitched = useSelector(
    (state: any) => state.authSlice.isSwitchedUser
  );

  function openSidebarHandler() {
    dispatch(handleBar());
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }
  const handleExitToOriginalUser = () => {
    const temp = localStorage.getItem("temp_session");

    if (!temp) {
      alert("No previous session found.");
      return;
    }

    const tempSession = JSON.parse(temp);

    // Restore user in Redux only
    if (tempSession.user) {
      dispatch(setUser(tempSession.user));
    } else {
      dispatch(logOut());
    }

    // Restore tokens only
    if (tempSession.access) localStorage.setItem("access_token", tempSession.access);
    if (tempSession.refresh) localStorage.setItem("refresh_token", tempSession.refresh);
    dispatch(setSwitchedUser(false));
    // Remove temporary session
    localStorage.removeItem("temp_session");

    // Navigate back
    navigate("/admin/dashboard");

    toast.success("Returned to the original user!");
  };


  return (
    <div className='top-header'>
      <div className={classes.topNav}>
        <div className={classes.topNav_left}>
          <div
            className={`${classes.topNav_left_menu_icon} top-nav-icon`}
            onClick={openSidebarHandler}
          >
            <Icon icon='ci:menu-alt-03' width='24' />
          </div>
          <div
            className={classes.topNav_left_menu}
            onClick={openSidebarHandler}
          >
            <div className='topNav_left_menu_open'>
              <Icon icon='ci:menu-alt-03' width='24' />
            </div>

            <div className='topNav_left_menu_close'>
              <Icon icon='eva:close-fill' width='24' />
            </div>
          </div>
          <div className={classes.search_desktop_wrapper}>
            {/* Show button only if temp_session exists */}
            {isSwitched && (
              <p>
                <button
                  className="btn btn-primary"
                  onClick={handleExitToOriginalUser}
                >
                  Switch Back to Original User
                </button>
              </p>
            )}
            {/* <SearchBox /> */}
          </div>
        </div>
        <TopNavRightBox />
        <br />
        <div className={classes.search_tablet_wrapper}>
          <SearchBox />
        </div>
      </div>
    </div>
  );
}

export default TopNav;
