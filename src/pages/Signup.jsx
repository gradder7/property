import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../components/TextInput";
import { toast } from "react-toastify";
import { db } from "../firebase.config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import GoogleAuth from "../components/GoogleAuth";
import FormContainer from "../layout/FormContainer";
import FormHeading from "../components/FormHeading";
import FormCard from "../layout/FormCard";
function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup | Rent or Sale";
  }, []);

  const onSubmit = async (values) => {
    const auth = getAuth();
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
      // create a document with user's data
      const formData = { ...values };
      delete formData.password;
      formData.createdOn = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formData);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <FormHeading heading="Get started" />
        <GoogleAuth />
        <Formik
          initialValues={{
            fullname: "",
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            fullname: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(5, "Password must have atleast five characters")
              .required("Required"),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <div className="mb-4">
                  <TextInput
                    label="Name"
                    id="fullname"
                    name="fullname"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <TextInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                  />
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
        <p className="text-center text-sm font-medium text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </FormCard>
    </FormContainer>
  );
}
export default Signup;
