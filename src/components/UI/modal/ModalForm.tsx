import React from "react";
import ReactDom from "react-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./Modal.module.scss";
import Card from "../card/Card";
import Input from "../input/Input"; // <-- custom Input (should support formik props)

interface IBackdrop {
  onClose: () => void;
}
const Backdrop: React.FC<IBackdrop> = ({ onClose }) => {
  return <div className={classes.backdrop} onClick={onClose}></div>;
};

interface IInputField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "password" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  validation?: any; // Yup validation schema
  required?: boolean;
}

interface IModalAction {
  label: string;
  type?: "primary" | "secondary" | "delete";
  submit?: boolean;
  onClick?: (values?: Record<string, any>) => void;
}

interface IModal {
  title: string;
  message?: React.ReactNode; 
  fields?: IInputField[];
  actions: IModalAction[];
  onClose: () => void;
}

const ModalOverlay: React.FC<IModal> = ({
  title,
  message,
  fields = [],
  actions,
  onClose,
}) => {
  const { t } = useTranslation();

  // Build initial values dynamically
  const initialValues = fields.reduce(
    (acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    },
    {} as Record<string, any>
  );

  // Build Yup validation schema dynamically
  const validationSchema = Yup.object(
    fields.reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {} as Record<string, any>)
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const saveAction = actions.find((a) => a.submit);
      if (saveAction?.onClick) {
        saveAction.onClick(values);
      }
      setSubmitting(false);
    },
  });

  return (
    <Card>
      <div className={classes.modal}>
        <header className={classes.header}>
          <h3>{title}</h3>
        </header>

        <div className={classes.content}>
         {message && <div className={classes.message}>{message}</div>}

          <form onSubmit={formik.handleSubmit} className={classes.form}>
            {fields.map((field) => (
              <div key={field.name} className={classes.formGroup}>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className={classes.textarea}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    className={classes.select}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    title={field.label}
                    placeholder={field.placeholder}
                    required={field.required}
                    width="full"
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <div className={classes.error}>
                    {formik.errors[field.name] as string}
                  </div>
                )}
              </div>
            ))}

            <footer className={classes.actions}>
              {actions.map((action, i) =>
                action.submit ? (
                  <button
                    key={i}
                    type="submit"
                    disabled={formik.isSubmitting}
                    className={
                      action.type === "delete" ? classes.delete : "custom-button"
                    }
                  >
                    {t(action.label)}
                  </button>
                ) : (
                  <button
                    key={i}
                    type="button"
                    className={
                      action.type === "delete" ? classes.delete : "custom-button"
                    }
                    onClick={() => action.onClick && action.onClick()}
                  >
                    {t(action.label)}
                  </button>
                )
              )}
            </footer>
          </form>
        </div>
      </div>
    </Card>
  );
};

const ModalForm: React.FC<IModal> = (props) => {
  const backdropRoot = document.getElementById("backdrop-root") as HTMLElement;
  const modalOverlay = document.getElementById("overlay-root") as HTMLElement;

  return (
    <>
      {ReactDom.createPortal(<Backdrop onClose={props.onClose} />, backdropRoot)}
      {ReactDom.createPortal(<ModalOverlay {...props} />, modalOverlay)}
    </>
  );
};

export default ModalForm;