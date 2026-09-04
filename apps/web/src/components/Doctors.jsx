"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { AppContext } from "@/src/context/AppContext";
import { Star } from "lucide-react";

const Doctors = () => {
  const { speciality } = useParams();
  const pathname = usePathname();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const router = useRouter();

  const { doctors } = useContext(AppContext);

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
  }, [doctors, speciality, pathname]);

  return (
    <div>
      <p className="text-text-secondaryLight">
        Browse through the doctors specialist.
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-text-secondaryLight ${showFilter ? "flex" : "hidden sm:flex"} `}
        >
          <p
            onClick={() =>
              speciality === "General physician"
                ? router.push("/doctors")
                : router.push("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border-light rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-primary-soft text-black " : ""}`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? router.push("/doctors")
                : router.push("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border-light rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-primary-soft text-black " : ""}`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? router.push("/doctors")
                : router.push("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border-light rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-primary-soft text-black " : ""}`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "pediatrician"
                ? router.push("/doctors")
                : router.push("/doctors/Pediatrician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border-light rounded transition-all cursor-pointer ${speciality === "pediatrician" ? "bg-primary-soft text-black " : ""}`}
          >
            Pediatrician
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? router.push("/doctors")
                : router.push("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border-light rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-primary-soft text-black " : ""}`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? router.push("/doctors")
                : router.push("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-border-light rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-primary-soft text-black " : ""}`}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => router.push(`/appointment/${item._id}`)}
              key={index}
              className="border border-primary-soft rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-primary-soft" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-600" : "text-gray-500"} `}
                >
                  <span
                    className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-gray-400"} rounded-full`}
                  ></span>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-text-primaryLight text-lg font-medium">
                  {item.name}
                </p>
                <p className="text-text-secondaryLight text-sm">
                  {item.speciality}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.ratingAverage
                      ? item.ratingAverage.toFixed(1)
                      : "0.0"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({item.ratingCount || 0})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
