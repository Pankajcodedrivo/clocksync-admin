import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { useAddUser } from "./useAddUser";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useParams,useLocation } from "react-router-dom";
import { userDetails } from "../../service/apis/user.api";

const UpdateUser = () => {
  const params = useParams();
  const location = useLocation();
  const { id } = params;
  const { addUserFormik, loading } = useAddUser(id);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const userData = await userDetails(id);
          if (userData.status === 200) {
            //console.log(userData);
            addUserFormik.setValues({
              fullName: userData.userData?.fullName || "",
              email: userData.userData?.email || "",
              profileImage: userData.userData?.profileimageurl || "",
              password: "",
            });
            setImagePreview(userData.userData?.profileimageurl || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      addUserFormik.setFieldValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id='editprofile' className={`${form.myprofilewrapper} dashboard-card-global` }>
      <div className='profile-card'>
        <div className={form.profile_flex}>
          <h2>{id ? "Update User" : "Add User"}</h2>
          <Link to='/admin/users'state={{ fromPage: location.state?.fromPage }}>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form
          onSubmit={addUserFormik.handleSubmit}
          autoComplete='off'
          className='formadduser from-fix-global-wrap'
        >
          <div className={`${form.profileform}  from-fix-global`}>
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
                  onChange={addUserFormik.handleChange}
                  value={addUserFormik.values.fullName}
                />
                {addUserFormik.touched.fullName &&
                  addUserFormik.errors.fullName && (
                    <div className='error'>{addUserFormik.errors.fullName}</div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                {id ? (
                  <Input
                    classes='passwordlabel'
                    type='text'
                    id='email'
                    name='email'
                    value={addUserFormik.values.email}
                    disabled
                  />
                ) : (
                  <Input
                    classes='passwordlabel'
                    type='text'
                    id='email'
                    placeholder={"Enter your email address"}
                    name='email'
                    onChange={addUserFormik.handleChange}
                    value={addUserFormik.values.email}
                  />
                )}
                {addUserFormik.touched.email && addUserFormik.errors.email && (
                  <div className='error'>{addUserFormik.errors.email}</div>
                )}
              </div>
            </div>

            {id === undefined && (
              <div className={form.profileformcol}>
                <div className='formgrp'>
                  <label htmlFor='password'>
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    classes='passwordlabel updateUser'
                    type={isPasswordVisible ? "text" : "password"}
                    id='password'
                    placeholder={"Enter your password"}
                    name='password'
                    onChange={addUserFormik.handleChange}
                    value={addUserFormik.values.password}
                    autoComplete='new-password'
                    rightIcon={
                      <FontAwesomeIcon
                        icon={isPasswordVisible ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          bottom: "10px",
                          transform: "translateY(-50%)",
                          right: "15px",
                        }}
                      />
                    }
                  />
                  {addUserFormik.touched.password &&
                    addUserFormik.errors.password && (
                      <div className='error'>
                        {addUserFormik.errors.password}
                      </div>
                    )}
                </div>
              </div>
            )}

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='profileImage'>Profile Image</label>
                <input
                  type='file'
                  id='profileImage'
                  name='profileImage'
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className='image-preview'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      width={100}
                      height={100}
                    />
                  </div>
                )}
                {addUserFormik.touched.profileImage &&
                  addUserFormik.errors.profileImage && (
                    <div className='error'>
                      {addUserFormik.errors.profileImage}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={`${form.profileformcol} submit-btn-wrap`}>
              {" "}
              <button className="custom-button submit-btn">Save</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
