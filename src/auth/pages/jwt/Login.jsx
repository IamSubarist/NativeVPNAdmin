import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { KeenIcon } from "@/components";
import { toAbsoluteUrl } from "@/utils";
import { useAuthContext } from "@/auth";
import { useLayout } from "@/providers";
import { Alert } from "@/components";
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .min(3, "Минимум 3 символа")
    .max(50, "Максимум 50 символов")
    .required("Логин обязателен"),
  password: Yup.string()
    .min(3, "Минимум 3 символа")
    .max(50, "Максимум 50 символов")
    .required("Пароль обязателен"),
  remember: Yup.boolean(),
});
const initialValues = {
  email: "",
  password: "",
  remember: false,
};
const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!login) {
          throw new Error("JWTProvider is required for this form.");
        }
        const redirectPath = await login(values.email, values.password);
        navigate(redirectPath);
        if (values.remember) {
          localStorage.setItem("email", values.email);
        } else {
          localStorage.removeItem("email");
        }
        // navigate(from, {
        //   replace: true,
        // });
      } catch {
        setStatus("Неверный логин или пароль");
        setSubmitting(false);
      }
      setLoading(false);
    },
  });
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  return (
    <div className="card max-w-[390px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            Вход
          </h3>
          {/* <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">
              Need an account?
            </span>
            <Link
              to={
                currentLayout?.name === "auth-branded"
                  ? "/auth/signup"
                  : "/auth/classic/signup"
              }
              className="text-2sm link"
            >
              Sign up
            </Link>
          </div> */}
        </div>

        {/* <div className="grid grid-cols-2 gap-2.5">
          <a href="#" className="btn btn-light btn-sm justify-center">
            <img
              src={toAbsoluteUrl("/media/brand-logos/google.svg")}
              className="size-3.5 shrink-0"
            />
            Use Google
          </a>

          <a href="#" className="btn btn-light btn-sm justify-center">
            <img
              src={toAbsoluteUrl("/media/brand-logos/apple-black.svg")}
              className="size-3.5 shrink-0 dark:hidden"
            />
            <img
              src={toAbsoluteUrl("/media/brand-logos/apple-white.svg")}
              className="size-3.5 shrink-0 light:hidden"
            />
            Use Apple
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            Or
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>

        <Alert variant="primary">
          Use{" "}
          <span className="font-semibold text-gray-900">
            demo@keenthemes.com
          </span>{" "}
          username and{" "}
          <span className="font-semibold text-gray-900">demo1234</span>{" "}
          password.
        </Alert> */}

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Логин или Email</label>
          <label className="input">
            <input
              placeholder="Введите логин или email"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx("form-control", {
                "is-invalid": formik.touched.email && formik.errors.email,
              })}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">Пароль</label>
            {/* <Link
              to={
                currentLayout?.name === "auth-branded"
                  ? "/auth/reset-password"
                  : "/auth/classic/reset-password"
              }
              className="text-2sm link shrink-0"
            >
              Забыли пароль?
            </Link> */}
          </div>
          <label className="input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Введите пароль"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx("form-control", {
                "is-invalid": formik.touched.password && formik.errors.password,
              })}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon
                icon="eye"
                className={clsx("text-gray-500", {
                  hidden: showPassword,
                })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx("text-gray-500", {
                  hidden: !showPassword,
                })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        {/* <label className="checkbox-group pointer-events-none opacity-40">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            {...formik.getFieldProps("remember")}
          />
          <span className="checkbox-label">Запомнить меня</span>
        </label> */}

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};
export { Login };
