// @ts-nocheck
"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '@/src/context/AdminContext';
import { AppContext } from '@/src/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Receipt, Filter } from 'lucide-react';

const BillingList = () => {
  const { aToken, backendURL } = useContext(AdminContext);
  const { currencySymbol } = useContext(AppContext);
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const LIMIT = 12;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const fetchBills = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pageNum); params.set("limit", LIMIT);
      if (filterStatus) params.set("status", filterStatus === "overdue" ? "Pending" : filterStatus === "paid" ? "Paid" : "Pending");
      if (filterSearch.trim()) params.set("search", filterSearch.trim());
      if (filterDateFrom) params.set("dateFrom", filterDateFrom);
      if (filterDateTo) params.set("dateTo", filterDateTo);
      const { data } = await axios.get(`${backendURL}/api/billing/admin/list?${params.toString()}`, { headers: { aToken } });
      if (data.success) { setBills(data.billings || []); setTotalCount(data.pagination?.total || 0); setPage(data.pagination?.page || 1); }
      else toast.error(data.message);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
  };

  useEffect(() => { if (aToken) fetchBills(1); }, [aToken]);

  const handleSearch = (e) => { e?.preventDefault(); fetchBills(1); };

  const clearFilters = () => { setFilterSearch(""); setFilterStatus(""); setFilterPaymentMethod(""); setFilterDateFrom(""); setFilterDateTo(""); setTimeout(() => fetchBills(1), 0); };

  const formatDate = (dateStr) => { if (!dateStr) return "—"; return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Paid</span>;
      case 'pending': return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Pending</span>;
      case 'overdue': return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Overdue</span>;
      default: return <span className="text-xs text-gray-400">{status}</span>;
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case 'online': return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Online</span>;
      case 'cash': return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Cash</span>;
      case 'insurance': return <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 text-violet-600">Insurance</span>;
      default: return <span className="text-xs text-gray-400">{method || '—'}</span>;
    }
  };

  const markAsPaid = async (billId, e) => {
    e?.stopPropagation();
    try {
      const { data } = await axios.post(`${backendURL}/api/billing/admin/mark-paid`, { billingId: billId }, { headers: { aToken } });
      if (data.success) { toast.success(data.message); fetchBills(page); }
      else toast.error(data.message);
    } catch (error) { toast.error(error.message); }
  };

  const hasActiveFilters = filterSearch || filterStatus || filterPaymentMethod || filterDateFrom || filterDateTo;

  return (
    <div className="m-5 w-full max-w-6xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Billing & Invoices</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters((v) => !v)} className={`flex items-center gap-2 text-sm border px-3 py-1.5 rounded-full cursor-pointer transition-colors ${hasActiveFilters ? "bg-primary text-white border-primary" : "text-text-secondaryLight border-border-light hover:bg-primary-soft"}`}>
            <SlidersHorizontal size={14} />{showFilters ? "Hide Filters" : "Filters"}{hasActiveFilters && <span className="w-4 h-4 rounded-full bg-white text-primary text-[10px] flex items-center justify-center font-bold">!</span>}
          </button>
          <button onClick={() => fetchBills(page)} className="flex items-center gap-2 text-sm border border-border-light px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary-soft transition-colors">Refresh</button>
        </div>
      </div>
      {showFilters && (
        <form onSubmit={handleSearch} className="bg-background-cardLight border border-border-light rounded-lg p-5 mb-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondaryLight">Search</label>
              <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondaryLight" />
                <input value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} placeholder="Patient, doctor, or bill ID" className="w-full border border-border-light rounded px-3 py-2 pl-8 text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondaryLight">Status</label>
              <div className="relative">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border border-border-light rounded px-3 py-2 pr-8 appearance-none text-sm bg-white">
                  <option value="">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondaryLight pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondaryLight">Payment Method</label>
              <div className="relative">
                <select value={filterPaymentMethod} onChange={(e) => setFilterPaymentMethod(e.target.value)} className="w-full border border-border-light rounded px-3 py-2 pr-8 appearance-none text-sm bg-white">
                  <option value="">All methods</option><option value="online">Online</option><option value="cash">Cash</option><option value="insurance">Insurance</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondaryLight pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondaryLight">Date From</label>
              <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="w-full border border-border-light rounded px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondaryLight">Date To</label>
              <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="w-full border border-border-light rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary text-white text-sm px-6 py-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors">Apply</button>
            <button type="button" onClick={clearFilters} className="text-sm px-6 py-2 border border-border-light rounded-full cursor-pointer hover:bg-primary-soft transition-colors">Clear</button>
          </div>
        </form>
      )}
      <p className="text-sm text-text-secondaryLight mb-4">{loading ? "Loading..." : `${totalCount} bill${totalCount !== 1 ? "s" : ""} total`}</p>
      <div className="bg-background-cardLight border border-border-light rounded-lg overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_1fr_auto] gap-2 py-3 px-6 border-b border-border-light text-sm font-medium text-text-secondaryLight">
          <p>Bill ID</p><p>Hospital</p><p>Amount</p><p>Status</p><p>Appointments</p><p>Date</p><p>Actions</p>
        </div>
        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-secondaryLight"><Receipt size={40} className="mb-3 opacity-40" /><p>No bills found</p></div>
        ) : (
          bills.map((bill) => (
            <div key={bill._id} className="flex flex-wrap justify-between items-center gap-2 sm:grid sm:grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_1fr_auto] py-3 px-6 border-b border-border-light text-sm hover:bg-primary-soft/30">
              <p className="font-mono text-xs text-text-secondaryLight truncate">{bill._id?.slice(-8) || '—'}</p>
              <div><p className="font-medium text-text-primaryLight truncate">{bill.hospitalId?.name || '—'}</p><p className="text-xs text-text-secondaryLight">Commission: {currencySymbol}{(bill.commissionAmount || 0).toLocaleString()}</p></div>
              <p className="font-semibold text-text-primaryLight">{currencySymbol}{bill.grandTotal?.toLocaleString() || 0}</p>
              {getStatusBadge((bill.status || '').toLowerCase())}
              <p className="text-text-secondaryLight">{bill.totalAppointments || 0}{bill.bedAllocations ? ` + ${bill.bedAllocations} beds` : ''}</p>
              <p className="text-text-secondaryLight">{formatDate(bill.billingPeriodEnd || bill.createdAt)}</p>
              <div className="flex items-center gap-3">
                {(bill.status || '') === 'Pending' && (
                  <button onClick={(e) => markAsPaid(bill._id, e)} className="text-xs bg-primary text-white px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary-hover transition-colors" title="Mark as paid">Mark Paid</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button disabled={page <= 1} onClick={() => fetchBills(page - 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border-light rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors"><ChevronLeft size={14} /> Prev</button>
          <span className="text-sm text-text-secondaryLight">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => fetchBills(page + 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border-light rounded-full disabled:opacity-40 cursor-pointer hover:bg-primary-soft transition-colors">Next <ChevronRight size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default BillingList;
