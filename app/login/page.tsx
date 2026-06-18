"use client";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Détection bot
    if (website) {
      console.log("Bot détecté");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifiant,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Connexion réussie");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else {
        toast.error(data.message || "Erreur de connexion");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-stone-950 to-stone-700 px-4">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-[140px] h-[140px] sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64 mb-4">
              <Image
                src="/images/logo_transparent.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 140px, (max-width: 768px) 96px, (max-width: 1024px) 128px, (max-width: 1280px) 192px, 256px"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="website">Laisser ce champ vide</label>

              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {/* Identifiant */}
            <div>
              {/* <label className="block text-sm font-medium text-slate-300 mb-2">
                Identifiant
              </label> */}

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  placeholder="Votre identifiant"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  required
                  className="
                    w-full
                    bg-slate-900/70
                    border border-slate-700
                    rounded-xl
                    py-3
                    pl-12
                    pr-4
                    text-white
                    placeholder:text-slate-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-500
                    focus:border-cyan-500
                    transition-all
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              {/* <label className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label> */}

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
        w-full
        bg-slate-900/70
        border border-slate-700
        rounded-xl
        py-3
        pl-12
        pr-12
        text-white
        placeholder:text-slate-500
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500
        focus:border-cyan-500
        transition-all
      "
                />

                {/* Eye button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition"
                >
                  {!showPassword ? (
                    <FaEyeSlash
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition cursor-pointer"
                    />
                  ) : (
                    <FaEye
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition cursor-pointer"
                    />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="
                w-full
                py-3
                rounded-xl
                bg-cyan-500
                hover:bg-cyan-400
                text-slate-950
                font-bold
                transition-all
                duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
                shadow-lg
                shadow-cyan-500/20
              "
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
