// @ts-nocheck
"use client";

import React, { useContext, useEffect, useState } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit2, Save, X, Upload, Loader2 } from "lucide-react";

const HospitalProfilePage = () => {
  const {
    hToken,
    backendURL: backendUrl,
    profileData,
    getProfileData,
  } = useContext(HospitalContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [about, setAbout] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [totalBeds, setTotalBeds] = useState(0);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (hToken) {
      getProfileData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hToken]);

  useEffect(() => {
    if (profileData && isEdit) {
      setAbout(profileData.about || "");
      setAddressLine1(profileData.address?.line1 || "");
      setAddressLine2(profileData.address?.line2 || "");
      setSpecialties(profileData.specialties?.join(", ") || "");
      setIsAvailable(profileData.isAvailable);
      setTotalBeds(profileData.totalBeds || 0);
      setAvailableBeds(profileData.availableBeds || 0);
      setImagePreview(profileData.image || "");
      setImageFile(null);
    }
  }, [isEdit, profileData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImageFile(null);
    setImagePreview("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("about", about);
      formData.append(
        "address",
        JSON.stringify({ line1: addressLine1, line2: addressLine2 })
      );
      formData.append(
        "specialties",
        JSON.stringify(
          specialties
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );
      formData.append("isAvailable", isAvailable);
      formData.append("totalBeds", totalBeds);
      formData.append("availableBeds", availableBeds);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/hospital/panel/update-profile`,
        formData,
        { headers: { hToken } }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="m-5 flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="m-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-medium">Hospital Profile</p>
        {!isEdit ? (
          <button
            onClick={() => setIsEdit(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-white px-8 py-8 rounded max-w-4xl">
        {!isEdit ? (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              {profileData.image && (
                <img
                  className="w-40 h-40 rounded object-cover"
                  src={profileData.image}
                  alt=""
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profileData.name}
                </h2>
                <p className="text-gray-500 mt-1">{profileData.city}</p>
                {profileData.address && (
                  <p className="text-gray-500 text-sm mt-1">
                    {profileData.address.line1}
                    {profileData.address.line2
                      ? `, ${profileData.address.line2}`
                      : ""}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  {profileData.specialties?.map((spec, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6 mt-4 text-sm text-gray-600">
                  <p>
                    Total Beds:{" "}
                    <span className="font-medium">{profileData.totalBeds}</span>
                  </p>
                  <p>
                    Beds Available:{" "}
                    <span className="font-medium">
                      {profileData.availableBeds}
                    </span>
                  </p>
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      profileData.isRegistered
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {profileData.isRegistered ? "Registered" : "Not Registered"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      profileData.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {profileData.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            {profileData.about && (
              <div className="mt-6">
                <p className="font-medium text-gray-700 mb-2">About</p>
                <p className="text-gray-500 text-sm whitespace-pre-line">
                  {profileData.about}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  className="w-40 h-40 rounded object-cover border-2 border-dashed border-gray-300"
                  src={
                    imagePreview ||
                    profileData.image ||
                    "/placeholder-hospital.png"
                  }
                  alt="Hospital"
                />
                <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profileData.name}
                </h2>
                <p className="text-gray-500 mt-1">{profileData.city}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Upload a new image to change the hospital photo
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Address Line 1"
                className="w-full px-4 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Address Line 2 (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <input
                type="text"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="Cardiology, Neurology, Orthopedics (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate multiple specialties with commas
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Beds
                </label>
                <input
                  type="number"
                  value={totalBeds}
                  onChange={(e) =>
                    setTotalBeds(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Beds
                </label>
                <input
                  type="number"
                  value={availableBeds}
                  onChange={(e) =>
                    setAvailableBeds(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  max={totalBeds}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Availability Status:
              </label>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAvailable ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  isAvailable ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isAvailable ? "Available" : "Not Available"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                placeholder="Write about your hospital..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalProfilePage;
