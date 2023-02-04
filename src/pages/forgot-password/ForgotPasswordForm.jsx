import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";

import TextInput from "../../components/TextInput";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
});

function ForgotPasswordForm() {
    const auth =getAuth();
    const navigate=useNavigate();
  const onSubmit = async ({ email }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent successfully.");
      navigate('/login')
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <div className="mb-4">
              <TextInput label="Email" id="email" name="email" type="email" />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mx-0"
              disabled={isSubmitting}
            >
              Send reset link
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ForgotPasswordForm;
