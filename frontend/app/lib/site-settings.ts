export type HeroSlide = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export type SiteSettings = {
  id: number;
  key: string;
  data: {
    brandName?: string;
    logoText?: string;
    logoSlogan?: string;
    bannerText?: string;
    whatsappNumber?: string;
    displayPhone?: string;
    email?: string;
    address?: string;
    workingHours?: string;
    socialLinks?: {
      instagram?: string;
      tiktok?: string;
      whatsapp?: string;
    };
    contactMapUrl?: string;
    contactMapLink?: string;
    footerPreparedBy?: string;
    home?: {
      heroEstablished?: string;
      heroSlides?: HeroSlide[];
      heroStats?: { value: string; label: string }[];
      capabilitiesTitle?: string;
      capabilities?: {
        title: string;
        desc: string;
        image?: string;
        stat?: string;
      }[];
      productsTitle?: string;
      products?: { title: string; desc: string; image: string }[];
      aboutTitle?: string;
      aboutDescription?: string;
      aboutImage?: string;
      aboutHighlights?: string[];
      contactTitle?: string;
      contactSubtitle?: string;
      contactBackgroundImage?: string;
      contactButtonLabel?: string;
    };
  };
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export function apiUrl(path: string) {
  return `${BASE_URL}${path}`;
}

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return apiUrl(path.startsWith("/") ? path : `/${path}`);
}

export async function uploadImage(file: File, path = "/uploads/product") {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(apiUrl(path), {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Image upload failed: ${response.status}`);
  }

  return response.json() as Promise<{ url: string }>;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const response = await fetch(apiUrl("/site-settings"), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to load site settings: ${response.status}`);
  }

  return response.json();
}

export async function saveSiteSettings(
  data: Partial<SiteSettings["data"]>,
): Promise<SiteSettings> {
  const response = await fetch(apiUrl("/site-settings"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to save site settings: ${response.status}`);
  }

  return response.json();
}

export async function createContactMessage(input: {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const response = await fetch(apiUrl("/contact-messages"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact message: ${response.status}`);
  }

  return response.json();
}

export async function fetchContactMessages() {
  const response = await fetch(apiUrl("/contact-messages/admin"), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to load contact messages: ${response.status}`);
  }

  return response.json();
}
