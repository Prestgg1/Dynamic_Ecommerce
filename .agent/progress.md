# DəmirMart — Progress Tracker (Yenilənmiş)

**Son yeniləmə:** 2026-04-05  
**Qalan vaxt:** 6 gün  
**Stack:** NestJS + MySQL + TypeORM + React Router (Vite) + Cookie Session

---

## 📊 Ümumi Vəziyyət

| Sahə                               | Status     | Qeyd                                             |
| ---------------------------------- | ---------- | ------------------------------------------------ |
| ✅ Backend core (NestJS + TypeORM) | Tamamlandı | Swagger (OpenAPI) qurulub                        |
| ✅ Cookie-based session auth       | Tamamlandı | Backend tərəf hazırdır                           |
| ✅ Frontend core (React Router v7) | Tamamlandı | OpenAPI client inteqrasiyası (`trpc.ts`) qurulub |
| ✅ Frontend UI Miqrasiyası         | Tamamlandı | Ana səhifə, Auth və Axtarış köçürülüb            |
| ✅ Backend İnteqrasiyası           | Tamamlandı | Auth, Category və Product inteqrasiya olunub     |
| ✅ Məhsul & Kateqoriya datası      | Tamamlandı | Seed və API inteqrasiyası hazırdır               |
| ✅ İstifadəçi Profili              | Tamamlandı | `AuthContext`, `/me` və `/profile` hazırdır      |

---

## 🏗️ Səhifələrin Statusu (Frontend)

| Səhifə                         | Dizayn (Old) | React Router | Backend İnteqrasiyası | Status   |
| ------------------------------ | ------------ | ------------ | --------------------- | -------- |
| Ana səhifə (`/`)               | ✅           | ✅           | ✅                    | Hazırdır |
| Login (`/auth/login`)          | ✅           | ✅           | ✅                    | Hazırdır |
| Register (`/auth/register`)    | ✅           | ✅           | ✅                    | Hazırdır |
| Axtarış / Catalog              | ✅           | ✅           | ✅                    | Hazırdır |
| Profil (`/profile`)            | ✅           | ✅           | ✅                    | Hazırdır |
| Haqqımızda (`/about`)          | ✅           | ✅           | —                     | Hazırdır |
| Xidmətlər (`/services`)        | —            | ✅           | —                     | Hazırdır |
| Əlaqə (`/contact`)             | —            | ✅           | —                     | Hazırdır |
| Məhsul detal (`/products/:id`) | ✅           | ✅           | ✅                    | Hazırdır |
| Wishlist (`/wishlist`)         | ✅           | ✅           | ✅                    | Hazırdır |
| Admin Panel                    | ❌           | ⏳           | ❌                    | Gün 11   |

---

## ✅ Tamamlanmış İşlər (Gündəlik)

### GÜN 1-2 — Backend Core & Auth

- [x] NestJS layihəsi və TypeORM (MySQL) qurulması.
- [x] Swagger (OpenAPI) inteqrasiyası.
- [x] `cookie-parser` və `express-session` konfiqurasiyası.
- [x] Auth Controller & Service (Register, Login, Logout, Me).

### GÜN 5-6 — Frontend Step-up & Auth Integration

- [x] React Router v7 qurulması.
- [x] `openapi-fetch` və `openapi-react-query` inteqrasiyası.
- [x] Login və Register səhifələrinin `oldprojectdesigns`-dan miqrasiyası.
- [x] Auth API bağlantısı (Frontend → Backend).

### GÜN 7-8 — Ana Səhifə & Məhsul API & Search

- [x] Axtarış səhifəsinin `oldprojectdesigns`-dan miqrasiyası və RRv7-yə uyğunlaşdırılması.
- [x] Backend-də **Category** və **Product** modullarının yaradılması (Entity, Service, Controller).
- [x] Database seeder (`db:seed`) skriptinin hazırlanması və 12 real məhsulun əlavə edilməsi.
- [x] Frontend-də Ana səhifə və Axtarış səhifəsinin backend API-a bağlanması.

### GÜN 8-9 — Profil İdarəetməsi & Auth Context

- [x] Frontend-də **AuthContext** yaradılması və `/auth/me` ilə persistent auth state.
- [x] Header-in yenilənməsi: İstifadəçi adı və avatarı (login halında).
- [x] Header naviqasiya yollarının düzəldilməsi (`/auth/login`, `/auth/register` və s.).
- [x] Backend-də `/auth/profile` (PATCH) endpoint-inin və `UpdateProfileDto`-nun əlavə olunması.
- [x] **Profil** səhifəsinin miqrasiyası və backend inteqrasiyası.
- [x] OpenAPI tiplərinin yenidən sinxronizasiyası (`200 OK` statusları əlavə olundu).

### GÜN 9 — Auth UX & Avatar Upload

- [x] Login və Register səhifələrindən uğurlu girişdə `refetchUser()` çağırılması — header anında yenilənir.
- [x] `PATCH /auth/profile` endpoint-i **multipart/form-data** dəstəyinə keçirildi — `fullName` + `avatar` faylı eyni endpointdən qəbul olunur.
- [x] Yüklənən avatar faylları backend-in `uploads/` qovluğuna saxlanılır.
- [x] `ServeStaticModule` vasitəsilə fayllar `/uploads/...` URL-dən xidmət göstərir.
- [x] **Profil** səhifəsi yenidən yazıldı — şəkil seçdikdə local preview göstərilir, saxla düyməsinə basanda FormData ilə backend-ə göndərilir.
- [x] Header-in avatar render məntiqi yeniləndi: lokal path-lər (`/uploads/...`) tam backend URL-ə çevrilir.
- [x] `AuthContext`-in `staleTime` 0-a endirildi və `throwOnError: false` əlavə edildi — 401 xətası context-i çökdürmür.

---

## ⏳ Növbəti Addımlar

### GÜN 9 — Bug fixing & Məhsul Detal & Səbət

- [ ] Logout Anlıq Çıxmır.
- [ ] Axtarış Backend tərəfindən gəlməli və frontend tərəfdə Debounce hookundan istifadə edərək hazırlamalısan.
- [ ] like effekti anlıq olmalıdır.
- [ ] Header və Footerdə Tərcümə hissəsində boşluq var.
- [ ] Məhsul detal səhifəsinin miqrasiyası və API bağlantısı.
- [ ] Səbət (Cart) məntiqinin qurulması (Local state və ya Backend).

### GÜN 10 — İstək Siyahısı (Wishlist)

- [x] Backend-də `Wishlist` API (GET `wishlist`, POST `wishlist/:id`, DELETE `wishlist/:id`) yaradıldı.
- [x] Frontend-də `useDebounce` hook-u yaradıldı (API istəklərini gecikdirmək/throttling üçün).
- [x] Wishlist səhifəsinin köhnə dizayndan tam miqrasiyası edildi və trpc ilə backende bağlandı.
- [x] Köhnə wishlist papkası (`/oldprojectdesigns/app/wishlist`) silindi.

---

## 🚨 Blokelar & Qeydlər

- **API Sync**: Backend-də API dəyişdikdə `npm run openapi` (frontend-də) mütləq işlədilməlidir.
- **Dizayn**: Bütün yeni səhifələr premium dizayn standartlarına (orange/gray/white palitrası) uyğunlaşdırılır.
