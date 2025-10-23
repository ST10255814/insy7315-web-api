import { monthsShort, ddmmyyyyPattern } from "../constants/constants";

/**
 * Format date string to DD-MMM-YYYY format
 * Handles multiple input formats including DD-MM-YYYY and ISO dates
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  let d;
  if (ddmmyyyyPattern.test(dateStr)) {
    // Parse DD-MM-YYYY format manually
    const [day, month, year] = dateStr.split('-').map(Number);
    d = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  } else {
    // Use default Date parsing for other formats
    d = new Date(dateStr);
  }
  
  if (isNaN(d)) return "";
  
  const day = String(d.getDate()).padStart(2, "0");
  const month = monthsShort[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Format date for US locale (used in InvoiceCard and BookingCard)
 * Handles multiple input formats including DD-MM-YYYY and ISO dates
 */
export const formatDateUS = (dateStr) => {
  if (!dateStr) return "";
  
  let d;
  if (ddmmyyyyPattern.test(dateStr)) {
    // Parse DD-MM-YYYY format manually
    const [day, month, year] = dateStr.split('-').map(Number);
    d = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  } else {
    // Use default Date parsing for other formats
    d = new Date(dateStr);
  }
  
  if (isNaN(d)) return "";
  
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

export const formatDateTimeUS = (dateStr) => {
  if (!dateStr) return "";
  
  let d;
  if (ddmmyyyyPattern.test(dateStr)) {
    // Parse DD-MM-YYYY format manually
    const [day, month, year] = dateStr.split('-').map(Number);
    d = new Date(year, month - 1, day); // month is 0-indexed in JavaScript
  } else {
    // Use default Date parsing for other formats
    d = new Date(dateStr);
  }
  
  if (isNaN(d)) return "";
  
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};

/**
 * Format amount with thousands separators
 * Handles both string and number inputs
 */
export const formatAmount = (value, locale = "en-US") => {
  const raw = value ?? 0;
  const num = typeof raw === "number" ? raw : Number(String(raw).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(num) ? num.toLocaleString(locale) : String(raw);
};

