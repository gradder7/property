import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import TextInput from "../../components/TextInput";

import {db } from "../../firebase.config";
import { getAuth } from "firebase/auth";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(5, "Password must have atleast five characters")
    .required("Required"),
});

function SignupForm() {
  const navigate = useNavigate();
  const auth=getAuth();
  const onSubmit = async (values) => {
    const { name, email, password } = values;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //set displayName to user's name
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      //create a document with user's data
      const formData = { ...values, favorites: [] };
      delete formData.password;
      formData.createdOn = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formData);
      navigate("/profile");
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
              <TextInput
                label="Name"
                id="name"
                name="name"
                type="text"
              />
            </div>
            <div className="mb-4">
              <TextInput label="Email" id="email" name="email" type="email" />
            </div>
            <div className="mb-8">
              <TextInput
                label="Password"
                id="password"
                name="password"
                type="password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mx-0 mb-8"
              disabled={isSubmitting}
            >
              Create account
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default SignupForm;
