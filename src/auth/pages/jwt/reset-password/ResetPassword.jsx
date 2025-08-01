import clsx from "clsx";
import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useAuthContext } from "@/auth/useAuthContext";
import { Alert, KeenIcon } from "@/components";
import { useLayout } from "@/providers";
const initialValues = {
  email: "",
};
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
});
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState(undefined);
  const { requestPasswordResetLink } = useAuthContext();
  const { currentLayout } = useLayout();
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      try {
        if (!requestPasswordResetLink) {
          throw new Error("JWTProvider is required for this form.");
        }
        await requestPasswordResetLink(values.email);
        setHasErrors(false);
        setLoading(false);
      } catch {
        setHasErrors(true);
        setLoading(false);
        setSubmitting(false);
        setStatus("The login detail is incorrect");
      }
    },
  });
  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Ваш Email</h3>
          <span className="text-2sm text-gray-600 font-medium">
            Введите свой email для сброса пароля
          </span>
        </div>

        {hasErrors && (
          <Alert variant="danger">
            Email address not found. Please check your entry.
          </Alert>
        )}

        {hasErrors === false && (
          <Alert variant="success">
            Password reset link sent. Please check your email to proceed
          </Alert>
        )}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="email@email.com"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid": formik.touched.email && formik.errors.email,
                },
                {
                  "is-valid": formik.touched.email && !formik.errors.email,
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 items-stretch">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? "Подождите..." : "Продолжить"}
          </button>

          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/login"
                : "/auth/classic/login"
            }
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
          >
            <KeenIcon icon="black-left" />
            Вернуться
          </Link>
        </div>
      </form>
    </div>
  );
};
export { ResetPassword };
