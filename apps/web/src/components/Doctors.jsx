"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { AppContext } from "@/src/context/AppContext";
import { Star, SlidersHorizontal, X } from "lucide-react";

const Doctors = () => {
  const { speciality } = useParams();
  const pathname = usePathname();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const router = useRouter();

  const { doctors } = useContext(AppContext);

  const specialities = [
    { key: "General physician", route: "/doctors/General physician" },
    { key: "Gynecologist", route: "/doctors/Gynecologist" },
    { key: "Dermatologist", route: "/doctors/Dermatologist" },
    { key: "pediatrician", route: "/doctors/Pediatrician" },
    { key: "Neurologist", route: "/doctors/Neurologist" },
    { key: "Gastroenterologist", route: "/doctors/Gastroenterologist" },
  ];

  const applyFilter = () => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const hospitalId = params.get("hospitalId");
    let filtered = doctors;

    if (hospitalId) {
      filtered = filtered.filter((doc) => doc.hospitalId === hospitalId);
    }

    if (speciality) {
      filtered = filtered.filter(
        (doc) => doc.speciality.toLowerCase() === speciality.toLowerCase()
      );
    }

    setFilterDoc(filtered);
  };

  useEffect(() => {
    applyFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, speciality, pathname]);

  const pickSpeciality = (specialityKey, route) => {
    setShowFilter(false);
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    const hospitalId = params.get("hospitalId");
    router.push(
      speciality === specialityKey
        ? hospitalId
          ? `/doctors?hospitalId=${hospitalId}`
          : "/doctors"
        : hospitalId
          ? `${route}?hospitalId=${hospitalId}`
          : route
    );
  };

  const specialityPill = (s) => (
    <p
      key={s.key}
      onClick={() => pickSpeciality(s.key, s.route)}
      className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border rounded transition-all cursor-pointer ${
        speciality === s.key ? "bg-primary-soft text-text-primary " : ""
      }`}
    >
      {s.key}
    </p>
  );

  return (
    <div>
      <p className="text-text-secondary">
        Browse through the doctors specialist.
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 rounded-full md:hidden flex items-center gap-2 text-sm transition-all ${showFilter ? "bg-primary text-white" : "bg-background-card border border-border shadow-sm"}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>

        {/* ---------- Desktop filter sidebar (unchanged) ---------- */}
        <div className="hidden sm:flex flex-col gap-4 text-sm text-text-secondary">
          {specialities.map((s) => specialityPill(s))}
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-auto gap-3 md:gap-4 gap-y-5 md:gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => router.push(`/appointment/${item._id}`)}
              key={index}
              className="border border-primary-soft bg-background-card rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-primary-soft w-full" src={item.image} alt="" />
              <div className="p-3 md:p-4">
                <div
                  className={`flex items-center gap-2 text-xs md:text-sm text-center ${item.available ? "text-green-600" : "text-text-secondary"} `}
                >
                  <span
                    className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-background-muted-hover"} rounded-full`}
                  ></span>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-text-primary text-sm md:text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-text-secondary text-xs md:text-sm truncate">
                  {item.speciality}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {item.ratingAverage
                      ? item.ratingAverage.toFixed(1)
                      : "0.0"}
                  </span>
                  <span className="text-xs text-text-secondary">
                    ({item.ratingCount || 0})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mobile filter bottom sheet ---------- */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${showFilter ? "" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowFilter(false)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-background-card rounded-t-3xl p-5 pb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold text-text-primary">
              Filter by Speciality
            </p>
            <button
              onClick={() => setShowFilter(false)}
              className="p-2 rounded-full bg-background-base touch-none-outline"
            >
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {specialities.map((s) => (
              <p
                key={s.key}
                onClick={() => pickSpeciality(s.key, s.route)}
                className={`text-xs px-3 py-2.5 rounded-full border text-center transition-all ${
                  speciality === s.key
                    ? "bg-primary text-white border-primary"
                    : "border-border text-text-secondary bg-background-card"
                }`}
              >
                {s.key}
              </p>
            ))}
          </div>
          <button
            onClick={() => setShowFilter(false)}
            className="w-full mt-6 bg-background-base border border-border rounded-xl py-3 text-sm font-medium text-text-secondary touch-none-outline"
          >
            Show {filterDoc.length} doctor{filterDoc.length === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Doctors;