export const currencySymbol = "₹";

export function calculateAge(dob: string): number {
  const birthYear = Number(String(dob).split("-")[0] || 0);
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function slotDateFormat(slotDate: string): string {
  const dateArray = String(slotDate).split("-");
  const month = MONTHS[Number(dateArray[1])] || "";
  const result = `${dateArray[2]} ${month} ${dateArray[0]}`;
  return result;
}
