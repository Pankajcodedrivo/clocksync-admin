import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { addEvent, updateEvent } from "../../service/apis/event.api";

interface FormValues {
  eventLogo: File | null;
  eventName: string;
  assignUserId: string; // scorekeeper
  startDate: string;
  endDate: string;
}

export const useAddEvent = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const localToUTCString = (localDateTime:any) => {
    // localDateTime is a string like "2025-09-20T14:33"
    const date = new Date(localDateTime); // JS treats it as local
    return date.toISOString(); // Converts to UTC automatically
  };
  // ✅ Validation schema for event form
const validationSchema = yup.object({
  eventName: yup.string().required("Event name is required"),
  assignUserId: yup.string().required("Event Director is required"),

  startDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? null : value
    )
    .typeError("Invalid start date")
    .min(today, "Start date must be in the future")
    .required("Start date is required"),

  endDate: yup
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
  const addEventFormik = useFormik<FormValues>({
    initialValues: {
      eventLogo: null,
      eventName: "",
      assignUserId: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("eventName", values.eventName);
      formData.append("assignUserId", values.assignUserId);
      formData.append("startDate", localToUTCString(values.startDate));
      formData.append("endDate", localToUTCString(values.endDate));

      if (values.eventLogo) {
        formData.append("eventLogo", values.eventLogo);
      }

      try {
        if (id) {
          const response = await updateEvent( formData,id);
          if (response.status===200) {
            toast.success(response.message);
            navigate("/events");
          }
        } else {
          const response = await addEvent(formData);
          if (response.status===200) {
            toast.success(response.message);
            resetForm();
            navigate("/events");
          }
        }
      } catch (error) {
        console.error("An error occurred while saving the event.", error);
        //toast.error("Failed to save event. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });
  
  return {
    addEventFormik,
    loading,
  };
};
