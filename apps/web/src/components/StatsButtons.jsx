"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "@/src/context/AppContext";
import { Users, UserCheck, Building2 } from "lucide-react";

const StatsButtons = () => {
  const { backendURL } = useContext(AppContext);
  const [stats, setStats] = useState({
    userCount: 0,
    doctorCount: 0,
    hospitalCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/api/user/stats`);
        if (data.success) {
          setStats(data);
        }
      } catch (error) {
        console.log("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [backendURL]);

  const stats_data = [
    { icon: Users, label: "Patients", count: stats.userCount },
    { icon: UserCheck, label: "Doctors", count: stats.doctorCount },
    { icon: Building2, label: "Hospitals", count: stats.hospitalCount },
  ];

  return (
    <div className="bg-white py-6 px-4 md:px-10">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
        {stats_data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 p-3 md:p-5 rounded-xl md:rounded-lg border border-primary-soft bg-gradient-to-r from-primary/5 to-transparent hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <item.icon size={20} className="text-primary md:size-8" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[11px] md:text-sm text-text-secondaryLight font-medium">
                {item.label}
              </p>
              <p className="text-xl md:text-3xl font-bold text-primary">
                {item.count.toLocaleString()}+
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsButtons;
