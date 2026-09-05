// @ts-nocheck
"use client";

import React, { useContext, useEffect, useState } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BedDouble,
  PlusCircle,
  Pencil,
  UserPlus,
  UserMinus,
  History,
  X,
} from "lucide-react";
import { SkeletonCards } from "@healhub/ui";

const HospitalManageRooms = () => {
  const { hToken, backendURL: backendUrl } = useContext(HospitalContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formTotal, setFormTotal] = useState("");
  const [formAvailable, setFormAvailable] = useState("");
  const [formDailyRate, setFormDailyRate] = useState("");

  const [showAdmit, setShowAdmit] = useState(false);
  const [admitCategoryId, setAdmitCategoryId] = useState("");
  const [admitPatientId, setAdmitPatientId] = useState("");

  const [showHistory, setShowHistory] = useState(false);
  const [allocations, setAllocations] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyFilter, setHistoryFilter] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/bed/hospital/categories`,
        { headers: { hToken } }
      );
      if (data.success) setCategories(data.categories);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (historyFilter) params.append("status", historyFilter);
      const { data } = await axios.get(
        `${backendUrl}/api/bed/hospital/history?${params}`,
        { headers: { hToken } }
      );
      if (data.success) {
        setAllocations(data.allocations);
        setHistoryPage(data.pagination.page);
        setHistoryTotal(data.pagination.total);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (hToken) fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hToken]);

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormTotal("");
    setFormAvailable("");
    setFormDailyRate("");
    setShowForm(false);
  };

  const openEditForm = (cat) => {
    setEditingId(cat._id);
    setFormName(cat.name);
    setFormTotal(String(cat.totalBeds));
    setFormAvailable(String(cat.availableBeds));
    setFormDailyRate(String(cat.dailyRate || 0));
    setShowForm(true);
    setShowAdmit(false);
    setShowHistory(false);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = editingId
        ? {
            categoryId: editingId,
            name: formName,
            totalBeds: Number(formTotal),
            availableBeds: Number(formAvailable),
            dailyRate: Number(formDailyRate || 0),
          }
        : {
            name: formName,
            totalBeds: Number(formTotal),
            availableBeds: Number(formAvailable || formTotal),
            dailyRate: Number(formDailyRate || 0),
          };

      const url = editingId
        ? `${backendUrl}/api/bed/hospital/update-category`
        : `${backendUrl}/api/bed/hospital/add-category`;

      const { data } = await axios.post(url, payload, {
        headers: { hToken },
      });
      if (data.success) {
        toast.success(data.message);
        resetForm();
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAdmit = async (e) => {
    e.preventDefault();
    if (!admitCategoryId || !admitPatientId)
      return toast.error("Select a category and enter patient ID");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/bed/hospital/admit`,
        { roomCategoryId: admitCategoryId, patientId: admitPatientId },
        { headers: { hToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setAdmitPatientId("");
        setAdmitCategoryId("");
        setShowAdmit(false);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDischarge = async (allocationId) => {
    if (!window.confirm("Discharge this patient?")) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/bed/hospital/discharge`,
        { allocationId },
        { headers: { hToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
        if (showHistory) fetchHistory(historyPage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="m-5">
        <SkeletonCards
          count={6}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        />
      </div>
    );
  }

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-medium">Rooms &amp; Beds</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(true);
              setShowAdmit(false);
              setShowHistory(false);
              setEditingId(null);
              setFormName("");
              setFormTotal("");
              setFormAvailable("");
              setFormDailyRate("");
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 cursor-pointer"
          >
            <PlusCircle size={16} /> Add Room
          </button>
          <button
            onClick={() => {
              setShowAdmit(true);
              setShowForm(false);
              setShowHistory(false);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 cursor-pointer"
          >
            <UserPlus size={16} /> Admit
          </button>
          <button
            onClick={() => {
              setShowHistory(!showHistory);
              setShowForm(false);
              setShowAdmit(false);
              if (!showHistory) fetchHistory(1);
            }}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 cursor-pointer"
          >
            <History size={16} /> History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BedDouble size={20} className="text-primary" />
                <h3 className="font-medium text-gray-800">{cat.name}</h3>
              </div>
              <button
                onClick={() => openEditForm(cat)}
                className="text-gray-400 hover:text-blue-600 cursor-pointer"
              >
                <Pencil size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {cat.totalBeds}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">
                  {cat.availableBeds}
                </p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-500">
                  {cat.totalBeds - cat.availableBeds}
                </p>
                <p className="text-xs text-gray-500">Occupied</p>
              </div>
            </div>
            {cat.dailyRate > 0 && (
              <p className="text-xs text-gray-400 mt-2 text-right">
                Rate: ₹{cat.dailyRate}/day
              </p>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-10">
            No room categories yet. Click "Add Room" to create one.
          </p>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">
              {editingId ? "Edit Room Category" : "Add Room Category"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <form
            onSubmit={handleCategorySubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="text-sm text-gray-500 block mb-1">Name</label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="border rounded px-3 py-2 w-full outline-primary"
                required
                placeholder="e.g. ICU, General, Private"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Total Beds
              </label>
              <input
                type="number"
                min="0"
                value={formTotal}
                onChange={(e) => setFormTotal(e.target.value)}
                className="border rounded px-3 py-2 w-full outline-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Available Beds
              </label>
              <input
                type="number"
                min="0"
                value={formAvailable}
                onChange={(e) => setFormAvailable(e.target.value)}
                className="border rounded px-3 py-2 w-full outline-primary"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Daily Rate (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formDailyRate}
                onChange={(e) => setFormDailyRate(e.target.value)}
                className="border rounded px-3 py-2 w-full outline-primary"
              />
            </div>
            <div className="md:col-span-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm hover:bg-primary/90 cursor-pointer"
              >
                {editingId ? "Update" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showAdmit && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Admit Patient</h3>
            <button
              onClick={() => setShowAdmit(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <form
            onSubmit={handleAdmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Room Category
              </label>
              <select
                value={admitCategoryId}
                onChange={(e) => setAdmitCategoryId(e.target.value)}
                className="border rounded px-3 py-2 w-full outline-primary"
                required
              >
                <option value="">Select category</option>
                {categories
                  .filter((c) => c.availableBeds > 0)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.availableBeds} available)
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Patient ID
              </label>
              <input
                value={admitPatientId}
                onChange={(e) => setAdmitPatientId(e.target.value)}
                className="border rounded px-3 py-2 w-full outline-primary"
                required
                placeholder="User/Patient ID"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 cursor-pointer"
              >
                Admit Patient
              </button>
            </div>
          </form>
        </div>
      )}

      {showHistory && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Allocation History</h3>
            <div className="flex gap-2 items-center">
              <select
                value={historyFilter}
                onChange={(e) => {
                  setHistoryFilter(e.target.value);
                  setTimeout(() => fetchHistory(1), 0);
                }}
                className="border rounded px-3 py-1.5 text-sm outline-primary"
              >
                <option value="">All Status</option>
                <option value="admitted">Admitted</option>
                <option value="discharged">Discharged</option>
              </select>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {allocations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No allocation records
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="text-left py-2 px-2">Patient</th>
                    <th className="text-left py-2 px-2">Room</th>
                    <th className="text-left py-2 px-2">Admitted</th>
                    <th className="text-left py-2 px-2">Discharged</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr key={a._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">
                        {a.patientId?.name || a.patientId?._id || a.patientId}
                      </td>
                      <td className="py-2 px-2">
                        {a.roomCategoryId?.name || "N/A"}
                      </td>
                      <td className="py-2 px-2">
                        {new Date(a.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2">
                        {a.dischargeDate
                          ? new Date(a.dischargeDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            a.status === "admitted"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {a.status === "admitted" && (
                          <button
                            onClick={() => handleDischarge(a._id)}
                            className="flex items-center gap-1 text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer"
                          >
                            <UserMinus size={12} /> Discharge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {historyTotal > 10 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from(
                { length: Math.ceil(historyTotal / 10) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchHistory(i + 1)}
                    className={`px-3 py-1 rounded text-sm cursor-pointer ${
                      historyPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalManageRooms;
