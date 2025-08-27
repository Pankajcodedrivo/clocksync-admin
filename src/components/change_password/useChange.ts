import { useFormik } from "formik";
import * as yup from "yup";
import { changePasswordFirstTimeApi } from "../../service/apis/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../store/auth.store";

// Define the shape of the form values
interface ChangePasswordFormValues {
  password: string;
  cpassword: string;
}

export const useChange = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  const changePasswordFormik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      password: "",
      cpassword: "",
    },
    validationSchema: yup.object({
      password: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Password field is Required")
        .matches(/\w/, "Please enter valid password"),

      cpassword: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Confirm Password field is Required")
        .oneOf([yup.ref("password")], "Passwords must match") // Ensure passwords match
        .matches(/\w/, "Please enter valid password"),
    }),
    onSubmit: async (values) => {
      const bodyData = {
        password: values.password,
      };

      try {
        const response = await changePasswordFirstTimeApi(bodyData);
        if (response) {
          toast.success(
            response.message || "Password has been changed successfully"
          );
          dispatch(logOut());
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        toast.error("An error occurred while changeting the password." + error);
      }
    },
  });

  return {
    changePasswordFormik,
  };
};
