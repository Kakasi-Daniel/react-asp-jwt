import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from "yup";
import context from "./store";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import jwtDecode from "jwt-decode";

const Register = () => {
  const [, dispatch] = useContext(context);
  const history = useHistory();
  const [error, seterror] = useState(null);

  return (
    <div className="centered">
      <Formik
        initialValues={{
          name: "",
          username: "",
          email: "",
          password: "",
          date: "",
        }}
        validationSchema={yup.object({
          name: yup
            .string()
            .min(5, "Minumum 5 characters")
            .max(20, "Maximum 20 characters")
            .required("Name is a required field!"),
          username: yup
            .string()
            .min(5, "Minumum 5 characters")
            .max(20, "Maximum 20 characters")
            .required("User Name is a required field!"),
          email: yup
            .string()
            .email("Invalid email!")
            .required("Email is required"),
          password: yup
            .string()
            .min(8, "Password should be at least 8 characters long")
            .required("Password is required"),
          date: yup.string().required("Date is required!"),
        })}
        onSubmit={(values) => {
          (async () => {
            const res = await fetch(
              "https://localhost:44387/api/account/register",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  DisplayName: values.name,
                  UserName: values.username,
                  Email: values.email,
                  BornDate: values.date,
                  Password: values.password,
                }),
              }
            );

            if (res.status === 400) {
              seterror("Try with diffrenr username/email");
            }

            const data = await res.json();

            console.log(data);

            if (data.token) {
              seterror(null);
              const decoded = jwtDecode(data.token);
              const expDate = new Date(decoded.exp * 1000).getTime();
              const today = new Date().getTime();
              const remainingTime = expDate - today;
              setTimeout(() => {
                dispatch({ type: "logout" });
              }, remainingTime);
              dispatch({ type: "setUser", user: { ...data } });
              history.replace("/");
            } else if (data[0]) {
              seterror(data[0].code + " " + data[0].description);
            }
          })();
        }}
      >
        {(formik) => {
          return (
            <Form className="form">
              {error && <h3>{error}</h3>}
              <Input
                label="Name"
                type="text"
                name="name"
                placeholder="Display Name"
              />
              <Input
                label="User Name"
                type="text"
                name="username"
                placeholder="User Name"
              />
              <Input
                label="E-mail"
                type="email"
                name="email"
                placeholder="Your email"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Strong password"
              />
              <Input label="Born Date" type="date" name="date" />
              <button
                disabled={!(formik.isValid && formik.dirty)}
                type="submit"
              >
                Register
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Register;
