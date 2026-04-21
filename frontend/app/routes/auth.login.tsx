import type { Route } from "./+types/auth.login";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "~/lib/trpc";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";
import { loginSchema } from "~/schemas/auth";
import { useLanguage } from "~/context/LanguageContext";
import type { TranslationKey } from "~/lib/translations";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daxil ol - DəmirMart" },
    { name: "description", content: "DəmirMart-a daxil olun" },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = trpc.useMutation("post", "/auth/login");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      login(
        {
          body: {
            email: values.email,
            password: values.password,
          },
        },
        {
          onSuccess: () => {
            toast.success(
              t("loginSuccess" as TranslationKey) || "Uğurla daxil oldunuz!",
            );
            navigate("/");
          },
          onError: (err: unknown) =>
            toast.error(
              (err as Error)?.message ||
                t("loginError" as TranslationKey) ||
                "Xəta baş verdi",
            ),
        },
      );
    },
  });

  return (
    <main className="min-h-screen bg-[#0a1428] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding / Visual */}
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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
              Xoş gəldiniz geri
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Hesabınıza daxil olun və keyfiyyətli polad və alətlər dünyasına
              qoşulun.
            </p>

            <div className="mt-16 text-sm text-zinc-500">
              © 2010–2026 DəmirMart. Bütün hüquqlar qorunur.
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..."
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  DəmirMart
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center lg:text-left mb-2 text-gray-900">
              Daxil ol
            </h1>
            <p className="text-center lg:text-left text-gray-500 mb-10">
              DəmirMart hesabınıza daxil olun
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email Field */}
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

              {/* Password Field */}
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
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1.5">
                    {formik.errors.password}
                  </p>
                )}

                <div className="flex justify-end mt-2">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    Şifrəni unutdunuz?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.985] shadow-lg shadow-orange-500/30 mt-4"
              >
                {isPending ? "Daxil olunur..." : "Daxil ol"}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Hesabınız yoxdur?{" "}
                <Link
                  to="/auth/register"
                  className="text-orange-500 font-semibold hover:text-orange-600"
                >
                  Qeydiyyatdan keçin
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="my-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">və ya</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 py-3.5 rounded-2xl text-sm font-medium text-gray-700 transition-all">
                Google ilə daxil ol
              </button>
              <button className="flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 py-3.5 rounded-2xl text-sm font-medium text-gray-700 transition-all">
                Facebook ilə daxil ol
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
