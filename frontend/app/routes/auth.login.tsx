import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useLanguage } from "~/context/LanguageContext";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const { mutate: login } = trpc.useMutation("post", "/auth/login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email və parol tələb olunur");
      return;
    }

    setIsLoading(true);
    setDebugInfo("⏳ Logging in...");

    login(
      {
        body: {
          email,
          password,
        },
      },
      {
        onSuccess: (data: any) => {
          console.log("✅ Login Response:", data);
          console.log("📦 Response type:", typeof data);
          console.log("📦 Response keys:", Object.keys(data));
          console.log("👤 User data:", data?.user);
          console.log("📋 Full data:", JSON.stringify(data, null, 2));

          const debugMsg = `Response: ${JSON.stringify(data)}`;
          setDebugInfo(debugMsg);

          // ✅ Check multiple possible response formats
          const userData = data?.user || data;

          if (userData && userData.id) {
            console.log("🔐 User found, storing in auth store:", userData);
            setUser(userData);

            // Verify it was stored
            setTimeout(() => {
              const stored = useAuthStore.getState();
              console.log("🔍 Auth store after setUser:", stored);
            }, 100);

            toast.success("Uğurla daxil oldunuz!");

            // Add a delay to ensure state is updated before navigation
            setTimeout(() => {
              navigate("/");
            }, 200);
          } else {
            console.error("❌ No valid user in response:", data);
            const errorMsg = `Invalid response: ${JSON.stringify(data)}`;
            setDebugInfo(errorMsg);
            toast.error("Gözlənilməz cavab formatı");
          }
        },
        onError: (error: any) => {
          console.error("❌ Login error:", error);
          console.error("Error details:", error?.message || error);
          const errorMsg = `Error: ${error?.message || JSON.stringify(error)}`;
          setDebugInfo(errorMsg);
          toast.error(error?.message || "Giriş uğursuz oldu");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
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
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-black text-center text-gray-900 mb-2">
            Daxil Olun
          </h1>
          <p className="text-center text-gray-500 text-sm mb-8">
            DəmirMart hesabınıza daxil olun
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Parol
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-black py-3 rounded-lg transition-all active:scale-95"
            >
              {isLoading ? "Daxil olunur..." : "Daxil Ol"}
            </button>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 text-sm">
              Hesabınız yoxdur?{" "}
              <Link
                to="/auth/register"
                className="font-bold text-orange-500 hover:text-orange-600"
              >
                Qeydiyyatdan keçin
              </Link>
            </p>
          </div>
        </div>

        {/* Debug info - Remove in production */}
        <div className="mt-8 space-y-3">
          <div className="p-4 bg-blue-800 text-blue-100 rounded-lg text-xs font-mono overflow-auto max-h-40">
            <p className="text-blue-300 font-bold mb-2">
              💡 Current Auth Store:
            </p>
            <p>User: {user?.email || "null"}</p>
            <p>
              Authenticated:{" "}
              {useAuthStore((s) => s.isAuthenticated) ? "true" : "false"}
            </p>
          </div>

          {debugInfo && (
            <div className="p-4 bg-gray-800 text-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-40">
              <p className="text-yellow-400 font-bold mb-2">📝 Debug Info:</p>
              <pre className="whitespace-pre-wrap break-words">{debugInfo}</pre>
            </div>
          )}

          <div className="p-4 bg-gray-800 text-gray-100 rounded-lg text-xs font-mono">
            <p className="text-blue-400">
              💡 Open DevTools Console (F12) to see detailed logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
