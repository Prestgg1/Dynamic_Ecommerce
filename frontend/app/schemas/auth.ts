import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Düzgün email daxil edin"),
  password: z.string().min(1, "Şifrəni daxil edin"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Ad Soyad minimum 3 simvol olmalıdır"),
    email: z.email("Düzgün email daxil edin"),
    password: z.string().min(6, "Şifrə minimum 6 simvol olmalıdır"),
    confirmPassword: z.string(),
    agreed: z
      .boolean()
      .refine((val) => val === true, "Şərtləri qəbul etməlisiniz"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifrələr uyğun gəlmir",
    path: ["confirmPassword"],
  });
