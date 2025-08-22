import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { addUser, updateUser } from "../../service/apis/user.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormValues {
  fullName: string;
  email: string;
  password?: string;
  profileImage: string | null;
}
export const useAddUser = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form validation schema
  const validationSchema = yup.object({
    fullName: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
    password: id
      ? yup.string().optional()
      : yup
          .string()
          .trim()
          .min(8, "Must be 8 or more characters")
          .required("Password field is required")
          .matches(/\w/, "Please enter a valid password"),
  });

  // Formik setup
  const addUserFormik = useFormik<FormValues>({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values.profileImage);
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      if (values.profileImage) {
        formData.append("profileimageurl", values.profileImage);
      }
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }
      try {
        if (id) {
          const response = await updateUser(id, formData);
          if (response.status === 200) {
            toast.success(response.message);
            navigate("/admin/users");
          }
        } else {
          formData.append("email", values.email);
          if (values.password && values.password.trim() !== "") {
            formData.append("password", values.password);
          }
          const response = await addUser(formData);
          if (response.status === 200) {
            toast.success(response.message);
            resetForm();
            navigate("/admin/users");
          }
        }
      } catch (error) {
        console.log("An error occurred while saving the user.");
      } finally {
        setLoading(false);
      }
    },
  });
  return {
    addUserFormik,
    loading,
  };
};
