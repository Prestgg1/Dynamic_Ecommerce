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
import { apiUrl } from "~/lib/site-settings";
import { useAuthStore } from "~/store/auth.store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Daxil ol - MetalX" },
    { name: "description", content: "MetalX-a daxil olun" },
  ];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const setUser = useAuthStore((s) => s.setUser);
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
          onSuccess: async () => {
            try {
              const response = await fetch(apiUrl("/auth/me"), {
                credentials: "include",
              });
              if (response.ok) {
                setUser(await response.json());
              }
            } catch {
              // The session cookie is already set; the layout can refetch later.
            }
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
    <main className="min-h-screen bg-[#001446] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding / Visual */}
        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-[#041d23] to-[#001446] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#0080e815_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative z-10 max-w-md">
            <div className="mb-12">
              <img
                src="/metalxlogo.svg"
                alt="MetalX"
                className="h-14 w-auto max-w-[260px]"
              />
              <div className="mt-4 text-sm font-bold uppercase tracking-[3px] text-[#0080e8]">
                PREMIUM TOOLS & STEEL
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
              © 2010–2026 MetalX. Bütün hüquqlar qorunur.
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10 flex justify-center lg:hidden">
              <img
                src="/metalxlogo.svg"
                alt="MetalX"
                className="h-12 w-auto max-w-[220px]"
              />
            </div>

            <h1 className="text-3xl font-bold text-center lg:text-left mb-2 text-gray-900">
              Daxil ol
            </h1>
            <p className="text-center lg:text-left text-gray-500 mb-10">
              MetalX hesabınıza daxil olun
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
                        : "border-gray-200 focus:border-[#0080e8]"
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
                        : "border-gray-200 focus:border-[#0080e8]"
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
                    className="text-sm text-[#0080e8] hover:text-[#0080e8]"
                  >
                    Şifrəni unutdunuz?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#0080e8] hover:bg-[#0080e8]/90 disabled:bg-[#0080e8]/70 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-[0.985] shadow-lg shadow-[#0080e8]/30 mt-4"
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
                  className="text-[#0080e8] font-semibold hover:text-[#0080e8]"
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
