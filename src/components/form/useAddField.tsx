// useAddField.ts
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addField, updateField, fieldDetails } from "../../service/apis/field.api";

/**
 * Hook to create/update Field objects with nested ads and image uploads.
 *
 * Formik values structure:
 * {
 *   name: string,
 *   unviseralClock: boolean,
 *   ads: {
 *     desktop: { top: Array<Ad>, left: Array<Ad>, right: Array<Ad> },
 *     mobile: { top: Array<Ad>, middle: Array<Ad>, bottom: Array<Ad> }
 *   }
 * }
 *
 * Each Ad: { imageFile?: File | null, imageUrl?: string, link?: string }
 *
 * Submission strategy:
 * - Build an `adsPayload` where each ad's `imageUrl` is either:
 *    - existing URL (string) if no new file, OR
 *    - a unique file key (e.g. 'file_desktop_top_0') if a new File is attached.
 * - Append JSON.stringify(adsPayload) to FormData under key 'ads'
 * - Append each File to FormData with its unique file key
 *
 * Backend must accept a multipart/form-data request and:
 * - parse the 'ads' JSON
 * - locate file keys and replace placeholders with uploaded file URLs after storing them
 */

type AdValue = {
  imageFile?: File | null;
  imageUrl?: string;
  link?: string;
};

type FormValues = {
  name: string;
  unviseralClock: boolean;
  adsTime:string;
  ads: {
    desktop: { top: AdValue[]; left: AdValue[]; right: AdValue[] };
    mobile: { top: AdValue[]; middle: AdValue[]; bottom: AdValue[] };
  };
};

const emptyAd = { imageFile: null as File | null, imageUrl: "", link: "" };

const useAddField = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Validation - name required, basic link URL checks optional
  const validationSchema = yup.object().shape({
    name: yup.string().required("Field name is required"),
    unviseralClock: yup.boolean().required(),
    // ads are optional arrays; we won't require image on every ad, but you can tighten if needed.
  });

  const initialValues: FormValues = {
    name: "",
    unviseralClock: true,
    adsTime:30,
    ads: {
      desktop: {
        top: [ /* default empty */ ],
        left: [],
        right: [],
      },
      mobile: {
        top: [],
        middle: [],
        bottom: [],
      },
    },
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true, // we'll set values after fetching for update
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

  // Fetch existing field if editing
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchField = async () => {
      setLoading(true);
      try {
        const res = await fieldDetails(id);
        if (res && res.field && mounted) {
          const f = res.field;
          // Map backend field structure to Formik initial values.
          const mapped: FormValues = {
            name: f.name || "",
            unviseralClock: typeof f.unviseralClock === "boolean" ? f.unviseralClock : true,
            adsTime:f.adsTime||30,
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
 *
 * Strategy:
 * - For each ad with a new File (imageFile), append file to FormData with a unique key.
 * - Build a JSON-friendly ads object where each ad.imageUrl is:
 *     - the original URL (if no new file), or
 *     - the fileKey placeholder (if a file exists). Backend should replace placeholder with actual stored URL.
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

  // Helper to process array and append files
  const processAdsArray = (
    arr: AdValue[],
    platform: "desktop" | "mobile",
    position: "top" | "left" | "right" | "middle" | "bottom",
  ) => {
    arr.forEach((ad, idx) => {
      if (ad.imageFile) {
        // create a unique file key
        const fileKey = `file_${platform}_${position}_${idx}_${Date.now()}`;
        formData.append(fileKey, ad.imageFile);
        adsPayload[platform][position].push({
          imageUrl: fileKey, // placeholder for backend to replace with saved URL
          link: ad.link || "",
        });
      } else {
        // no new file, keep existing imageUrl (may be empty)
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
