import React from "react";
import classnames from "classnames";

interface IInput {
  type?: string;
  hasError?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  useRef?: any;
  onChange?: any;
  defaultValue?: string;

  //   useRef?: React.RefObject<any> | undefined | any;
}

export const Input: React.FC<IInput> = ({
  type = "input",
  hasError,
  className,
  required,
  placeholder,
  useRef,
  name,
  onChange,
  defaultValue,
}) => {
  return (
    <input
      {...useRef}
      required={required}
      type={type}
      name={name}
      className={classnames("form-control", className, {
        "is-invalid": hasError,
      })}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  );
};
