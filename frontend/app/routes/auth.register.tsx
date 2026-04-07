import type { Route } from "./+types/auth.register";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";
import { trpc } from "~/lib/trpc";
import { registerSchema } from "~/schemas/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Qeydiyyat - DəmirMart" },
    { name: "description", content: "DəmirMart-a qeydiyyatdan keçin" },
  ];
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = trpc.useMutation('post', "/auth/register");

  const formik = useFormik({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "", agreed: false },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values) => {
      register({
        body: {
          name: values.fullName,
          email: values.email,
          password: values.password,
          repassword: values.confirmPassword
        }
      }, {
        onSuccess: () => {
          toast.success("Uğurla qeydiyyatdan keçdiniz!");
          refetchUser();
          navigate("/");
        },
        onError: (err: unknown) => {
          toast.error((err as Error)?.message || "Xəta baş verdi");
        }
      });
    }
  });

  const getPasswordStrength = () => {
    const pwd = formik.values.password;
    if (!pwd) return { width: "0%", color: "bg-gray-200", label: "" };
    if (pwd.length < 6) return { width: "33%", color: "bg-red-400", label: "Weak" };
    if (pwd.length < 10) return { width: "66%", color: "bg-yellow-400", label: "Medium" };
    return { width: "100%", color: "bg-green-500", label: "Strong" };
  };

  const strength = getPasswordStrength();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-orange-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Qeydiyyat</h1>
            <p className="text-orange-100 text-sm mt-1">DəmirMart</p>
          </div>

          <div className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ad Soyad"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                    }`}
                  />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="example@email.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifrə</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                )}
                {formik.values.password && (
                  <div className="mt-1.5">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifrəni təsdiqləyin</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                    }`}
                  />
                  {formik.values.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {formik.values.confirmPassword === formik.values.password ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formik.values.agreed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formik.values.agreed ? "bg-orange-500 border-orange-500" : "border-gray-300 hover:border-orange-400"}`}>
                    {formik.values.agreed && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    {"I agree to the "}
                    <a href="#" className="text-orange-500 hover:text-orange-600">Terms of Service</a>
                    {" and "}
                    <a href="#" className="text-orange-500 hover:text-orange-600">Privacy Policy</a>
                  </span>
                  {formik.touched.agreed && formik.errors.agreed && (
                    <span className="text-red-500 text-xs mt-1">{formik.errors.agreed as string}</span>
                  )}
                </div>
              </label>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-75 text-white py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-orange-500/30 mt-2"
              >
                Qeydiyyat
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Hesabınız var?{" "}
                <Link to="/auth/login" className="text-orange-500 hover:text-orange-600 font-semibold">
                  Daxil olun
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}