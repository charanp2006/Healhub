// @ts-nocheck
"use client";
import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '@/src/context/DoctorContext';
import { AppContext } from '@/src/context/AppContext';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, CalendarCheck, Users, CircleDollarSign, CalendarMinus } from 'lucide-react';
import { SkeletonDashboard } from "@healhub/ui";

const DoctorAnalytics = () => {
  const { dToken, backendURL } = useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!dToken) return;
      setLoading(true);
      try {
        const analyticsRes = await axios.get(`${backendURL}/api/doctor/analytics`, { headers: { dToken } });
        const a = analyticsRes.data.analytics;
        if (analyticsRes.data.success && a) {
          setOverview({
            ...a.stats,
            totalRevenue: a.revenue?.totalRevenue,
            thisMonthRevenue: a.revenue?.thisMonthRevenue,
            revenueGrowth: a.revenue?.revenueGrowth,
            cancelledCount: a.stats?.cancelledAppointments,
            activeCount: a.stats?.activeAppointments,
            inPersonCount: a.breakdown?.inPersonCount,
            videoCount: a.breakdown?.videoCount,
          });
          setTrends((a.monthlyTrend || []).map((m) => ({
            month: m.month,
            booked: m.appointments,
            completed: m.completed,
            cancelled: m.cancelled ?? 0,
          })));
        }
      } catch (error) { console.log('Error fetching analytics:', error); }
      setLoading(false);
    };
    fetchData();
  }, [dToken, backendURL]);

  const GrowthBadge = ({ value }) => {
    if (!value || value === 0) return <span className="text-xs text-gray-400">0%</span>;
    return value > 0
      ? <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><TrendingUp size={12} /> +{value}%</span>
      : <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium"><TrendingDown size={12} /> {value}%</span>;
  };

  if (loading) return <div className="m-5 w-full max-w-6xl"><SkeletonDashboard /></div>;

  if (!overview) return <div className="m-5 w-full max-w-6xl flex items-center justify-center min-h-[60vh]"><p className="text-gray-400">No analytics data available</p></div>;

  return (
    <div className="m-5 w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">My Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Your performance insights and trends</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><CalendarCheck size={18} className="text-emerald-600" /><span className="text-sm text-gray-500">Total</span></div>
          <p className="text-2xl font-bold text-gray-800">{overview.totalAppointments}</p>
          <GrowthBadge value={overview.appointmentGrowth} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Users size={18} className="text-blue-600" /><span className="text-sm text-gray-500">Patients</span></div>
          <p className="text-2xl font-bold text-gray-800">{overview.totalPatients}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><CircleDollarSign size={18} className="text-violet-600" /><span className="text-sm text-gray-500">Revenue</span></div>
          <p className="text-2xl font-bold text-gray-800">{currencySymbol}{overview.totalRevenue?.toLocaleString()}</p>
          <GrowthBadge value={overview.revenueGrowth} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><CalendarMinus size={18} className="text-red-600" /><span className="text-sm text-gray-500">Cancelled</span></div>
          <p className="text-2xl font-bold text-gray-800">{overview.cancelledCount}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
        <p className="font-semibold text-gray-800 mb-1">Appointment Trends</p>
        <p className="text-xs text-gray-400 mb-4">Your bookings over the last 12 months</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="booked" name="Booked" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4">Appointment Types</p>
          <div className="flex items-center justify-center h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'In-Person', value: overview.inPersonCount || 0 }, { name: 'Video', value: overview.videoCount || 0 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  <Cell fill="#20C3AE" /><Cell fill="#6366F1" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4">Performance Summary</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="font-semibold text-gray-800">{overview.totalAppointments > 0 ? Math.round(((overview.totalAppointments - overview.cancelledCount) / overview.totalAppointments) * 100) : 0}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Avg. Revenue/Booking</span>
              <span className="font-semibold text-gray-800">{currencySymbol}{overview.totalAppointments > 0 ? Math.round(overview.totalRevenue / overview.totalAppointments) : 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Active Bookings</span>
              <span className="font-semibold text-gray-800">{overview.activeCount || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Video Consultations</span>
              <span className="font-semibold text-gray-800">{overview.videoCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAnalytics;
