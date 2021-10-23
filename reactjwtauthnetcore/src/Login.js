import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from "yup";
import { useContext, useState } from "react";
import context from "./store";
import { useHistory } from "react-router";
import jwtDecode from "jwt-decode";

const Login = () => {
  const [, dispatch] = useContext(context);
  const history = useHistory();
  const [error, setError] = useState(null);

  return (
    <div className="centered">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={yup.object({
          email: yup
            .string()
            .email("Invalid email!")
            .required("Email is required"),
          password: yup.string().required("Password is required"),
        })}
        onSubmit={(values) => {
          (async () => {
            const res = await fetch(
              "https://localhost:44387/api/account/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              }
            );

            const data = await res.json();

            if (data.token) {
              setError(null);
              const decoded = jwtDecode(data.token);
              const expDate = new Date(decoded.exp * 1000).getTime();
              const today = new Date().getTime();
              const remainingTime = expDate - today;
              setTimeout(() => {
                dispatch({ type: "logout" });
              }, remainingTime);
              dispatch({ type: "setUser", user: { ...data } });
              history.replace("/");
            } else {
              if (data.status === 401) {
                setError("Wrong Password!");
              } else if (data.status === 404) {
                setError("User doesn't exist");
              } else {
                setError("Server error!");
              }
            }
          })();
        }}
      >
        {(formik) => {
          return (
            <Form className="form">
              {error && <h3>{error}</h3>}
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
              <button
                disabled={!(formik.isValid && formik.dirty)}
                type="submit"
              >
                Login
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;
