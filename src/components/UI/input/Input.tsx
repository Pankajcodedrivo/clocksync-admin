import React, { useImperativeHandle, useRef } from "react";
import { useTranslation } from "react-i18next";
import classes from "./Input.module.scss";

interface Props {
  id: string;
  type: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  classes?: string; // Use this for custom classes
  ref?: React.Ref<HTMLInputElement>; // Change type to React.Ref
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  name?: string;
  onChange?: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  errorMsg?: string;
  title?: string;
  autoComplete?: string;
  rightIcon?: React.ReactNode; // Add this line to define the rightIcon prop
}

interface IImperativeHandler {
  focus: () => void;
  value?: string;
}

const Input = React.forwardRef<IImperativeHandler, Props>((props, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function inputFocused() {
    inputRef.current?.focus();
    inputRef.current?.setAttribute("style", "border:2px solid red");
  }

  useImperativeHandle(ref, () => {
    return {
      focus: inputFocused,
    };
  });

  const { t } = useTranslation();

  return (
    <div
      className={`${classes.form__control} ${props.classes ? props.classes : ""}`}
    >
      <label htmlFor={props.title ?? props.id}>
        {props.title ?? t(`${props.id}`)}{" "}
        {props.required ? <span style={{ color: "red" }}>*</span> : null}
      </label>
      <div className={classes.inputContainer}>
        {" "}
        {/* Wrap input and icon */}
        <input
          ref={inputRef}
          id={props.id}
          name={props.name}
          minLength={props.minLength}
          maxLength={props.maxLength}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          readOnly={props.readonly || false}
          disabled={props.disabled || false}
          onChange={props.onChange}
          autoComplete={props.autocomplete || "off"}
          className={classes.input} // Apply any specific styles for input
        />
        {props.rightIcon && (
          <span className={classes.rightIcon}>{props.rightIcon}</span> // Render right icon
        )}
      </div>
      {props.errorMsg && (
        <span className={`error`} style={{ color: "red" }}>
          {props.errorMsg}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
