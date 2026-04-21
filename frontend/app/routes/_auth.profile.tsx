import type { Route } from "./+types/_auth.profile";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as zod from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";

const BACKEND_URL = "http://localhost:4000";

const profileSchema = zod.object({
  fullName: zod
    .string()
    .min(3, "Ad və Soyad ən az 3 simvoldan ibarət olmalıdır"),
});

function resolveAvatar(avatarUrl: string | undefined, name: string) {
  if (!avatarUrl) {
    return `https://ui-avatars.com/api/?background=f97316&color=fff&name=${encodeURIComponent(name)}`;
  }
  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${BACKEND_URL}${avatarUrl}`;
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updateProfile } = trpc.useMutation(
    "patch",
    "/auth/profile",
  );
  const { refetch: refetchMe } = trpc.useQuery("get", "/auth/me", {
    enabled: false,
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setPreviewUrl(resolveAvatar(user.avatarUrl, user.fullName));
    }
  }, [user]);

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Şəkil ölçüsü 2MB-dan çox olmamalıdır");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (
    values: { fullName: string },
    { setSubmitting }: any,
  ) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      await updateProfile({ body: formData as any });

      const { data: newUser } = await refetchMe();
      if (newUser) {
        setUser(newUser as any);
      }

      toast.success("Profil müvəffəqiyyətlə yeniləndi!");
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err?.message || "Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a1428] text-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-[#13223f] hover:bg-white/5 border border-white/10 transition-all"
          >
            <svg
              className="w-6 h-6"
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
          <h1 className="text-4xl font-bold tracking-tighter">
            Profil Bilgiləri
          </h1>
        </div>

        <div className="bg-[#13223f] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-10 md:p-14">
            <Formik
              initialValues={{ fullName: user.fullName }}
              validationSchema={toFormikValidationSchema(profileSchema)}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-10">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl bg-[#0a1428]">
                        <img
                          src={previewUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Edit Overlay */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <div className="text-center">
                          <svg
                            className="w-9 h-9 text-white mx-auto mb-1"
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
                          <p className="text-xs text-white font-medium">
                            Şəkli dəyişdir
                          </p>
                        </div>
                      </button>

                      {/* Camera Icon Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-3 -right-3 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-2xl shadow-xl transition-all"
                      >
                        <svg
                          className="w-5 h-5"
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
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <div className="mt-6 text-center">
                      <p className="text-2xl font-bold text-white">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
                      {selectedFile && (
                        <p className="text-xs text-orange-400 font-medium mt-3 bg-orange-500/10 px-4 py-1.5 rounded-full inline-block">
                          ✓ {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest">
                        Ad və Soyad
                      </label>
                      <Field
                        name="fullName"
                        className="w-full bg-[#0a1428] border border-white/10 focus:border-orange-400 text-white px-6 py-4 rounded-2xl outline-none transition-all text-lg"
                        placeholder="Ad və Soyad"
                      />
                      <ErrorMessage
                        name="fullName"
                        component="p"
                        className="mt-2 text-red-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest">
                        Email (dəyişdirilmir)
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full bg-[#0a1428] border border-white/10 text-zinc-400 px-6 py-4 rounded-2xl cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-5 rounded-2xl text-lg transition-all active:scale-[0.98] shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Yadda saxlanılır...
                      </>
                    ) : (
                      <>
                        Məlumatları Yenilə
                        <svg
                          className="w-6 h-6"
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
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
}
