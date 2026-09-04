// @ts-nocheck
"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HospitalContext } from "@/src/context/HospitalContext";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { SkeletonList } from "@healhub/ui";

const HospitalBillings = () => {
  const { hToken, backendURL: backendUrl } = useContext(HospitalContext);

  const [billings, setBillings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [genStartDate, setGenStartDate] = useState("");
  const [genEndDate, setGenEndDate] = useState("");
  const [genCommission, setGenCommission] = useState(10);
  const [generating, setGenerating] = useState(false);

  const LIMIT = 10;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const fetchBillings = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pageNum);
      params.set("limit", LIMIT);
      if (filterStatus) params.set("status", filterStatus);

      const { data } = await axios.get(
        `${backendUrl}/api/billing/hospital/list?${params.toString()}`,
        { headers: { hToken } }
      );

      if (data.success) {
        setBillings(data.billings || []);
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
    if (hToken) fetchBillings(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hToken]);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchBillings(1);
  };

  const handleGenerateBilling = async (e) => {
    e.preventDefault();
    if (!genStartDate || !genEndDate) {
      return toast.error("Please select billing period dates");
    }
    setGenerating(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/billing/hospital/generate`,
        {
          billingPeriodStart: genStartDate,
          billingPeriodEnd: genEndDate,
          commissionPercentage: genCommission,
        },
        { headers: { hToken } }
      );

      if (data.success) {
        toast.success("Billing generated successfully");
        setShowGenerateForm(false);
        setGenStartDate("");
        setGenEndDate("");
        setGenCommission(10);
        fetchBillings(1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = billings.reduce((sum, b) => sum + b.totalRevenue, 0);
  const totalCommission = billings.reduce(
    (sum, b) => sum + b.commissionAmount,
    0
  );
  const totalNetPayable = billings.reduce((sum, b) => sum + b.netPayable, 0);
  const pendingCount = billings.filter((b) => b.status === "Pending").length;
  const paidCount = billings.filter((b) => b.status === "Paid").length;

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Billings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Generate and view your billing history
          </p>
        </div>
        <button
          onClick={() => setShowGenerateForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Generate Billing
        </button>
      </div>

      {showGenerateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Generate New Billing
            </h2>
            <form onSubmit={handleGenerateBilling} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Period Start
                  </label>
                  <input
                    type="date"
                    value={genStartDate}
                    onChange={(e) => setGenStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Period End
                  </label>
                  <input
                    type="date"
                    value={genEndDate}
                    onChange={(e) => setGenEndDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Commission % (default 10%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={genCommission}
                  onChange={(e) => setGenCommission(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Commission</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totalCommission)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Net Payable</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(totalNetPayable)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending / Paid</p>
              <p className="text-xl font-semibold">
                {pendingCount} / {paidCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <form
            onSubmit={handleSearch}
            className="mt-4 flex flex-wrap items-end gap-4"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 min-w-37.5"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Apply
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <SkeletonList rows={6} className="p-8" />
        ) : billings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No billings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                    Billing Period
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                    Appointments
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                    Revenue
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                    Commission
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                    Net Payable
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {billings.map((billing) => (
                  <tr key={billing._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(billing.billingPeriodStart)} -{" "}
                        {formatDate(billing.billingPeriodEnd)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {billing.totalAppointments}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(billing.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(billing.commissionAmount)} (
                        {billing.commissionPercentage}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {formatCurrency(billing.netPayable)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          billing.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {billing.status === "Paid" ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {billing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} ({totalCount} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchBillings(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => fetchBillings(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalBillings;
