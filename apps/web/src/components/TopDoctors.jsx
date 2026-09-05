"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/src/context/AppContext";
import { Star } from "lucide-react";

const TopDoctors = () => {
  const router = useRouter();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-text-primary md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-2 md:grid-cols-auto gap-3 md:gap-4 pt-5 gap-y-6 px-1 md:px-0 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              router.push(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="border border-primary-soft bg-background-card rounded-xl md:rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
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
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-text-primary">
                  {item.ratingAverage ? item.ratingAverage.toFixed(1) : "0.0"}
                </span>
                <span className="text-xs text-text-secondary">
                  ({item.ratingCount || 0})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          router.push("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-primary-soft text-text-primary px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
    </div>
  );
};

export default TopDoctors;
