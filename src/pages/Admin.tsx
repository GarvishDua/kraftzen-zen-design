import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, RefreshCw, Check, X, Calendar as CalIcon } from "lucide-react";
import { formatDateLong, generateSlots } from "@/lib/booking";

type Status = "scheduled" | "completed" | "cancelled";

interface Appt {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  notes: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: Status;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [appts, setAppts] = useState<Appt[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");

  const slotLabels = new Map(generateSlots().map((s) => [s.start, s.label]));

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
      return;
    }
    setAppts((data ?? []) as Appt[]);
  }, [toast]);

  useEffect(() => {
    (async () => {
      const { data: sessionRes } = await supabase.auth.getSession();
      if (!sessionRes.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: hasAdmin, error } = await supabase.rpc("has_role", {
        _user_id: sessionRes.session.user.id,
        _role: "admin",
      });
      if (error || !hasAdmin) {
        toast({ title: "Not authorized", description: "Your account isn't an admin.", variant: "destructive" });
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
        return;
      }
      setIsAdmin(true);
      await load();
      setLoading(false);
    })();
  }, [navigate, toast, load]);

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (loading || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D7E2EA]/60" />
      </main>
    );
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const visible = appts.filter((a) =>
    filter === "all" ? true : a.date >= todayISO && a.status === "scheduled"
  );

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] px-4 sm:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Bookings</h1>
            <p className="text-xs text-[#D7E2EA]/50 mt-1">Manage Kraftzen consultation requests</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/[0.05] transition"
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs uppercase tracking-widest hover:bg-white/[0.05] transition"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </header>

        <div className="flex gap-2 mb-6">
          {(["upcoming", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition ${
                filter === f
                  ? "bg-[#D7E2EA] text-[#0C0C0C] border-[#D7E2EA]"
                  : "border-white/15 text-[#D7E2EA]/70 hover:bg-white/[0.05]"
              }`}
            >
              {f === "upcoming" ? "Upcoming" : "All"}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-[#D7E2EA]/50">{visible.length} shown</span>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center">
            <CalIcon size={32} className="mx-auto text-[#D7E2EA]/40 mb-4" />
            <p className="text-sm text-[#D7E2EA]/60">No bookings to show.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-widest text-[#D7E2EA]/50">
                  <tr>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Time</th>
                    <th className="text-left px-4 py-3">Service</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">Notes</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((a) => {
                    const startKey = a.start_time.slice(0, 5);
                    return (
                      <tr key={a.id} className="border-t border-white/5 align-top">
                        <td className="px-4 py-3 whitespace-nowrap">{formatDateLong(a.date)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{slotLabels.get(startKey) ?? startKey}</td>
                        <td className="px-4 py-3">{a.service}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{a.name}</td>
                        <td className="px-4 py-3 text-xs">
                          <div>{a.email}</div>
                          {a.phone && <div className="text-[#D7E2EA]/50">{a.phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#D7E2EA]/70 max-w-[240px]">
                          {a.notes ? <span className="line-clamp-3 whitespace-pre-wrap">{a.notes}</span> : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateStatus(a.id, "completed")}
                              disabled={a.status === "completed"}
                              title="Mark completed"
                              className="p-2 rounded-full border border-white/10 hover:bg-white/[0.05] disabled:opacity-30"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => updateStatus(a.id, "cancelled")}
                              disabled={a.status === "cancelled"}
                              title="Cancel"
                              className="p-2 rounded-full border border-white/10 hover:bg-white/[0.05] disabled:opacity-30"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cls =
    status === "completed"
      ? "bg-emerald-400/15 text-emerald-300 border-emerald-400/30"
      : status === "cancelled"
      ? "bg-red-400/15 text-red-300 border-red-400/30"
      : "bg-[#D7E2EA]/10 text-[#D7E2EA] border-[#D7E2EA]/30";
  return (
    <span className={`inline-block px-2 py-1 rounded-full border text-[10px] uppercase tracking-widest ${cls}`}>
      {status}
    </span>
  );
}
