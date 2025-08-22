import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { addTeam, updateTeam } from "../../service/apis/team.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormValues {
  teamname: string;
  venue: string;
  seednumber:number;
  random: number;
  teamlogo: string | null;
}
export const useTeamUser = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form validation schema
  const validationSchema = yup.object({
    teamname: yup.string().required("Team name is required"),
    venue: yup.string().required("Location is required"),
    seednumber: yup.number().required("Seed number is required").typeError('Seed Number must be a number'),
    random: yup
      .number()
      .required("Random is required")
      .min(0, "Random number must be at least 0"),
  });

  // Formik setup
  const addTeamFormik = useFormik<FormValues>({
    initialValues: {
      teamname: "",
      venue: "",
      seednumber:0,
      random: 0,
      teamlogo: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("teamName", values.teamname);
      if (values.teamlogo) {
        formData.append("teamLogo", values.teamlogo);
      }
      formData.append("location", values.venue);
      formData.append("seedNumber", values.seednumber.toString());
      formData.append("randomNumber", values.random.toString());

      try {
        if (id) {
          const response = await updateTeam(id, formData);
          if (response.status === 200) {
            toast.success(response.message);
            navigate("/admin/teams");
          }
        } else {
          const response = await addTeam(formData);
          if (response.status === 200) {
            toast.success(response.message);
            resetForm();
            navigate("/admin/teams");
          }
        }
      } catch (error) {
        console.log("An error occurred while saving the team.");
      } finally {
        setLoading(false);
      }
    },
  });
  return {
    addTeamFormik,
    loading,
  };
};
