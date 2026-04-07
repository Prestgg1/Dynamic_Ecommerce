# DəmirMart Admin Panel: UI/UX Planı

## 1. Ümumi Analiz və Vibe (Layihə Konteksti)
Mövcud layihə vizual olaraq **"Premium E-commerce"** aurasına malikdir.
- **Əsas Rənglər:** Narıncı (`orange-500`, `orange-600`), Tünd Boz/Qara (`gray-900`, `gray-800`).
- **Fon vərdişləri:** Ağ kartlar, `gray-50` background.
- **Forma və strukturlar:** Yumşaq və böyük künclər (`rounded-2xl`, `rounded-3xl`), dərin və yumşaq kölgələr (`shadow-sm`, `shadow-xl`, `shadow-orange-500/30`).
- **Tioqrafiya:** Qalın (`font-black`, `font-bold`), açıq və asan oxunan böyük mətnlər.

Admin panel müştəri tərəfinin bu lüks aurasını saxlamalıdır, lakin eyni zamanda *zəngin data* və *cədvəllər* üçün daha kompakt və funksional olmalıdır.

## 2. Layout (Quruluş) Sistemi
Admin panel üçün **"Sidebar + Main Content"** layihələndirilməsi planlaşdırılır.

### Sidebar (Yan panel):
- **Stil:** Tünd mövzu (`bg-gray-900` və ya `bg-gray-950`). Bu, istifadəçini əsas iş zonasından (ağ) ayırmaq üçün idealdır.
- **Linklər (Naviqasiya):**
  - Dashboard (Əsas statistika)
  - Məhsullar (İdarəetmə, Əlavə/Sil)
  - Kateqoriyalar
  - Sifarişlər
  - İstifadəçilər
  - Ayarlar
- **Aktiv link stili:** `bg-orange-500 text-white shadow-lg shadow-orange-500/30`.

### Header (Üst panel):
- **Görünüş:** `bg-white`, şüşə effekti (glassmorphism: `backdrop-blur-md bg-white/80`), `border-b border-gray-100`.
- **Məzmun:** Səhifə başlığı (Məsələn: *Məhsullar / Yeni əlavə et*), Axtarış çubuğu, Bildiriş ikonu, Admin profili.

## 3. Komponent Qaydaları

### Kartlar və Statistika (Dashboard)
- `bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100`.
- Rəqəmlər böyük (`text-4xl font-black`), yanında böyümə/kiçilmə faizləri (Yaşıl və ya Qırmızı rəngli kiçik badgelər - `bg-green-100 text-green-700`).

### Cədvəllər (Tables)
- Cədvəllər əsas ağrı nöqtəsidir. Standart dar, sıxıcı cədvəllərdən qaçınmalıyıq.
- Hər sətir (row) bir az geniş olmalıdır (`py-4`).
- Şəkillər üçün kiçik thumbnail (`w-12 h-12 rounded-xl`).
- Status badgeləri: 
  - *Stokda:* `bg-green-100 text-green-700 px-3 py-1 font-bold text-xs uppercase tracking-widest rounded-lg`
  - *Bitib:* `bg-red-100 text-red-700 ...`

### Buttonlar (Düymələr)
- **Primary:** `bg-gray-900 hover:bg-orange-500 text-white rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all font-bold`.
- **Secondary:** `bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl`.
- **Destructive/Danger (Silmək üçün):** `bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl`.

### Formlar (Inputlar & Selectlər)
- Vebsaytda istifadə etdiyimiz böyük, rahat inputlar burada da qalacaq:
- `w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 text-gray-900 font-medium`.

## 4. UX Təcrübələri (Mikro-İnteraksiyalar)
1. **Toast Bildirişlər:** Əməliyyatların (Əlavə etmə, Yeniləmə, Silmə) nəticələri anında sağ-alt küncdə React Hot Toast vasitəsilə bildiriləcək.
2. **Skeleton Yüklənməsi:** Datası ağır olan cədvəllərdə loading spinner əvəzinə, skeleton səhifələr istifadə ediləcək ki, sistem sürətli hiss etdirsin.
3. **Modal/Drawer (Pop-up pəncərələr):** Məlumat silinərkən *Confirmation Modal*, kiçik editlər edilərkən isə sağdan açılan *Drawer* istifadə olunacaq ki, admin cədvəl səhifəsindən uzaqlaşmasın.

## 5. Yol Xəritəsi (Roadmap)
- [ ] Admin Layihə Strukturunun Qurulması (Sidebar + Header + Layout).
- [ ] Dashboard Səhifəsi (Statistik rəqəmlər).
- [ ] Məhsullar Bölməsi (Cədvəl interfeysi, Listələmə).
- [ ] Məhsul Yarat / Redaktə Forması (Şəkil upload dəstəyi ilə).
- [ ] Sifarişlərin izlənilməsi interfeysi.
