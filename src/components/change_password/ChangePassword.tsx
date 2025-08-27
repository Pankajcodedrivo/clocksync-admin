import { useState } from "react";
import { images } from "../../constants";
import Input from "../UI/input/Input";
import { useTranslation } from "react-i18next";
import classes from "./Change.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useChange } from "./useCHange";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ChangePasswordBox() {
  // Retrieve language and translation function
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();
  const { changePasswordFormik } = useChange();

  // State for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);

  // Toggle visibility for password fields
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleCPasswordVisibility = () => {
    setIsCPasswordVisible((prev) => !prev);
  };

  return (
    <div className={`${classes.container} ${lang === "fa" ? classes.rtl : ""}`}>
      <div className={classes.resetPasswordBox}>
        <div className={classes.logo}>
          <img src={images.logo} alt='logo' />
        </div>

        <h2 className={classes.title} style={{ textAlign: "center" }}>
          {t("Change Password")}
        </h2>
        <form
          id='resetpassword'
          className='login-form '
          onSubmit={changePasswordFormik.handleSubmit}
        >
          

          <div className='formgrp'>
            <Input
              classes='passwordlabel'
              type={isPasswordVisible ? "text" : "password"}
              id='Password'
              placeholder={t("Enter your password")}
              name='password'
              onChange={changePasswordFormik.handleChange}
              value={changePasswordFormik.values.password}
              errorMsg={changePasswordFormik.errors.password}
              rightIcon={
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye} // Use FontAwesomeIcon
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }} // Change cursor to pointer
                />
              }
            />
          </div>

          <div className='formgrp'>
            <Input
              classes='passwordlabel'
              type={isCPasswordVisible ? "text" : "password"}
              id='Cpassword'
              placeholder={t("Enter your confirm password")}
              name='cpassword'
              onChange={changePasswordFormik.handleChange}
              value={changePasswordFormik.values.cpassword}
              errorMsg={changePasswordFormik.errors.cpassword}
              rightIcon={
                <FontAwesomeIcon
                  icon={isCPasswordVisible ? faEyeSlash : faEye} // Use FontAwesomeIcon
                  onClick={toggleCPasswordVisibility}
                  style={{ cursor: "pointer" }} // Change cursor to pointer
                />
              }
            />
          </div>
          <button type='submit' className="custom-button mt-30" >{t("Update")}</button>
          
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordBox;
