import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { Route } from "./+types/_auth.profile";
import { userContext } from "~/root";
import { trpc } from "~/lib/trpc";
import { useAuth } from "~/context/AuthContext";

const BACKEND_URL = "http://localhost:4000";

function resolveAvatar(avatarUrl: string | undefined, name: string) {
  if (!avatarUrl) {
    return `https://ui-avatars.com/api/?background=f97316&color=fff&name=${encodeURIComponent(name)}`;
  }
  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${BACKEND_URL}${avatarUrl}`;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { mutate: update } = trpc.useQuery("patch", "/auth/profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPreviewUrl(resolveAvatar(user.avatarUrl, user.fullName));
    }
  }, [user, navigate]);

  // Local preview on file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const form = new FormData();
      form.append("fullName", fullName);
      if (selectedFile) {
        form.append("avatar", selectedFile);
      }

      const res = await update(form);

      if (!res.ok) {
        const err = (await res.json()) as { message?: string };
        throw new Error(err.message ?? "Xəta baş verdi");
      }

      // await refetchUser();
      toast.success("Profil müvəffəqiyyətlə yeniləndi!");
      setSelectedFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xəta baş verdi");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm group"
          >
            <svg
              className="w-6 h-6 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Profil Bilgiləri
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar */}
              <div className="flex flex-col items-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-orange-500/10 bg-white">
                    <img
                      src={previewUrl}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  </div>

                  {/* Hover overlay */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
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
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  {/* Edit badge */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                      />
                    </svg>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="mt-5 text-center">
                  <p className="text-lg font-black text-gray-900">
                    {fullName || user.fullName}
                  </p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  {selectedFile && (
                    <p className="text-xs text-orange-500 font-semibold mt-1">
                      ✓ {selectedFile.name} seçildi
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WebP · Maks 2MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-5 py-2 rounded-xl border border-orange-200 text-orange-600 text-sm font-bold hover:bg-orange-50 transition-colors"
                >
                  Şəkil Seç
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 px-1 uppercase tracking-widest">
                  Ad və Soyad
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all bg-gray-50 text-gray-900 font-bold placeholder:text-gray-400"
                  placeholder="Məsələn: Orxan Məmmədov"
                  required
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-black text-gray-900 mb-3 px-1 uppercase tracking-widest">
                  Email (dəyişdirilmir)
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-lg"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                      <span>Yadda saxlanılır...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 group-hover:rotate-12 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Məlumatları Yenilə</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
