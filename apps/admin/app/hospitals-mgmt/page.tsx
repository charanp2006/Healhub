// @ts-nocheck
"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/src/context/AdminContext";
import { AppContext } from "@/src/context/AppContext";
import { Search, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { SkeletonList } from "@healhub/ui";

const HospitalsMgmt = () => {
  const { backendURL, aToken } = useContext(AdminContext);
  const { currencySymbol } = useContext(AppContext);
  const [hospitals, setHospitals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", 15);
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      const { data } = await axios.get(`${backendURL}/api/admin/hospital-management?${params.toString()}`, { headers: { aToken } });
      if (data.success) {
        setHospitals(data.hospitals || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, aToken]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (aToken) fetchHospitals(); }, [aToken, page, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (aToken) { setPage(1); fetchHospitals(); }
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Hospitals (Reception Managed) <span className="text-sm text-text-secondary font-normal">({total})</span></p>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hospital..." className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary w-52" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary cursor-pointer">
          <option value="">All Status</option>
          <option value="registered">Registered</option>
          <option value="unregistered">Unregistered</option>
        </select>
      </div>
      <div className="bg-background-card border border-border rounded-lg text-sm max-h-[80vh] overflow-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_1.5fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-1 py-3 px-6 border-b border-border bg-background-muted font-medium text-text-secondary">
          <p>#</p><p>Hospital</p><p>City</p><p>Doctors</p><p>Appointments</p><p>Status</p><p>Billing Summary</p>
        </div>
        {loading ? (
          <SkeletonList rows={6} className="p-6" />
        ) : hospitals.length === 0 ? (
          <p className="p-6 text-text-secondary text-center">No hospitals found</p>
        ) : (
          hospitals.map((h, index) => (
            <div key={h._id} className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_1.5fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-1 items-center text-text-primary py-3 px-6 border-b border-border hover:bg-background-muted">
              <p className="max-sm:hidden text-text-secondary">{(page - 1) * 15 + index + 1}</p>
              <div className="flex items-center gap-2">
                {h.image ? (
                  <img src={h.image} alt="" className="w-8 h-8 rounded-full object-cover bg-background-muted" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center"><Building2 size={14} className="text-primary" /></div>
                )}
                <p className="font-medium truncate">{h.name}</p>
              </div>
              <p className="text-text-secondary">{h.city}</p>
              <p className="text-text-secondary">{h.totalDoctors}</p>
              <p className="text-text-secondary">{h.totalAppointments}</p>
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${h.isRegistered ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {h.isRegistered ? "Registered" : "Unregistered"}
                </span>
              </div>
              <div className="text-text-secondary">
                <p className="text-xs">Revenue: <span className="font-medium text-text-primary">{currencySymbol}{h.totalRevenue?.toLocaleString() || "0"}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors">
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-text-secondary">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors">
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalsMgmt;
