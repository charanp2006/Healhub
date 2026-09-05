// @ts-nocheck
"use client";

import React, { useState, useEffect, useContext } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Stethoscope,
} from "lucide-react";

const HospitalAnalyticsPage = () => {
  const { hToken, backendURL: backendUrl } = useContext(HospitalContext);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/hospital/panel/analytics`,
        { headers: { hToken } }
      );
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hToken) fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hToken]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <div className="m-5 flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="m-5 text-center text-gray-500 py-20">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No analytics data available</p>
      </div>
    );
  }

  const { stats, topDoctors, specialityBreakdown, monthlyTrend } = analytics;
  const maxMonthAppts = Math.max(...monthlyTrend.map((m) => m.appointments), 1);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Hospital Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your hospital performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalDoctors}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {stats.activeDoctors} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalAppointments}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.appointmentGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span
                  className={`text-xs ${
                    stats.appointmentGrowth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stats.appointmentGrowth > 0 ? "+" : ""}
                  {stats.appointmentGrowth}% this month
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {stats.revenueGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span
                  className={`text-xs ${
                    stats.revenueGrowth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stats.revenueGrowth > 0 ? "+" : ""}
                  {stats.revenueGrowth}% vs last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.completionRate}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.completedAppointments} completed
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">
              {stats.completedAppointments}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">
              {stats.activeAppointments}
            </p>
            <p className="text-sm text-gray-500">Active / Pending</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">
              {stats.cancelledAppointments}
            </p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            Monthly Trend (Last 6 Months)
          </h3>
          <div className="space-y-3">
            {monthlyTrend.map((month, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-10">
                  {month.month}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(month.appointments / maxMonthAppts) * 100}%`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {month.appointments} appts
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 w-20 text-right">
                  {formatCurrency(month.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            Top Performing Doctors
          </h3>
          {topDoctors.length > 0 ? (
            <div className="space-y-3">
              {topDoctors.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-bold text-gray-400 w-5">
                    #{i + 1}
                  </span>
                  <img
                    src={doc.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.speciality}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {doc.appointments} appts
                    </p>
                    <p className="text-xs text-green-600">
                      {formatCurrency(doc.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              No doctor data yet
            </p>
          )}
        </div>
      </div>

      {specialityBreakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            Speciality Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {specialityBreakdown.map((spec, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{spec.name}</p>
                  <p className="text-xs text-gray-500">
                    {spec.doctors} doctor{spec.doctors !== 1 ? "s" : ""} ·{" "}
                    {spec.appointments} appts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalAnalyticsPage;
