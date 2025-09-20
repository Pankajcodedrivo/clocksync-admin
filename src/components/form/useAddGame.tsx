import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { addGame, updateGame } from "../../service/apis/game.api";

interface FormValues {
  homeTeamLogo: File | null;
  homeTeamName: string;
  awayTeamLogo: File | null;
  awayTeamName: string;
  fieldId: string;
  assignUserId: string; // scorekeeper
  startDateTime: string;
  endDateTime: string;
}

export const useAddGame = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const localToUTCString = (localDateTime:any) => {
  // localDateTime is a string like "2025-09-20T14:33"
  const date = new Date(localDateTime); // JS treats it as local
  return date.toISOString(); // Converts to UTC automatically
};

  // ✅ Validation schema for game form
const validationSchema = yup.object({
  homeTeamName: yup.string().required("Home team name is required"),
  awayTeamName: yup.string().required("Away team name is required"),
  fieldId: yup.string().required("Field is required"),
  assignUserId: yup.string().required("Scorekeeper is required"),

  startDateTime: yup
    .date()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? null : value
    )
    .typeError("Invalid start date")
    .min(new Date(), "Start date must be in the future")
    .required("Start date is required"),

  endDateTime: yup
    .date()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? null : value
    )
    .typeError("Invalid end date")
    .when("startDateTime", {
      is: (val: Date | null) => val != null,
      then: (schema) =>
        schema.min(yup.ref("startDateTime"), "End date must be after start date"),
      otherwise: (schema) => schema,
    })
    .required("End date is required"),
});


  // ✅ Formik setup
  const addGameFormik = useFormik<FormValues>({
    initialValues: {
      homeTeamLogo: null,
      homeTeamName: "",
      awayTeamLogo: null,
      awayTeamName: "",
      fieldId: "",
      assignUserId: "",
      startDateTime: "",
      endDateTime: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("homeTeamName", values.homeTeamName);
      formData.append("awayTeamName", values.awayTeamName);
      formData.append("fieldId", values.fieldId);
      formData.append("assignUserId", values.assignUserId);
      formData.append("startDateTime", localToUTCString(values.startDateTime));
      formData.append("endDateTime", localToUTCString(values.endDateTime));
      formData.append("userTimezone", Intl.DateTimeFormat().resolvedOptions().timeZone);

      if (values.homeTeamLogo) {
        formData.append("homeTeamLogo", values.homeTeamLogo);
      }
      if (values.awayTeamLogo) {
        formData.append("awayTeamLogo", values.awayTeamLogo);
      }

      try {
        if (id) {
          const response = await updateGame( formData,id);
          if (response.game) {
            toast.success(response.message);
            navigate("/games");
          }
        } else {
          const response = await addGame(formData);
          if (response.game) {
            toast.success(response.message);
            resetForm();
            navigate("/games");
          }
        }
      } catch (error) {
        console.error("An error occurred while saving the game.", error);
        toast.error("Failed to save game. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });
  
  return {
    addGameFormik,
    loading,
  };
};
