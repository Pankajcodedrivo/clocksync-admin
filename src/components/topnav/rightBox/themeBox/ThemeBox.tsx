import { useEffect } from "react";
// import ThemeContext from "../../../../store/themeContext";
import classes from "./ThemeBox.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { updateTheme } from "../../../../store/theme.store";
import Moon from "../../../../assets/images/moon.svg";
import Sun from "../../../../assets/images/sun.svg";
function ThemeBox() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.themeSlice);
  useEffect(() => {
    console.log(theme, "theme");
  }, [theme]);
  return (
    <div
      className={classes.themeBox}
      onClick={() => {
        dispatch(updateTheme(theme === "light" ? "dark" : "light"));
      }}
    >
      <div
        className={`${classes.toggle} ${
          theme === "dark" ? classes.darkMode : ""
        } theme-change`}
      >
        <div className='moon'>
          <img src={Moon} alt='Moon' />
        </div>
        <div className='sun'>
          <img src={Sun} alt='Sun' />
        </div>
      </div>
    </div>
  );
}

export default ThemeBox;
