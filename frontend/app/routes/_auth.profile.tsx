import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as zod from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";
import type { Route } from "./+types/_auth.profile";
import { trpc } from "~/lib/trpc";
import { useAuthStore } from "~/store/auth.store";

const BACKEND_URL = "http://localhost:4000";

const profileSchema = zod.object({
  fullName: zod.string().min(3, "Ad və Soyad ən az 3 simvoldan ibarət olmalıdır"),
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
  
  const { mutateAsync: updateProfile } = trpc.useMutation("patch", "/auth/profile");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setStatus: (status: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Şəkil ölçüsü 2MB-dan çox olmamalıdır");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (values: { fullName: string }, { setSubmitting }: any) => {
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
    <main className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm group"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Profil Bilgiləri</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <Formik
              initialValues={{ fullName: user.fullName }}
              validationSchema={toFormikValidationSchema(profileSchema)}
              onSubmit={onSubmit}
            >
              {({ isSubmitting, setStatus }) => (
                <Form className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-orange-500/10 bg-white">
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Avatar" />
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-white transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                        </svg>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setStatus)}
                    />

                    <div className="mt-5 text-center">
                      <p className="text-xl font-black text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-400 font-medium">{user.email}</p>
                      {selectedFile && (
                        <p className="text-xs text-orange-600 font-bold mt-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                          ✓ {selectedFile.name} seçildi
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 px-1 uppercase tracking-[0.2em]">
                        Ad və Soyad
                      </label>
                      <Field
                        name="fullName"
                        className="w-full px-6 py-4 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all bg-gray-50 text-gray-900 font-bold placeholder:text-gray-300"
                        placeholder="Məsələn: Orxan Məmmədov"
                      />
                      <ErrorMessage name="fullName" component="p" className="mt-2 text-xs text-red-500 font-bold px-1" />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-3 px-1 uppercase tracking-[0.2em]">
                        Email (dəyişdirilmir)
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-6 py-4 border border-gray-50 rounded-2xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 hover:bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Yadda saxlanılır...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Məlumatları Yenilə</span>
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
}
