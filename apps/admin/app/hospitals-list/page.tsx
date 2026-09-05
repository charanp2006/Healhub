// @ts-nocheck
"use client";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/src/context/AdminContext";
import { Search, SlidersHorizontal, MapPin, BedDouble, Star, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SkeletonCount, SkeletonCards } from "@healhub/ui";

const specialties = ["General Physician","Gynecologist","Dermatologist","Pediatrician","Neurologist","Gastroenterologist"];

const HospitalsList = () => {
  const { backendURL, aToken } = useContext(AdminContext);
  const [hospitals, setHospitals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const LIMIT = 12;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const fetchHospitals = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pageNum);
      params.set("limit", LIMIT);
      params.set("sort", sortBy);
      if (filterName.trim()) params.set("name", filterName.trim());
      if (filterCity.trim()) params.set("city", filterCity.trim());
      if (filterSpeciality) params.set("speciality", filterSpeciality);
      const { data } = await axios.get(`${backendURL}/api/admin/all-hospitals?${params.toString()}`, { headers: { aToken } });
      if (data.success) {
        setHospitals(data.hospitals || []);
        setTotalCount(data.pagination?.total || 0);
        setPage(data.pagination?.page || 1);
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
    if (aToken) fetchHospitals(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aToken, sortBy]);

  const handleSearch = (e) => { e?.preventDefault(); fetchHospitals(1); };

  const clearFilters = () => {
    setFilterName(""); setFilterCity(""); setFilterSpeciality(""); setSortBy("latest");
    setTimeout(() => fetchHospitals(1), 0);
  };

  return (
    <div className="m-5 w-full max-w-6xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">All Hospitals</h1>
        <button onClick={() => setShowFilters((v) => !v)} className="flex items-center gap-2 text-sm text-text-secondary border border-border px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary-soft transition-colors">
          <SlidersHorizontal size={14} />
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>
      {showFilters && (
        <form onSubmit={handleSearch} className="bg-background-card border border-border rounded-lg p-5 mb-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">Name</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Hospital name" className="w-full border border-border rounded px-3 py-2 pl-8 text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">City</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input value={filterCity} onChange={(e) => setFilterCity(e.target.value)} placeholder="City" className="w-full border border-border rounded px-3 py-2 pl-8 text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">Speciality</label>
              <div className="relative">
                <select value={filterSpeciality} onChange={(e) => setFilterSpeciality(e.target.value)} className="w-full border border-border rounded px-3 py-2 pr-8 appearance-none text-sm bg-background-card">
                  <option value="">All specialities</option>
                  {specialties.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">Sort by</label>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-border rounded px-3 py-2 pr-8 appearance-none text-sm bg-background-card">
                  <option value="latest">Latest added</option>
                  <option value="rating">Highest rating</option>
                  <option value="availability">Most beds available</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary text-white text-sm px-6 py-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors">Apply</button>
            <button type="button" onClick={clearFilters} className="text-sm px-6 py-2 border border-border rounded-full cursor-pointer hover:bg-primary-soft transition-colors">Clear</button>
          </div>
        </form>
      )}
      <p className="text-sm text-text-secondary mb-4">
        {loading ? <SkeletonCount /> : `${totalCount} hospital${totalCount !== 1 ? "s" : ""} found`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <SkeletonCards count={6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" />
        ) : hospitals.map((h) => (
          <div key={h._id} className="border border-border rounded-xl overflow-hidden bg-background-card hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-40 bg-primary-soft overflow-hidden">
              {h.image ? (
                <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/40"><BedDouble size={48} /></div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${h.isRegistered ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${h.isRegistered ? "bg-green-500" : "bg-red-400"}`} />
                  {h.isRegistered ? "Registered" : "Unregistered"}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${h.isAvailable ? 'bg-green-50 text-green-600' : 'bg-background-muted text-text-secondary'}`}>
                  {h.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <p className="text-text-primary font-medium text-base truncate">{h.name}</p>
              <p className="flex items-center gap-1 text-sm text-text-secondary mt-0.5"><MapPin size={12} /> {h.city}</p>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="flex items-center gap-1 text-text-secondary">
                  <Star size={13} className="text-yellow-500 fill-yellow-500" />
                  {h.ratingAverage?.toFixed(1) || "0.0"} <span className="text-xs">({h.ratingCount || 0})</span>
                </span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <BedDouble size={13} className="text-primary" />
                  {h.availableBeds ?? 0}/{h.totalBeds ?? 0} beds
                </span>
              </div>
              {h.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {h.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-text-secondary">{s}</span>
                  ))}
                  {h.specialties.length > 3 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-border text-text-secondary">+{h.specialties.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {hospitals.length === 0 && !loading && (
        <p className="text-text-secondary text-center py-20 text-lg">No hospitals found</p>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button disabled={page <= 1} onClick={() => fetchHospitals(page - 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors">
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-text-secondary">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => fetchHospitals(page + 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors">
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalsList;
