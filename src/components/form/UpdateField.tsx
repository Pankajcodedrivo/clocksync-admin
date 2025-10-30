// UpdateField.tsx
import React, { useEffect, useState } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import form from "./formcus.module.scss";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import useAddField from "./useAddField";
import { images } from "../../constants";
import Input from "../UI/input/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

/**
 * UI for adding/updating a Field
 *
 * Supports:
 * - name (text)
 * - unviseralClock (Active/Inactive)
 * - ads:
 *   - desktop: top[], left[], right[]
 *   - mobile: top[], middle[], bottom[]
 *
 * Each ad row supports file upload (image) + link (string).
 * Existing imageUrl (string) from backend is shown as preview.
 */

const emptyAd = { imageFile: null as File | null, imageUrl: "", link: "" };

const UpdateField: React.FC = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const params = useParams();
  const location = useLocation();
  const id = params?.id;

  const { formik, loading } = useAddField(id);

  // Helpers to show preview: if imageFile present, use object URL; otherwise show imageUrl or placeholder
  const getAdPreview = (ad: any) => {
    if (ad.imageFile) return URL.createObjectURL(ad.imageFile);
    if (ad.imageUrl) return ad.imageUrl;
    return images.noImageData; // placeholder from your constants
  };

  useEffect(() => {
    // cleanup object URLs on unmount
    return () => {
      // Formik stores files in values; if any object URLs created they'll be garbage collected,
      // but we'll revoke them when replacing uploads during change handlers in the hook.
    };
  }, []);

  return (
    <div id="update-field" className={`${form.myprofilewrapper} dashboard-card-global`}>
      <div className="profile-card">
        <div className={form.profile_flex}>
          <h2>{id ? "Update Field" : "Add Field"}</h2>
          <Link to="/fields" state={{ fromPage: location.state?.fromPage }}>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form onSubmit={formik.handleSubmit} autoComplete="off" className="formaddgame from-fix-global-wrap">
          <div className={form.profileform}>
            {/* Name */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter field name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && <div className="error">{formik.errors.name}</div>}
              </div>
            </div>
            
            
            {/* Universal Clock */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="unviseralClock">Universal Clock</label>
                <select
                  id="unviseralClock"
                  name="unviseralClock"
                  value={String(formik.values.unviseralClock)}
                  onChange={(e) => {
                    const v = e.target.value === "true";
                    formik.setFieldValue("unviseralClock", v);
                  }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ads sections */}
          <FormikProvider value={formik}>
            <div className="ads-sections">

              {/* Desktop - Top */}
              <AdSection
                sectionLabel="Desktop Top Ads"
                namePrefix="ads.desktop.top"
                valuesArray={formik.values.ads.desktop.top}
                onAdd={() => {
                  const arr = [...formik.values.ads.desktop.top, { ...emptyAd }];
                  formik.setFieldValue("ads.desktop.top", arr);
                }}
                onRemove={(index) => {
                  const arr = [...formik.values.ads.desktop.top];
                  arr.splice(index, 1);
                  formik.setFieldValue("ads.desktop.top", arr);
                }}
                onChangeFile={(file: File | null, index: number) => {
                  const arr = [...formik.values.ads.desktop.top];
                  arr[index] = { ...arr[index], imageFile: file };
                  formik.setFieldValue("ads.desktop.top", arr);
                }}
                onChangeLink={(link: string, index: number) => {
                  const arr = [...formik.values.ads.desktop.top];
                  arr[index] = { ...arr[index], link };
                  formik.setFieldValue("ads.desktop.top", arr);
                }}
                getPreview={(index: number) => getAdPreview(formik.values.ads.desktop.top[index])}
              />

              {/* Desktop - Left */}
              <AdSection
                sectionLabel="Desktop Left Ads"
                namePrefix="ads.desktop.left"
                valuesArray={formik.values.ads.desktop.left}
                onAdd={() => {
                  const arr = [...formik.values.ads.desktop.left, { ...emptyAd }];
                  formik.setFieldValue("ads.desktop.left", arr);
                }}
                onRemove={(index) => {
                  const arr = [...formik.values.ads.desktop.left];
                  arr.splice(index, 1);
                  formik.setFieldValue("ads.desktop.left", arr);
                }}
                onChangeFile={(file: File | null, index: number) => {
                  const arr = [...formik.values.ads.desktop.left];
                  arr[index] = { ...arr[index], imageFile: file };
                  formik.setFieldValue("ads.desktop.left", arr);
                }}
                onChangeLink={(link: string, index: number) => {
                  const arr = [...formik.values.ads.desktop.left];
                  arr[index] = { ...arr[index], link };
                  formik.setFieldValue("ads.desktop.left", arr);
                }}
                getPreview={(index: number) => getAdPreview(formik.values.ads.desktop.left[index])}
              />

              {/* Desktop - Right */}
              <AdSection
                sectionLabel="Desktop Right Ads"
                namePrefix="ads.desktop.right"
                valuesArray={formik.values.ads.desktop.right}
                onAdd={() => {
                  const arr = [...formik.values.ads.desktop.right, { ...emptyAd }];
                  formik.setFieldValue("ads.desktop.right", arr);
                }}
                onRemove={(index) => {
                  const arr = [...formik.values.ads.desktop.right];
                  arr.splice(index, 1);
                  formik.setFieldValue("ads.desktop.right", arr);
                }}
                onChangeFile={(file: File | null, index: number) => {
                  const arr = [...formik.values.ads.desktop.right];
                  arr[index] = { ...arr[index], imageFile: file };
                  formik.setFieldValue("ads.desktop.right", arr);
                }}
                onChangeLink={(link: string, index: number) => {
                  const arr = [...formik.values.ads.desktop.right];
                  arr[index] = { ...arr[index], link };
                  formik.setFieldValue("ads.desktop.right", arr);
                }}
                getPreview={(index: number) => getAdPreview(formik.values.ads.desktop.right[index])}
              />


              {/* Mobile - Top */}
              <AdSection
                sectionLabel="Mobile Top Ads"
                namePrefix="ads.mobile.top"
                valuesArray={formik.values.ads.mobile.top}
                onAdd={() => {
                  const arr = [...formik.values.ads.mobile.top, { ...emptyAd }];
                  formik.setFieldValue("ads.mobile.top", arr);
                }}
                onRemove={(index) => {
                  const arr = [...formik.values.ads.mobile.top];
                  arr.splice(index, 1);
                  formik.setFieldValue("ads.mobile.top", arr);
                }}
                onChangeFile={(file: File | null, index: number) => {
                  const arr = [...formik.values.ads.mobile.top];
                  arr[index] = { ...arr[index], imageFile: file };
                  formik.setFieldValue("ads.mobile.top", arr);
                }}
                onChangeLink={(link: string, index: number) => {
                  const arr = [...formik.values.ads.mobile.top];
                  arr[index] = { ...arr[index], link };
                  formik.setFieldValue("ads.mobile.top", arr);
                }}
                getPreview={(index: number) => getAdPreview(formik.values.ads.mobile.top[index])}
              />

              {/* Mobile - Middle */}
              <AdSection
                sectionLabel="Mobile Middle Ads"
                namePrefix="ads.mobile.middle"
                valuesArray={formik.values.ads.mobile.middle}
                onAdd={() => {
                  const arr = [...formik.values.ads.mobile.middle, { ...emptyAd }];
                  formik.setFieldValue("ads.mobile.middle", arr);
                }}
                onRemove={(index) => {
                  const arr = [...formik.values.ads.mobile.middle];
                  arr.splice(index, 1);
                  formik.setFieldValue("ads.mobile.middle", arr);
                }}
                onChangeFile={(file: File | null, index: number) => {
                  const arr = [...formik.values.ads.mobile.middle];
                  arr[index] = { ...arr[index], imageFile: file };
                  formik.setFieldValue("ads.mobile.middle", arr);
                }}
                onChangeLink={(link: string, index: number) => {
                  const arr = [...formik.values.ads.mobile.middle];
                  arr[index] = { ...arr[index], link };
                  formik.setFieldValue("ads.mobile.middle", arr);
                }}
                getPreview={(index: number) => getAdPreview(formik.values.ads.mobile.middle[index])}
              />

              {/* Mobile - Bottom */}
              <AdSection
                sectionLabel="Mobile Bottom Ads"
                namePrefix="ads.mobile.bottom"
                valuesArray={formik.values.ads.mobile.bottom}
                onAdd={() => {
                  const arr = [...formik.values.ads.mobile.bottom, { ...emptyAd }];
                  formik.setFieldValue("ads.mobile.bottom", arr);
                }}
                onRemove={(index) => {
                  const arr = [...formik.values.ads.mobile.bottom];
                  arr.splice(index, 1);
                  formik.setFieldValue("ads.mobile.bottom", arr);
                }}
                onChangeFile={(file: File | null, index: number) => {
                  const arr = [...formik.values.ads.mobile.bottom];
                  arr[index] = { ...arr[index], imageFile: file };
                  formik.setFieldValue("ads.mobile.bottom", arr);
                }}
                onChangeLink={(link: string, index: number) => {
                  const arr = [...formik.values.ads.mobile.bottom];
                  arr[index] = { ...arr[index], link };
                  formik.setFieldValue("ads.mobile.bottom", arr);
                }}
                getPreview={(index: number) => getAdPreview(formik.values.ads.mobile.bottom[index])}
              />
            </div>
          </FormikProvider>

          {/* Submit */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={`${form.profileformcol} submit-btn-wrap`}>
              <button type="submit" className="custom-button submit-btn">
                {id ? "Update Field" : "Add Field"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateField;

/**
 * AdSection component (local to this file) - renders a list of repeatable ad rows
 */
type AdSectionProps = {
  sectionLabel: string;
  namePrefix: string; // e.g. "ads.desktop.top"
  valuesArray: Array<any>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangeFile: (file: File | null, index: number) => void;
  onChangeLink: (link: string, index: number) => void;
  getPreview: (index: number) => string;
};

const AdSection: React.FC<AdSectionProps> = ({
  sectionLabel,
  namePrefix,
  valuesArray,
  onAdd,
  onRemove,
  onChangeFile,
  onChangeLink,
  getPreview,
}) => {
  return (
    <div className="ad-section">
       <div className={form.profile_flex}>
          <h4>{sectionLabel}</h4>
        </div>


      <div className="ad-list settings">
        {valuesArray && valuesArray.length > 0 ? (
          valuesArray.map((ad: any, idx: number) => (
            <div className={`${form.profileform} ad-row`} key={`${namePrefix}-${idx}`}>
  {/* Upload + Preview */}
   <div className={form.profileformcol}>
  <div className="upload-logo-file formgrp">
    <div className="uploadimage">
      <div className="upload-logo">
        <img
          src={getPreview(idx) || images.noImageData} // preview or default
          alt={`${sectionLabel} ${idx}`}
          className={getPreview(idx) ? "" : "no-image"}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onChangeFile(file, idx);
          }}
        />
        <div className="overlay">
          <span className="icon">
            <FontAwesomeIcon icon={faUpload} />
          </span>
        </div>
      </div>
    </div>
  </div>
  </div>
  {/* Link input */}
   <div className={form.profileformcol}>
  <div className="ad-fields formgrp">
    <Input
      type="text"
      title="Ad Link"
      id={`ad-link-${idx}`}
      placeholder="Enter link"
      value={ad.link || ""}
      onChange={(e: any) => onChangeLink(e.target.value, idx)}
    />
  </div>
  </div>
  {/* Remove button */}
  <div className="ad-actions">
    <button
      type="button"
      className="custom-button danger"
      onClick={() => onRemove(idx)}
      title="Remove ad"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  </div>
</div>

          ))
        ) : (
          <div className="no-ads">No ads yet — add one.</div>
        )}
      </div>
      <div className={form.profile_flex}>
          <button type="button" className="custom-button" onClick={onAdd}>
            + Add Ad
          </button>
        </div>
    </div>
  );
};
