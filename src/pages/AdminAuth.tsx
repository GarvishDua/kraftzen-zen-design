import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/admin", { replace: true });
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message ?? "Check credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D7E2EA]/60" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md p-8 rounded-3xl border-2 border-[#D7E2EA]/20 bg-white/[0.02] space-y-5"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">Admin Login</h1>
          <p className="text-xs text-[#D7E2EA]/50 mt-1">Authorized personnel only</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-full px-4 py-3 text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]/40"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#D7E2EA]/50 mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-full px-4 py-3 text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]/40"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D7E2EA] text-[#0C0C0C] text-sm uppercase tracking-widest font-semibold disabled:opacity-60 hover:bg-white transition"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
          Sign in
        </button>
      </form>
    </main>
  );
}
