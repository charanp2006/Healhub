// @ts-nocheck
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPin, LocateFixed, Search, SlidersHorizontal, X } from "lucide-react";
import { AppContext } from "@/src/context/AppContext";
import { assets, specialityData } from "@/src/assets/assets";
import { Skeleton } from "@healhub/ui";

const Hospitals = () => {
  const router = useRouter();
  const { backendURL } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Use current location");

  const [filters, setFilters] = useState({
    name: "",
    city: "",
    speciality: "",
    lat: "",
    lng: "",
    radius: "",
    sort: "rating",
  });

  const fetchHospitals = async (pageNumber = 1, overrideFilters = null) => {
    setLoading(true);
    try {
      const activeFilters = overrideFilters || filters;
      const params = new URLSearchParams();
      params.set("page", pageNumber.toString());
      params.set("limit", pagination.limit.toString());
      if (activeFilters.name) params.set("name", activeFilters.name);
      if (activeFilters.city) params.set("city", activeFilters.city);
      if (activeFilters.speciality)
        params.set("speciality", activeFilters.speciality);
      if (activeFilters.lat) params.set("lat", activeFilters.lat);
      if (activeFilters.lng) params.set("lng", activeFilters.lng);
      if (activeFilters.radius) params.set("radius", activeFilters.radius);
      if (activeFilters.sort) params.set("sort", activeFilters.sort);

      const { data } = await axios.get(
        `${backendURL}/api/hospital/list?${params.toString()}`
      );

      if (data.success) {
        setHospitals(data.hospitals);
        setPagination(data.pagination);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    fetchHospitals(1);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device");
      return;
    }

    setLocationStatus("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const nextFilters = { ...filters, lat, lng };
        setFilters(nextFilters);
        setLocationStatus("Using current location");
        fetchHospitals(1, nextFilters);
      },
      () => {
        setLocationStatus("Location access denied");
        toast.error("Please allow location access to use this feature");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const hasNextPage = pagination.page * pagination.limit < pagination.total;
  const hasPrevPage = pagination.page > 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Hospitals & Clinics
          </h1>
          <p className="text-text-secondary">
            Found {pagination.total} hospital/clinic
            {pagination.total === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() => setShowFilter(true)}
          className="lg:hidden flex items-center gap-2 bg-background-card border border-border rounded-full px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm touch-none-outline"
        >
          <SlidersHorizontal size={16} className="text-primary" />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <div
            className={`${showFilter ? "fixed inset-0 z-50" : "hidden"} lg:static lg:block`}
          >
            <div
              onClick={() => setShowFilter(false)}
              className={`absolute inset-0 bg-black/40 lg:hidden ${showFilter ? "" : "hidden"}`}
            />
            <div className="relative bg-background-card lg:bg-background-card border lg:border-border lg:rounded-lg rounded-t-3xl p-5 pb-8 lg:pb-5 max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-2 rounded-full bg-background-base lg:hidden text-text-secondary touch-none-outline"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Hospital/Clinic name
                </label>
                <div className="flex items-center gap-2 border border-border rounded px-3 py-2">
                  <Search className="h-4 w-4 text-text-secondary" />
                  <input
                    className="w-full outline-none text-sm text-text-secondary"
                    type="text"
                    placeholder="Search by name"
                    value={filters.name}
                    onChange={(e) =>
                      handleFilterChange("name", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  City
                </label>
                <input
                  className="w-full border border-border rounded px-3 py-2 text-sm"
                  type="text"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) =>
                    handleFilterChange("city", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Specialty
                </label>
                <select
                  className="w-full border border-border rounded px-3 py-2 text-sm"
                  value={filters.speciality}
                  onChange={(e) =>
                    handleFilterChange("speciality", e.target.value)
                  }
                >
                  <option value="">All Specialties</option>
                  {specialityData.map((item) => (
                    <option key={item.speciality} value={item.speciality}>
                      {item.speciality}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Radius (km)
                </label>
                <input
                  className="w-full border border-border rounded px-3 py-2 text-sm"
                  type="number"
                  placeholder="10"
                  value={filters.radius}
                  onChange={(e) =>
                    handleFilterChange("radius", e.target.value)
                  }
                />
              </div>

              <button
                onClick={requestLocation}
                className="w-full flex items-center justify-center gap-2 border border-border rounded px-4 py-2 text-sm text-text-secondary"
              >
                <LocateFixed className="h-4 w-4" />
                {locationStatus}
              </button>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Sort by
                </label>
                <select
                  className="w-full border border-border rounded px-3 py-2 text-sm"
                  value={filters.sort}
                  onChange={(e) =>
                    handleFilterChange("sort", e.target.value)
                  }
                >
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-primary text-white rounded px-4 py-2 text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
          </div>
        </div>

        <div className="lg:w-3/4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-background-card lg:bg-background-card border border-border lg:border-border rounded-2xl lg:rounded-lg p-4 lg:p-5 flex flex-col md:flex-row gap-4"
                >
                  <Skeleton className="w-full md:w-40 h-44 md:h-40 rounded-xl lg:rounded-lg" />
                  <div className="flex-1 space-y-3 pt-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : hospitals.length === 0 ? (
            <div className="bg-background-card border border-border rounded-lg p-10 text-center">
              <p className="text-text-secondary">
                No hospitals/clinics found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((item) => (
                <div
                  onClick={() => router.push(`/hospital/${item._id}`)}
                  key={item._id}
                  className="bg-background-card lg:bg-background-card border border-border lg:border-border rounded-2xl lg:rounded-lg p-4 lg:p-5 cursor-pointer hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      className="w-full md:w-40 h-44 md:h-40 object-cover rounded-xl lg:rounded-lg bg-primary-soft"
                      src={item.image || assets.header_img.src}
                      alt=""
                    />
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <p className="text-text-primary text-lg md:text-xl font-semibold">
                            {item.name}
                          </p>
                          <p className="text-text-secondary text-sm">
                            {item.city}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-sm ${item.isRegistered ? "text-green-600" : "text-text-secondary"}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${item.isRegistered ? "bg-green-500" : "bg-background-muted-hover"}`}
                          ></span>
                          <p>
                            {item.isRegistered
                              ? "Registered"
                              : "Not Registered"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.city}</span>
                        </div>
                        {item.distanceKm !== undefined && (
                          <span className="text-accent-cta font-medium">
                            {item.distanceKm} km away
                          </span>
                        )}
                      </div>

                      <p className="text-text-secondary text-sm mt-3">
                        {item.specialties?.length
                          ? item.specialties.slice(0, 3).join(", ")
                          : "Specialties not listed"}
                      </p>

                      <p className="text-text-secondary text-sm mt-2">
                        Beds available: {item.availableBeds}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              className="border border-border rounded px-4 py-2 text-sm text-text-secondary disabled:opacity-50"
              onClick={() => fetchHospitals(pagination.page - 1)}
              disabled={!hasPrevPage}
            >
              Previous
            </button>
            <p className="text-text-secondary text-sm">
              Page {pagination.page} of{" "}
              {Math.max(Math.ceil(pagination.total / pagination.limit), 1)}
            </p>
            <button
              className="border border-border rounded px-4 py-2 text-sm text-text-secondary disabled:opacity-50"
              onClick={() => fetchHospitals(pagination.page + 1)}
              disabled={!hasNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
