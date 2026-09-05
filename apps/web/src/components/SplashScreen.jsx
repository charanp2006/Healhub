"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BRAND_LOGO, LOGO_ALT } from "@healhub/ui/images";

const SPLASH_KEY = "healhub_splash_shown";
const MOBILE_BREAKPOINT = 768;

const SplashScreen = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const seen = window.localStorage.getItem(SPLASH_KEY);
    if (isMobile && !seen) {
      window.localStorage.setItem(SPLASH_KEY, "1");
      setVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    document.body.style.overflow = "";
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#f0fdfa] to-[#ccfbf1] px-8">
      <img
        src={BRAND_LOGO}
        alt={LOGO_ALT}
        className="w-72 h-30 object-contain animate-[splash-pop_0.8s_ease-out_both]"
      />
      <h1 className="mt-8 text-2xl font-semibold text-text-primary animate-[splash-fade-up_0.7s_ease-out_0.3s_both]">
        Welcome to Healhub
      </h1>
      <p className="mt-2 text-sm text-center text-text-secondary animate-[splash-fade-up_0.7s_ease-out_0.45s_both]">
        Your health, one tap away. Book appointments with trusted doctors and
        hospitals.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-8 flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-transform active:scale-95 animate-[splash-fade-up_0.7s_ease-out_0.6s_both]"
      >
        Get Started
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default SplashScreen;