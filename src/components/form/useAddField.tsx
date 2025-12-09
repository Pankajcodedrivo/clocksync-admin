import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addField, updateField, fieldDetails } from "../../service/apis/field.api";

/**
 * IMAGE VALIDATION HELPERS
 * -------------------------------------
 */

// Validate image file size + dimensions
const validateImage = (requiredWidth: number, requiredHeight: number) =>
  yup
    .mixed()
    .test(
      "file-validation",
      `Image must be ${requiredWidth}×${requiredHeight}px and not exceed 150KB`,
      (file: any) => {
        if (!file || !(file instanceof File)) return true; // skip if no new upload

        // file size
        if (file.size > 150 * 1024) return false;

        // validate dimensions asynchronously
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve(img.width === requiredWidth && img.height === requiredHeight);
          img.onerror = () => resolve(false);
          img.src = URL.createObjectURL(file);
        });
      }
    );

type AdValue = {
  imageFile?: File | null;
  imageUrl?: string;
  link?: string;
};

type FormValues = {
  name: string;
  unviseralClock: boolean;
  adsTime: string | number;
  ads: {
    desktop: { top: AdValue[]; left: AdValue[]; right: AdValue[] };
    mobile: { top: AdValue[]; middle: AdValue[]; bottom: AdValue[] };
  };
};

const emptyAd = { imageFile: null as File | null, imageUrl: "", link: "" };

const useAddField = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // UPDATED VALIDATION SCHEMA ----------------------------------------------------
  const validationSchema = yup.object().shape({
    name: yup.string().required("Field name is required"),
    unviseralClock: yup.boolean().required(),
    adsTime: yup
      .number()
      .min(1, "Ads time must be at least 1 second")
      .required("Ads time required"),

    ads: yup.object({
      mobile: yup.object({
        top: yup.array().of(
          yup.object({
            imageFile: validateImage(300, 100),
            link: yup.string().url("Invalid link").nullable(),
          })
        ),
        middle: yup.array().of(
          yup.object({
            imageFile: validateImage(300, 250),
            link: yup.string().url("Invalid link").nullable(),
          })
        ),
        bottom: yup.array().of(
          yup.object({
            imageFile: validateImage(350, 50),
            link: yup.string().url("Invalid link").nullable(),
          })
        ),
      }),

      desktop: yup.object({
        top: yup.array().of(
          yup.object({
            imageFile: validateImage(728, 90),
            link: yup.string().url("Invalid link").nullable(),
          })
        ),
        left: yup.array().of(
          yup.object({
            imageFile: validateImage(970, 90),
            link: yup.string().url("Invalid link").nullable(),
          })
        ),
        right: yup.array().of(
          yup.object({
            imageFile: validateImage(970, 90),
            link: yup.string().url("Invalid link").nullable(),
          })
        ),
      }),
    }),
  });

  // ------------------------------------------------------------------------------

  const initialValues: FormValues = {
    name: "",
    unviseralClock: true,
    adsTime: 30,
    ads: {
      desktop: { top: [], left: [], right: [] },
      mobile: { top: [], middle: [], bottom: [] },
    },
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = buildFormDataFromValues(values);
        if (id) {
          const res = await updateField(formData, id);
          if (res && res.field) {
            toast.success(res.message || "Field updated");
            navigate("/fields");
          } else {
            toast.error("Failed to update field");
          }
        } else {
          const res = await addField(formData);
          if (res && res.field) {
            toast.success(res.message || "Field added");
            navigate("/fields");
          } else {
            toast.error("Failed to create field");
          }
        }
      } catch (err) {
        console.error("Error saving field", err);
        toast.error("Error saving field");
      } finally {
        setLoading(false);
      }
    },
  });

  // FETCH FIELD IF EDITING -------------------------------------------------------

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchField = async () => {
      setLoading(true);
      try {
        const res = await fieldDetails(id);
        if (res && res.field && mounted) {
          const f = res.field;

          const mapped: FormValues = {
            name: f.name || "",
            unviseralClock: typeof f.unviseralClock === "boolean" ? f.unviseralClock : true,
            adsTime: f.adsTime || 30,
            ads: {
              desktop: {
                top: (f.ads?.desktop?.top || []).map((a: any) => ({
                  imageFile: null,
                  imageUrl: a.imageUrl || "",
                  link: a.link || "",
                })),
                left: (f.ads?.desktop?.left || []).map((a: any) => ({
                  imageFile: null,
                  imageUrl: a.imageUrl || "",
                  link: a.link || "",
                })),
                right: (f.ads?.desktop?.right || []).map((a: any) => ({
                  imageFile: null,
                  imageUrl: a.imageUrl || "",
                  link: a.link || "",
                })),
              },
              mobile: {
                top: (f.ads?.mobile?.top || []).map((a: any) => ({
                  imageFile: null,
                  imageUrl: a.imageUrl || "",
                  link: a.link || "",
                })),
                middle: (f.ads?.mobile?.middle || []).map((a: any) => ({
                  imageFile: null,
                  imageUrl: a.imageUrl || "",
                  link: a.link || "",
                })),
                bottom: (f.ads?.mobile?.bottom || []).map((a: any) => ({
                  imageFile: null,
                  imageUrl: a.imageUrl || "",
                  link: a.link || "",
                })),
              },
            },
          };

          formik.setValues(mapped);
        }
      } catch (err) {
        console.error("Error fetching field details", err);
        toast.error("Failed to load field details");
      } finally {
        setLoading(false);
      }
    };

    fetchField();
    return () => {
      mounted = false;
    };
  }, [id]);

  return { formik, loading };
};

/**
 * Build multipart/form-data from Formik values.
 */
function buildFormDataFromValues(values: FormValues) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("adsTime", values.adsTime);
  formData.append("unviseralClock", String(values.unviseralClock));

  const adsPayload: any = {
    desktop: { top: [], left: [], right: [] },
    mobile: { top: [], middle: [], bottom: [] },
  };

  const processAdsArray = (
    arr: AdValue[],
    platform: "desktop" | "mobile",
    position: "top" | "left" | "right" | "middle" | "bottom"
  ) => {
    arr.forEach((ad, idx) => {
      if (ad.imageFile) {
        const fileKey = `file_${platform}_${position}_${idx}_${Date.now()}`;
        formData.append(fileKey, ad.imageFile);
        adsPayload[platform][position].push({
          imageUrl: fileKey,
          link: ad.link || "",
        });
      } else {
        adsPayload[platform][position].push({
          imageUrl: ad.imageUrl || "",
          link: ad.link || "",
        });
      }
    });
  };

  processAdsArray(values.ads.desktop.top, "desktop", "top");
  processAdsArray(values.ads.desktop.left, "desktop", "left");
  processAdsArray(values.ads.desktop.right, "desktop", "right");

  processAdsArray(values.ads.mobile.top, "mobile", "top");
  processAdsArray(values.ads.mobile.middle, "mobile", "middle");
  processAdsArray(values.ads.mobile.bottom, "mobile", "bottom");

  formData.append("ads", JSON.stringify(adsPayload));
  return formData;
}

export default useAddField;