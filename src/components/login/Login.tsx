import React, { useState } from "react";
import { images } from "../../constants";
import Input from "../UI/input/Input";
import Button from "../UI/button/Button";
import { useTranslation } from "react-i18next";
import classes from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLogin } from "./useLogin";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner"; // Import the spinner
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LoginBox() {
  const { loginFormik, loading } = useLogin();
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Toggle visibility for password fields
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className={`${classes.container} ${lang === "fa" ? classes.rtl : ""}`}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.loginBox}>
          <>
            <div
              className={classes.logo}
              style={{ marginTop: "0px", height: "75px" }}
            >
              <img
                src={images.logo}
                alt='logo'
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <h2 className={classes.title} style={{ textAlign: "center" }}>
              {t("Admin Login")}
            </h2>
            <form onSubmit={loginFormik.handleSubmit} className='login-form'>
              <div className='formgrp'>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='email'
                  placeholder={"Enter your email address"}
                  name='email'
                  onChange={loginFormik.handleChange}
                  value={loginFormik.values.email}
                  errorMsg={loginFormik.errors.email}
                />
              </div>
              <div className='formgrp'>
                <Input
                  classes='passwordlabel'
                  type={isPasswordVisible ? "text" : "password"}
                  id={"Password"}
                  placeholder={"Enter your password"}
                  name='password'
                  onChange={loginFormik.handleChange}
                  value={loginFormik.values.password}
                  errorMsg={loginFormik.errors.password}
                  rightIcon={
                    <FontAwesomeIcon
                      icon={isPasswordVisible ? faEyeSlash : faEye} // Use FontAwesomeIcon
                      onClick={togglePasswordVisibility}
                      style={
                        {
                          //cursor: "pointer",
                          //position: "absolute",
                          //top: "65%",
                          //transform: "translateY(-50%)",
                          //right: "10px",
                        }
                      } // Change cursor to pointer//
                    />
                  }
                />
              </div> 
              <button className="custom-button mt-30" type='submit'>{t("login")}</button>
              <Link className={classes.forgat_pass} to='/forgot-password'>
                {t("forgetPass")}
              </Link>
              <div className={classes.checkbox}></div>
            </form>
          </>
        </div>
      )}
    </div>
  );
}

export default LoginBox;
