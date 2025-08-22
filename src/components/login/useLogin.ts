import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { logInApi } from "../../service/apis/auth.api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Password field is Required")
        .matches(/\w/, "Please enter valid password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const bodyData = {
          email: values.email,
          password: values.password,
        };
        const response = await logInApi(bodyData);
        toast.success(response.message);
        setLoading(false);
        dispatch(setUser(response.user));
        localStorage.setItem("access_token", response.tokens.access);
        localStorage.setItem("refresh_token", response.tokens.refresh);
        const role = response?.user?.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/login");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
  });
  return {
    loginFormik,
    loading,
  };
};
