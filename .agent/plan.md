# DəmirMart — Yenilənmiş Backend + Fullstack Plan

**Backend Stack:** NestJS + MySQL + TypeORM  
**Frontend Stack:** React Router v7 (Vite) + Tailwind CSS  
**API Connection:** OpenAPI-TypeScript (openapi-fetch + openapi-react-query)
**Auth:** Cookie-based Session (HttpOnly Cookie, server-side session)  
**UI Foundation:** Migrated components from `frontend/oldprojectdesigns`

---

## 1. Yeni Arxitektura

| Yeni Plan                             |
| ------------------------------------- |
| NestJS REST API + Swagger (OpenAPI)   |
| TypeORM (MySQL)                       |
| Cookie-based Session                  |
| React Router v7 (Frontend)            |
| OpenAPI-TypeScript for type-safe API  |

---

## 2. API Strukturu (REST)

### 2.1 Auth (`/auth`)

- `POST /auth/register` → User qeydiyyatı
- `POST /auth/login` → Giriş (cookie set edilir)
- `POST /auth/logout` → Çıxış (cookie silinir)
- `GET /auth/me` → Mövcud istifadəçi məlumatları

### 2.2 Products (`/products`)

- `GET /products` → Məhsulların siyahısı (filter, sort, pagination)
- `GET /products/:id` → Məhsul detalı
- `GET /products/featured` → Seçilmiş məhsullar
- `GET /products/best-sellers` → Ən çox satılanlar
- `GET /products/new-arrivals` → Yeni gələnlər
- `POST /products` (Admin)
- `PATCH /products/:id` (Admin)
- `DELETE /products/:id` (Admin)

### 2.3 Digər Router-lər
- **Categories**, **Reviews**, **Wishlist**, **Orders**, **Users**, **Admin Stats**.

---

## 3. Cookie-based Session Mexanizması

### Necə işləyir:

1. **Giriş**: `POST /auth/login` çağırılır. Server session yaradır və HttpOnly cookie göndərir.
2. **Sorğular**: Frontend hər sorğuda `withCredentials: include` (və ya `credentials: "include"`) istifadə edir.
3. **Avtorizasiya**: NestJS `cookie-parser` və session middleware vasitəsilə `req.session.userId` oxuyur.

---

## 4. Frontend — React Router + OpenAPI

### API Bağlantısı (`frontend/app/lib/trpc.ts`):
Faylın adı `trpc.ts` olsa da, daxilində `openapi-fetch` və `openapi-react-query` istifadə edilir. Bu, backend-dən gələn tiplərin (OpenAPI schema) frontend-də tam təhlükəsiz istifadəsini təmin edir.

### UI Miqrasiyası:
Köhnə layihə dizaynları `frontend/oldprojectdesigns` qovluğundan addım-addım `frontend/app` qovluğuna köçürülür. Köçürülən komponentlər React Router v7 standartlarına uyğunlaşdırılır.

---

## 5. 13 Günlük Zaman Cədvəli

| Günlər | Məqsəd                                                              |
| ------ | ------------------------------------------------------------------- |
| Gün 1  | NestJS + TypeORM (MySQL) qurulması, Swagger (OpenAPI) setup         |
| Gün 2  | Auth sistemi (register/login/logout/me), Session middleware         |
| Gün 3  | Products & Categories backend (TypeORM entities + Controllers)       |
| Gün 4  | Seed data (12 məhsul + 7 kateqoriya)                                |
| Gün 5  | Frontend React Router qurulması, OpenAPI client inteqrasiyası       |
| Gün 6  | **Auth inteqrasiyası (Login/Register səhifələri hazırdır)**         |
| Gün 7  | Ana səhifə dizaynının köçürülməsi + Backend inteqrasiyası           |
| Gün 8  | Məhsul detalı və Catalog səhifələri (migration from old designs)    |
| Gün 9  | Wishlist & Cart inteqrasiyası (server-side sync)                    |
| Gün 10 | Orders flow (Checkout → My Orders)                                  |
| Gün 11 | Admin panel (Dashboard stats, Product/Order management)             |
| Gün 12 | Final UI adjustment, Responsive design, Error handling              |
| Gün 13 | Final testing, Bug fixes, Documentation, Deployment                 |
