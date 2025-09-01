"use client";

import { useAccess } from "@/context/AccessContext";
import { CSSProperties } from "react";
import { Button, Form, Row, Tab } from "react-bootstrap";
import { Control, UseFormRegisterReturn } from "react-hook-form";
import { Many2one, Many2OneOption } from "../Many2one";
import { FormCheckType } from "react-bootstrap/esm/FormCheck";

type FieldEntryProps = {
  label: string;
  type?: React.HTMLInputTypeAttribute; // "text" | "password" | "email" | ...
  register: UseFormRegisterReturn;
  fieldName: string;
  invalid?: boolean;
  className?: string;
  disabled?: boolean;
  feedBack?: React.ReactNode;
};

type Option = {
  value: string | number;
  label: string;
};

type FieldSelectProps = {
  label: string;
  register: UseFormRegisterReturn;
  className?: string;
  fieldName: string;
  invalid?: boolean;
  options: Option[];
  disabled?: boolean;
  feedBack?: React.ReactNode;
};

type FieldMany2oneProps = {
  control: Control<any>;
  register: UseFormRegisterReturn;
  options: Many2OneOption[];
  label: string;
  fieldName: string;
  disabled?: boolean;
  callBackMode: "object" | "id";
};

type AppButtonProps = {
  label: string;
  fieldName: string;
  action: () => void;
  disabled?: boolean;
};

type BooleanProps = {
  label: string;
  type: FormCheckType;
  register: UseFormRegisterReturn;
  fieldName: string;
};

type PageContentProps = {
  children: React.ReactNode;
  disabled?: boolean;
  invisible?: boolean;
  fieldName: string;
};

function useFields({ accessModel }: { accessModel: string | null }) {
  let access = null;

  if (accessModel) {
    access = useAccess(accessModel);
  }

  const PageContent = ({
    children,
    disabled,
    invisible,
    fieldName,
  }: PageContentProps) => {
    const fieldAccessAttrs = access?.find(
      (field) => field.fieldName === fieldName
    );

    return (
      <fieldset
        disabled={disabled}
        style={{ display: invisible ? "none" : "block" }}
        className="container-fluid my-2 p-0"
      >
        <fieldset
          style={{ display: fieldAccessAttrs?.invisible ? "none" : "flex" }}
          disabled={fieldAccessAttrs?.readonly}
          className="row g-2"
        >
          {children}
        </fieldset>
      </fieldset>
    );
  };

  const Boolean = ({ label, register, fieldName, type }: BooleanProps) => {
    const fieldAccessAttrs = access?.find(
      (field) => field.fieldName === fieldName
    );

    const styleProps: CSSProperties = {
      display: fieldAccessAttrs?.invisible ? "none" : "block",
      pointerEvents: fieldAccessAttrs?.readonly ? "none" : "auto",
    };
    return (
      <Form.Group
        controlId={"Control" + fieldName.trim()}
        style={styleProps}
        className="mb-2"
      >
        <Form.Check
          size={2}
          {...register}
          type={type}
          label={label}
          id={label}
        />
      </Form.Group>
    );
  };

  const Entry = ({
    label,
    type = "text",
    register,
    fieldName,
    className,
    invalid,
    disabled,
    feedBack,
  }: FieldEntryProps) => {
    const fieldAccessAttrs = access?.find(
      (field) => field.fieldName === fieldName
    );

    const styleProps: CSSProperties = {
      display: fieldAccessAttrs?.invisible ? "none" : "block",
      pointerEvents: fieldAccessAttrs?.readonly ? "none" : "auto",
    };

    return (
      <Form.Group
        controlId={"Control" + fieldName.trim()}
        style={styleProps}
        className="mb-3"
      >
        <Form.Label className="fw-semibold">{label}</Form.Label>
        <Form.Control
          className={className}
          {...register}
          type={type}
          autoComplete="off"
          disabled={disabled}
          required={fieldAccessAttrs?.required}
          isInvalid={invalid}
          size="sm"
        />
        {feedBack && (
          <Form.Control.Feedback type="invalid">
            {feedBack}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  };

  const Selection = ({
    label,
    register,
    className,
    fieldName,
    invalid = false,
    options,
    disabled,
    feedBack,
  }: FieldSelectProps) => {
    const fieldAccessAttrs = access?.find(
      (field) => field.fieldName === fieldName
    );

    const styleProps: CSSProperties = {
      display: fieldAccessAttrs?.invisible ? "none" : "block",
      pointerEvents: fieldAccessAttrs?.readonly ? "none" : "auto",
    };

    return (
      <Form.Group
        controlId={"Control" + label.trim()}
        style={styleProps}
        className="mb-3"
      >
        <Form.Label className="fw-semibold">{label}</Form.Label>
        <Form.Select
          className={className}
          {...register}
          disabled={disabled}
          required={fieldAccessAttrs?.required}
          isInvalid={invalid}
          size="sm"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
        {feedBack && feedBack}
      </Form.Group>
    );
  };

  const Relation = ({
    control,
    register,
    fieldName,
    label,
    options,
    callBackMode,
    disabled,
  }: FieldMany2oneProps) => {
    const fieldAccessAttrs = access?.find(
      (field) => field.fieldName === fieldName
    );

    const styleProps: CSSProperties = {
      display: fieldAccessAttrs?.invisible ? "none" : "block",
      pointerEvents: fieldAccessAttrs?.readonly ? "none" : "auto",
    };

    return (
      <Form.Group
        controlId={"Control" + label.trim()}
        style={styleProps}
        className="mb-3"
      >
        <Form.Label className="fw-semibold">{label}</Form.Label>
        <Many2one
          disabled={disabled}
          options={options}
          {...register}
          control={control}
          callBackMode={callBackMode}
          size="sm"
          required={fieldAccessAttrs?.required}
        />
      </Form.Group>
    );
  };

  const AppButton = ({
    fieldName,
    action,
    label,
    disabled,
  }: AppButtonProps) => {
    const fieldAccessAttrs = access?.find(
      (field) => field.fieldName === fieldName
    );

    const styleProps: CSSProperties = {
      display: fieldAccessAttrs?.invisible ? "none" : "block",
      pointerEvents: fieldAccessAttrs?.readonly ? "none" : "auto",
    };

    return (
      <Button
        style={styleProps}
        onClick={action}
        disabled={disabled}
        title={fieldName}
        className="fw-bolder"
      >
        {label}
      </Button>
    );
  };

  return { Entry, Selection, Relation, AppButton, Boolean, PageContent };
}

export default useFields;
