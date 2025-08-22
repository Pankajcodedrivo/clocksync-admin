import { useFormik } from "formik";
import * as yup from "yup";
import { forgotPasswordApi } from "../../service/apis/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useForgotPass = () => {
  const navigate = useNavigate();
  const forgotPassFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required"),
    }),
    onSubmit: async (values) => {
      const response = await forgotPasswordApi(values);
      if (response.status === 200) {
        localStorage.setItem("email", values.email);
        toast.success("OTP sent to your email ID");
        navigate("/reset-password");
      }
    },
  });
  return {
    forgotPassFormik,
  };
};
