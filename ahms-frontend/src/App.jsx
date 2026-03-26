import { useState, useEffect, createContext, useContext } from "react";

// ============================================================
// DESIGN TOKENS & THEME
// ============================================================
const theme = {
  colors: {
    primary: "#0A6EBD",
    primaryDark: "#0854A0",
    primaryLight: "#E8F4FD",
    accent: "#00B4A6",
    accentLight: "#E0F7F5",
    danger: "#E53935",
    dangerLight: "#FFEBEE",
    warning: "#F59E0B",
    warningLight: "#FFF8E1",
    success: "#16A34A",
    successLight: "#DCFCE7",
    purple: "#7C3AED",
    purpleLight: "#EDE9FE",
    neutral: "#64748B",
    bg: "#F0F4F8",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: "#1E293B",
    textMuted: "#64748B",
    sidebar: "#0D1B2A",
    sidebarHover: "#1A2E45",
    sidebarActive: "#0A6EBD",
  },
};

// ============================================================
// HOSPITAL BRANDING — SINGLE SOURCE OF TRUTH
// Edit here to update across the entire system
// ============================================================
const HOSPITAL = {
  name:       "AFGOI Hospital",
  fullName:   "AFGOI Hospital",
  systemName: "AFGOI Hospital Management System",
  shortName:  "AHMS",
  version:    "v2.0",
  address:    "21 October Street, Afgoi, Somalia",
  tel:        "+252 614 900 313",
  email:      "info@ahms.com",
  website:    "www.ahms.com",
  tagline:    "Committed to Quality Healthcare",
  year:       "2025",
};

// Reusable logo mark component (SVG cross + initials)
const HospitalLogo = ({ size = "md", light = false }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  return (
    <div className={`${sizes[size]} rounded-xl flex-shrink-0 flex items-center justify-center font-extrabold relative overflow-hidden`}
      style={{ background: light ? "rgba(255,255,255,0.15)" : "#0A6EBD" }}>
      {/* Medical cross SVG */}
      <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full opacity-20" fill="none">
        <rect x="16" y="6" width="8" height="28" rx="2" fill="white"/>
        <rect x="6" y="16" width="28" height="8" rx="2" fill="white"/>
      </svg>
      <span className={`relative z-10 font-black tracking-tight ${light ? "text-white" : "text-white"}`}>AH</span>
    </div>
  );
};

// Document letterhead — used on invoices, lab reports, prescriptions, etc.
const DocumentHeader = ({ title, subtitle, docId, docDate, extra }) => (
  <div className="border-b-2 border-blue-600 pb-5 mb-6">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <HospitalLogo size="lg" />
        <div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{HOSPITAL.name.toUpperCase()}</div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-0.5">{HOSPITAL.systemName}</div>
          <div className="mt-2 text-xs text-slate-500 space-y-0.5 leading-relaxed">
            <div>📍 {HOSPITAL.address}</div>
            <div>📞 {HOSPITAL.tel} &nbsp;|&nbsp; ✉ {HOSPITAL.email} &nbsp;|&nbsp; 🌐 {HOSPITAL.website}</div>
          </div>
        </div>
      </div>
      <div className="text-right">
        {title && <div className="text-2xl font-black text-slate-800 uppercase tracking-wider">{title}</div>}
        {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
        {docId && <div className="text-sm font-mono font-bold text-blue-600 mt-2">{docId}</div>}
        {docDate && <div className="text-xs text-slate-400 mt-1">Date: {docDate}</div>}
        {extra}
      </div>
    </div>
  </div>
);

// System-wide footer bar (for dashboard/app footer)
const SystemFooter = () => (
  <footer className="mt-10 pt-5 pb-3 border-t border-slate-200">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <HospitalLogo size="sm" />
        <div>
          <span className="font-semibold text-slate-600">{HOSPITAL.fullName}</span>
          <span className="mx-1.5">·</span>
          <span>{HOSPITAL.systemName} ({HOSPITAL.shortName}) {HOSPITAL.version}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-slate-400">
        <span>📍 {HOSPITAL.address}</span>
        <span className="hidden sm:inline">|</span>
        <span>📞 {HOSPITAL.tel}</span>
        <span className="hidden sm:inline">|</span>
        <span>✉ {HOSPITAL.email}</span>
      </div>
    </div>
    <div className="text-center mt-2 text-xs text-slate-300">
      © {HOSPITAL.year} {HOSPITAL.fullName}. All rights reserved. &nbsp;·&nbsp; {HOSPITAL.tagline}
    </div>
  </footer>
);

// ============================================================
// APP CONTEXT
// ============================================================
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ============================================================
// SAMPLE DATA
// ============================================================
const samplePatients = [
  { id: "AHMS-P001", name: "Ahmed Al-Rashid", age: 45, gender: "Male", blood: "A+", phone: "0912-345-678", diagnosis: "Hypertension", status: "Active", doctor: "Dr. Fatima Noor", dept: "Cardiology", dob: "1979-03-12", address: "Mogadishu, Hodan District", emergency: "Halima Al-Rashid | 0912-987-654", allergy: "Penicillin", insurance: "Takaful Insurance", visits: 7, admitted: false, regDate: "2024-01-15" },
  { id: "AHMS-P002", name: "Maryan Hussein", age: 32, gender: "Female", blood: "O+", phone: "0613-456-789", diagnosis: "Diabetes Type 2", status: "Admitted", doctor: "Dr. Omar Sharif", dept: "General Medicine", dob: "1992-07-22", address: "Hargeisa, Ahmed Dhagah", emergency: "Abdi Hussein | 0613-111-222", allergy: "Sulfa drugs", insurance: "None", visits: 12, admitted: true, regDate: "2024-02-20" },
  { id: "AHMS-P003", name: "Ismail Duale", age: 58, gender: "Male", blood: "B+", phone: "0615-567-890", diagnosis: "Pneumonia", status: "Discharged", doctor: "Dr. Safia Warsame", dept: "Pulmonology", dob: "1966-11-05", address: "Kismayo, Hodan", emergency: "Faduma Duale | 0615-222-333", allergy: "None", insurance: "NHIF", visits: 3, admitted: false, regDate: "2024-03-01" },
  { id: "AHMS-P004", name: "Hawa Abdi", age: 26, gender: "Female", blood: "AB-", phone: "0917-678-901", diagnosis: "Appendicitis", status: "Admitted", doctor: "Dr. Yusuf Garad", dept: "Surgery", dob: "1998-05-18", address: "Mogadishu, Waberi", emergency: "Faadumo Abdi | 0917-333-444", allergy: "Latex", insurance: "Jubilee Insurance", visits: 1, admitted: true, regDate: "2024-03-10" },
  { id: "AHMS-P005", name: "Abdullahi Farah", age: 71, gender: "Male", blood: "O-", phone: "0612-789-012", diagnosis: "Knee Osteoarthritis", status: "Active", doctor: "Dr. Nimco Osman", dept: "Orthopedics", dob: "1953-09-30", address: "Berbera, Old Town", emergency: "Saado Farah | 0612-444-555", allergy: "Aspirin", insurance: "NHIF", visits: 15, admitted: false, regDate: "2023-11-08" },
  { id: "AHMS-P006", name: "Safia Mohamud", age: 38, gender: "Female", blood: "A-", phone: "0916-890-123", diagnosis: "Prenatal Care", status: "Active", doctor: "Dr. Hodan Ali", dept: "Gynecology", dob: "1986-01-25", address: "Mogadishu, Bondhere", emergency: "Mohamed Mohamud | 0916-555-666", allergy: "None", insurance: "Takaful Insurance", visits: 8, admitted: false, regDate: "2024-01-02" },
];

const sampleDoctors = [
  { id: "AHMS-D001", name: "Dr. Fatima Noor", specialization: "Cardiologist", dept: "Cardiology", fee: 150, phone: "0912-001-001", email: "f.noor@ahms.so", status: "On Duty", patients: 24, schedule: "Mon-Fri 8AM-4PM", experience: "12 years", education: "MD, FACC" },
  { id: "AHMS-D002", name: "Dr. Omar Sharif", specialization: "General Physician", dept: "General Medicine", fee: 80, phone: "0912-002-002", email: "o.sharif@ahms.so", status: "On Duty", patients: 42, schedule: "Mon-Sat 7AM-3PM", experience: "8 years", education: "MBBS, MRCP" },
  { id: "AHMS-D003", name: "Dr. Safia Warsame", specialization: "Pulmonologist", dept: "Pulmonology", fee: 130, phone: "0912-003-003", email: "s.warsame@ahms.so", status: "Off Duty", patients: 18, schedule: "Tue-Sat 9AM-5PM", experience: "10 years", education: "MD, FCCP" },
  { id: "AHMS-D004", name: "Dr. Yusuf Garad", specialization: "Surgeon", dept: "Surgery", fee: 200, phone: "0912-004-004", email: "y.garad@ahms.so", status: "In Surgery", patients: 31, schedule: "Mon-Fri 6AM-2PM", experience: "15 years", education: "MBBS, FRCS" },
  { id: "AHMS-D005", name: "Dr. Nimco Osman", specialization: "Orthopedic Surgeon", dept: "Orthopedics", fee: 180, phone: "0912-005-005", email: "n.osman@ahms.so", status: "On Duty", patients: 27, schedule: "Mon-Thu 8AM-4PM", experience: "11 years", education: "MBBS, FRCS(Orth)" },
  { id: "AHMS-D006", name: "Dr. Hodan Ali", specialization: "Obstetrician", dept: "Gynecology", fee: 160, phone: "0912-006-006", email: "h.ali@ahms.so", status: "On Duty", patients: 35, schedule: "Daily 8AM-6PM", experience: "9 years", education: "MBBS, MRCOG" },
];

const sampleAppointments = [
  { id: "AHMS-A001", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", doctor: "Dr. Fatima Noor", dept: "Cardiology", date: "2024-03-14", time: "09:00", status: "Confirmed", type: "Follow-up", fee: 150 },
  { id: "AHMS-A002", patient: "Maryan Hussein", patientId: "AHMS-P002", doctor: "Dr. Omar Sharif", dept: "General Medicine", date: "2024-03-14", time: "10:30", status: "Completed", type: "Consultation", fee: 80 },
  { id: "AHMS-A003", patient: "Hawa Abdi", patientId: "AHMS-P004", doctor: "Dr. Yusuf Garad", dept: "Surgery", date: "2024-03-14", time: "11:00", status: "Pending", type: "Pre-op Assessment", fee: 200 },
  { id: "AHMS-A004", patient: "Abdullahi Farah", patientId: "AHMS-P005", doctor: "Dr. Nimco Osman", dept: "Orthopedics", date: "2024-03-14", time: "14:00", status: "Confirmed", type: "Review", fee: 180 },
  { id: "AHMS-A005", patient: "Safia Mohamud", patientId: "AHMS-P006", doctor: "Dr. Hodan Ali", dept: "Gynecology", date: "2024-03-14", time: "15:30", status: "Pending", type: "Antenatal", fee: 160 },
  { id: "AHMS-A006", patient: "Ismail Duale", patientId: "AHMS-P003", doctor: "Dr. Safia Warsame", dept: "Pulmonology", date: "2024-03-15", time: "09:30", status: "Confirmed", type: "Follow-up", fee: 130 },
];

const sampleBeds = [
  { id: "BED-101", ward: "General Ward A", room: "Room 101", type: "Standard", status: "Occupied", patient: "Maryan Hussein", admDate: "2024-03-10", doctor: "Dr. Omar Sharif" },
  { id: "BED-102", ward: "General Ward A", room: "Room 101", type: "Standard", status: "Available", patient: null, admDate: null, doctor: null },
  { id: "BED-201", ward: "ICU", room: "ICU-1", type: "ICU", status: "Occupied", patient: "Hawa Abdi", admDate: "2024-03-10", doctor: "Dr. Yusuf Garad" },
  { id: "BED-202", ward: "ICU", room: "ICU-1", type: "ICU", status: "Available", patient: null, admDate: null, doctor: null },
  { id: "BED-301", ward: "Maternity Ward", room: "Room 301", type: "Maternity", status: "Available", patient: null, admDate: null, doctor: null },
  { id: "BED-302", ward: "Maternity Ward", room: "Room 302", type: "Maternity", status: "Maintenance", patient: null, admDate: null, doctor: null },
  { id: "BED-401", ward: "Pediatric Ward", room: "Room 401", type: "Pediatric", status: "Available", patient: null, admDate: null, doctor: null },
  { id: "BED-402", ward: "Pediatric Ward", room: "Room 402", type: "Pediatric", status: "Reserved", patient: null, admDate: null, doctor: null },
];

const sampleMedicines = [
  { id: "MED-001", name: "Amoxicillin 500mg", category: "Antibiotics", stock: 850, unit: "Capsules", price: 0.45, expiry: "2025-08-01", supplier: "PharmaTech Ltd", reorder: 200, batch: "BTX-2024-01" },
  { id: "MED-002", name: "Metformin 500mg", category: "Diabetes", stock: 1200, unit: "Tablets", price: 0.12, expiry: "2025-12-15", supplier: "MedSupply Co", reorder: 300, batch: "BTX-2024-02" },
  { id: "MED-003", name: "Atorvastatin 20mg", category: "Cardiovascular", stock: 45, unit: "Tablets", price: 0.38, expiry: "2025-06-30", supplier: "GlobalPharma", reorder: 150, batch: "BTX-2024-03" },
  { id: "MED-004", name: "Omeprazole 20mg", category: "Gastro", stock: 600, unit: "Capsules", price: 0.22, expiry: "2026-02-28", supplier: "MedSupply Co", reorder: 100, batch: "BTX-2024-04" },
  { id: "MED-005", name: "Paracetamol 500mg", category: "Analgesics", stock: 30, unit: "Tablets", price: 0.08, expiry: "2025-09-10", supplier: "PharmaTech Ltd", reorder: 500, batch: "BTX-2024-05" },
  { id: "MED-006", name: "Insulin Glargine", category: "Diabetes", stock: 280, unit: "Vials", price: 18.50, expiry: "2024-11-30", supplier: "InsuPharm", reorder: 50, batch: "BTX-2024-06" },
];

const sampleLabTests = [
  { id: "LAB-001", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", test: "Complete Blood Count", orderedBy: "Dr. Fatima Noor", date: "2024-03-14", status: "Completed", result: "Normal", tech: "Ali Hassan", fee: 25 },
  { id: "LAB-002", patient: "Maryan Hussein", patientId: "AHMS-P002", test: "HbA1c", orderedBy: "Dr. Omar Sharif", date: "2024-03-14", status: "Processing", result: null, tech: "Halima Yusuf", fee: 40 },
  { id: "LAB-003", patient: "Hawa Abdi", patientId: "AHMS-P004", test: "Urinalysis", orderedBy: "Dr. Yusuf Garad", date: "2024-03-13", status: "Pending", result: null, tech: null, fee: 15 },
  { id: "LAB-004", patient: "Ismail Duale", patientId: "AHMS-P003", test: "Chest X-Ray Culture", orderedBy: "Dr. Safia Warsame", date: "2024-03-12", status: "Completed", result: "Abnormal", tech: "Ali Hassan", fee: 35 },
];

const sampleBills = [
  { id: "INV-2024-001", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", date: "2024-03-14", items: [{ desc: "Consultation Fee", amt: 150 }, { desc: "CBC Test", amt: 25 }, { desc: "Medicines", amt: 45 }], total: 220, paid: 220, balance: 0, status: "Paid", method: "Cash" },
  { id: "INV-2024-002", patient: "Maryan Hussein", patientId: "AHMS-P002", date: "2024-03-10", items: [{ desc: "Admission Fee", amt: 100 }, { desc: "Room Charges (4d)", amt: 240 }, { desc: "Consultation", amt: 80 }, { desc: "Lab Tests", amt: 65 }], total: 485, paid: 300, balance: 185, status: "Partial", method: "Mobile Money" },
  { id: "INV-2024-003", patient: "Hawa Abdi", patientId: "AHMS-P004", date: "2024-03-10", items: [{ desc: "Surgery Fee", amt: 800 }, { desc: "Admission Fee", amt: 100 }, { desc: "Room Charges (4d)", amt: 480 }, { desc: "Anaesthesia", amt: 200 }], total: 1580, paid: 0, balance: 1580, status: "Pending", method: null },
];

const sampleStaff = [
  { id: "AHMS-S001", name: "Fadumo Osman", role: "Head Nurse", dept: "General Medicine", shift: "Morning", phone: "0912-101-001", email: "f.osman@ahms.so", salary: 850, status: "Active", joinDate: "2020-05-10" },
  { id: "AHMS-S002", name: "Ahmed Bile", role: "Receptionist", dept: "Administration", shift: "Morning", phone: "0912-102-002", email: "a.bile@ahms.so", salary: 550, status: "Active", joinDate: "2021-08-15" },
  { id: "AHMS-S003", name: "Nasra Hassan", role: "Pharmacist", dept: "Pharmacy", shift: "Evening", phone: "0912-103-003", email: "n.hassan@ahms.so", salary: 750, status: "Active", joinDate: "2019-02-20" },
  { id: "AHMS-S004", name: "Mohamed Isse", role: "Lab Technician", dept: "Laboratory", shift: "Morning", phone: "0912-104-004", email: "m.isse@ahms.so", salary: 700, status: "On Leave", joinDate: "2022-01-12" },
  { id: "AHMS-S005", name: "Luul Abdi", role: "Nurse", dept: "Pediatrics", shift: "Night", phone: "0912-105-005", email: "l.abdi@ahms.so", salary: 650, status: "Active", joinDate: "2021-11-01" },
];

const departments = [
  { id: "DEPT-01", name: "Cardiology", head: "Dr. Fatima Noor", doctors: 3, staff: 8, status: "Active", desc: "Heart and cardiovascular disease management" },
  { id: "DEPT-02", name: "General Medicine", head: "Dr. Omar Sharif", doctors: 5, staff: 15, status: "Active", desc: "Primary care and general medical conditions" },
  { id: "DEPT-03", name: "Surgery", head: "Dr. Yusuf Garad", doctors: 4, staff: 12, status: "Active", desc: "Surgical procedures and post-op care" },
  { id: "DEPT-04", name: "Gynecology", head: "Dr. Hodan Ali", doctors: 2, staff: 10, status: "Active", desc: "Women's health and maternity services" },
  { id: "DEPT-05", name: "Pediatrics", head: "Dr. Amina Warsame", doctors: 3, staff: 9, status: "Active", desc: "Children's health and development" },
  { id: "DEPT-06", name: "Radiology", head: "Dr. Hassan Farah", doctors: 2, staff: 6, status: "Active", desc: "Medical imaging and diagnostic radiology" },
  { id: "DEPT-07", name: "Laboratory", head: "Dr. Ifrah Ahmed", doctors: 1, staff: 8, status: "Active", desc: "Clinical pathology and diagnostic testing" },
  { id: "DEPT-08", name: "Pharmacy", head: "Nasra Hassan", doctors: 0, staff: 5, status: "Active", desc: "Medicine dispensing and pharmaceutical care" },
  { id: "DEPT-09", name: "Emergency", head: "Dr. Bile Muse", doctors: 4, staff: 14, status: "Active", desc: "24/7 emergency and trauma care" },
  { id: "DEPT-10", name: "Orthopedics", head: "Dr. Nimco Osman", doctors: 2, staff: 7, status: "Active", desc: "Bone, joint, and musculoskeletal care" },
];

// ============================================================
// UTILITY COMPONENTS
// ============================================================

const Badge = ({ status }) => {
  const map = {
    "Active": "bg-green-100 text-green-700",
    "Admitted": "bg-blue-100 text-blue-700",
    "Discharged": "bg-gray-100 text-gray-600",
    "Confirmed": "bg-blue-100 text-blue-700",
    "Completed": "bg-green-100 text-green-700",
    "Pending": "bg-yellow-100 text-yellow-700",
    "Cancelled": "bg-red-100 text-red-700",
    "Available": "bg-green-100 text-green-700",
    "Occupied": "bg-red-100 text-red-700",
    "Maintenance": "bg-orange-100 text-orange-700",
    "Reserved": "bg-purple-100 text-purple-700",
    "On Duty": "bg-green-100 text-green-700",
    "Off Duty": "bg-gray-100 text-gray-600",
    "In Surgery": "bg-red-100 text-red-700",
    "Paid": "bg-green-100 text-green-700",
    "Partial": "bg-yellow-100 text-yellow-700",
    "Processing": "bg-blue-100 text-blue-700",
    "On Leave": "bg-orange-100 text-orange-700",
    "Normal": "bg-green-100 text-green-700",
    "Abnormal": "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color, trend }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "bg-blue-600 text-white", text: "text-blue-600" },
    teal: { bg: "bg-teal-50", icon: "bg-teal-600 text-white", text: "text-teal-600" },
    green: { bg: "bg-green-50", icon: "bg-green-600 text-white", text: "text-green-600" },
    amber: { bg: "bg-amber-50", icon: "bg-amber-500 text-white", text: "text-amber-600" },
    purple: { bg: "bg-purple-50", icon: "bg-purple-600 text-white", text: "text-purple-600" },
    red: { bg: "bg-red-50", icon: "bg-red-500 text-white", text: "text-red-600" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            ↑ {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm font-medium text-slate-600 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, action, onAction }) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-150"
      >
        <span>+</span> {action}
      </button>
    )}
  </div>
);

const SearchBar = ({ placeholder, value, onChange }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
    <input
      className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const Modal = ({ open, onClose, title, children, size = "md" }) => {
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const FormField = ({ label, type = "text", value, onChange, options, required, placeholder, hint }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === "select" ? (
      <select
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        value={value} onChange={e => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options?.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
        rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      />
    )}
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

const EmptyState = ({ icon, title, subtitle, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
    <p className="text-sm text-slate-400 mt-1 max-w-xs">{subtitle}</p>
    {action && (
      <button onClick={onAction} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl">
        {action}
      </button>
    )}
  </div>
);

// ============================================================
// SIDEBAR NAVIGATION CONFIG
// ============================================================
const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard", group: "main" },
  { id: "patients", icon: "👤", label: "Patients", group: "clinical" },
  { id: "doctors", icon: "🩺", label: "Doctors", group: "clinical" },
  { id: "staff", icon: "👥", label: "Staff & Nurses", group: "clinical" },
  { id: "departments", icon: "🏥", label: "Departments", group: "clinical" },
  { id: "appointments", icon: "📅", label: "Appointments", group: "operations" },
  { id: "opd", icon: "🏃", label: "OPD", group: "operations" },
  { id: "ipd", icon: "🛏", label: "IPD / Admissions", group: "operations" },
  { id: "beds", icon: "🏨", label: "Wards & Beds", group: "operations" },
  { id: "billing", icon: "💳", label: "Billing", group: "finance" },
  { id: "pharmacy", icon: "💊", label: "Pharmacy", group: "services" },
  { id: "laboratory", icon: "🔬", label: "Laboratory", group: "services" },
  { id: "radiology", icon: "📡", label: "Radiology", group: "services" },
  { id: "prescriptions", icon: "📋", label: "Prescriptions", group: "services" },
  { id: "records", icon: "📁", label: "Medical Records", group: "records" },
  { id: "hr", icon: "🧑‍💼", label: "HR & Payroll", group: "admin" },
  { id: "reports", icon: "📊", label: "Reports", group: "admin" },
  { id: "settings", icon: "⚙️", label: "Settings", group: "admin" },
];

const groupLabels = {
  main: null,
  clinical: "CLINICAL",
  operations: "OPERATIONS",
  finance: "FINANCE",
  services: "SERVICES",
  records: "RECORDS",
  admin: "ADMINISTRATION",
};

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => {
  const groups = [...new Set(navItems.map(n => n.group))];

  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300"
      style={{ width: collapsed ? 64 : 240, background: "#0D1B2A" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AH
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm leading-tight">AFGOI Hospital</div>
            <div className="text-blue-300 text-xs">AHMS v2.0</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 custom-scroll">
        {groups.map(group => {
          const items = navItems.filter(n => n.group === group);
          const label = groupLabels[group];
          return (
            <div key={group} className="mb-2">
              {label && !collapsed && (
                <div className="text-xs font-semibold text-slate-500 px-3 py-1.5 mb-1 uppercase tracking-wider">{label}</div>
              )}
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${
                    active === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-3 flex items-center justify-center py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 text-xs transition-all"
      >
        {collapsed ? "→" : "← Collapse"}
      </button>
    </aside>
  );
};

// ============================================================
// TOP NAVBAR
// ============================================================
const Navbar = ({ sidebarWidth, user, setPage }) => (
  <header
    className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100 shadow-sm"
    style={{ left: sidebarWidth }}
  >
    <div className="flex items-center gap-2">
      <div className="text-xs text-slate-400">AFGOI Hospital Management System</div>
    </div>
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
        🔔
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      {/* Quick add */}
      <button
        onClick={() => setPage("patients")}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
      >
        + Quick Add
      </button>
      {/* User */}
      <div className="flex items-center gap-2.5 cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          SA
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-slate-800">Super Admin</div>
          <div className="text-xs text-slate-400">AHMS Administrator</div>
        </div>
      </div>
    </div>
  </header>
);

// ============================================================
// MINI BAR CHART COMPONENT
// ============================================================
const MiniBarChart = ({ data, color = "#0A6EBD" }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-300"
            style={{ height: `${(d.value / max) * 56}px`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.5 }}
          />
          <span className="text-xs text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const DashboardPage = ({ setPage }) => {
  const weekData = [
    { label: "Mon", value: 45 }, { label: "Tue", value: 62 }, { label: "Wed", value: 38 },
    { label: "Thu", value: 71 }, { label: "Fri", value: 55 }, { label: "Sat", value: 30 }, { label: "Sun", value: 22 },
  ];
  const revenueData = [
    { label: "Jan", value: 18200 }, { label: "Feb", value: 22500 }, { label: "Mar", value: 19800 },
    { label: "Apr", value: 24100 }, { label: "May", value: 28600 }, { label: "Jun", value: 31200 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Good morning, Administrator 👋</h1>
            <p className="text-blue-100 text-sm mt-1">AFGOI Hospital Management System — Saturday, March 14, 2026</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-blue-200 text-xs">Surgeries Today</div>
            </div>
            <div className="w-px h-10 bg-blue-500" />
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-blue-200 text-xs">Doctors On Duty</div>
            </div>
            <div className="w-px h-10 bg-blue-500" />
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-blue-200 text-xs">ICU Occupied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👤" label="Total Patients" value="1,284" sub="↑ 23 this week" color="blue" trend="+8%" />
        <StatCard icon="📅" label="Today's Appointments" value="28" sub="5 pending confirmation" color="teal" trend="+3" />
        <StatCard icon="🛏" label="Beds Occupied" value="47/80" sub="58.7% occupancy rate" color="purple" />
        <StatCard icon="💰" label="Monthly Revenue" value="$31,200" sub="vs $28,600 last month" color="green" trend="+9%" />
        <StatCard icon="🏃" label="OPD Today" value="64" sub="18 waiting" color="amber" />
        <StatCard icon="💊" label="Pharmacy Sales" value="$2,840" sub="Today's dispensing" color="teal" />
        <StatCard icon="🔬" label="Lab Tests" value="38" sub="7 results pending" color="blue" />
        <StatCard icon="⚠️" label="Pending Bills" value="$8,950" sub="12 unpaid invoices" color="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Weekly Patient Flow</h3>
              <p className="text-xs text-slate-400 mt-0.5">Outpatient visits this week</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-medium">This Week</span>
          </div>
          <MiniBarChart data={weekData} color="#0A6EBD" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revenue trend (USD)</p>
            </div>
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg font-medium">2024</span>
          </div>
          <MiniBarChart data={revenueData} color="#16A34A" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Today's Appointments</h3>
            <button onClick={() => setPage("appointments")} className="text-xs text-blue-600 hover:underline font-medium">View All →</button>
          </div>
          <div className="p-2">
            {sampleAppointments.filter(a => a.date === "2024-03-14").map(apt => (
              <div key={apt.id} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                  {apt.patient.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{apt.patient}</div>
                  <div className="text-xs text-slate-400">{apt.doctor} · {apt.dept}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-600">{apt.time}</div>
                  <Badge status={apt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Department Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { name: "General Medicine", pct: 85, color: "bg-blue-500" },
              { name: "Cardiology", pct: 72, color: "bg-red-500" },
              { name: "Surgery", pct: 60, color: "bg-purple-500" },
              { name: "Gynecology", pct: 90, color: "bg-pink-500" },
              { name: "Pediatrics", pct: 45, color: "bg-amber-500" },
              { name: "Orthopedics", pct: 55, color: "bg-teal-500" },
            ].map(dept => (
              <div key={dept.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{dept.name}</span>
                  <span className="text-slate-400">{dept.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Admissions</h3>
          <button onClick={() => setPage("ipd")} className="text-xs text-blue-600 hover:underline font-medium">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold">Patient</th>
                <th className="text-left px-5 py-3 font-semibold">Ward / Bed</th>
                <th className="text-left px-5 py-3 font-semibold">Doctor</th>
                <th className="text-left px-5 py-3 font-semibold">Admitted</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleBeds.filter(b => b.status === "Occupied").map(bed => (
                <tr key={bed.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{bed.patient}</td>
                  <td className="px-5 py-3 text-slate-500">{bed.ward} · {bed.id}</td>
                  <td className="px-5 py-3 text-slate-500">{bed.doctor}</td>
                  <td className="px-5 py-3 text-slate-500">{bed.admDate}</td>
                  <td className="px-5 py-3"><Badge status="Admitted" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PATIENTS PAGE
// ============================================================
const PatientsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", gender: "", blood: "", phone: "", address: "", diagnosis: "" });

  const filtered = samplePatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  if (selectedPatient) {
    return (
      <div>
        <button onClick={() => setSelectedPatient(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-5 font-medium">
          ← Back to Patients
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Patient Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-3">
                {selectedPatient.name.charAt(0)}
              </div>
              <h2 className="text-lg font-bold text-slate-800">{selectedPatient.name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{selectedPatient.id}</p>
              <div className="mt-3"><Badge status={selectedPatient.status} /></div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Age", selectedPatient.age + " years"],
                ["Gender", selectedPatient.gender],
                ["Blood Group", selectedPatient.blood],
                ["Phone", selectedPatient.phone],
                ["DOB", selectedPatient.dob],
                ["Department", selectedPatient.dept],
                ["Doctor", selectedPatient.doctor],
                ["Visits", selectedPatient.visits],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">{k}</span>
                  <span className="text-slate-700 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Medical Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">Medical Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 font-medium mb-1">PRIMARY DIAGNOSIS</div>
                  <div className="font-semibold text-slate-700">{selectedPatient.diagnosis}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 font-medium mb-1">ALLERGIES</div>
                  <div className="font-semibold text-red-600">{selectedPatient.allergy}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 font-medium mb-1">INSURANCE</div>
                  <div className="font-semibold text-slate-700">{selectedPatient.insurance}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-400 font-medium mb-1">EMERGENCY CONTACT</div>
                  <div className="font-semibold text-slate-700 text-xs">{selectedPatient.emergency}</div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3">Address & Contact</h3>
              <div className="text-sm text-slate-600">{selectedPatient.address}</div>
              <div className="text-sm text-slate-600 mt-1">{selectedPatient.phone}</div>
            </div>

            {/* Recent Lab Results */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">Recent Lab Tests</h3>
              {sampleLabTests.filter(l => l.patientId === selectedPatient.id).length > 0 ? (
                <div className="space-y-2">
                  {sampleLabTests.filter(l => l.patientId === selectedPatient.id).map(lab => (
                    <div key={lab.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{lab.test}</div>
                        <div className="text-xs text-slate-400">{lab.date} · {lab.tech || "Unassigned"}</div>
                      </div>
                      <Badge status={lab.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 text-center py-4">No lab tests ordered yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Patient Management"
        subtitle={`${samplePatients.length} registered patients`}
        action="Register Patient"
        onAction={() => setShowModal(true)}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchBar placeholder="Search by name or patient ID..." value={search} onChange={setSearch} />
        </div>
        <div className="flex gap-2">
          {["All", "Active", "Admitted", "Discharged"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-blue-700">{samplePatients.filter(p => p.status === "Active").length}</div>
          <div className="text-xs text-blue-500 font-medium">Active</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-red-600">{samplePatients.filter(p => p.status === "Admitted").length}</div>
          <div className="text-xs text-red-500 font-medium">Admitted</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-gray-600">{samplePatients.filter(p => p.status === "Discharged").length}</div>
          <div className="text-xs text-gray-500 font-medium">Discharged</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 font-semibold">Patient</th>
              <th className="text-left px-5 py-3.5 font-semibold">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold">Age / Gender</th>
              <th className="text-left px-5 py-3.5 font-semibold">Blood</th>
              <th className="text-left px-5 py-3.5 font-semibold">Department</th>
              <th className="text-left px-5 py-3.5 font-semibold">Doctor</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{p.id}</td>
                <td className="px-5 py-3.5 text-slate-600">{p.age}y · {p.gender}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded">{p.blood}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{p.dept}</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs">{p.doctor}</td>
                <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => setSelectedPatient(p)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <EmptyState icon="👤" title="No patients found" subtitle="Try adjusting your search or filters" />
        )}
      </div>

      {/* Register Patient Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Register New Patient" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" value={form.name} onChange={v => setForm({...form, name: v})} required placeholder="Enter full name" />
          <FormField label="Date of Birth" type="date" value={form.dob} onChange={v => setForm({...form, dob: v})} required />
          <FormField label="Gender" type="select" value={form.gender} onChange={v => setForm({...form, gender: v})} options={["Male", "Female"]} required />
          <FormField label="Blood Group" type="select" value={form.blood} onChange={v => setForm({...form, blood: v})} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
          <FormField label="Phone Number" value={form.phone} onChange={v => setForm({...form, phone: v})} required placeholder="0912-XXX-XXX" />
          <FormField label="Department" type="select" value={form.dept} onChange={v => setForm({...form, dept: v})} options={departments.map(d => d.name)} />
          <FormField label="Emergency Contact" value={form.emergency} onChange={v => setForm({...form, emergency: v})} placeholder="Name | Phone" />
          <FormField label="Insurance" value={form.insurance} onChange={v => setForm({...form, insurance: v})} placeholder="Insurance provider (optional)" />
          <div className="col-span-2">
            <FormField label="Address" value={form.address} onChange={v => setForm({...form, address: v})} placeholder="District, City" />
          </div>
          <div className="col-span-2">
            <FormField label="Known Allergies" value={form.allergy} onChange={v => setForm({...form, allergy: v})} placeholder="List any known allergies or None" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Register Patient</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// DOCTORS PAGE
// ============================================================
const DoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = sampleDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-5 font-medium">← Back to Doctors</button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center text-3xl font-bold text-teal-600 mx-auto mb-3">
              {selected.name.replace("Dr. ", "").charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{selected.name}</h2>
            <p className="text-sm text-teal-600 font-medium mt-0.5">{selected.specialization}</p>
            <p className="text-xs text-slate-400 mt-0.5">{selected.id}</p>
            <div className="mt-3"><Badge status={selected.status} /></div>
            <div className="mt-5 space-y-2.5 text-sm text-left">
              {[["Department", selected.dept], ["Experience", selected.experience], ["Education", selected.education], ["Schedule", selected.schedule], ["Consultation", `$${selected.fee}`], ["Patients", selected.patients]].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-slate-700 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Upcoming Appointments</h3>
            {sampleAppointments.filter(a => a.doctor === selected.name).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                <div>
                  <div className="text-sm font-semibold text-slate-700">{apt.patient}</div>
                  <div className="text-xs text-slate-400">{apt.type} · {apt.date} at {apt.time}</div>
                </div>
                <Badge status={apt.status} />
              </div>
            ))}
            {sampleAppointments.filter(a => a.doctor === selected.name).length === 0 && (
              <div className="text-sm text-slate-400 text-center py-8">No appointments scheduled</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Doctor Management" subtitle={`${sampleDoctors.length} doctors registered`} action="Add Doctor" onAction={() => setShowModal(true)} />
      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search doctors..." value={search} onChange={setSearch} /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(doc)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-600">
                  {doc.name.replace("Dr. ", "").charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{doc.name}</div>
                  <div className="text-xs text-teal-600 font-medium">{doc.specialization}</div>
                </div>
              </div>
              <Badge status={doc.status} />
            </div>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between"><span>Department</span><span className="font-medium text-slate-700">{doc.dept}</span></div>
              <div className="flex justify-between"><span>Patients</span><span className="font-medium text-slate-700">{doc.patients}</span></div>
              <div className="flex justify-between"><span>Fee</span><span className="font-medium text-green-600">${doc.fee}</span></div>
              <div className="flex justify-between"><span>Schedule</span><span className="font-medium text-slate-700 text-right max-w-28 truncate">{doc.schedule}</span></div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Doctor" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" value="" onChange={() => {}} required placeholder="Dr. Full Name" />
          <FormField label="Specialization" value="" onChange={() => {}} required placeholder="e.g. Cardiologist" />
          <FormField label="Department" type="select" value="" onChange={() => {}} options={departments.map(d => d.name)} required />
          <FormField label="Consultation Fee ($)" type="number" value="" onChange={() => {}} required />
          <FormField label="Phone Number" value="" onChange={() => {}} required />
          <FormField label="Email Address" type="email" value="" onChange={() => {}} />
          <FormField label="Education / Qualifications" value="" onChange={() => {}} placeholder="e.g. MBBS, FRCS" />
          <FormField label="Experience" value="" onChange={() => {}} placeholder="e.g. 10 years" />
          <div className="col-span-2">
            <FormField label="Schedule" value="" onChange={() => {}} placeholder="e.g. Mon-Fri 8AM-4PM" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Add Doctor</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// APPOINTMENTS PAGE
// ============================================================
const AppointmentsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = sampleAppointments.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <SectionHeader title="Appointments" subtitle={`${sampleAppointments.length} total appointments`} action="Book Appointment" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Today", count: sampleAppointments.filter(a => a.date === "2024-03-14").length, color: "blue" },
          { label: "Pending", count: sampleAppointments.filter(a => a.status === "Pending").length, color: "amber" },
          { label: "Confirmed", count: sampleAppointments.filter(a => a.status === "Confirmed").length, color: "teal" },
          { label: "Completed", count: sampleAppointments.filter(a => a.status === "Completed").length, color: "green" },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-50 rounded-xl p-3 text-center cursor-pointer`} onClick={() => setFilter(s.label === "Today" ? "All" : s.label)}>
            <div className={`text-xl font-bold text-${s.color}-700`}>{s.count}</div>
            <div className={`text-xs text-${s.color}-500 font-medium`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search by patient or doctor..." value={search} onChange={setSearch} /></div>
        <div className="flex gap-2">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 font-semibold">Appt ID</th>
              <th className="text-left px-5 py-3.5 font-semibold">Patient</th>
              <th className="text-left px-5 py-3.5 font-semibold">Doctor</th>
              <th className="text-left px-5 py-3.5 font-semibold">Department</th>
              <th className="text-left px-5 py-3.5 font-semibold">Date & Time</th>
              <th className="text-left px-5 py-3.5 font-semibold">Type</th>
              <th className="text-left px-5 py-3.5 font-semibold">Fee</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{a.id}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{a.patient}</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs">{a.doctor}</td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{a.dept}</td>
                <td className="px-5 py-3.5">
                  <div className="text-slate-700 font-medium">{a.date}</div>
                  <div className="text-xs text-slate-400">{a.time}</div>
                </td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{a.type}</td>
                <td className="px-5 py-3.5 font-semibold text-green-600">${a.fee}</td>
                <td className="px-5 py-3.5"><Badge status={a.status} /></td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button className="text-xs text-red-500 hover:underline">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon="📅" title="No appointments found" subtitle="No appointments match your filters" />}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Book New Appointment" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value="" onChange={() => {}} options={samplePatients.map(p => p.name)} required />
          <FormField label="Doctor" type="select" value="" onChange={() => {}} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Department" type="select" value="" onChange={() => {}} options={departments.map(d => d.name)} required />
          <FormField label="Appointment Type" type="select" value="" onChange={() => {}} options={["Consultation", "Follow-up", "Pre-op Assessment", "Antenatal", "Emergency", "Review"]} />
          <FormField label="Date" type="date" value="" onChange={() => {}} required />
          <FormField label="Time" type="time" value="" onChange={() => {}} required />
          <div className="col-span-2">
            <FormField label="Notes" type="textarea" value="" onChange={() => {}} placeholder="Additional notes or reason for visit..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Book Appointment</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// BEDS / WARDS PAGE
// ============================================================
const BedsPage = () => {
  const [filter, setFilter] = useState("All");
  const bedStats = {
    Available: sampleBeds.filter(b => b.status === "Available").length,
    Occupied: sampleBeds.filter(b => b.status === "Occupied").length,
    Maintenance: sampleBeds.filter(b => b.status === "Maintenance").length,
    Reserved: sampleBeds.filter(b => b.status === "Reserved").length,
  };

  const filtered = filter === "All" ? sampleBeds : sampleBeds.filter(b => b.status === filter);

  return (
    <div>
      <SectionHeader title="Wards & Bed Management" subtitle={`${sampleBeds.length} beds across all wards`} action="Add Bed" />

      <div className="grid grid-cols-4 gap-3 mb-5">
        {Object.entries(bedStats).map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl border border-slate-100 p-4 text-center cursor-pointer hover:shadow-sm" onClick={() => setFilter(k)}>
            <div className="text-2xl font-bold text-slate-800">{v}</div>
            <div className="text-xs font-medium text-slate-400 mt-0.5">{k}</div>
            <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${
                k === "Available" ? "bg-green-500" :
                k === "Occupied" ? "bg-red-500" :
                k === "Maintenance" ? "bg-orange-500" : "bg-purple-500"
              }`} style={{ width: `${(v / sampleBeds.length) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        {["All", "Available", "Occupied", "Maintenance", "Reserved"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(bed => (
          <div key={bed.id} className={`bg-white rounded-2xl border-2 p-4 transition-all hover:shadow-md ${
            bed.status === "Available" ? "border-green-200" :
            bed.status === "Occupied" ? "border-red-200" :
            bed.status === "Maintenance" ? "border-orange-200" : "border-purple-200"
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-slate-800">{bed.id}</div>
                <div className="text-xs text-slate-400">{bed.type}</div>
              </div>
              <Badge status={bed.status} />
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <div><span className="font-medium text-slate-600">Ward:</span> {bed.ward}</div>
              <div><span className="font-medium text-slate-600">Room:</span> {bed.room}</div>
              {bed.patient && (
                <>
                  <div className="pt-2 border-t border-slate-100">
                    <div><span className="font-medium text-slate-600">Patient:</span> {bed.patient}</div>
                    <div><span className="font-medium text-slate-600">Doctor:</span> {bed.doctor}</div>
                    <div><span className="font-medium text-slate-600">Since:</span> {bed.admDate}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// BILLING PAGE
// ============================================================
const BillingPage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const totalRevenue = sampleBills.reduce((s, b) => s + b.paid, 0);
  const totalPending = sampleBills.reduce((s, b) => s + b.balance, 0);

  if (selectedBill) {
    return (
      <div>
        <button onClick={() => setSelectedBill(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-5 font-medium">← Back to Billing</button>
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {/* Invoice Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="text-2xl font-bold text-blue-600">AFGOI Hospital</div>
                <div className="text-sm text-slate-400">AFGOI Hospital Management System</div>
                <div className="text-xs text-slate-400 mt-1">Mogadishu, Somalia | Tel: +252-XXX-XXXX</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-800">INVOICE</div>
                <div className="text-sm text-slate-500 font-mono mt-1">{selectedBill.id}</div>
                <div className="text-xs text-slate-400 mt-1">Date: {selectedBill.date}</div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Bill To</div>
              <div className="font-bold text-slate-800">{selectedBill.patient}</div>
              <div className="text-sm text-slate-500">{selectedBill.patientId}</div>
            </div>

            {/* Items */}
            <table className="w-full text-sm mb-5">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                  <th className="text-left px-3 py-2.5 rounded-l-lg">Description</th>
                  <th className="text-right px-3 py-2.5 rounded-r-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-3 py-2.5 text-slate-700">{item.desc}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-700">${item.amt.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium">${selectedBill.total.toFixed(2)}</span></div>
              <div className="flex justify-between text-green-600"><span>Paid</span><span className="font-semibold">${selectedBill.paid.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-bold border-t border-slate-100 pt-2">
                <span>Balance Due</span>
                <span className={selectedBill.balance > 0 ? "text-red-600" : "text-green-600"}>${selectedBill.balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
              <Badge status={selectedBill.status} />
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200">🖨 Print</button>
                {selectedBill.balance > 0 && <button className="px-4 py-2 text-sm bg-blue-600 rounded-xl text-white hover:bg-blue-700">Record Payment</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Billing & Invoices" subtitle="Manage patient billing and payments" action="Create Invoice" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon="💰" label="Total Collected" value={`$${totalRevenue.toFixed(0)}`} color="green" />
        <StatCard icon="⏳" label="Outstanding" value={`$${totalPending.toFixed(0)}`} color="amber" />
        <StatCard icon="📄" label="Total Invoices" value={sampleBills.length} color="blue" />
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search invoices..." value={search} onChange={setSearch} /></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 font-semibold">Invoice #</th>
              <th className="text-left px-5 py-3.5 font-semibold">Patient</th>
              <th className="text-left px-5 py-3.5 font-semibold">Date</th>
              <th className="text-left px-5 py-3.5 font-semibold">Total</th>
              <th className="text-left px-5 py-3.5 font-semibold">Paid</th>
              <th className="text-left px-5 py-3.5 font-semibold">Balance</th>
              <th className="text-left px-5 py-3.5 font-semibold">Method</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleBills.map(bill => (
              <tr key={bill.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-blue-600 font-semibold">{bill.id}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{bill.patient}</td>
                <td className="px-5 py-3.5 text-slate-500">{bill.date}</td>
                <td className="px-5 py-3.5 font-medium text-slate-700">${bill.total.toFixed(2)}</td>
                <td className="px-5 py-3.5 font-medium text-green-600">${bill.paid.toFixed(2)}</td>
                <td className="px-5 py-3.5 font-medium text-red-600">${bill.balance.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">{bill.method || "—"}</td>
                <td className="px-5 py-3.5"><Badge status={bill.status} /></td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setSelectedBill(bill)} className="text-xs text-blue-600 hover:underline font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// PHARMACY PAGE
// ============================================================
const PharmacyPage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const lowStock = sampleMedicines.filter(m => m.stock <= m.reorder);

  const filtered = sampleMedicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Pharmacy & Inventory" subtitle="Medicine stock and dispensing management" action="Add Medicine" onAction={() => setShowModal(true)} />

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-amber-800">Low Stock Alert</div>
            <div className="text-xs text-amber-600 mt-1">{lowStock.map(m => m.name).join(", ")} — below reorder level</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="💊" label="Total Medicines" value={sampleMedicines.length} color="blue" />
        <StatCard icon="⚠️" label="Low Stock" value={lowStock.length} color="amber" />
        <StatCard icon="💵" label="Inventory Value" value={`$${sampleMedicines.reduce((s, m) => s + m.stock * m.price, 0).toLocaleString()}`} color="green" />
        <StatCard icon="📦" label="Categories" value={[...new Set(sampleMedicines.map(m => m.category))].length} color="purple" />
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search medicines..." value={search} onChange={setSearch} /></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 font-semibold">Medicine</th>
              <th className="text-left px-5 py-3.5 font-semibold">Category</th>
              <th className="text-left px-5 py-3.5 font-semibold">Stock</th>
              <th className="text-left px-5 py-3.5 font-semibold">Unit Price</th>
              <th className="text-left px-5 py-3.5 font-semibold">Expiry</th>
              <th className="text-left px-5 py-3.5 font-semibold">Supplier</th>
              <th className="text-left px-5 py-3.5 font-semibold">Batch</th>
              <th className="text-left px-5 py-3.5 font-semibold">Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(med => {
              const isLow = med.stock <= med.reorder;
              return (
                <tr key={med.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{med.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{med.category}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isLow ? "text-red-600" : "text-slate-700"}`}>{med.stock}</span>
                      <span className="text-xs text-slate-400">{med.unit}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-green-600">${med.price.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{med.expiry}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{med.supplier}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{med.batch}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={isLow ? "Pending" : "Active"} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// LABORATORY PAGE
// ============================================================
const LaboratoryPage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <SectionHeader title="Laboratory" subtitle="Test orders and results management" action="Order Test" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🔬" label="Total Tests" value={sampleLabTests.length} color="blue" />
        <StatCard icon="⏳" label="Pending" value={sampleLabTests.filter(l => l.status === "Pending").length} color="amber" />
        <StatCard icon="🔄" label="Processing" value={sampleLabTests.filter(l => l.status === "Processing").length} color="purple" />
        <StatCard icon="✅" label="Completed" value={sampleLabTests.filter(l => l.status === "Completed").length} color="green" />
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search tests..." value={search} onChange={setSearch} /></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 font-semibold">Test ID</th>
              <th className="text-left px-5 py-3.5 font-semibold">Patient</th>
              <th className="text-left px-5 py-3.5 font-semibold">Test</th>
              <th className="text-left px-5 py-3.5 font-semibold">Ordered By</th>
              <th className="text-left px-5 py-3.5 font-semibold">Date</th>
              <th className="text-left px-5 py-3.5 font-semibold">Technician</th>
              <th className="text-left px-5 py-3.5 font-semibold">Result</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold">Fee</th>
            </tr>
          </thead>
          <tbody>
            {sampleLabTests.map(lab => (
              <tr key={lab.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{lab.id}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{lab.patient}</td>
                <td className="px-5 py-3.5 text-slate-700">{lab.test}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{lab.orderedBy}</td>
                <td className="px-5 py-3.5 text-slate-500">{lab.date}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{lab.tech || <span className="text-slate-300">Unassigned</span>}</td>
                <td className="px-5 py-3.5">
                  {lab.result ? <Badge status={lab.result} /> : <span className="text-slate-300 text-xs">Pending</span>}
                </td>
                <td className="px-5 py-3.5"><Badge status={lab.status} /></td>
                <td className="px-5 py-3.5 font-medium text-green-600">${lab.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Order Lab Test" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value="" onChange={() => {}} options={samplePatients.map(p => p.name)} required />
          <FormField label="Ordered By (Doctor)" type="select" value="" onChange={() => {}} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Test Name" value="" onChange={() => {}} required placeholder="e.g. Complete Blood Count" />
          <FormField label="Test Category" type="select" value="" onChange={() => {}} options={["Hematology", "Biochemistry", "Microbiology", "Urine Analysis", "Hormones", "Imaging"]} />
          <FormField label="Priority" type="select" value="" onChange={() => {}} options={["Routine", "Urgent", "STAT"]} />
          <FormField label="Fee ($)" type="number" value="" onChange={() => {}} />
          <div className="col-span-2"><FormField label="Clinical Notes" type="textarea" value="" onChange={() => {}} placeholder="Clinical information or special instructions..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Order Test</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// DEPARTMENTS PAGE
// ============================================================
const DepartmentsPage = () => (
  <div>
    <SectionHeader title="Departments" subtitle={`${departments.length} active departments`} action="Add Department" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map(dept => (
        <div key={dept.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">🏥</div>
            <Badge status={dept.status} />
          </div>
          <h3 className="font-bold text-slate-800 mt-2">{dept.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{dept.desc}</p>
          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Head</span><span className="font-medium text-slate-700">{dept.head}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Doctors</span><span className="font-medium text-slate-700">{dept.doctors}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Staff</span><span className="font-medium text-slate-700">{dept.staff}</span></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// STAFF PAGE
// ============================================================
const StaffPage = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = sampleStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="Staff & Nurses" subtitle={`${sampleStaff.length} staff members`} action="Add Staff" onAction={() => setShowModal(true)} />
      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search staff..." value={search} onChange={setSearch} /></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 font-semibold">Staff Member</th>
              <th className="text-left px-5 py-3.5 font-semibold">ID</th>
              <th className="text-left px-5 py-3.5 font-semibold">Role</th>
              <th className="text-left px-5 py-3.5 font-semibold">Department</th>
              <th className="text-left px-5 py-3.5 font-semibold">Shift</th>
              <th className="text-left px-5 py-3.5 font-semibold">Salary</th>
              <th className="text-left px-5 py-3.5 font-semibold">Joined</th>
              <th className="text-left px-5 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{s.id}</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs font-medium">{s.role}</td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{s.dept}</td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{s.shift}</td>
                <td className="px-5 py-3.5 font-semibold text-green-600">${s.salary}/mo</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">{s.joinDate}</td>
                <td className="px-5 py-3.5"><Badge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Staff Member" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" value="" onChange={() => {}} required />
          <FormField label="Role" type="select" value="" onChange={() => {}} options={["Head Nurse", "Nurse", "Receptionist", "Pharmacist", "Lab Technician", "Radiologist", "Accountant", "HR Officer", "Security", "Cleaner"]} required />
          <FormField label="Department" type="select" value="" onChange={() => {}} options={departments.map(d => d.name)} required />
          <FormField label="Shift" type="select" value="" onChange={() => {}} options={["Morning", "Evening", "Night", "Rotating"]} />
          <FormField label="Phone Number" value="" onChange={() => {}} required />
          <FormField label="Email" type="email" value="" onChange={() => {}} />
          <FormField label="Monthly Salary ($)" type="number" value="" onChange={() => {}} required />
          <FormField label="Join Date" type="date" value="" onChange={() => {}} required />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Add Staff</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// IPD / ADMISSIONS PAGE
// ============================================================
const IPDPage = () => {
  const [showModal, setShowModal] = useState(false);
  const admittedBeds = sampleBeds.filter(b => b.status === "Occupied");

  return (
    <div>
      <SectionHeader title="IPD / Inpatient Admissions" subtitle={`${admittedBeds.length} currently admitted patients`} action="Admit Patient" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🛏" label="Total Admitted" value={admittedBeds.length} color="blue" />
        <StatCard icon="🏥" label="ICU Patients" value={sampleBeds.filter(b => b.status === "Occupied" && b.ward === "ICU").length} color="red" />
        <StatCard icon="🏨" label="General Ward" value={sampleBeds.filter(b => b.status === "Occupied" && b.ward.includes("General")).length} color="teal" />
        <StatCard icon="📊" label="Occupancy" value={`${Math.round((admittedBeds.length / sampleBeds.length) * 100)}%`} color="purple" />
      </div>

      <div className="space-y-3">
        {admittedBeds.map(bed => (
          <div key={bed.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                  {bed.patient.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{bed.patient}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span>🏥 {bed.ward}</span>
                    <span>🛏 {bed.id}</span>
                    <span>📅 Admitted {bed.admDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-slate-400">
                  <div className="font-medium text-slate-600">{bed.doctor}</div>
                  <div>Attending Doctor</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100">Progress Note</button>
                  <button className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100">Discharge</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Admit Patient" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value="" onChange={() => {}} options={samplePatients.map(p => p.name)} required />
          <FormField label="Attending Doctor" type="select" value="" onChange={() => {}} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Ward" type="select" value="" onChange={() => {}} options={["General Ward A", "General Ward B", "ICU", "Maternity Ward", "Pediatric Ward", "Surgical Ward"]} required />
          <FormField label="Bed" type="select" value="" onChange={() => {}} options={sampleBeds.filter(b => b.status === "Available").map(b => b.id)} required />
          <FormField label="Admission Date" type="date" value="" onChange={() => {}} required />
          <FormField label="Reason for Admission" value="" onChange={() => {}} placeholder="Primary diagnosis/reason" required />
          <div className="col-span-2"><FormField label="Admission Notes" type="textarea" value="" onChange={() => {}} placeholder="Clinical notes, treatment plan..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Admit Patient</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// OPD PAGE
// ============================================================
const OPDPage = () => (
  <div>
    <SectionHeader title="OPD — Outpatient Department" subtitle="Daily outpatient consultations" action="Register Visit" />
    <div className="grid grid-cols-3 gap-4 mb-5">
      <StatCard icon="🏃" label="OPD Today" value="64" sub="18 waiting" color="blue" />
      <StatCard icon="✅" label="Seen Today" value="46" color="green" />
      <StatCard icon="⏱" label="Avg Wait Time" value="22 min" color="amber" />
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Waiting Queue</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {samplePatients.slice(0, 4).map((p, i) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">{p.name}</div>
              <div className="text-xs text-slate-400">{p.id} · {p.dept}</div>
            </div>
            <div className="text-xs text-slate-400">Waiting: {10 + i * 5} min</div>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium">Call In</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// REPORTS PAGE
// ============================================================
const ReportsPage = () => {
  const reports = [
    { icon: "👤", title: "Patient Report", desc: "Registrations, demographics, visit history", color: "blue" },
    { icon: "📅", title: "Appointment Report", desc: "Scheduling trends and completion rates", color: "teal" },
    { icon: "💰", title: "Revenue Report", desc: "Billing, payments and outstanding amounts", color: "green" },
    { icon: "💊", title: "Pharmacy Report", desc: "Sales, stock and dispensing analytics", color: "amber" },
    { icon: "🛏", title: "Bed Occupancy Report", desc: "Ward utilization and capacity metrics", color: "purple" },
    { icon: "👥", title: "Staff Report", desc: "Employee records and HR analytics", color: "blue" },
    { icon: "🕐", title: "Attendance Report", desc: "Daily and monthly attendance tracking", color: "teal" },
    { icon: "🔬", title: "Lab Report", desc: "Test volumes and turnaround times", color: "purple" },
    { icon: "🏥", title: "Admission / Discharge", desc: "IPD flow and discharge summaries", color: "red" },
  ];

  return (
    <div>
      <SectionHeader title="Reports & Analytics" subtitle="Generate and export operational reports" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <div key={r.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-11 h-11 rounded-xl bg-${r.color}-100 flex items-center justify-center text-xl mb-3`}>
              {r.icon}
            </div>
            <h3 className="font-bold text-slate-800">{r.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100">View</button>
              <button className="px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100">Export CSV</button>
              <button className="px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100">PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// HR PAGE
// ============================================================
const HRPage = () => (
  <div>
    <SectionHeader title="HR & Payroll" subtitle="Human resources and salary management" />
    <div className="grid grid-cols-4 gap-3 mb-5">
      <StatCard icon="👥" label="Total Employees" value="87" color="blue" />
      <StatCard icon="💸" label="Monthly Payroll" value="$52,400" color="green" />
      <StatCard icon="🌴" label="On Leave" value="5" color="amber" />
      <StatCard icon="📋" label="Pending Leaves" value="3" color="purple" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4">Payroll Summary — March 2024</h3>
        <div className="space-y-3">
          {[
            { dept: "Doctors", count: 12, total: 22800 },
            { dept: "Nursing Staff", count: 25, total: 14500 },
            { dept: "Pharmacy", count: 5, total: 3750 },
            { dept: "Laboratory", count: 8, total: 5600 },
            { dept: "Administration", count: 10, total: 5250 },
            { dept: "Support Staff", count: 27, total: 500 },
          ].map(row => (
            <div key={row.dept} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm font-semibold text-slate-700">{row.dept}</div>
                <div className="text-xs text-slate-400">{row.count} employees</div>
              </div>
              <div className="font-bold text-green-600">${row.total.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4">Pending Leave Requests</h3>
        <div className="space-y-3">
          {[
            { name: "Fadumo Osman", role: "Head Nurse", type: "Annual Leave", dates: "Mar 20–25", days: 5 },
            { name: "Ahmed Bile", role: "Receptionist", type: "Sick Leave", dates: "Mar 15–16", days: 2 },
            { name: "Mohamed Isse", role: "Lab Technician", type: "Emergency Leave", dates: "Mar 14", days: 1 },
          ].map(req => (
            <div key={req.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <div className="text-sm font-semibold text-slate-700">{req.name}</div>
                <div className="text-xs text-slate-400">{req.role} · {req.type} · {req.dates}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-lg font-medium">Approve</button>
                <button className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg font-medium">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// SETTINGS PAGE
// ============================================================
const SettingsPage = () => {
  const [hospitalName, setHospitalName] = useState("AFGOI Hospital");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Africa/Mogadishu");

  return (
    <div>
      <SectionHeader title="System Settings" subtitle="Configure AHMS system preferences" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Hospital Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Hospital Name" value={hospitalName} onChange={setHospitalName} required />
              <FormField label="Short Name / Abbreviation" value="AHMS" onChange={() => {}} />
              <FormField label="Phone" value="+252-XXX-XXXX" onChange={() => {}} />
              <FormField label="Email" value="info@afgoi-hospital.so" onChange={() => {}} type="email" />
              <div className="col-span-2"><FormField label="Address" value="Mogadishu, Somalia" onChange={() => {}} /></div>
            </div>
            <button className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Changes</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">System Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Currency" type="select" value={currency} onChange={setCurrency} options={["USD", "SOS", "EUR", "GBP"]} />
              <FormField label="Time Zone" type="select" value={timezone} onChange={setTimezone} options={["Africa/Mogadishu", "Africa/Nairobi", "UTC", "Europe/London"]} />
              <FormField label="Date Format" type="select" value="YYYY-MM-DD" onChange={() => {}} options={["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]} />
              <FormField label="Language" type="select" value="English" onChange={() => {}} options={["English", "Somali", "Arabic"]} />
            </div>
            <button className="mt-4 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Preferences</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">User Roles</h3>
            <div className="space-y-2">
              {["Super Admin", "Admin", "Doctor", "Nurse", "Receptionist", "Pharmacist", "Lab Technician", "Radiologist", "Accountant", "HR Manager"].map(role => (
                <div key={role} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">{role}</span>
                  <button className="text-xs text-blue-600 hover:underline">Permissions</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="text-sm font-bold text-blue-800 mb-1">AHMS Version 2.0</div>
            <div className="text-xs text-blue-500">AFGOI Hospital Management System</div>
            <div className="text-xs text-blue-400 mt-2">© 2024 AFGOI Hospital. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PLACEHOLDER PAGES
// ============================================================
const PlaceholderPage = ({ title, icon, subtitle }) => (
  <div>
    <SectionHeader title={title} subtitle={subtitle} action={`New ${title.split(" ")[0]}`} />
    <EmptyState icon={icon} title={`${title} Module`} subtitle="This module is ready for full implementation with backend API integration. All UI components and data structures are defined." action="Connect to Backend" />
  </div>
);

// ============================================================
// PAGE ROUTER
// ============================================================
const PageRouter = ({ page, setPage }) => {
  const pages = {
    dashboard: <DashboardPage setPage={setPage} />,
    patients: <PatientsPage />,
    doctors: <DoctorsPage />,
    staff: <StaffPage />,
    departments: <DepartmentsPage />,
    appointments: <AppointmentsPage />,
    opd: <OPDPage />,
    ipd: <IPDPage />,
    beds: <BedsPage />,
    billing: <BillingPage />,
    pharmacy: <PharmacyPage />,
    laboratory: <LaboratoryPage />,
    radiology: <PlaceholderPage title="Radiology" icon="📡" subtitle="Imaging requests and radiology reports" />,
    prescriptions: <PlaceholderPage title="Prescriptions" icon="📋" subtitle="Doctor prescriptions and medicine orders" />,
    records: <PlaceholderPage title="Medical Records" icon="📁" subtitle="Complete patient clinical history" />,
    hr: <HRPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };
  return pages[page] || <DashboardPage setPage={setPage} />;
};

// ============================================================
// LOGIN PAGE
// ============================================================
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="min-h-screen flex" style={{ background: "#F0F4F8" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16" style={{ background: "#0D1B2A" }}>
        <div className="max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold text-2xl mb-8">
            AH
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            AFGOI Hospital<br />Management System
          </h1>
          <p className="text-blue-200 text-lg">
            AHMS — A complete, modern platform for streamlined hospital operations, patient care, and clinical management.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[["1,284+", "Patients Registered"], ["28", "Doctors on Staff"], ["80", "Beds Managed"], ["20+", "Modules Available"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{v}</div>
                <div className="text-blue-300 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-8">
              <div className="lg:hidden flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">AH</div>
                <span className="font-bold text-slate-800">AFGOI AHMS</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-slate-400 mt-1.5 text-sm">Sign in to your AHMS account</p>
            </div>

            <div className="space-y-4">
              <FormField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="admin@ahms.so" required />
              <FormField label="Password" type="password" value={pass} onChange={setPass} placeholder="Enter your password" required />
            </div>

            <button
              onClick={onLogin}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-150"
            >
              Sign In to AHMS
            </button>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-600 text-center">
              Demo credentials: admin@ahms.so / any password
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["Super Admin", "Doctor", "Nurse", "Receptionist"].map(role => (
                <button key={role} onClick={onLogin} className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                  Login as {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            AFGOI Hospital Management System v2.0 · Secure Access
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 64 : 240;

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F0F4F8" }}>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Navbar sidebarWidth={sidebarWidth} setPage={setPage} />

      <main
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6 max-w-screen-2xl mx-auto">
          <PageRouter page={page} setPage={setPage} />
        </div>
      </main>
    </div>
  );
}
