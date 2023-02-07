import { useField } from "formik";

function RadioInput({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name} className="flex cursor-pointer">
        <input
          type="radio"
          className="radio radio-primary"
          {...field}
          {...props}
        />
        <span className="label-text mr-4 px-3">{label}</span>
      </label>
      {meta.touched && meta.error ? (
        <span className="block text-red-600 text-sm mt-2">{meta.error}</span>
      ) : null}
    </>
  );
}

export default RadioInput;
