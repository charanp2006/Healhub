// @ts-nocheck
"use client";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/src/context/AdminContext";
import { AppContext } from "@/src/context/AppContext";
import { assets } from "@/src/assets/assets";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, Users, CalendarCheck, DollarSign, Building2, Activity, Video, MapPin, ArrowRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import axios from "axios";
import { SkeletonDashboard } from "@healhub/ui";

const Dashboard = () => {
  const { aToken, cancelAppointment, dashboardData, getDashboardData, backendURL } =
    useContext(AdminContext);
  const { slotDateFormat, currencySymbol } = useContext(AppContext);
  const router = useRouter();

  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dashboardReady, setDashboardReady] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, trendsRes, activityRes] = await Promise.all([
        axios.get(`${backendURL}/api/analytics/overview`, { headers: { aToken } }),
        axios.get(`${backendURL}/api/analytics/trends`, { headers: { aToken } }),
        axios.get(`${backendURL}/api/analytics/recent-activity`, { headers: { aToken } }),
      ]);
      if (overviewRes.data.success) setOverview(overviewRes.data.stats);
      if (trendsRes.data.success) setTrends(trendsRes.data.trends);
      if (activityRes.data.success) setRecentActivity(activityRes.data.activities);
    } catch (error) {
      console.log('Error fetching analytics:', error);
    } finally {
      setDashboardReady(true);
    }
  };

  useEffect(() => {
    if (aToken) {
      getDashboardData();
      fetchAnalytics();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aToken]);

  const GrowthBadge = ({ value }) => {
    if (value === 0) return <span className="text-xs text-gray-400">0%</span>;
    return value > 0
      ? <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><TrendingUp size={12} /> +{value}%</span>
      : <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium"><TrendingDown size={12} /> {value}%</span>;
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'completed': return 'bg-green-50 text-green-600';
      case 'cancelled': return 'bg-red-50 text-red-500';
      case 'rescheduled': return 'bg-amber-50 text-amber-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  if (!dashboardReady) {
    return (
      <div className="m-5 w-full max-w-6xl">
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div className="m-5 w-full max-w-6xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            {overview && <GrowthBadge value={overview.appointmentGrowth} />}
          </div>
          <p className="text-2xl font-bold text-gray-800">{overview?.totalPatients ?? '—'}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total Patients</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CalendarCheck size={20} className="text-emerald-600" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">{overview?.activeAppointments ?? 0} active</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overview?.totalAppointments ?? '—'}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total Appointments</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <DollarSign size={20} className="text-violet-600" />
            </div>
            {overview && <GrowthBadge value={overview.revenueGrowth} />}
          </div>
          <p className="text-2xl font-bold text-gray-800">{currencySymbol}{overview?.totalRevenue?.toLocaleString() ?? '—'}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
              <Building2 size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{overview?.totalDoctors ?? '—'} <span className="text-sm font-normal text-gray-400">doctors</span></p>
          <p className="text-sm text-gray-500 mt-0.5">{overview?.totalHospitals ?? 0} hospitals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800">Revenue Trend</p>
              <p className="text-xs text-gray-400">Last 12 months</p>
            </div>
            <button onClick={() => router.push('/analytics')} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline cursor-pointer">
              View Details <ArrowRight size={12} />
            </button>
          </div>
          <div className="h-48">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#20C3AE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#20C3AE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                    formatter={(value) => [`${currencySymbol}${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#20C3AE" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-4">Appointment Summary</p>
          {overview && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium text-green-600">{overview.completedAppointments}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${overview.totalAppointments ? (overview.completedAppointments / overview.totalAppointments * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Active</span>
                  <span className="font-medium text-blue-600">{overview.activeAppointments}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${overview.totalAppointments ? (overview.activeAppointments / overview.totalAppointments * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Cancelled</span>
                  <span className="font-medium text-red-500">{overview.cancelledAppointments}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${overview.totalAppointments ? (overview.cancelledAppointments / overview.totalAppointments * 100) : 0}%` }} />
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500"><MapPin size={14} /> In-Person</span>
                  <span className="font-medium">{overview.inPersonCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="flex items-center gap-1.5 text-gray-500"><Video size={14} /> Video Call</span>
                  <span className="font-medium">{overview.videoCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              <p className="font-semibold text-gray-800">Recent Activity</p>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="p-6 text-gray-400 text-center text-sm">No recent activity</p>
            ) : (
              recentActivity.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 border-t border-gray-50">
                  <img className="w-8 h-8 rounded-full object-cover" src={item.patientImage} alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{item.patientName}</span>
                      {' '}<span className={`text-xs px-1.5 py-0.5 rounded ${getActionColor(item.action)}`}>{item.action}</span>{' '}
                      with <span className="font-medium">{item.doctorName}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.slotDate} | {item.slotTime}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{currencySymbol}{item.amount}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 p-5 pb-3">
            <img src={assets.list_icon} alt="" className="w-5" />
            <p className="font-semibold text-gray-800">Latest Bookings</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {dashboardData && dashboardData.latestAppointments.length === 0 ? (
              <p className="p-6 text-gray-400 text-center text-sm">No appointments found</p>
            ) : (
              dashboardData && dashboardData.latestAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center px-5 py-2.5 gap-3 hover:bg-gray-50 border-t border-gray-50"
                >
                  <img
                    className="rounded-full bg-gray-100 w-8 h-8 object-cover"
                    src={appointment.docData.image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-700">{appointment.docData.name}</p>
                    <p className="text-xs text-gray-400">{slotDateFormat(appointment.slotDate)}</p>
                  </div>
                  {appointment.cancelled ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">Cancelled</span>
                  ) : appointment.isCompleted ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">Completed</span>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(appointment._id)}
                      className="w-8 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
