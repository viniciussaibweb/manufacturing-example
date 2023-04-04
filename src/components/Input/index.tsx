"use client";
import { useEffect, useRef, ChangeEvent, FocusEvent, forwardRef } from "react";
import { useField } from "@unform/core";

import { InputContainer, FormInput } from "./styles";

interface PropsInput {
  name: string;
  id?: string;
  label?: string;
  type?: string;
  isUppercase?: boolean;
  isRequired?: boolean;
  disabled?: boolean;
  onChangeExternal?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

const Input = ({
  name,
  label,
  isUppercase,
  isRequired,
  onChangeExternal,
  maxLength,
  ...rest
}: PropsInput) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue = "", registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  const toInputUppercase = (e: FocusEvent<HTMLInputElement>) => {
    if (isUppercase) {
      e.target.value = `${e.target.value}`.toUpperCase();
    }
  };

  return (
    <InputContainer isRequired={Boolean(isRequired)}>
      <div>
        <label htmlFor={fieldName}>{label}</label>
        {error && (
          <span style={{ color: "#f00", display: "block" }}>{error}</span>
        )}
      </div>
      <FormInput
        ref={inputRef}
        name={fieldName}
        id={fieldName}
        defaultValue={defaultValue}
        onBlur={toInputUppercase}
        uppercase={Boolean(isUppercase)}
        invalid={error}
        maxLength={maxLength}
        onChange={onChangeExternal && rest.onChange}
        {...rest}
      />
    </InputContainer>
  );
};

export default Input;
