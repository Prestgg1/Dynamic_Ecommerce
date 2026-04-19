import type { Route } from "./+types/auth.register";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";
import { trpc } from "~/lib/trpc";
import { registerSchema } from "~/schemas/auth";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Qeydiyyat - DəmirMart" },
    { name: "description", content: "DəmirMart-a qeydiyyatdan keçin" },
  ];
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: register, isPending } = trpc.useMutation(
    "post",
    "/auth/register",
  );

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values) => {
      register(
        {
          body: {
            name: values.fullName,
            email: values.email,
            password: values.password,
            repassword: values.confirmPassword,
          },
        },
        {
          onSuccess: () => {
            toast.success(
              t("registerSuccess" as TranslationKey) ||
                "Uğurla qeydiyyatdan keçdiniz!",
            );
            navigate("/");
          },
          onError: (err: unknown) => {
            toast.error(
              (err as Error)?.message ||
                t("registerError" as TranslationKey) ||
                "Xəta baş verdi",
            );
          },
        },
      );
    },
  });

  const getPasswordStrength = () => {
    const pwd = formik.values.password;
    if (!pwd) return { width: "0%", color: "bg-gray-200", label: "" };
    if (pwd.length < 6)
      return { width: "33%", color: "bg-red-400", label: "Weak" };
    if (pwd.length < 10)
      return { width: "66%", color: "bg-yellow-400", label: "Medium" };
    return { width: "100%", color: "bg-green-500", label: "Strong" };
  };

  const strength = getPasswordStrength();

  return (
    <main className="min-h-screen bg-[#0a1428] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Visual / Branding */}
        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-[#13223f] to-[#0a1428] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#22d3ee15_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-4xl font-bold tracking-tighter text-white">
                  DəmirMart
                </div>
                <div className="text-orange-400 text-sm font-bold tracking-[3px] uppercase">
                  PREMIUM TOOLS & STEEL
                </div>
              </div>
            </div>

            <h2 className="text-5xl font-bold tracking-tighter leading-tight text-white mb-6">
              Yeni hesab yaradın
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              DəmirMart ailəsinə qoşulun və keyfiyyətli polad və alətlərə
              birbaşa çıxış əldə edin.
            </p>

            <div className="mt-16 text-sm text-zinc-500">
              © 2010–2026 DəmirMart. Bütün hüquqlar qorunur.
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-3 rounded-2xl">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  DəmirMart
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center lg:text-left mb-2 text-gray-900">
              Qeydiyyat
            </h1>
            <p className="text-center lg:text-left text-gray-500 mb-10">
              Yeni hesab yaradın
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ad Soyad"
                    className={`w-full pl-12 py-4 border rounded-2xl text-base focus:outline-none transition-all ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-[#22d3ee]"
                    }`}
                  />
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1.5">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="example@email.com"
                    className={`w-full pl-12 py-4 border rounded-2xl text-base focus:outline-none transition-all ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-[#22d3ee]"
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1.5">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifrə
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 border rounded-2xl text-base focus:outline-none transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-[#22d3ee]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formik.values.password && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {strength.label}
                    </p>
                  </div>
                )}

                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1.5">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifrəni təsdiqləyin
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full pl-12 py-4 border rounded-2xl text-base focus:outline-none transition-all ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-[#22d3ee]"
                    }`}
                  />
                  {formik.values.confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {formik.values.confirmPassword ===
                      formik.values.password ? (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1.5">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formik.values.agreed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      formik.values.agreed
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    {formik.values.agreed && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span>
                    Şərtlər və Qaydalar ilə razıyam{" "}
                    <a
                      href="#"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      İstifadə Şərtləri
                    </a>{" "}
                    və{" "}
                    <a
                      href="#"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      Məxfilik Siyasəti
                    </a>
                  </span>
                  {formik.touched.agreed && formik.errors.agreed && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.agreed as string}
                    </p>
                  )}
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.985] shadow-lg shadow-orange-500/30 mt-2"
              >
                {isPending ? "Qeydiyyat tamamlanır..." : "Qeydiyyat"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Artıq hesabınız var?{" "}
                <Link
                  to="/auth/login"
                  className="text-orange-500 font-semibold hover:text-orange-600"
                >
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
