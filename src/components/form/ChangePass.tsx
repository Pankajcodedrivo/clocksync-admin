import { useState } from "react";
import Input from "../UI/input/Input";
import Button from "../UI/button/Button";
import { useTranslation } from "react-i18next";
import form from "./formcus.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useChangePass } from "./useChangePass";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ChangePass() {
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  const { changePasswordFormik } = useChangePass();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleCPasswordVisibility = () => {
    setIsCPasswordVisible((prev) => !prev);
  };

  return (
    <div className={`${form.myprofilewrapper}  dashboard-card-global edit-profile-wrap change-pass-wrap`} id='myprofilewrapper'>
      <div className='change-password-form'>
        <div className="dashboard-card-title">
          <h2>Change Password</h2> 
        </div>

        <form onSubmit={changePasswordFormik.handleSubmit} autoComplete='off'>
          <div className='row'>
            <div className='col-4 formgrp'>
              <label htmlFor='password_old'>
                Old Password{" "}
                <span id='errorfield' style={{ color: "red" }}>
                  *
                </span>
              </label>
              <Input
                classes='passwordlabel'
                type='text'
                id='password_old'
                placeholder={t("Enter your old password")}
                name='password_old'
                onChange={changePasswordFormik.handleChange}
                value={changePasswordFormik.values.password_old}
                errorMsg={changePasswordFormik.errors.password_old}
                autoComplete='off'
              />
            </div>
            <div className='col-4 formgrp'>
              <label htmlFor='password_new'>
                New Password{" "}
                <span id='errorfield' style={{ color: "red" }}>
                  *
                </span>
              </label>
              <Input
                classes='passwordlabel'
                type={isPasswordVisible ? "text" : "password"}
                id='password_new'
                placeholder={t("Enter your new password")}
                name='password_new'
                onChange={changePasswordFormik.handleChange}
                value={changePasswordFormik.values.password_new}
                errorMsg={changePasswordFormik.errors.password_new}
                autoComplete='off'
                rightIcon={
                  <FontAwesomeIcon
                    icon={isPasswordVisible ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                }
              />
            </div>
            <div className='col-4 formgrp'>
              <label htmlFor='password_confirm'>
                Confirm Password{" "}
                <span id='errorfield' style={{ color: "red" }}>
                  *
                </span>
              </label>
              <Input
                classes='passwordlabel'
                type={isCPasswordVisible ? "text" : "password"}
                id='cpassword'
                placeholder={t("Enter your confirm password")}
                name='cpassword'
                onChange={changePasswordFormik.handleChange}
                value={changePasswordFormik.values.cpassword}
                errorMsg={changePasswordFormik.errors.cpassword}
                autoComplete='off'
                rightIcon={
                  <FontAwesomeIcon
                    icon={isCPasswordVisible ? faEyeSlash : faEye}
                    onClick={toggleCPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                }
              />
            </div>
            <div className='col-6'>
              <button type='submit' className="custom-button mt-20">{t("Save")}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
