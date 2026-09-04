// @ts-nocheck
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "@/src/context/AppContext";
import { assets } from "@/src/assets/assets";
import RelatedDoctors from "@/src/components/RelatedDoctors";
import { Video, MapPin, Building2 } from "lucide-react";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendURL, getDoctorsData, token } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const router = useRouter();

  // Fetching doctor information based on docId
  const [docInfo, setDocInfo] = useState(null);

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  // Fetching available slots for the doctor
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [slotDuration, setSlotDuration] = useState(30);

  // Smart appointment fields
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // Fetch schedule if not already fetched
    let schedule = doctorSchedule;
    let slotDur = slotDuration;

    if (!doctorSchedule) {
      try {
        const { data } = await axios.get(
          `${backendURL}/api/doctor/${docId}/schedule`
        );
        if (data.success) {
          schedule = data.schedule;
          slotDur = data.slotDuration || 30;
          setDoctorSchedule(schedule);
          setSlotDuration(slotDur);
        }
      } catch (error) {
        console.log("Error fetching doctor schedule:", error);
        // Use default values if fetch fails
        schedule = docInfo?.schedule || {};
        slotDur = 30;
      }
    }

    // getting current date
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting date with index
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      // Get day name for schedule lookup
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayName = dayNames[currentDate.getDay()];
      const daySchedule = schedule?.[dayName];

      // Check if day is working
      if (!daySchedule?.enabled) {
        setDocSlots((prev) => [...prev, []]);
        continue;
      }

      // Check if date is blocked
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
      const isDateBlocked = docInfo?.blockedDates?.includes(dateStr);

      if (isDateBlocked) {
        setDocSlots((prev) => [...prev, []]);
        continue;
      }

      // Get start and end times from schedule
      const [startHour, startMin] = daySchedule.startTime
        .split(":")
        .map(Number);
      const [endHour, endMin] = daySchedule.endTime.split(":").map(Number);

      // Set start time
      let currentSlotTime = new Date(currentDate);
      currentSlotTime.setHours(startHour, startMin, 0, 0);

      // Set end time for comparison
      const endTime = new Date(currentDate);
      endTime.setHours(endHour, endMin, 0, 0);

      // For today, don't show past slots
      if (today.getDate() === currentDate.getDate()) {
        const now = new Date();
        if (currentSlotTime <= now) {
          // Move to next available slot
          const minsUntilNextSlot =
            slotDur - (now.getMinutes() % slotDur);
          currentSlotTime = new Date(
            now.getTime() + minsUntilNextSlot * 60 * 1000
          );
          currentSlotTime.setMinutes(
            Math.floor(currentSlotTime.getMinutes() / slotDur) * slotDur
          );
        }
      }

      const timeSlots = [];

      while (currentSlotTime < endTime) {
        const formattedTime = currentSlotTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = currentSlotTime.getDate();
        const month = currentSlotTime.getMonth() + 1;
        const year = currentSlotTime.getFullYear();

        const slotDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentSlotTime),
            time: formattedTime,
          });
        }

        // Increment by slot duration
        currentSlotTime.setMinutes(
          currentSlotTime.getMinutes() + slotDur
        );
      }

      // only add the day if there are available slots
      if (timeSlots.length > 0) {
        setDocSlots((prev) => [...prev, timeSlots]);
      }
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return router.push("/login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const slotDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        { docId, slotDate, slotTime, appointmentType, symptoms, notes },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        router.push("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo && docId) {
      getAvailableSlots();
    }
  }, [docInfo, doctorSchedule, docId]);

  // reset slot index when slots array changes
  useEffect(() => {
    if (docSlots.length > 0) {
      setSlotIndex(0);
      setSlotTime("");
    }
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        {/* ---------- Doctor details ---------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary-soft w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-border-light rounded-lg p-8 py-7 bg-background-cardLight mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* ---------- Doctor Info ---------- */}
            <p className="flex items-center gap-2 text-3xl font-medium text-text-primaryLight">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon.src} alt="" />
            </p>
            <div className="flex items-center gap-2 mt-1 text-text-secondaryLight">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* Hospital/Clinic info */}
            {docInfo.hospitalId && (
              <div className="flex items-center gap-2 mt-2">
                <Building2 size={14} className="text-primary" />
                <p className="text-sm text-primary font-medium">
                  {docInfo.hospitalId.name || "Hospital/Clinic"}
                  {docInfo.hospitalId.city && (
                    <span className="text-text-secondaryLight font-normal">
                      {" "}
                      · {docInfo.hospitalId.city}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* dr about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-text-primaryLight mt-3">
                About{" "}
                <img className="w-3" src={assets.info_icon.src} alt="" />
              </p>
              <p className="text-sm text-text-secondaryLight max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-text-secondaryLight font-medium mt-4">
              Appoointment fee:{" "}
              <span className="text-text-primaryLight">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* ---------- Doctor available slots for booking ---------- */}
        <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-text-secondaryLight">
          <p>Booking slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => {
                if (!item || item.length === 0) return null;
                return (
                  <div
                    onClick={() => setSlotIndex(index)}
                    key={index}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : " border border-border-light "}`}
                  >
                    <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0].datetime.getDate()}</p>
                  </div>
                );
              })}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length && docSlots[slotIndex] ? (
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-text-secondaryLight border border-border-light"} `}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p className="text-text-secondaryLight text-sm">
                No available slots
              </p>
            )}
          </div>

          {/* ---------- Appointment Type ---------- */}
          <div className="mt-6">
            <p className="mb-2">Appointment Type</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAppointmentType("in-person")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border transition-all cursor-pointer ${appointmentType === "in-person" ? "bg-primary text-white border-primary" : "border-border-light text-text-secondaryLight hover:border-primary"}`}
              >
                <MapPin size={16} /> In-Person
              </button>
              <button
                onClick={() => setAppointmentType("video")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border transition-all cursor-pointer ${appointmentType === "video" ? "bg-primary text-white border-primary" : "border-border-light text-text-secondaryLight hover:border-primary"}`}
              >
                <Video size={16} /> Video Call
              </button>
            </div>
          </div>

          {/* ---------- Symptoms & Notes ---------- */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">
                Symptoms{" "}
                <span className="text-text-secondaryLight text-xs">
                  (optional)
                </span>
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                placeholder="Describe your symptoms..."
                className="w-full border border-border-light rounded-lg p-3 text-sm outline-primary resize-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">
                Notes{" "}
                <span className="text-text-secondaryLight text-xs">
                  (optional)
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional notes for the doctor..."
                className="w-full border border-border-light rounded-lg p-3 text-sm outline-primary resize-none"
              />
            </div>
          </div>

          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 w-full sm:w-auto cursor-pointer touch-none-outline"
          >
            Book an appointment
          </button>
        </div>

        {/* ---------- Listing related doctors ---------- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
