import React from "react";
import { Field,field, ErrorMessage, meta } from "formik";

export default function Rsdiobtn(label, ...props) {
  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="cursor-pointer label px-0"
      >
        {label}
      </label>
      <Field name={name} {...props}>
        { (field)=>{
            
        }}
      </Field>
    </>
  );
}
