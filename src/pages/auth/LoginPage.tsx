import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/ui/Button/Button";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginPage() {
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Please enter your email"),
      password: Yup.string().required("Please enter your password"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
    },
  });

  return (
    <div className="auth-page-content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mt-sm-5 mb-4 text-white-50">
              <h2 className="text-white">Outdoor Experience</h2>
              <p className="mt-3 fs-15 fw-medium">
                A complete platform to create, manage, and share outdoor
                experiences.
              </p>
            </div>

            <div className="card mt-4">
              <div className="card-body p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Welcome back!</h5>
                  <p className="text-muted">Sign in to continue.</p>
                </div>

                <div className="p-2 mt-4">
                  <form onSubmit={formik.handleSubmit} noValidate>
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      error={
                        formik.touched.email ? formik.errors.email : undefined
                      }
                    />

                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={
                        formik.touched.password
                          ? formik.errors.password
                          : undefined
                      }
                    />

                    <Checkbox id="remember-me" label="Remember me" />

                    <div className="mt-4">
                      <Button
                        type="submit"
                        variant="success"
                        className="w-100"
                        loading={formik.isSubmitting}
                      >
                        Sign In
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
