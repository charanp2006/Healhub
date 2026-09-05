// @ts-nocheck
"use client";
import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "@/src/context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Camera, Briefcase, GraduationCap, FileText, Globe, Star, Loader2, Award } from "lucide-react";

const specialities = ["General physician","Gynecologist","Dermatologist","Pediatricians","Neurologist","Gastroenterologist"];

const DoctorProfile = () => {
  const { backendURL, dToken, profileData, getProfileData } = useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", speciality: "", degree: "", experience: "", about: "", available: true, address1: "", address2: "", fees: "", specializationsInput: "", languagesInput: ""
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (dToken) getProfileData(); }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "", email: profileData.email || "", password: "", speciality: profileData.speciality || "", degree: profileData.degree || "", experience: profileData.experience || "", about: profileData.about || "", available: profileData.available ?? true, address1: profileData.address?.line1 || "", address2: profileData.address?.line2 || "", fees: profileData.fees || "", specializationsInput: profileData.specializations?.join(", ") || "", languagesInput: profileData.languages?.join(", ") || ""
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("id", profileData._id);
      payload.append("name", formData.name); payload.append("speciality", formData.speciality); payload.append("degree", formData.degree); payload.append("experience", formData.experience); payload.append("about", formData.about); payload.append("available", formData.available); payload.append("fees", formData.fees);
      payload.append("address", JSON.stringify({ line1: formData.address1, line2: formData.address2 }));
      payload.append("specializations", JSON.stringify(formData.specializationsInput.split(",").map((s) => s.trim()).filter(Boolean)));
      payload.append("languages", JSON.stringify(formData.languagesInput.split(",").map((l) => l.trim()).filter(Boolean)));
      if (image) payload.append("image", image);
      const { data } = await axios.post(`${backendURL}/api/doctor/update-profile`, payload, { headers: { dToken } });
      if (data.success) { toast.success(data.message); setIsEdit(false); setImage(false); getProfileData(); }
      else toast.error(data.message);
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  const displayData = profileData ? {
    name: profileData.name || "Not set", email: profileData.email || "Not set", speciality: profileData.speciality || "Not set", degree: profileData.degree || "Not set", experience: profileData.experience || "N/A", about: profileData.about || "Not set", fees: profileData.fees || "N/A", address1: profileData.address?.line1 || "Not set", address2: profileData.address?.line2 || "", specializations: profileData.specializations?.length > 0 ? profileData.specializations : ["Not set"], languages: profileData.languages?.length > 0 ? profileData.languages : ["Not set"], image: profileData.image, available: profileData.available, ratingAverage: profileData.ratingAverage, ratingCount: profileData.ratingCount
  } : null;

  return profileData && (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Profile</h1><p className="text-gray-500 text-sm">{isEdit ? "Update your profile information" : "Your professional profile information"}</p></div>
        {!isEdit && <button onClick={() => setIsEdit(true)} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-all cursor-pointer">Edit Profile</button>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative group shrink-0">
              <label htmlFor="doc-img" className="cursor-pointer block">
                <img className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gray-100 object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity" src={image ? URL.createObjectURL(image) : displayData.image} alt="" />
                {isEdit && <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} className="text-white" /></div>}
              </label>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
            </div>
            <div className="flex-1 space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Full Name</label>{isEdit ? <input name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" required /> : <p className="text-gray-800 font-medium text-lg">{displayData.name}</p>}</div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Email</label><p className="text-gray-800">{displayData.email}</p></div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1"><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Speciality</label>{isEdit ? <select name="speciality" value={formData.speciality} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-all" required><option value="">Select Speciality</option>{specialities.map((s) => (<option key={s} value={s}>{s}</option>))}</select> : <p className="text-gray-800">{displayData.speciality}</p>}</div>
                <div className="flex-1"><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Experience</label>{isEdit ? <input name="experience" value={formData.experience} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" required /> : <p className="text-gray-800">{displayData.experience}</p>}</div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Consultation Fee</label>{isEdit ? <input name="fees" type="number" value={formData.fees} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" required /> : <p className="text-gray-800 font-medium">{displayData.fees === "N/A" ? "N/A" : `₹${displayData.fees}`}</p>}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><GraduationCap size={16} className="text-blue-500" /></div><h3 className="font-semibold text-gray-800">Education</h3></div>
            <div className="space-y-4"><div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Degree</label>{isEdit ? <input name="degree" value={formData.degree} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" required /> : <p className="text-gray-800">{displayData.degree}</p>}</div><div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Specializations</label><div className="flex flex-wrap gap-2">{displayData.specializations.map((s, i) => (<span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{s}</span>))}</div></div></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Globe size={16} className="text-purple-500" /></div><h3 className="font-semibold text-gray-800">Languages</h3></div>
            <div className="space-y-4">
              {isEdit ? <textarea name="languagesInput" value={formData.languagesInput} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" rows={2} placeholder="English, Hindi, Telugu, ..." /> : <div className="flex flex-wrap gap-2">{displayData.languages.map((l, i) => (<span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">{l}</span>))}</div>}
              {isEdit && <p className="text-xs text-gray-400">Separate languages with commas</p>}
            </div>
            <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Availability Status</span>
              {isEdit ? <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={formData.available} onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div></label> : <span className={`px-3 py-1 rounded-full text-xs font-medium ${displayData.available ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{displayData.available ? "Available" : "Unavailable"}</span>}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Award size={16} className="text-amber-500" /></div><h3 className="font-semibold text-gray-800">Ratings</h3></div>
          <div className="flex items-center gap-4"><div className="flex items-center gap-2"><Star size={24} className="fill-yellow-400 text-yellow-400" /><span className="text-2xl font-bold text-gray-800">{displayData.ratingAverage ? displayData.ratingAverage.toFixed(1) : '0.0'}</span></div><span className="text-gray-400">•</span><span className="text-sm text-gray-500">{displayData.ratingCount || 0} ratings</span></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><FileText size={16} className="text-emerald-500" /></div><h3 className="font-semibold text-gray-800">About</h3></div>
          {isEdit ? <textarea name="about" value={formData.about} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[120px]" required /> : <div><p className={`text-gray-600 leading-relaxed ${!showBio && displayData.about.length > 200 ? "line-clamp-3" : ""}`}>{displayData.about}</p>{displayData.about.length > 200 && <button type="button" onClick={() => setShowBio(!showBio)} className="text-primary text-sm font-medium mt-2 hover:underline cursor-pointer">{showBio ? "Show less" : "Read more"}</button>}</div>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-5"><div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><Briefcase size={16} className="text-red-500" /></div><h3 className="font-semibold text-gray-800">Address</h3></div>
          <div className="space-y-4">{isEdit ? <><div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Address Line 1</label><input name="address1" value={formData.address1} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" required /></div><div><label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Address Line 2</label><input name="address2" value={formData.address2} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all" /></div></> : <div className="text-gray-800"><p>{displayData.address1}</p>{displayData.address2 && <p>{displayData.address2}</p>}</div>}</div>
        </div>
        {isEdit && <div className="flex flex-col sm:flex-row gap-3 justify-end pb-8">
          <button type="button" onClick={() => { setIsEdit(false); setImage(false); setFormData(prev => ({ ...prev, name: profileData.name || "", speciality: profileData.speciality || "", degree: profileData.degree || "", experience: profileData.experience || "", about: profileData.about || "", fees: profileData.fees || "", address1: profileData.address?.line1 || "", address2: profileData.address?.line2 || "", specializationsInput: profileData.specializations?.join(", ") || "", languagesInput: profileData.languages?.join(", ") || "" })); }} className="px-8 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save Changes"}</button>
        </div>}
      </form>
    </div>
  );
};

export default DoctorProfile;
