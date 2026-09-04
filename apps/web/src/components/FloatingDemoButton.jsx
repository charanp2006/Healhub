"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import DemoContent from "./DemoContent";

const FloatingDemoButton = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowDemo(!showDemo)}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition-all duration-300 z-40 flex items-center justify-center hover:scale-110 motion-safe:animate-bounce"
        title="View Platform Demo"
      >
        <HelpCircle size={24} />
      </button>

      {/* Modal Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 overflow-y-auto transition-opacity duration-300 ${showDemo ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div
          className={`flex items-center justify-center min-h-screen p-4 transition-transform duration-300 ${showDemo ? "translate-y-0" : "translate-y-4"}`}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowDemo(false)}
              className="sticky top-4 right-4 float-right z-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="p-8 md:p-12">
              <DemoContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingDemoButton;
