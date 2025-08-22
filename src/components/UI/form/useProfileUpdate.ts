import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { updateProfile } from "../../../service/apis/user.api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth.store";

interface FormValues {
  fullName: string;
  email: string;
}
export const useProfileUpdate = () => {
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    fullName: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
  });

  // Formik setup
  const addProfileFormik = useFormik<FormValues>({
    initialValues: {
      fullName: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const bodyData = {
        fullName: values.fullName,
        email: values.email,
      };
      try {
        const response = await updateProfile(bodyData);
        toast.success("Profile updated successfully");
        dispatch(setUser(response.userData));
      } catch (error) {
        console.log("An error occurred while updating the profile.");
      } finally {
      }
    },
  });
  return {
    addProfileFormik,
  };
};
