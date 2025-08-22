import { images } from "../../constants";
import Input from "../UI/input/Input";
import Button from "../UI/button/Button";
import { useTranslation } from "react-i18next";
import classes from "./Forgot.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useForgotPass } from "./useForgot";
import { Link } from "react-router-dom";

function ForgotPassBox() {
  const { forgotPassFormik } = useForgotPass();
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  return (
    <div className='forgot-password'>
      <div
        className={`${classes.container} ${lang === "fa" ? classes.rtl : ""}`}
      >
        <div className={classes.loginBox}>
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
            {t("Forgot Password")}
          </h2>
          <form id='forgotPassword' className="login-form" onSubmit={forgotPassFormik.handleSubmit}>
            <div className='formgrp'>
              <Input
                classes='passwordlabel'
                type={"text"}
                id='email'
                placeholder={"Enter your email address"}
                name='email'
                onChange={forgotPassFormik.handleChange}
                value={forgotPassFormik.values.email}
                errorMsg={forgotPassFormik.errors.email}
              />
            </div>
            <button className="custom-button mt-30" type='submit'>{t("Send Email")}</button>
            <Link className={classes.forgat_pass} to='/login'>
              {t("Back to login")}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassBox;
