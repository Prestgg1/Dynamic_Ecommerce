import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl, fetchContactMessages } from "~/lib/site-settings";

type Message = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetchContactMessages()
      .then((items) => setMessages(items))
      .catch(() => toast.error("Messages yüklənmədi"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: number) => {
    const res = await fetch(apiUrl(`/contact-messages/admin/${id}/read`), {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Marked as read");
    load();
  };

  const remove = async (id: number) => {
    const res = await fetch(apiUrl(`/contact-messages/admin/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Yüklənir...</div>;
  }

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">Contact Messages</h2>
        <p className="text-sm text-gray-500">İstifadəçi mesajları burada görünür.</p>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <article key={message.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{message.fullName}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${message.status === "NEW" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                    {message.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{message.email} {message.phone ? `· ${message.phone}` : ""}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{message.message}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => markRead(message.id)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600"
                >
                  Read
                </button>
                <button
                  onClick={() => remove(message.id)}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}

        {!messages.length && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            No contact messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
