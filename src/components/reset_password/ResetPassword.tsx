import React, { useState } from "react";
import { images } from "../../constants";
import Input from "../UI/input/Input";
import Button from "../UI/button/Button";
import { useTranslation } from "react-i18next";
import classes from "./Reset.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useReset } from "./useReset";
import { Link, useParams } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ResetPasswordBox() {
  // Retrieve language and translation function
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  // Get email from localstorage
  const email = localStorage.getItem("email");
  const { resetPasswordFormik } = useReset(email);

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
          {t("Reset Password")}
        </h2>
        <form
          id='resetpassword'
          className='login-form '
          onSubmit={resetPasswordFormik.handleSubmit}
        >
          <div className='formgrp'>
            <Input
              classes='passwordlabel'
              type='text'
              id='Otp'
              placeholder={t("Enter your OTP")}
              name='otp'
              onChange={resetPasswordFormik.handleChange}
              value={resetPasswordFormik.values.otp}
              errorMsg={resetPasswordFormik.errors.otp}
            />
          </div>

          <div className='formgrp'>
            <Input
              classes='passwordlabel'
              type={isPasswordVisible ? "text" : "password"}
              id='Password'
              placeholder={t("Enter your password")}
              name='password'
              onChange={resetPasswordFormik.handleChange}
              value={resetPasswordFormik.values.password}
              errorMsg={resetPasswordFormik.errors.password}
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
              onChange={resetPasswordFormik.handleChange}
              value={resetPasswordFormik.values.cpassword}
              errorMsg={resetPasswordFormik.errors.cpassword}
              rightIcon={
                <FontAwesomeIcon
                  icon={isCPasswordVisible ? faEyeSlash : faEye} // Use FontAwesomeIcon
                  onClick={toggleCPasswordVisibility}
                  style={{ cursor: "pointer" }} // Change cursor to pointer
                />
              }
            />
          </div>
          <button type='submit' className="custom-button mt-30" >{t("Save")}</button>
          <Link className={classes.forgat_pass} to='/login'>
            {t("Back to login")}
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordBox;
