import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { images } from "../../constants";
import sidebarNav from "../../config/sidebarNav";
import { Icon } from "@iconify/react";
import classes from "./Sidebar.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";

import { logOut } from "../../store/auth.store";

function Sidebar() {
  const { isOpen } = useSelector((state: RootState) => state.sideBarSlice);
  const role = useSelector((state: RootState) => state.authSlice.user?.role);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const { width } = useWindowSize();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function openSidebarHandler() {
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  function logoutHandler() {
    dispatch(logOut());
    localStorage.clear();
    openSidebarHandler();
  }

  function toggleSubmenu() {
    setOpenSubmenu((prev) => !prev);
  }

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[2] || ""; // Ensure curPath is a string
    const activeItem = sidebarNav.findIndex((item) => item.section === curPath);
    setActiveIndex(activeItem !== -1 ? activeItem : 0); // Default to 0 if not found
  }, [location, sidebarNav]);

  // Filter sidebar items based on the user's role
  const filteredNav = sidebarNav.filter(
    (nav) => nav.role && nav.role.includes(role || "") // Default to empty string if role is undefined
  );

  return (
    <div className={`${classes.sidebar} ${!isOpen && classes.sidebar_close} sidebar-main`}>
      <div className='sidebar-logo'>
        <img src={images.logo} alt='logo' />
      </div>

      <div className={classes.sidebar__menu}>
        {filteredNav.map((nav, index) => (
          <Link
            to={nav.link}
            key={`nav-${index}`}
            className={`${classes.sidebar__menu__item} ${ activeIndex === index ? 'active' : '' } sidenav-li`}
            onClick={openSidebarHandler}
          >
            <div className={classes.sidebar__menu__item__icon}>
              <Icon icon={nav.icon} />
            </div>
            <div className={classes.sidebar__menu__item__txt}>
              {t(nav.text)}
            </div>
          </Link>
        ))}
      </div>

      {/* <div className={classes.sidebar__menu}>
        {filteredNav.map((nav, index) => {
            const hasSubmenu = Array.isArray(nav.submenu) && nav.submenu.length > 0;
            return (
        <div key={`nav-${index}`} className="sidebarmenuholder">
            <Link
              to={nav.link}
              className={`${classes.sidebar__menu__item} ${activeIndex === index && classes.active} 
              ${hasSubmenu ? classes.hasSubmenu : ""} parentofsubmenu`}
              onClick={nav.submenu ? toggleSubmenu : openSidebarHandler}
            >
              <div className={classes.sidebar__menu__item__icon}>
                <Icon icon={nav.icon} />
              </div>
              <div className={classes.sidebar__menu__item__txt}>
                {t(nav.text)}
              </div>
            </Link>
            {nav.submenu && openSubmenu && (
              <div className="sidebar_submenu">
                {nav.submenu.map((subNav, subIndex) => (
                  <Link
                    to={subNav.link}
                    key={`subnav-${subIndex}`}
                    className="sidebar__submenu__item"
                  >
                    <div className={classes.sidebar__submenu__item__icon}>
                      <Icon icon={subNav.icon} />
                    </div>
                    <div className={classes.sidebar__submenu__item__txt}>
                      {t(subNav.text)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
           );
})}
      </div> */}

      <div className={[classes.sidebar__menu, classes.logout].join("")}>
        <Link
          to='/login'
          className={classes.sidebar__menu__item}
          onClick={logoutHandler}
        >
          <div className={classes.sidebar__menu__item__icon}>
            <Icon icon='tabler:logout' />
          </div>
          <div className={classes.sidebar__menu__item__txt}>{t("logout")}</div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
