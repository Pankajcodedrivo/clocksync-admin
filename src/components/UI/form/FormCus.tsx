import { useEffect, useState } from "react";
import Input from "../input/Input";
import form from "./formcus.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useProfileUpdate } from "./useProfileUpdate";
import Select from "react-select";
import Avatar from "../../../../src/assets/images/avatar.jpg";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth.store";
import toast from "react-hot-toast";
import { updateProfileImage } from "../../../service/apis/user.api";
import GoogleAutoComplete from "../../../layout/GoogleAutoComplete";

const FormCus = () => {
  const { addProfileFormik } = useProfileUpdate();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [preview, setPreview] = useState(Avatar);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      addProfileFormik.setValues({
        fullName: user.fullName || "",
        email: user.email || "",
      });
      setPreview(user.profileimageurl);
    }
  }, [user]);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Update preview
      handleUpload(file);
    }
  };

  const handleUpload = async (file: any) => {
    if (!file) {
      alert("Please select an image file first.");
      return;
    }
    const formData = new FormData();
    formData.append("profileimageurl", file);
    //console.log(file);
    try {
      const response = await updateProfileImage(formData);
      toast.success("Profile image updated successfully");
      dispatch(setUser(response.userData));
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    } finally {
    }
  };

  return (
    <div id='editprofile' className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}>
      <div className='profile-card profileform'>
        <div className="dashboard-card-title">
          <h2>Update Profile</h2> 
        </div>
        

        <div className='profile-picture-upload'>
          <div className='uploadimage'>
            <div className='upimg'>
              <img src={preview} alt='Avatar' />
            </div>
            <div className='upbtn'>
              <input
                className='choosefile'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              <button className="custom-button">Upload Picture</button>
            </div>
          </div>
        </div>

        <form onSubmit={addProfileFormik.handleSubmit} className=" from-fix-global-wrap" autoComplete='off'>
          <div className={`from-fix-global`}>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Full Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='fullName'
                  placeholder={"Enter your full name"}
                  name='fullName'
                  onChange={addProfileFormik.handleChange}
                  value={addProfileFormik.values.fullName}
                />
                {addProfileFormik.touched.fullName &&
                  addProfileFormik.errors.fullName && (
                    <div className='error'>
                      {addProfileFormik.errors.fullName}
                    </div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes={`passwordlabel ${addProfileFormik.values.email ? 'disabled-input' : ''}`}
                  type={"text"}
                  id='email'
                  placeholder={"Enter your email address"}
                  name='email'
                  onChange={addProfileFormik.handleChange}
                  value={addProfileFormik.values.email}
                  disabled
                />
                {addProfileFormik.touched.email &&
                  addProfileFormik.errors.email && (
                    <div className='error'>{addProfileFormik.errors.email}</div>
                  )}
              </div>
            </div>
          </div>
          <button className="custom-button mt-20">Save</button>
        </form>
      </div>
    </div>
  );
};

export default FormCus;
