import { useState, useEffect, createContext, useContext } from "react";

// ============================================================
// DESIGN TOKENS & THEME
// ============================================================
const theme = {
  colors: {
    primary: "#2F6FED",
    primaryDark: "#1A56D6",
    primaryLight: "#EBF2FF",
    accent: "#1BBE9E",
    accentLight: "#E0FAF5",
    danger: "#E53935",
    dangerLight: "#FFEBEE",
    warning: "#F59E0B",
    warningLight: "#FFF8E1",
    success: "#16A34A",
    successLight: "#DCFCE7",
    purple: "#7C3AED",
    purpleLight: "#EDE9FE",
    neutral: "#64748B",
    bg: "#F4F7FB",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: "#1E293B",
    textMuted: "#64748B",
    sidebar: "#0D1B2A",
    sidebarHover: "#1A2E45",
    sidebarActive: "#2F6FED",
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
  year:       "2026",
  tech:       "Sahal Tech",
};

// AFGOI Hospital Shield Logo — faithful SVG recreation
const AfgoiShieldSVG = ({ style, className }) => (
  <svg viewBox="0 0 120 148" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* Shield outer — dark navy */}
    <path d="M60 2 L116 28 L116 82 Q116 130 60 146 Q4 130 4 82 L4 28 Z" fill="#1B3A6B"/>
    {/* Shield inner — sky blue */}
    <path d="M60 11 L108 34 L108 80 Q108 122 60 136 Q12 122 12 80 L12 34 Z" fill="#87CEEB"/>
    {/* Cloud streaks */}
    <ellipse cx="44" cy="38" rx="16" ry="5" fill="white" opacity="0.55"/>
    <ellipse cx="80" cy="32" rx="10" ry="4" fill="white" opacity="0.45"/>
    {/* Sun */}
    <circle cx="87" cy="42" r="11" fill="white" opacity="0.92"/>
    <circle cx="87" cy="42" r="8" fill="#FDD835" opacity="0.7"/>
    {/* White tower / minaret */}
    <rect x="22" y="56" width="15" height="36" rx="1.5" fill="white" opacity="0.95"/>
    <path d="M20 57 L37 57 L37 52 L29.5 42 L28.5 42 L21 52 Z" fill="white" opacity="0.95"/>
    <ellipse cx="29" cy="42" rx="5" ry="4" fill="white" opacity="0.95"/>
    {/* Green hills */}
    <ellipse cx="74" cy="97" rx="38" ry="17" fill="#2E7D32"/>
    <ellipse cx="55" cy="100" rx="22" ry="12" fill="#388E3C"/>
    {/* Palm trunk 1 */}
    <rect x="79" y="68" width="3" height="30" rx="1" fill="#5D4037"/>
    {/* Palm leaves 1 */}
    <path d="M80 68 Q95 60 98 53 Q86 62 80 68Z" fill="#388E3C"/>
    <path d="M80 68 Q95 68 100 63 Q88 66 80 68Z" fill="#2E7D32"/>
    <path d="M80 68 Q65 60 62 53 Q74 62 80 68Z" fill="#43A047"/>
    <path d="M80 68 Q68 72 64 68 Q73 68 80 68Z" fill="#388E3C"/>
    {/* Palm trunk 2 (smaller) */}
    <rect x="92" y="76" width="2.5" height="22" rx="1" fill="#6D4C41"/>
    <path d="M93 76 Q103 70 106 65 Q97 72 93 76Z" fill="#43A047"/>
    <path d="M93 76 Q83 70 80 65 Q89 72 93 76Z" fill="#2E7D32"/>
    {/* Red heart */}
    <path d="M60 118 C42 100 18 103 18 120 C18 133 38 141 60 152 C82 141 102 133 102 120 C102 103 78 100 60 118Z" fill="#C62828"/>
    <path d="M60 118 C44 102 22 105 22 120 C22 132 40 140 60 150 C80 140 98 132 98 120 C98 105 76 102 60 118Z" fill="#D32F2F"/>
    {/* ECG heartbeat line */}
    <polyline points="28,120 35,120 39,110 43,130 48,114 55,120 65,120 69,110 73,120 92,120"
      stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Laurel leaves — left */}
    <path d="M14 122 Q4 114 4 102 Q10 113 16 120Z" fill="#2E7D32"/>
    <path d="M12 130 Q1 124 0 112 Q7 122 14 128Z" fill="#388E3C"/>
    <path d="M14 138 Q3 134 1 122 Q9 130 16 136Z" fill="#2E7D32"/>
    {/* Laurel leaves — right */}
    <path d="M106 122 Q116 114 116 102 Q110 113 104 120Z" fill="#2E7D32"/>
    <path d="M108 130 Q119 124 120 112 Q113 122 106 128Z" fill="#388E3C"/>
    <path d="M106 138 Q117 134 119 122 Q111 130 104 136Z" fill="#2E7D32"/>
  </svg>
);

// Reusable logo mark component
const HospitalLogo = ({ size = "md", light = false }) => {
  const sizes = {
    sm:  { w: 36,  h: 44  },
    md:  { w: 44,  h: 54  },
    lg:  { w: 58,  h: 70  },
    xl:  { w: 80,  h: 97  },
  };
  const s = sizes[size];
  return (
    <AfgoiShieldSVG
      style={{ width: s.w, height: s.h, opacity: light ? 0.85 : 1, flexShrink: 0 }}
    />
  );
};

// Document letterhead — used on invoices, lab reports, prescriptions, etc.
const DocumentHeader = ({ title, subtitle, docId, docDate, extra }) => (
  <div className="border-b-2 border-blue-600 pb-5 mb-6 print-header">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <HospitalLogo size="lg" />
        <div>
          <div className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">{HOSPITAL.name.toUpperCase()}</div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-0.5">{HOSPITAL.systemName} ({HOSPITAL.shortName})</div>
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

// Doctor electronic signature block — appended to prescriptions & reports
const DoctorSignatureBlock = ({ doctor }) => {
  const doc = sampleDoctors.find(d => d.name === doctor) || {};
  return (
    <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between">
      <div>
        <div className="text-xs text-slate-400 mb-1">Issued by:</div>
        <div className="w-40 h-14 border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50 mb-1">
          {doc.signature
            ? <img src={doc.signature} alt="signature" className="max-h-12 max-w-full object-contain" />
            : <div className="text-slate-300 text-xs text-center leading-tight">Electronic<br/>Signature</div>
          }
        </div>
        <div className="text-sm font-bold text-slate-800">{doctor || doc.name}</div>
        <div className="text-xs text-slate-500">{doc.specialization || "Medical Officer"}</div>
        <div className="text-xs text-blue-600 font-medium">{HOSPITAL.name}</div>
      </div>
      <div className="text-right text-xs text-slate-400">
        <div>Reg. No: {doc.id || "AHMS-D000"}</div>
        <div>{doc.education || "MBBS"}</div>
        <div>Experience: {doc.experience || "—"}</div>
      </div>
    </div>
  );
};

// System-wide footer bar (for dashboard/app footer)
const SystemFooter = () => (
  <footer className="mt-10 pt-5 pb-4 border-t border-slate-200 no-print">
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
    <div className="text-center mt-2 text-xs text-slate-400">
      © {HOSPITAL.year} {HOSPITAL.fullName}. All Rights Reserved.
      &nbsp;·&nbsp; {HOSPITAL.tagline}
    </div>
    <div className="text-center mt-1 text-xs text-slate-300">
      Powered by <span className="font-semibold text-slate-400">{HOSPITAL.tech}</span>
    </div>
  </footer>
);

// Print a document open in a modal — triggered by "Print" / "Download PDF" buttons
const handlePrint = () => window.print();

// ============================================================
// PRINT PREVIEW MODAL
// Usage: <PrintPreviewModal open={show} onClose={()=>setShow(false)}
//          title="Prescription" docId="RX-001" docDate="2026-03-15"
//          doctor="Dr. Ahmed Ali" subtitle="Outpatient Prescription">
//          {/* document body content */}
//        </PrintPreviewModal>
// ============================================================
const PrintPreviewModal = ({ open, onClose, title, subtitle, docId, docDate, doctor, children }) => {
  if (!open) return null;
  const doPrint = () => setTimeout(() => window.print(), 80);

  // Shared document body used in both screen preview and actual print
  const docBody = (
    <>
      <DocumentHeader title={title} subtitle={subtitle} docId={docId} docDate={docDate} />
      <div style={{ marginTop: 16 }}>{children}</div>
      {doctor && <DoctorSignatureBlock doctor={doctor} />}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #E2E8F0", textAlign: "center", fontSize: 11, color: "#94A3B8", lineHeight: 1.6 }}>
        <div style={{ fontWeight: 600, color: "#64748B" }}>{HOSPITAL.fullName} · {HOSPITAL.systemName} ({HOSPITAL.shortName})</div>
        <div>{HOSPITAL.address}</div>
        <div>{HOSPITAL.tel} &nbsp;·&nbsp; {HOSPITAL.email} &nbsp;·&nbsp; {HOSPITAL.website}</div>
        <div style={{ marginTop: 4, color: "#1BBE9E", fontWeight: 600 }}>{HOSPITAL.tagline} · Powered by {HOSPITAL.tech}</div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Screen modal chrome — ALL hidden during print via no-print ── */}
      <div className="no-print fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8" style={{ background: "rgba(0,0,0,0.6)" }}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 mb-8">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
            <div>
              <div className="font-bold text-slate-800 text-base">🖨 Print Preview</div>
              <div className="text-xs text-slate-500 mt-0.5">{title}{docId ? ` — ${docId}` : ""}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium">
                ✕ Cancel
              </button>
              <button onClick={doPrint} className="px-5 py-2 text-sm rounded-lg font-semibold text-white" style={{ background: "#2F6FED" }}>
                🖨 Print Document
              </button>
            </div>
          </div>

          {/* Screen-only preview (visual clone — not used for actual printing) */}
          <div className="p-6">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              {docBody}
            </div>
          </div>

        </div>
      </div>

      {/* ── ACTUAL PRINT AREA ── rendered OUTSIDE no-print so printer sees it ──
          Hidden on screen via @media screen CSS; shown only when printing.       */}
      <div className="print-area">
        {docBody}
      </div>
    </>
  );
};

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
  { id: "AHMS-D004", name: "Dr. Yusuf Garad", specialization: "General Surgeon", dept: "Surgery", fee: 200, phone: "0912-004-004", email: "y.garad@ahms.so", status: "In Surgery", patients: 31, schedule: "Mon-Fri 6AM-2PM", experience: "15 years", education: "MBBS, FRCS" },
  { id: "AHMS-D005", name: "Dr. Nimco Osman", specialization: "Orthopedic Surgeon", dept: "Orthopedics", fee: 180, phone: "0912-005-005", email: "n.osman@ahms.so", status: "On Duty", patients: 27, schedule: "Mon-Thu 8AM-4PM", experience: "11 years", education: "MBBS, FRCS(Orth)" },
  { id: "AHMS-D006", name: "Dr. Hodan Ali", specialization: "Obstetrician & Gynecologist", dept: "Gynecology", fee: 160, phone: "0912-006-006", email: "h.ali@ahms.so", status: "On Duty", patients: 35, schedule: "Daily 8AM-6PM", experience: "9 years", education: "MBBS, MRCOG" },
  { id: "AHMS-D007", name: "Dr. Amina Warsame", specialization: "Pediatrician", dept: "Pediatrics", fee: 120, phone: "0912-007-007", email: "a.warsame@ahms.so", status: "On Duty", patients: 38, schedule: "Mon-Fri 8AM-4PM", experience: "9 years", education: "MBBS, DCH, MRCPCH" },
  { id: "AHMS-D008", name: "Dr. Hassan Farah", specialization: "Diagnostic Radiologist", dept: "Radiology", fee: 140, phone: "0912-008-008", email: "h.farah@ahms.so", status: "On Duty", patients: 22, schedule: "Mon-Sat 7AM-3PM", experience: "7 years", education: "MBBS, FRCR" },
  { id: "AHMS-D009", name: "Dr. Bile Muse", specialization: "Emergency Physician", dept: "Emergency", fee: 100, phone: "0912-009-009", email: "b.muse@ahms.so", status: "On Duty", patients: 55, schedule: "24/7 Rotation", experience: "10 years", education: "MBBS, MRCEM" },
  { id: "AHMS-D010", name: "Dr. Ifrah Ahmed", specialization: "Neurologist", dept: "Neurology", fee: 170, phone: "0912-010-010", email: "i.ahmed@ahms.so", status: "On Duty", patients: 20, schedule: "Mon-Thu 9AM-5PM", experience: "13 years", education: "MD, MRCP(Neurology)" },
  { id: "AHMS-D011", name: "Dr. Abdirashid Jama", specialization: "Ophthalmologist", dept: "Ophthalmology", fee: 150, phone: "0912-011-011", email: "a.jama@ahms.so", status: "On Duty", patients: 18, schedule: "Mon-Fri 8AM-4PM", experience: "8 years", education: "MBBS, DO, FRCS(Ophth)" },
  { id: "AHMS-D012", name: "Dr. Shukri Mohamed", specialization: "ENT Specialist", dept: "ENT", fee: 130, phone: "0912-012-012", email: "s.mohamed@ahms.so", status: "On Duty", patients: 25, schedule: "Mon-Fri 9AM-5PM", experience: "11 years", education: "MBBS, MS(ENT), DLO" },
  { id: "AHMS-D013", name: "Dr. Ladan Abdi", specialization: "Dermatologist", dept: "Dermatology", fee: 120, phone: "0912-013-013", email: "l.abdi@ahms.so", status: "On Duty", patients: 30, schedule: "Tue-Sat 9AM-4PM", experience: "6 years", education: "MBBS, MRCP(Derm)" },
  { id: "AHMS-D014", name: "Dr. Muse Osman", specialization: "Psychiatrist", dept: "Psychiatry", fee: 160, phone: "0912-014-014", email: "m.osman@ahms.so", status: "On Duty", patients: 15, schedule: "Mon-Fri 10AM-6PM", experience: "14 years", education: "MBBS, MRCPsych" },
  { id: "AHMS-D015", name: "Dr. Deeqa Hassan", specialization: "Urologist", dept: "Urology", fee: 170, phone: "0912-015-015", email: "d.hassan@ahms.so", status: "On Duty", patients: 16, schedule: "Mon-Thu 8AM-4PM", experience: "9 years", education: "MBBS, FRCS(Urol)" },
  { id: "AHMS-D016", name: "Dr. Faisal Nur", specialization: "Nephrologist", dept: "Nephrology", fee: 160, phone: "0912-016-016", email: "f.nur@ahms.so", status: "On Duty", patients: 19, schedule: "Mon-Fri 8AM-4PM", experience: "11 years", education: "MBBS, MD, DM(Nephrology)" },
  { id: "AHMS-D017", name: "Dr. Ayan Mohamud", specialization: "Oncologist", dept: "Oncology", fee: 200, phone: "0912-017-017", email: "a.mohamud@ahms.so", status: "On Duty", patients: 14, schedule: "Mon-Fri 8AM-5PM", experience: "15 years", education: "MBBS, MD, DM(Oncology)" },
  { id: "AHMS-D018", name: "Dr. Khadar Shire", specialization: "Anesthesiologist", dept: "Anesthesia", fee: 250, phone: "0912-018-018", email: "k.shire@ahms.so", status: "In Surgery", patients: 0, schedule: "Mon-Fri 7AM-7PM", experience: "12 years", education: "MBBS, MD, DA, FRCA" },
  { id: "AHMS-D019", name: "Dr. Hodan Warsame", specialization: "Gastroenterologist", dept: "Gastroenterology", fee: 160, phone: "0912-019-019", email: "h.warsame@ahms.so", status: "On Duty", patients: 21, schedule: "Mon-Fri 9AM-5PM", experience: "10 years", education: "MBBS, MD, DM(Gastro)" },
  { id: "AHMS-D020", name: "Dr. Yahye Ibrahim", specialization: "Intensivist / Critical Care", dept: "ICU", fee: 200, phone: "0912-020-020", email: "y.ibrahim@ahms.so", status: "On Duty", patients: 8, schedule: "24/7 Rotation", experience: "11 years", education: "MBBS, FRCA, FICM" },
  { id: "AHMS-D021", name: "Dr. Habibo Said", specialization: "Endocrinologist", dept: "Endocrinology", fee: 155, phone: "0912-021-021", email: "h.said@ahms.so", status: "On Duty", patients: 17, schedule: "Mon-Wed-Fri 9AM-4PM", experience: "8 years", education: "MBBS, MRCP, CCT(Endocrinology)" },
  { id: "AHMS-D022", name: "Dr. Mukhtar Ali", specialization: "Rheumatologist", dept: "Rheumatology", fee: 155, phone: "0912-022-022", email: "m.ali@ahms.so", status: "On Duty", patients: 13, schedule: "Mon-Thu 9AM-5PM", experience: "10 years", education: "MBBS, MRCP(Rheumatology)" },
  { id: "AHMS-D023", name: "Dr. Farhia Osman", specialization: "Hematologist", dept: "Hematology", fee: 165, phone: "0912-023-023", email: "f.osman@ahms.so", status: "On Duty", patients: 12, schedule: "Mon-Fri 8AM-4PM", experience: "9 years", education: "MBBS, MD, DM(Hematology)" },
  { id: "AHMS-D024", name: "Dr. Nasteho Hirsi", specialization: "Physiotherapist", dept: "Physiotherapy", fee: 60, phone: "0912-024-024", email: "n.hirsi@ahms.so", status: "On Duty", patients: 28, schedule: "Mon-Sat 8AM-5PM", experience: "7 years", education: "BPT, MPT" },
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
  { id: "DEPT-01", name: "Cardiology", head: "Dr. Fatima Noor", doctors: 3, staff: 8, status: "Active", desc: "Heart and cardiovascular disease management", icon: "❤️" },
  { id: "DEPT-02", name: "General Medicine", head: "Dr. Omar Sharif", doctors: 5, staff: 15, status: "Active", desc: "Primary care and general medical conditions", icon: "🩺" },
  { id: "DEPT-03", name: "Surgery", head: "Dr. Yusuf Garad", doctors: 4, staff: 12, status: "Active", desc: "Surgical procedures and post-op care", icon: "🔪" },
  { id: "DEPT-04", name: "Gynecology & Obstetrics", head: "Dr. Hodan Ali", doctors: 3, staff: 10, status: "Active", desc: "Women's health, maternity and antenatal care", icon: "🤰" },
  { id: "DEPT-05", name: "Pediatrics", head: "Dr. Amina Warsame", doctors: 3, staff: 9, status: "Active", desc: "Children's health and development", icon: "👶" },
  { id: "DEPT-06", name: "Radiology & Imaging", head: "Dr. Hassan Farah", doctors: 2, staff: 6, status: "Active", desc: "Medical imaging, X-Ray, CT, MRI and Ultrasound", icon: "📡" },
  { id: "DEPT-07", name: "Laboratory", head: "Dr. Ifrah Ahmed", doctors: 1, staff: 8, status: "Active", desc: "Clinical pathology and diagnostic testing", icon: "🔬" },
  { id: "DEPT-08", name: "Pharmacy", head: "Nasra Hassan", doctors: 0, staff: 5, status: "Active", desc: "Medicine dispensing and pharmaceutical care", icon: "💊" },
  { id: "DEPT-09", name: "Emergency", head: "Dr. Bile Muse", doctors: 6, staff: 20, status: "Active", desc: "24/7 emergency and trauma care", icon: "🚨" },
  { id: "DEPT-10", name: "Orthopedics", head: "Dr. Nimco Osman", doctors: 2, staff: 7, status: "Active", desc: "Bone, joint, and musculoskeletal care", icon: "🦴" },
  { id: "DEPT-11", name: "ICU", head: "Dr. Yahye Ibrahim", doctors: 3, staff: 12, status: "Active", desc: "Intensive care for critically ill patients", icon: "💓" },
  { id: "DEPT-12", name: "Neurology", head: "Dr. Ifrah Ahmed", doctors: 2, staff: 6, status: "Active", desc: "Neurological disorders, stroke and epilepsy care", icon: "🧠" },
  { id: "DEPT-13", name: "Ophthalmology", head: "Dr. Abdirashid Jama", doctors: 2, staff: 5, status: "Active", desc: "Eye care, vision and ocular disease management", icon: "👁️" },
  { id: "DEPT-14", name: "ENT", head: "Dr. Shukri Mohamed", doctors: 2, staff: 5, status: "Active", desc: "Ear, nose and throat specialist care", icon: "👂" },
  { id: "DEPT-15", name: "Dermatology", head: "Dr. Ladan Abdi", doctors: 2, staff: 4, status: "Active", desc: "Skin, hair and nail disease management", icon: "🩹" },
  { id: "DEPT-16", name: "Psychiatry", head: "Dr. Muse Osman", doctors: 2, staff: 6, status: "Active", desc: "Mental health and psychiatric care", icon: "🧘" },
  { id: "DEPT-17", name: "Urology", head: "Dr. Deeqa Hassan", doctors: 2, staff: 5, status: "Active", desc: "Urological and kidney tract conditions", icon: "🫘" },
  { id: "DEPT-18", name: "Nephrology", head: "Dr. Faisal Nur", doctors: 2, staff: 4, status: "Active", desc: "Kidney disease, dialysis and renal care", icon: "🩺" },
  { id: "DEPT-19", name: "Oncology", head: "Dr. Ayan Mohamud", doctors: 2, staff: 8, status: "Active", desc: "Cancer diagnosis, chemotherapy and treatment", icon: "🎗️" },
  { id: "DEPT-20", name: "Gastroenterology", head: "Dr. Hodan Warsame", doctors: 2, staff: 5, status: "Active", desc: "Digestive system and liver disorders", icon: "🫀" },
  { id: "DEPT-21", name: "Anesthesia", head: "Dr. Khadar Shire", doctors: 3, staff: 6, status: "Active", desc: "Anesthesia for surgical and ICU procedures", icon: "💉" },
  { id: "DEPT-22", name: "Pulmonology", head: "Dr. Safia Warsame", doctors: 2, staff: 6, status: "Active", desc: "Respiratory, lung disease and sleep medicine", icon: "🫁" },
  { id: "DEPT-23", name: "Endocrinology", head: "Dr. Habibo Said", doctors: 2, staff: 4, status: "Active", desc: "Hormonal, thyroid and metabolic disorders", icon: "🔬" },
  { id: "DEPT-24", name: "Rheumatology", head: "Dr. Mukhtar Ali", doctors: 2, staff: 4, status: "Active", desc: "Joints, autoimmune and rheumatic diseases", icon: "🦵" },
  { id: "DEPT-25", name: "Hematology", head: "Dr. Farhia Osman", doctors: 2, staff: 5, status: "Active", desc: "Blood disorders, anemia and coagulation", icon: "🩸" },
  { id: "DEPT-26", name: "Physiotherapy", head: "Dr. Nasteho Hirsi", doctors: 0, staff: 6, status: "Active", desc: "Physical rehabilitation and movement therapy", icon: "🏃" },
];

const sampleRadiology = [
  { id: "RAD-001", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", test: "Chest X-Ray (PA & Lateral)", type: "X-Ray", orderedBy: "Dr. Fatima Noor", date: "2024-03-14", status: "Completed", result: "Normal", tech: "Abdiqadir Ali", fee: 45, notes: "No acute cardiopulmonary findings. Heart size normal. Clear lung fields bilaterally." },
  { id: "RAD-002", patient: "Maryan Hussein", patientId: "AHMS-P002", test: "Abdominal CT Scan (with contrast)", type: "CT Scan", orderedBy: "Dr. Omar Sharif", date: "2024-03-14", status: "Pending", result: null, tech: null, fee: 180, notes: "" },
  { id: "RAD-003", patient: "Hawa Abdi", patientId: "AHMS-P004", test: "Pelvic Ultrasound", type: "Ultrasound", orderedBy: "Dr. Hodan Ali", date: "2024-03-13", status: "Completed", result: "Abnormal", tech: "Abdiqadir Ali", fee: 80, notes: "Enlarged right iliac lymph nodes identified (max 2.1cm). Recommend surgical review." },
  { id: "RAD-004", patient: "Ismail Duale", patientId: "AHMS-P003", test: "Brain MRI with Gadolinium", type: "MRI", orderedBy: "Dr. Ifrah Ahmed", date: "2024-03-12", status: "Processing", result: null, tech: "Fadumo Adan", fee: 320, notes: "Scan acquired. Awaiting radiologist reporting." },
  { id: "RAD-005", patient: "Abdullahi Farah", patientId: "AHMS-P005", test: "Knee X-Ray Bilateral", type: "X-Ray", orderedBy: "Dr. Nimco Osman", date: "2024-03-11", status: "Completed", result: "Abnormal", tech: "Abdiqadir Ali", fee: 55, notes: "Moderate osteoarthritic changes bilateral knees. Joint space narrowing medially. Osteophyte formation." },
  { id: "RAD-006", patient: "Safia Mohamud", patientId: "AHMS-P006", test: "Obstetric Ultrasound (3rd Trimester)", type: "Ultrasound", orderedBy: "Dr. Hodan Ali", date: "2024-03-14", status: "Processing", result: null, tech: "Fadumo Adan", fee: 90, notes: "32 weeks gestation. Fetal biometry in progress. AFI to be assessed." },
  { id: "RAD-007", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", test: "Echocardiogram (2D Echo)", type: "Echo", orderedBy: "Dr. Fatima Noor", date: "2024-03-10", status: "Completed", result: "Abnormal", tech: "Abdiqadir Ali", fee: 150, notes: "EF 45%. Mild LV dysfunction. Mild MR noted. No pericardial effusion." },
  { id: "RAD-008", patient: "Ismail Duale", patientId: "AHMS-P003", test: "Chest CT (HRCT)", type: "CT Scan", orderedBy: "Dr. Safia Warsame", date: "2024-03-09", status: "Completed", result: "Abnormal", tech: "Fadumo Adan", fee: 160, notes: "Right lower lobe consolidation with air bronchogram. Features consistent with bacterial pneumonia." },
];

const samplePrescriptions = [
  { id: "RX-2024-001", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", doctor: "Dr. Fatima Noor", date: "2024-03-14", status: "Active", diagnosis: "Hypertension + Dyslipidemia", medicines: [{ name: "Amlodipine 5mg", dose: "1 tablet", frequency: "Once daily morning", duration: "30 days", qty: 30 }, { name: "Atorvastatin 20mg", dose: "1 tablet", frequency: "Once nightly", duration: "30 days", qty: 30 }, { name: "Aspirin 75mg", dose: "1 tablet", frequency: "Once daily with food", duration: "30 days", qty: 30 }], notes: "Monitor BP weekly. Low-salt diet advised. Return in 4 weeks." },
  { id: "RX-2024-002", patient: "Maryan Hussein", patientId: "AHMS-P002", doctor: "Dr. Omar Sharif", date: "2024-03-10", status: "Dispensed", diagnosis: "Diabetes Type 2", medicines: [{ name: "Metformin 500mg", dose: "1 tablet", frequency: "Twice daily with meals", duration: "30 days", qty: 60 }, { name: "Glibenclamide 5mg", dose: "1 tablet", frequency: "Once with breakfast", duration: "30 days", qty: 30 }], notes: "Check fasting blood sugar and 2hr post-meal. Diabetic diet. Exercise 30 min/day." },
  { id: "RX-2024-003", patient: "Hawa Abdi", patientId: "AHMS-P004", doctor: "Dr. Yusuf Garad", date: "2024-03-10", status: "Active", diagnosis: "Post-op Appendicitis", medicines: [{ name: "Amoxicillin 500mg", dose: "1 capsule", frequency: "Three times daily", duration: "7 days", qty: 21 }, { name: "Paracetamol 500mg", dose: "2 tablets", frequency: "Every 6 hours as needed", duration: "5 days", qty: 40 }, { name: "Omeprazole 20mg", dose: "1 capsule", frequency: "Before breakfast", duration: "14 days", qty: 14 }], notes: "Complete full antibiotic course. Avoid heavy lifting for 4 weeks. Follow-up in 2 weeks." },
  { id: "RX-2024-004", patient: "Abdullahi Farah", patientId: "AHMS-P005", doctor: "Dr. Nimco Osman", date: "2024-03-11", status: "Active", diagnosis: "Bilateral Knee Osteoarthritis", medicines: [{ name: "Diclofenac 75mg", dose: "1 tablet", frequency: "Twice daily with food", duration: "14 days", qty: 28 }, { name: "Omeprazole 20mg", dose: "1 tablet", frequency: "Once daily", duration: "14 days", qty: 14 }, { name: "Calcium Carbonate + Vit D3", dose: "1 tablet", frequency: "Once daily", duration: "60 days", qty: 60 }], notes: "Physiotherapy 3x/week. Weight reduction advised. Avoid stairs where possible." },
  { id: "RX-2024-005", patient: "Ismail Duale", patientId: "AHMS-P003", doctor: "Dr. Safia Warsame", date: "2024-03-12", status: "Dispensed", diagnosis: "Pneumonia", medicines: [{ name: "Amoxicillin-Clavulanate 625mg", dose: "1 tablet", frequency: "Three times daily", duration: "10 days", qty: 30 }, { name: "Salbutamol Inhaler 100mcg", dose: "2 puffs", frequency: "Every 4-6 hours as needed", duration: "30 days", qty: 1 }, { name: "Prednisolone 5mg", dose: "4 tablets", frequency: "Once daily morning", duration: "5 days", qty: 20 }], notes: "Complete antibiotic course. Rest and hydration. Return if worsening." },
  { id: "RX-2024-006", patient: "Safia Mohamud", patientId: "AHMS-P006", doctor: "Dr. Hodan Ali", date: "2024-03-14", status: "Active", diagnosis: "Antenatal Care - 32 Weeks", medicines: [{ name: "Ferrous Sulphate 200mg", dose: "1 tablet", frequency: "Twice daily", duration: "30 days", qty: 60 }, { name: "Folic Acid 5mg", dose: "1 tablet", frequency: "Once daily", duration: "30 days", qty: 30 }, { name: "Calcium Carbonate 500mg", dose: "1 tablet", frequency: "Twice daily", duration: "30 days", qty: 60 }], notes: "Next antenatal visit in 2 weeks. Fetal kick count daily. Attend Scan at 34 weeks." },
];

const sampleEmergency = [
  { id: "ER-001", patient: "Hassan Farah", age: 52, gender: "Male", chiefComplaint: "Severe chest pain, shortness of breath, sweating", triage: "Critical", arrivalTime: "08:45", doctor: "Dr. Bile Muse", status: "In Treatment", bp: "185/110", pulse: "104", spo2: "87%", temp: "37.1°C" },
  { id: "ER-002", patient: "Faadumo Aden", age: 35, gender: "Female", chiefComplaint: "Sudden severe headache, visual disturbance, vomiting", triage: "Urgent", arrivalTime: "09:10", doctor: "Dr. Ifrah Ahmed", status: "In Treatment", bp: "165/98", pulse: "90", spo2: "98%", temp: "37.4°C" },
  { id: "ER-003", patient: "Yusuf Abdi", age: 8, gender: "Male", chiefComplaint: "High fever 40.2°C with seizure episode at home", triage: "Urgent", arrivalTime: "09:30", doctor: "Dr. Amina Warsame", status: "In Treatment", bp: "95/60", pulse: "122", spo2: "97%", temp: "40.2°C" },
  { id: "ER-004", patient: "Asha Mohamed", age: 28, gender: "Female", chiefComplaint: "RTA — lacerations to head and right arm", triage: "Semi-urgent", arrivalTime: "10:00", doctor: null, status: "Waiting", bp: "118/76", pulse: "95", spo2: "99%", temp: "36.8°C" },
  { id: "ER-005", patient: "Omar Hassan", age: 67, gender: "Male", chiefComplaint: "Worsening breathlessness and bilateral leg swelling", triage: "Urgent", arrivalTime: "10:15", doctor: null, status: "Waiting", bp: "148/92", pulse: "112", spo2: "91%", temp: "36.5°C" },
  { id: "ER-006", patient: "Nimo Warsame", age: 22, gender: "Female", chiefComplaint: "Anaphylactic reaction — facial swelling, urticaria", triage: "Critical", arrivalTime: "10:25", doctor: "Dr. Bile Muse", status: "In Treatment", bp: "88/55", pulse: "118", spo2: "94%", temp: "37.0°C" },
  { id: "ER-007", patient: "Abdi Jama", age: 44, gender: "Male", chiefComplaint: "Laceration right hand — industrial accident", triage: "Semi-urgent", arrivalTime: "10:40", doctor: null, status: "Waiting", bp: "125/80", pulse: "88", spo2: "98%", temp: "36.9°C" },
  { id: "ER-008", patient: "Ladan Mohamud", age: 19, gender: "Female", chiefComplaint: "Abdominal pain, nausea, fever", triage: "Non-urgent", arrivalTime: "11:00", doctor: null, status: "Waiting", bp: "112/72", pulse: "82", spo2: "99%", temp: "38.0°C" },
];

const sampleICU = [
  { id: "ICU-01", bed: "ICU Bed 1", patient: "Abdirahman Said", age: 64, diagnosis: "Acute MI — Post-Angioplasty", admDate: "2024-03-10", doctor: "Dr. Yahye Ibrahim", status: "Critical", ventilator: true, bp: "100/65", pulse: "78", spo2: "95%", gcs: "12", fluids: "1200ml/24h" },
  { id: "ICU-02", bed: "ICU Bed 2", patient: "Hawa Abdi", age: 26, diagnosis: "Post-op Appendicitis with Peritonitis", admDate: "2024-03-10", doctor: "Dr. Yusuf Garad", status: "Serious", ventilator: false, bp: "118/76", pulse: "96", spo2: "98%", gcs: "15", fluids: "1000ml/24h" },
  { id: "ICU-03", bed: "ICU Bed 3", patient: "Mohamed Jama", age: 45, diagnosis: "Severe Sepsis — Urinary Source", admDate: "2024-03-11", doctor: "Dr. Yahye Ibrahim", status: "Critical", ventilator: true, bp: "80/50", pulse: "128", spo2: "89%", gcs: "9", fluids: "2500ml/24h" },
  { id: "ICU-04", bed: "ICU Bed 4", patient: "", age: null, diagnosis: "", admDate: null, doctor: null, status: "Available", ventilator: false, bp: null, pulse: null, spo2: null, gcs: null, fluids: null },
  { id: "ICU-05", bed: "ICU Bed 5", patient: "Farhia Osman", age: 71, diagnosis: "COPD Exacerbation with Type II Respiratory Failure", admDate: "2024-03-12", doctor: "Dr. Safia Warsame", status: "Serious", ventilator: true, bp: "138/88", pulse: "104", spo2: "88%", gcs: "13", fluids: "800ml/24h" },
  { id: "ICU-06", bed: "ICU Bed 6", patient: "", age: null, diagnosis: "", admDate: null, doctor: null, status: "Available", ventilator: false, bp: null, pulse: null, spo2: null, gcs: null, fluids: null },
];

const sampleSurgeries = [
  { id: "OR-001", patient: "Hawa Abdi", patientId: "AHMS-P004", procedure: "Laparoscopic Appendectomy", surgeon: "Dr. Yusuf Garad", anesthetist: "Dr. Khadar Shire", theater: "OT-1", date: "2024-03-10", time: "08:00", duration: "90 min", status: "Completed", priority: "Emergency", notes: "Successful. Transferred to ICU post-op." },
  { id: "OR-002", patient: "Abdullahi Farah", patientId: "AHMS-P005", procedure: "Right Total Knee Replacement (TKR)", surgeon: "Dr. Nimco Osman", anesthetist: "Dr. Khadar Shire", theater: "OT-2", date: "2024-03-15", time: "09:00", duration: "180 min", status: "Scheduled", priority: "Elective", notes: "Pre-op assessment completed. Patient consented. NBM from midnight." },
  { id: "OR-003", patient: "Ahmed Al-Rashid", patientId: "AHMS-P001", procedure: "Coronary Angioplasty (PTCA + Stenting)", surgeon: "Dr. Fatima Noor", anesthetist: "Dr. Khadar Shire", theater: "Cath Lab", date: "2024-03-16", time: "10:30", duration: "120 min", status: "Scheduled", priority: "Urgent", notes: "Cardiology cleared. Dual antiplatelet loaded. Echo pre-op done." },
  { id: "OR-004", patient: "Safia Mohamud", patientId: "AHMS-P006", procedure: "Elective Lower Segment Caesarean Section (LSCS)", surgeon: "Dr. Hodan Ali", anesthetist: "Dr. Khadar Shire", theater: "OT-3", date: "2024-03-20", time: "07:30", duration: "60 min", status: "Scheduled", priority: "Elective", notes: "38 weeks gestation. Cephalopelvic disproportion. Patient consented." },
  { id: "OR-005", patient: "Jama Mohamud", patientId: null, procedure: "Left Inguinal Hernia Repair (Mesh)", surgeon: "Dr. Yusuf Garad", anesthetist: "Dr. Khadar Shire", theater: "OT-1", date: "2024-03-14", time: "13:00", duration: "75 min", status: "In Progress", priority: "Elective", notes: "Lichtenstein mesh repair planned." },
  { id: "OR-006", patient: "Ali Hassan", patientId: null, procedure: "Cataract Extraction + IOL Implant (Right)", surgeon: "Dr. Abdirashid Jama", anesthetist: "Dr. Khadar Shire", theater: "OT-2", date: "2024-03-14", time: "15:00", duration: "45 min", status: "Scheduled", priority: "Elective", notes: "Phacoemulsification technique. Patient fasted." },
];

const sampleInventory = [
  // Pharmacy / Medicines
  { id: "INV-001", name: "Amoxicillin 500mg Capsules", category: "Antibiotics", dept: "Pharmacy", qty: 850, minQty: 200, unit: "Capsules", price: 0.45, supplier: "PharmaTech Ltd", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-002", name: "Metformin 500mg Tablets", category: "Diabetes Drugs", dept: "Pharmacy", qty: 1200, minQty: 300, unit: "Tablets", price: 0.12, supplier: "MedSupply Co", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-003", name: "Atorvastatin 20mg Tablets", category: "Cardiovascular", dept: "Pharmacy", qty: 45, minQty: 150, unit: "Tablets", price: 0.38, supplier: "GlobalPharma", lastUpdated: "2024-03-13", status: "Low Stock" },
  { id: "INV-004", name: "Paracetamol 500mg Tablets", category: "Analgesics", dept: "Pharmacy", qty: 30, minQty: 500, unit: "Tablets", price: 0.08, supplier: "PharmaTech Ltd", lastUpdated: "2024-03-12", status: "Low Stock" },
  { id: "INV-005", name: "Omeprazole 20mg Capsules", category: "GI Drugs", dept: "Pharmacy", qty: 600, minQty: 100, unit: "Capsules", price: 0.22, supplier: "MedSupply Co", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-006", name: "Insulin Glargine 100IU/ml", category: "Diabetes Drugs", dept: "Pharmacy", qty: 280, minQty: 50, unit: "Vials", price: 18.50, supplier: "InsuPharm", lastUpdated: "2024-03-13", status: "In Stock" },
  { id: "INV-007", name: "Amlodipine 5mg Tablets", category: "Cardiovascular", dept: "Pharmacy", qty: 0, minQty: 100, unit: "Tablets", price: 0.18, supplier: "GlobalPharma", lastUpdated: "2024-03-10", status: "Out of Stock" },
  // Laboratory Supplies
  { id: "INV-008", name: "Blood Collection Tubes (EDTA)", category: "Lab Consumables", dept: "Laboratory", qty: 2400, minQty: 500, unit: "Tubes", price: 0.15, supplier: "LabTech Supplies", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-009", name: "Urine Collection Cups", category: "Lab Consumables", dept: "Laboratory", qty: 800, minQty: 200, unit: "Cups", price: 0.10, supplier: "LabTech Supplies", lastUpdated: "2024-03-13", status: "In Stock" },
  { id: "INV-010", name: "HbA1c Reagent Kit", category: "Lab Reagents", dept: "Laboratory", qty: 12, minQty: 10, unit: "Kits", price: 45.00, supplier: "DiagnosticsPro", lastUpdated: "2024-03-12", status: "Low Stock" },
  { id: "INV-011", name: "CBC Reagent Pack", category: "Lab Reagents", dept: "Laboratory", qty: 25, minQty: 8, unit: "Packs", price: 38.00, supplier: "DiagnosticsPro", lastUpdated: "2024-03-11", status: "In Stock" },
  { id: "INV-012", name: "Microscope Glass Slides", category: "Lab Consumables", dept: "Laboratory", qty: 5000, minQty: 1000, unit: "Slides", price: 0.05, supplier: "LabTech Supplies", lastUpdated: "2024-03-10", status: "In Stock" },
  // Radiology Supplies
  { id: "INV-013", name: "X-Ray Films (30×40 cm)", category: "Radiology Supplies", dept: "Radiology", qty: 200, minQty: 100, unit: "Films", price: 1.20, supplier: "ImagingSupplies Co", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-014", name: "Ultrasound Gel (5L)", category: "Radiology Supplies", dept: "Radiology", qty: 8, minQty: 5, unit: "Bottles", price: 12.00, supplier: "ImagingSupplies Co", lastUpdated: "2024-03-13", status: "In Stock" },
  { id: "INV-015", name: "CT Contrast Medium (Iohexol)", category: "Radiology Supplies", dept: "Radiology", qty: 4, minQty: 10, unit: "Vials", price: 22.00, supplier: "RadioPharm", lastUpdated: "2024-03-12", status: "Low Stock" },
  // Medical Supplies
  { id: "INV-016", name: "Surgical Gloves (Medium)", category: "PPE & Consumables", dept: "Surgery", qty: 5000, minQty: 500, unit: "Pairs", price: 0.25, supplier: "MedEquip Ltd", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-017", name: "Disposable Syringes 5ml", category: "Consumables", dept: "General", qty: 3000, minQty: 500, unit: "Pieces", price: 0.12, supplier: "MedEquip Ltd", lastUpdated: "2024-03-14", status: "In Stock" },
  { id: "INV-018", name: "IV Cannula 18G", category: "Consumables", dept: "General", qty: 150, minQty: 200, unit: "Pieces", price: 0.35, supplier: "MedEquip Ltd", lastUpdated: "2024-03-13", status: "Low Stock" },
  { id: "INV-019", name: "Surgical Masks (Box of 50)", category: "PPE & Consumables", dept: "General", qty: 80, minQty: 20, unit: "Boxes", price: 8.50, supplier: "SafeguardPPE", lastUpdated: "2024-03-13", status: "In Stock" },
  { id: "INV-020", name: "Sterile Gauze Pads 4x4", category: "Wound Care", dept: "General", qty: 2000, minQty: 500, unit: "Pieces", price: 0.08, supplier: "MedEquip Ltd", lastUpdated: "2024-03-12", status: "In Stock" },
  // Equipment
  { id: "INV-021", name: "Digital Blood Pressure Monitor", category: "Equipment", dept: "General Medicine", qty: 12, minQty: 5, unit: "Units", price: 85.00, supplier: "MedDevice Co", lastUpdated: "2024-03-01", status: "In Stock" },
  { id: "INV-022", name: "Pulse Oximeter (Handheld)", category: "Equipment", dept: "ICU", qty: 8, minQty: 4, unit: "Units", price: 45.00, supplier: "MedDevice Co", lastUpdated: "2024-03-01", status: "In Stock" },
  { id: "INV-023", name: "Stethoscope (Littmann)", category: "Equipment", dept: "General", qty: 2, minQty: 5, unit: "Units", price: 120.00, supplier: "MedDevice Co", lastUpdated: "2024-02-28", status: "Low Stock" },
  { id: "INV-024", name: "Defibrillator (AED)", category: "Equipment", dept: "Emergency", qty: 3, minQty: 2, unit: "Units", price: 1200.00, supplier: "CriticalCare Systems", lastUpdated: "2024-02-20", status: "In Stock" },
];

const stockMovements = [
  { id: "SM-001", item: "Amoxicillin 500mg Capsules", type: "Stock Added", qty: 500, user: "Nasra Hassan", date: "2024-03-14", reason: "Monthly supplier order received" },
  { id: "SM-002", item: "Paracetamol 500mg Tablets", type: "Stock Used", qty: -120, user: "Pharmacy Staff", date: "2024-03-14", reason: "Daily dispensing" },
  { id: "SM-003", item: "CT Contrast Medium (Iohexol)", type: "Stock Used", qty: -2, user: "Radiology Dept", date: "2024-03-13", reason: "CT scan procedures" },
  { id: "SM-004", item: "IV Cannula 18G", type: "Stock Used", qty: -50, user: "ICU Staff", date: "2024-03-13", reason: "ICU patient care" },
  { id: "SM-005", item: "Surgical Gloves (Medium)", type: "Stock Added", qty: 2000, user: "Store Manager", date: "2024-03-12", reason: "Emergency restock order" },
  { id: "SM-006", item: "HbA1c Reagent Kit", type: "Stock Used", qty: -3, user: "Lab Technician", date: "2024-03-12", reason: "Diabetes patient testing" },
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

const StatCard = ({ icon, label, value, sub, color, trend, gradient }) => {
  const colorMap = {
    blue:   { bg: "bg-blue-50",   icon: "bg-blue-600 text-white",   text: "text-blue-600"   },
    teal:   { bg: "bg-teal-50",   icon: "bg-teal-600 text-white",   text: "text-teal-600"   },
    green:  { bg: "bg-green-50",  icon: "bg-green-600 text-white",  text: "text-green-600"  },
    amber:  { bg: "bg-amber-50",  icon: "bg-amber-500 text-white",  text: "text-amber-600"  },
    purple: { bg: "bg-purple-50", icon: "bg-purple-600 text-white", text: "text-purple-600" },
    red:    { bg: "bg-red-50",    icon: "bg-red-500 text-white",    text: "text-red-600"    },
  };
  const gradientMap = {
    green:  "linear-gradient(135deg, #1BBE9E 0%, #16A34A 100%)",
    blue:   "linear-gradient(135deg, #2F6FED 0%, #1A56D6 100%)",
    orange: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
    red:    "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
  };
  if (gradient) {
    return (
      <div
        className="rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-200 text-white"
        style={{ background: gradientMap[gradient] || gradientMap.blue }}
      >
        <div className="flex items-start justify-between">
          <div className="text-3xl">{icon}</div>
          {trend && (
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
              ↑ {trend}
            </span>
          )}
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold tracking-tight">{value}</div>
          <div className="text-sm font-semibold mt-1 opacity-90">{label}</div>
          {sub && <div className="text-xs mt-1 opacity-70">{sub}</div>}
        </div>
      </div>
    );
  }
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

// Toast notification
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold transition-all ${type === "success" ? "bg-teal-600" : "bg-red-500"}`}>
      <span className="text-base">{type === "success" ? "✓" : "✗"}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
};

// Confirm Delete Dialog
const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-3xl mb-3 text-center">🗑️</div>
        <h3 className="text-base font-bold text-slate-800 text-center mb-1">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-medium bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// UTILITY: CSV / Excel Export
// ============================================================
const exportCSV = (filename, headers, rows) => {
  const escape = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename + ".csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ============================================================
// REUSABLE: ActionBar
// ============================================================
const ActionBar = ({ onAdd, addLabel = "Add", onPrint, onExport, onExportCSV, onRefresh, extra = [] }) => (
  <div className="flex flex-wrap items-center gap-2 mb-5">
    {onAdd && (
      <button onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95"
        style={{ background: "linear-gradient(90deg,#2F6FED,#4A7DFF)" }}>
        + {addLabel}
      </button>
    )}
    {extra.map((a, i) => (
      <button key={i} onClick={a.onClick}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${a.cls || "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
        {a.icon} {a.label}
      </button>
    ))}
    {onPrint && (
      <button onClick={onPrint}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
        🖨 Print
      </button>
    )}
    {onExport && (
      <button onClick={onExport}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
        📥 Export PDF
      </button>
    )}
    {onExportCSV && (
      <button onClick={onExportCSV}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
        📊 Export CSV
      </button>
    )}
    {onRefresh && (
      <button onClick={onRefresh}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-400 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors ml-auto">
        ↻ Refresh
      </button>
    )}
  </div>
);

// ============================================================
// REUSABLE: DataTable — sortable, paginated, with row actions
// ============================================================
const DataTable = ({
  columns, data, rowActions,
  emptyIcon = "📋", emptyTitle = "No records found", emptySubtitle = "",
  pageSize = 10,
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const va = a[sortKey] ?? ""; const vb = b[sortKey] ?? "";
        const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      })
    : data;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span className="text-slate-300 text-xs"> ↕</span>;
    return <span className="text-blue-500 text-xs">{sortDir === "asc" ? " ↑" : " ↓"}</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
              {columns.map(col => (
                <th key={col.key}
                  className={`text-left px-5 py-3.5 font-semibold whitespace-nowrap ${col.sortable !== false ? "cursor-pointer hover:text-slate-600 select-none" : ""}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}>
                  {col.label}{col.sortable !== false && <SortIcon k={col.key} />}
                </th>
              ))}
              {rowActions && <th className="text-left px-5 py-3.5 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3.5">
                    {col.render ? col.render(row) : <span className="text-slate-700">{row[col.key]}</span>}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">{rowActions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paged.length === 0 && <EmptyState icon={emptyIcon} title={emptyTitle} subtitle={emptySubtitle} />}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">{sorted.length} record{sorted.length !== 1 ? "s" : ""} · Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            {[["«", 1], ["‹", page - 1], ["›", page + 1], ["»", totalPages]].map(([sym, target]) => (
              <button key={sym}
                disabled={target < 1 || target > totalPages || target === page}
                onClick={() => setPage(target)}
                className="w-7 h-7 text-xs rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors">
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// REUSABLE: PrintActions — inline print/preview/PDF buttons
// ============================================================
const PrintActions = ({ title, subtitle, docId, docDate, doctor, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors">
          👁 Preview
        </button>
        <button onClick={() => { setOpen(true); setTimeout(() => window.print(), 300); }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          🖨 Print
        </button>
        <button onClick={() => { setOpen(true); setTimeout(() => window.print(), 300); }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl transition-colors"
          style={{ background: "#2F6FED" }}>
          📥 PDF
        </button>
      </div>
      <PrintPreviewModal open={open} onClose={() => setOpen(false)} title={title} subtitle={subtitle} docId={docId} docDate={docDate} doctor={doctor}>
        {children}
      </PrintPreviewModal>
    </>
  );
};

// ============================================================
// SIDEBAR NAVIGATION CONFIG
// ============================================================
const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard", group: "main" },
  { id: "patients", icon: "👤", label: "Patients", group: "clinical" },
  { id: "doctors", icon: "🩺", label: "Doctors & Specialists", group: "clinical" },
  { id: "staff", icon: "👥", label: "Staff & Nurses", group: "clinical" },
  { id: "departments", icon: "🏥", label: "Departments", group: "clinical" },
  { id: "appointments", icon: "📅", label: "Appointments", group: "operations" },
  { id: "emergency", icon: "🚨", label: "Emergency", group: "operations" },
  { id: "opd", icon: "🏃", label: "OPD", group: "operations" },
  { id: "ipd", icon: "🛏", label: "IPD / Admissions", group: "operations" },
  { id: "icu", icon: "💓", label: "ICU", group: "operations" },
  { id: "surgery", icon: "🔪", label: "Surgery / OT", group: "operations" },
  { id: "beds", icon: "🏨", label: "Wards & Beds", group: "operations" },
  { id: "billing", icon: "💳", label: "Billing", group: "finance" },
  { id: "pharmacy", icon: "💊", label: "Pharmacy", group: "services" },
  { id: "laboratory", icon: "🔬", label: "Laboratory", group: "services" },
  { id: "radiology", icon: "📡", label: "Radiology & Imaging", group: "services" },
  { id: "prescriptions", icon: "📋", label: "Prescriptions", group: "services" },
  { id: "records", icon: "📁", label: "Medical Records", group: "records" },
  { id: "hr", icon: "🧑‍💼", label: "HR & Payroll", group: "admin" },
  { id: "inventory", icon: "📦", label: "Inventory", group: "admin" },
  { id: "reports", icon: "📊", label: "Reports & Analytics", group: "admin" },
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
// NOTIFICATION DATA
// ============================================================
const sampleNotifications = [
  { id: 1, icon: "👤", msg: "New patient registered: Ahmed Al-Rashid (AHMS-P001)", time: "2 min ago", read: false, type: "patient" },
  { id: 2, icon: "📅", msg: "Appointment in 30 min: Dr. Fatima Noor with Maryan Hussein", time: "15 min ago", read: false, type: "appointment" },
  { id: 3, icon: "⚠️", msg: "Low stock alert: Amoxicillin 500mg — only 12 units left", time: "1 hr ago", read: false, type: "stock" },
  { id: 4, icon: "🔬", msg: "Lab result ready: CBC for Hawa Abdi — Abnormal", time: "2 hr ago", read: true, type: "lab" },
  { id: 5, icon: "💰", msg: "Payment received: $250 from Abdullahi Farah — Invoice INV-005", time: "3 hr ago", read: true, type: "payment" },
  { id: 6, icon: "🚨", msg: "Emergency: New critical case admitted to ER — immediate care needed", time: "4 hr ago", read: true, type: "emergency" },
  { id: 7, icon: "💊", msg: "Prescription dispensed: RX-003 for Safia Mohamud by Pharmacist", time: "5 hr ago", read: true, type: "pharmacy" },
];

// ============================================================
// NOTIFICATION CENTER DROPDOWN
// ============================================================
const NotificationCenter = ({ show, onClose, notifications, onMarkAll }) => {
  if (!show) return null;
  const typeColors = {
    patient: "#2F6FED", appointment: "#1BBE9E", stock: "#F59E0B",
    lab: "#7C3AED", payment: "#16A34A", emergency: "#EF4444", pharmacy: "#0891B2",
  };
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden" style={{ width: 340 }}>
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="text-xs font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: "#EF4444" }}>
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button onClick={onMarkAll} className="text-xs font-medium hover:underline" style={{ color: "#2F6FED" }}>
            Mark all as read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map(n => (
            <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                style={{ background: (typeColors[n.type] || "#2F6FED") + "22" }}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-700 leading-relaxed">{n.msg}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{n.time}</div>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: "#2F6FED" }} />}
            </div>
          ))}
        </div>
        <div className="px-4 py-3 text-center border-t border-slate-50">
          <button className="text-xs font-medium" style={{ color: "#2F6FED" }}>View all notifications →</button>
        </div>
      </div>
    </>
  );
};

// ============================================================
// GLOBAL SEARCH MODAL
// ============================================================
const GlobalSearchModal = ({ show, onClose, setPage }) => {
  const [q, setQ] = useState("");
  if (!show) return null;

  const allResults = q.length < 2 ? [] : [
    ...samplePatients
      .filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map(p => ({ type: "Patient", icon: "👤", label: p.name, sub: `${p.id} · ${p.dept} · Age ${p.age}`, page: "patients", color: "#2F6FED" })),
    ...sampleDoctors
      .filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.specialization.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map(d => ({ type: "Doctor", icon: "🩺", label: d.name, sub: `${d.specialization} · ${d.id}`, page: "doctors", color: "#1BBE9E" })),
    ...sampleAppointments
      .filter(a => a.patient.toLowerCase().includes(q.toLowerCase()) || a.doctor.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 2)
      .map(a => ({ type: "Appointment", icon: "📅", label: a.patient, sub: `${a.doctor} · ${a.date} ${a.time}`, page: "appointments", color: "#7C3AED" })),
    ...samplePrescriptions
      .filter(r => r.patient.toLowerCase().includes(q.toLowerCase()) || r.diagnosis.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 2)
      .map(r => ({ type: "Prescription", icon: "📋", label: r.patient, sub: `${r.diagnosis} · ${r.id}`, page: "prescriptions", color: "#F59E0B" })),
    ...sampleBills
      .filter(b => b.patient.toLowerCase().includes(q.toLowerCase()) || b.id.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 2)
      .map(b => ({ type: "Invoice", icon: "💳", label: b.patient, sub: `${b.id} · $${b.total} · ${b.status}`, page: "billing", color: "#16A34A" })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ paddingTop: 80 }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <span className="text-slate-400 text-lg">🔍</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search patients, doctors, appointments, invoices..."
            className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400 bg-transparent"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors">
            ✕ Esc
          </button>
        </div>

        {/* Results */}
        {allResults.length > 0 && (
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {allResults.map((r, i) => (
              <button
                key={i}
                onClick={() => { setPage(r.page); onClose(); setQ(""); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm"
                  style={{ background: r.color + "22" }}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{r.label}</div>
                  <div className="text-xs text-slate-400 truncate">{r.sub}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0 font-medium"
                  style={{ background: r.color + "22", color: r.color }}>
                  {r.type}
                </span>
              </button>
            ))}
          </div>
        )}
        {q.length >= 2 && allResults.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-sm">No results found for "<strong>{q}</strong>"</div>
        )}
        {q.length < 2 && (
          <div className="px-4 py-6 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-xs text-slate-400">Search across Patients · Doctors · Appointments · Prescriptions · Invoices</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const Sidebar = ({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const groups = [...new Set(navItems.map(n => n.group))];

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/10">
        <AfgoiShieldSVG style={{ width: (collapsed && !isMobile) ? 36 : 44, height: (collapsed && !isMobile) ? 44 : 54, flexShrink: 0 }} />
        {(!collapsed || isMobile) && (
          <div className="overflow-hidden leading-tight">
            <div className="font-extrabold text-sm tracking-wide" style={{ color: "#4CAF50" }}>AFGOI</div>
            <div className="font-bold text-xs text-white tracking-widest">HOSPITAL</div>
            <div className="text-blue-300 text-xs mt-0.5 font-medium">AHMS v2.0</div>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-slate-400 hover:text-white text-lg px-1">✕</button>
        )}
      </div>
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 custom-scroll">
        {groups.map(group => {
          const items = navItems.filter(n => n.group === group);
          const label = groupLabels[group];
          return (
            <div key={group} className="mb-2">
              {label && (!collapsed || isMobile) && (
                <div className="text-xs font-semibold text-slate-500 px-3 py-1.5 mb-1 uppercase tracking-wider">{label}</div>
              )}
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); if (isMobile) setMobileOpen(false); }}
                  title={(collapsed && !isMobile) ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${
                    active === item.id
                      ? "text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                  style={active === item.id ? { background: "#2F6FED" } : {}}
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </nav>
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="m-3 flex items-center justify-center py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 text-xs transition-all"
        >
          {collapsed ? "→" : "← Collapse"}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full z-40 flex-col transition-all duration-300"
        style={{ width: collapsed ? 64 : 240, background: "#0D1B2A" }}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside
            className="fixed left-0 top-0 h-full z-50 flex flex-col lg:hidden transition-transform duration-300"
            style={{ width: 260, background: "#0D1B2A", transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
          >
            {sidebarContent(true)}
          </aside>
        </>
      )}
    </>
  );

};

// ============================================================
// TOP NAVBAR — with Notifications, Search, Dark Mode, Mobile Hamburger
// ============================================================
const Navbar = ({ sidebarWidth, setPage, darkMode, toggleDarkMode, onMenuOpen }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifs, setNotifs] = useState(sampleNotifications);
  const unread = notifs.filter(n => !n.read).length;

  const navBg = darkMode ? "#1E293B" : "#FFFFFF";
  const navBorder = darkMode ? "#334155" : "#E2E8F0";
  const titleColor = darkMode ? "#E2E8F0" : "#1E293B";
  const subColor = darkMode ? "#64748B" : "#94A3B8";

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-4 py-3 shadow-sm transition-colors duration-300"
      style={{ left: typeof sidebarWidth === "number" ? sidebarWidth : 240, background: navBg, borderBottom: `1px solid ${navBorder}` }}
    >
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 text-lg"
        >
          ☰
        </button>
        <div>
          <span className="font-extrabold text-base tracking-tight" style={{ color: titleColor }}>AFGOI HOSPITAL</span>
          <span className="ml-2 text-sm font-medium tracking-wide hidden sm:inline" style={{ color: subColor }}>MANAGEMENT SYSTEM</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => setShowSearch(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-colors"
          style={{ color: subColor }}
          title="Global Search"
        >
          🔍
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-colors"
            style={{ color: subColor }}
            title="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold leading-none">
                {unread}
              </span>
            )}
          </button>
          <NotificationCenter
            show={showNotif}
            onClose={() => setShowNotif(false)}
            notifications={notifs}
            onMarkAll={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-colors"
          style={{ color: subColor }}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Quick Add */}
        <button
          onClick={() => setPage("patients")}
          className="hidden sm:flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: "#2F6FED" }}
        >
          + Quick Add
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer pl-2 border-l" style={{ borderColor: navBorder }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#2F6FED" }}>
            Dr
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold" style={{ color: titleColor }}>Dr. Mohamed Ahmed</div>
            <div className="text-xs" style={{ color: subColor }}>AHMS Administrator</div>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal show={showSearch} onClose={() => setShowSearch(false)} setPage={setPage} />
    </header>
  );
};

// ============================================================
// MINI BAR CHART COMPONENT
// ============================================================
const MiniBarChart = ({ data, color = "#2F6FED" }) => {
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
// DASHBOARD AREA CHART (SVG — Monthly Revenue)
// ============================================================
const DashboardAreaChart = () => {
  const data = [
    { label: "Oct", value: 12000 }, { label: "Nov", value: 18500 }, { label: "Dec", value: 14000 },
    { label: "Jan", value: 22000 }, { label: "Feb", value: 17000 }, { label: "Mar", value: 28500 },
    { label: "Apr", value: 24000 }, { label: "May", value: 38000 }, { label: "Jun", value: 45000 },
  ];
  const W = 440, H = 170;
  const PAD = { top: 15, right: 15, bottom: 32, left: 42 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;
  const maxV = Math.max(...data.map(d => d.value));
  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * iW,
    y: PAD.top + (1 - d.value / maxV) * iH,
  }));
  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, "");
  const areaPath = `${linePath} L ${pts[pts.length-1].x},${PAD.top+iH} L ${pts[0].x},${PAD.top+iH} Z`;
  const yTicks = [0, 10, 20, 30, 40];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="dashAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F6FED" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#2F6FED" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {yTicks.map((_, i) => {
        const y = PAD.top + (i / (yTicks.length - 1)) * iH;
        return <line key={i} x1={PAD.left} y1={y} x2={PAD.left + iW} y2={y} stroke="#E8EFF8" strokeWidth="1"/>;
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#dashAreaGrad)"/>
      {/* Line */}
      <path d={linePath} fill="none" stroke="#2F6FED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Points */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#2F6FED" strokeWidth="2"/>
      ))}
      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={pts[i].x} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#94A3B8" fontFamily="system-ui">{d.label}</text>
      ))}
      {/* Y labels */}
      {yTicks.map((v, i) => (
        <text key={i} x={PAD.left - 6} y={PAD.top + (1 - i / (yTicks.length-1)) * iH + 3.5} textAnchor="end" fontSize="9.5" fill="#94A3B8" fontFamily="system-ui">{v}</text>
      ))}
    </svg>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const DashboardPage = ({ setPage }) => {
  const recentPatients = samplePatients.slice(0, 6).map((p, i) => ({
    ...p,
    amount: ["$333.0M", "$228,000", "$380,000", "$953,000", "$330,000", "$180,000"][i] || "$200,000",
    amountColor: i % 3 === 0 ? "text-slate-700" : i % 2 === 0 ? "text-green-600" : "text-red-500",
    avatarBg: ["#2F6FED","#1BBE9E","#F59E0B","#7C3AED","#EF4444","#0891B2"][i % 6],
  }));

  const upcomingApts = sampleAppointments.slice(0, 4);

  const quickActions = [
    { label: "Add Patient",      icon: "📋", grad: "linear-gradient(135deg,#1BBE9E,#16A34A)", page: "patients"     },
    { label: "New Appointment",  icon: "📅", grad: "linear-gradient(135deg,#2F6FED,#1A56D6)", page: "appointments" },
    { label: "Create Invoice",   icon: "🧾", grad: "linear-gradient(135deg,#F59E0B,#EA580C)", page: "billing"      },
    { label: "Check Inventory",  icon: "📦", grad: "linear-gradient(135deg,#6366F1,#2F6FED)", page: "inventory"    },
  ];

  return (
    <div className="space-y-5">

      {/* ── 4 Gradient Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard gradient="green"  icon="👤" label="Total Patients"    value="1,250" sub="Total" />
        <StatCard gradient="blue"   icon="📅" label="Appointments"      value="280"   sub="Today  45" />
        <StatCard gradient="orange" icon="🛏" label="Added Patients"    value="18"    />
        <StatCard gradient="red"    icon="💳" label="Pending Bills"     value="$12,450" sub="$50 avg" />
      </div>

      {/* ── Middle row: Statistics + Recent Patients ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Statistics — area chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-800">Statistics</h3>
            <span className="text-xs text-slate-400 cursor-pointer">Sorted ▾</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: "#2F6FED" }}></span>
            <span className="text-xs text-slate-500">Monthly Revenue · 2026</span>
            <span className="ml-auto text-xs font-semibold text-slate-700">$85,500</span>
          </div>
          <DashboardAreaChart />
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Patients</h3>
            <button onClick={() => setPage("patients")} className="text-xs text-slate-400 hover:text-blue-600">
              Go to Patients ▾
            </button>
          </div>
          <div className="grid grid-cols-4 text-xs text-slate-400 font-semibold uppercase tracking-wide pb-2 border-b border-slate-50 mb-1">
            <span>Name</span><span className="text-center">Age</span><span className="text-center">Gender</span><span className="text-right">Amount</span>
          </div>
          <div className="space-y-1">
            {recentPatients.map((p, i) => (
              <div key={p.id} className="grid grid-cols-4 items-center py-2 rounded-lg hover:bg-slate-50 px-1 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: ["#2F6FED","#1BBE9E","#F59E0B","#7C3AED","#EF4444","#0891B2"][i%6] }}>
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate">{p.name.split(" ")[0]}</span>
                </div>
                <span className="text-xs text-slate-500 text-center">Age {p.age}</span>
                <span className="text-xs text-slate-500 text-center">{p.gender}</span>
                <span className={`text-xs font-semibold text-right ${p.amountColor}`}>{p.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Upcoming Appointments + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-slate-800">Upcoming Appointments</h3>
            </div>
            <button onClick={() => setPage("appointments")} className="text-xs text-slate-400">Confirmed ▾</button>
          </div>
          {/* Header row */}
          <div className="grid grid-cols-3 text-xs text-slate-400 font-semibold uppercase tracking-wide pb-2 border-b border-slate-50 mb-2">
            <span>Today</span><span className="text-center">Doctor</span><span className="text-right">Fee</span>
          </div>
          <div className="space-y-1">
            {upcomingApts.map(apt => (
              <div key={apt.id} className="grid grid-cols-3 items-center py-2.5 rounded-lg hover:bg-slate-50 px-1 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-500 text-xs">👤</div>
                  <span className="text-xs font-medium text-slate-700 truncate">{apt.patient.split(" ")[0]}</span>
                </div>
                <span className="text-xs text-slate-500 text-center truncate">{apt.doctor.replace("Dr. ","")}</span>
                <span className="text-xs font-semibold text-slate-600 text-right">${apt.fee || "130,000"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(qa => (
              <button
                key={qa.label}
                onClick={() => setPage(qa.page)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
                style={{ background: qa.grad }}
              >
                <span className="text-2xl">{qa.icon}</span>
                <span className="text-xs font-semibold">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// ============================================================
// PATIENTS PAGE
// ============================================================
const PatientsPage = () => {
  const [patients, setPatients] = useState(samplePatients);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { name: "", dob: "", gender: "", blood: "", phone: "", dept: "", emergency: "", insurance: "", address: "", allergy: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const openAdd = () => { setEditPatient(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => { setEditPatient(p); setForm({ name: p.name, dob: p.dob || "", gender: p.gender, blood: p.blood || "", phone: p.phone, dept: p.dept || "", emergency: p.emergency || "", insurance: p.insurance || "", address: p.address || "", allergy: p.allergy || "" }); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.gender) {
      setToast({ msg: "Name, Phone and Gender are required.", type: "error" }); return;
    }
    if (editPatient) {
      const age = form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : editPatient.age;
      setPatients(prev => prev.map(p => p.id === editPatient.id ? { ...editPatient, ...form, age } : p));
      setToast({ msg: "Patient record updated.", type: "success" });
    } else {
      const newId = `AHMS-P${String(patients.length + 1).padStart(3, "0")}`;
      const age = form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : 0;
      setPatients(prev => [...prev, { ...emptyForm, ...form, id: newId, age, status: "Active", visits: 0, doctor: "Unassigned", diagnosis: "Pending", regDate: new Date().toISOString().slice(0, 10), admitted: false }]);
      setToast({ msg: "Patient registered successfully.", type: "success" });
    }
    setForm(emptyForm); setShowModal(false); setEditPatient(null);
  };

  const handleDelete = () => {
    setPatients(prev => prev.filter(p => p.id !== deleteTarget.id));
    setToast({ msg: "Patient record deleted.", type: "success" });
    setDeleteTarget(null);
    if (selectedPatient?.id === deleteTarget?.id) setSelectedPatient(null);
  };

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
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!deleteTarget} title="Delete Patient" message={`Remove ${deleteTarget?.name}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      <SectionHeader
        title="Patient Management"
        subtitle={`${patients.length} registered patients`}
        action="Register Patient"
        onAction={openAdd}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchBar placeholder="Search by name or patient ID..." value={search} onChange={setSearch} />
        </div>
        <button
          onClick={() => exportCSV("AHMS-Patients", ["ID","Name","Age","Gender","Blood","Department","Doctor","Phone","Status"],
            filtered.map(p => [p.id, p.name, p.age, p.gender, p.blood, p.dept, p.doctor, p.phone, p.status]))}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
          📊 Export CSV
        </button>
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
          <div className="text-xl font-bold text-blue-700">{patients.filter(p => p.status === "Active").length}</div>
          <div className="text-xs text-blue-500 font-medium">Active</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-red-600">{patients.filter(p => p.status === "Admitted").length}</div>
          <div className="text-xs text-red-500 font-medium">Admitted</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-gray-600">{patients.filter(p => p.status === "Discharged").length}</div>
          <div className="text-xs text-gray-500 font-medium">Discharged</div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        emptyIcon="👤" emptyTitle="No patients found" emptySubtitle="Try adjusting your search or filters"
        columns={[
          { key: "name", label: "Patient", render: p => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">{p.name.charAt(0)}</div>
              <span className="font-semibold text-slate-800">{p.name}</span>
            </div>
          )},
          { key: "id", label: "ID", render: p => <span className="font-mono text-xs text-slate-400">{p.id}</span> },
          { key: "age", label: "Age / Gender", render: p => <span className="text-slate-600">{p.age}y · {p.gender}</span> },
          { key: "blood", label: "Blood", render: p => <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded">{p.blood}</span> },
          { key: "dept", label: "Department" },
          { key: "doctor", label: "Doctor", render: p => <span className="text-xs text-slate-600">{p.doctor}</span> },
          { key: "status", label: "Status", render: p => <Badge status={p.status} /> },
        ]}
        rowActions={p => (<>
          <button onClick={() => setSelectedPatient(p)} className="text-xs text-blue-600 hover:underline font-medium">View</button>
          <button onClick={() => openEdit(p)} className="text-xs text-teal-600 hover:underline font-medium">Edit</button>
          <button onClick={() => setDeleteTarget(p)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
        </>)}
      />

      {/* Register / Edit Patient Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditPatient(null); }} title={editPatient ? "Edit Patient Record" : "Register New Patient"} size="lg">
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
          <button onClick={() => { setShowModal(false); setEditPatient(null); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editPatient ? "Save Changes" : "Register Patient"}</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// DOCTORS PAGE
// ============================================================
const DoctorAvatar = ({ name, size = "md" }) => {
  const initials = name.replace(/^Dr\.\s*/i, "").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const colors = [
    ["#EBF5FF","#2F6FED"], ["#F0FDF4","#16A34A"], ["#FFF7ED","#EA580C"],
    ["#F5F3FF","#7C3AED"], ["#FDF2F8","#DB2777"], ["#ECFDF5","#059669"],
    ["#EFF6FF","#3B82F6"], ["#FEF3C7","#D97706"],
  ];
  const [bg, fg] = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "lg" ? "w-16 h-16 text-xl" : size === "xl" ? "w-20 h-20 text-2xl" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-bold flex-shrink-0`} style={{ background: bg, color: fg }}>
      {initials}
    </div>
  );
};

const DoctorStatusBadge = ({ status }) => {
  const styles = {
    "On Duty":  { bg: "#F0FDF4", color: "#16A34A", dot: "#16A34A", label: "On Duty" },
    "Active":   { bg: "#F0FDF4", color: "#16A34A", dot: "#16A34A", label: "Active" },
    "On Leave": { bg: "#FFFBEB", color: "#D97706", dot: "#D97706", label: "On Leave" },
    "Inactive": { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626", label: "Inactive" },
    "Off Duty": { bg: "#F8FAFC", color: "#64748B", dot: "#94A3B8", label: "Off Duty" },
  };
  const s = styles[status] || styles["Off Duty"];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

const DoctorsPage = ({ setPage = () => {} }) => {
  const [doctors, setDoctors] = useState(sampleDoctors);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { name: "", specialization: "", dept: "", fee: "", phone: "", email: "", education: "", experience: "", schedule: "" };
  const [form, setForm] = useState(emptyForm);

  const deptOptions = ["All", ...new Set(doctors.map(d => d.dept).filter(Boolean))];
  const statusOptions = ["All", "On Duty", "On Leave", "Inactive", "Off Duty"];

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      (d.dept || "").toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "All" || d.dept === filterDept;
    const matchStatus = filterStatus === "All" || d.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const openAdd = () => { setEditDoctor(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (d) => { setEditDoctor(d); setForm({ name: d.name, specialization: d.specialization, dept: d.dept, fee: String(d.fee), phone: d.phone, email: d.email || "", education: d.education || "", experience: d.experience || "", schedule: d.schedule || "" }); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.specialization.trim() || !form.dept) {
      setToast({ msg: "Name, Specialization and Department are required.", type: "error" }); return;
    }
    if (editDoctor) {
      setDoctors(prev => prev.map(d => d.id === editDoctor.id ? { ...editDoctor, ...form, fee: Number(form.fee) || 0 } : d));
      setToast({ msg: "Doctor record updated.", type: "success" });
    } else {
      const newId = `AHMS-D${String(doctors.length + 1).padStart(3, "0")}`;
      setDoctors(prev => [...prev, { ...emptyForm, ...form, id: newId, fee: Number(form.fee) || 0, status: "On Duty", patients: 0 }]);
      setToast({ msg: "Doctor added successfully.", type: "success" });
    }
    setForm(emptyForm); setShowModal(false); setEditDoctor(null);
  };

  const handleDelete = () => {
    setDoctors(prev => prev.filter(d => d.id !== deleteTarget.id));
    setToast({ msg: "Doctor removed.", type: "success" });
    setDeleteTarget(null);
    if (selected?.id === deleteTarget?.id) setSelected(null);
  };

  /* ── DETAIL VIEW ── */
  if (selected) {
    const apts = sampleAppointments.filter(a => a.doctor === selected.name);
    return (
      <div>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <ConfirmDialog open={!!deleteTarget} title="Remove Doctor" message={`Remove ${deleteTarget?.name}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />

        {/* Back nav */}
        <button onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <span className="text-lg leading-none">←</span> Back to Doctors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Banner */}
            <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600" />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold"
                  style={{ background: "#EBF5FF", color: "#2F6FED" }}>
                  {selected.name.replace(/^Dr\.\s*/i, "").charAt(0)}
                </div>
                <DoctorStatusBadge status={selected.status} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">{selected.name}</h2>
              <p className="text-sm font-semibold text-blue-600 mt-0.5">{selected.specialization}</p>
              <p className="text-xs text-slate-400 mt-1 font-mono">{selected.id}</p>

              <div className="mt-5 space-y-0 divide-y divide-slate-50">
                {[
                  ["🏥", "Department",   selected.dept],
                  ["🎓", "Education",    selected.education],
                  ["⏱",  "Experience",   selected.experience],
                  ["📅", "Schedule",     selected.schedule],
                  ["💰", "Consult Fee",  `$${selected.fee}`],
                  ["👥", "Patients",     selected.patients],
                  ["📞", "Phone",        selected.phone],
                  ["✉️", "Email",        selected.email],
                ].map(([icon, label, val]) => val ? (
                  <div key={label} className="flex items-start gap-3 py-2.5">
                    <span className="text-base mt-0.5 w-5 text-center flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 font-medium">{label}</div>
                      <div className="text-sm font-semibold text-slate-700 truncate">{val}</div>
                    </div>
                  </div>
                ) : null)}
              </div>

              <div className="flex gap-2 mt-5">
                <button onClick={() => { openEdit(selected); setSelected(null); }}
                  className="flex-1 py-2 text-sm font-semibold rounded-xl transition-colors"
                  style={{ background: "#EBF5FF", color: "#2F6FED" }}>
                  ✏️ Edit
                </button>
                <button onClick={() => setDeleteTarget(selected)}
                  className="flex-1 py-2 text-sm font-semibold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>

          {/* Appointments panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "📅", label: "Total Appts", val: apts.length, color: "blue" },
                { icon: "✅", label: "Completed",   val: apts.filter(a => a.status === "Completed").length, color: "green" },
                { icon: "⏳", label: "Pending",      val: apts.filter(a => a.status === "Pending").length, color: "amber" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className={`text-2xl font-bold text-${s.color}-600`}>{s.val}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Appointment list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Appointments</h3>
                <span className="text-xs text-slate-400 font-medium">{apts.length} record{apts.length !== 1 ? "s" : ""}</span>
              </div>
              {apts.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-3">📅</div>
                  <div className="text-sm font-semibold text-slate-500">No appointments scheduled</div>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {apts.map(apt => (
                    <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base flex-shrink-0">👤</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{apt.patient}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{apt.type} · {apt.date} at {apt.time}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-semibold text-green-600">${apt.fee}</span>
                        <Badge status={apt.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN LIST VIEW ── */
  const onDuty   = doctors.filter(d => d.status === "On Duty" || d.status === "Active").length;
  const onLeave  = doctors.filter(d => d.status === "On Leave").length;
  const inactive = doctors.filter(d => d.status === "Inactive").length;

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!deleteTarget} title="Remove Doctor" message={`Remove ${deleteTarget?.name}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Doctors & Specialists</h1>
          <p className="text-sm text-slate-400 mt-0.5">{doctors.length} registered · {onDuty} on duty · {onLeave} on leave</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(90deg,#2F6FED,#4A7DFF)", boxShadow: "0 4px 14px rgba(47,111,237,0.30)" }}>
          + Add Doctor
        </button>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { icon: "👨‍⚕️", label: "Total",    val: doctors.length,  bg: "#EBF5FF", fg: "#2F6FED" },
          { icon: "✅",  label: "On Duty",  val: onDuty,          bg: "#F0FDF4", fg: "#16A34A" },
          { icon: "🌴",  label: "On Leave", val: onLeave,         bg: "#FFFBEB", fg: "#D97706" },
          { icon: "⛔",  label: "Inactive", val: inactive,        bg: "#FEF2F2", fg: "#DC2626" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: s.fg }}>{s.val}</div>
              <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTER / SEARCH BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 mb-5 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialty or department..."
            className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-slate-400"
          />
        </div>

        {/* Department filter */}
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-600 font-medium">
          {deptOptions.map(d => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
        </select>

        {/* Status filter */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-600 font-medium">
          {statusOptions.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5 flex-shrink-0">
          {[["table","☰ Table"],["cards","⊞ Cards"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === mode ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || filterDept !== "All" || filterStatus !== "All") && (
          <span className="text-xs text-slate-400 font-medium">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        )}
        <button
          onClick={() => exportCSV("AHMS-Doctors", ["ID","Name","Specialization","Department","Experience","Fee","Patients","Phone","Email","Status"],
            filtered.map(d => [d.id, d.name, d.specialization, d.dept, d.experience, d.fee, d.patients, d.phone, d.email, d.status]))}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0 ml-auto">
          📊 Export CSV
        </button>
      </div>

      {/* ── EMPTY STATE ── */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <div className="text-base font-bold text-slate-700 mb-1">
            {doctors.length === 0 ? "No doctors registered yet" : "No doctors match your filters"}
          </div>
          <p className="text-sm text-slate-400 mb-5">
            {doctors.length === 0 ? "Add your first doctor to get started." : "Try adjusting your search or clearing filters."}
          </p>
          {doctors.length === 0 && (
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
              style={{ background: "linear-gradient(90deg,#2F6FED,#4A7DFF)" }}>
              + Add First Doctor
            </button>
          )}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === "table" && filtered.length > 0 && (
        <DataTable
          data={filtered}
          pageSize={12}
          emptyIcon="👨‍⚕️" emptyTitle="No doctors found" emptySubtitle="Adjust your search or filters"
          columns={[
            { key: "name", label: "Doctor", render: doc => (
              <div className="flex items-center gap-3">
                <DoctorAvatar name={doc.name} size="md" />
                <div>
                  <div className="font-bold text-slate-800 text-sm">{doc.name}</div>
                  <div className="text-xs text-blue-600 font-medium mt-0.5">{doc.specialization}</div>
                </div>
              </div>
            )},
            { key: "dept", label: "Department", render: doc => (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                🏥 {doc.dept}
              </span>
            )},
            { key: "experience", label: "Experience", render: doc => (
              <span className="text-sm text-slate-600 font-medium">{doc.experience || "—"}</span>
            )},
            { key: "fee", label: "Fee", render: doc => (
              <span className="text-sm font-bold text-green-600">${doc.fee}</span>
            )},
            { key: "patients", label: "Patients", render: doc => (
              <span className="text-sm font-semibold text-slate-700">{doc.patients}</span>
            )},
            { key: "phone", label: "Contact", render: doc => (
              <div>
                <div className="text-xs text-slate-600 font-medium">{doc.phone}</div>
                {doc.email && <div className="text-xs text-slate-400 truncate max-w-36">{doc.email}</div>}
              </div>
            )},
            { key: "status", label: "Status", render: doc => <DoctorStatusBadge status={doc.status} />, sortable: false },
          ]}
          rowActions={doc => (
            <div className="flex items-center gap-1">
              <button onClick={() => setSelected(doc)} title="View Profile"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm">
                👁
              </button>
              <button onClick={() => openEdit(doc)} title="Edit Doctor"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors text-sm">
                ✏️
              </button>
              <button onClick={() => setPage("appointments")} title="Schedule Appointment"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors text-sm">
                📅
              </button>
              <button onClick={() => setDeleteTarget(doc)} title="Delete Doctor"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm">
                🗑
              </button>
            </div>
          )}
        />
      )}

      {/* ── CARD VIEW ── */}
      {viewMode === "cards" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(doc => (
            <div key={doc.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group cursor-pointer"
              onClick={() => setSelected(doc)}>
              {/* Card color band */}
              <div className="h-2 w-full" style={{ background: "linear-gradient(90deg,#2F6FED,#4A7DFF)" }} />

              <div className="p-5">
                {/* Avatar + status */}
                <div className="flex items-start justify-between mb-4">
                  <DoctorAvatar name={doc.name} size="lg" />
                  <DoctorStatusBadge status={doc.status} />
                </div>

                {/* Name & specialty */}
                <h3 className="font-bold text-slate-800 text-base leading-tight">{doc.name}</h3>
                <p className="text-sm font-semibold text-blue-600 mt-0.5">{doc.specialization}</p>

                {/* Info rows */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>🏥</span>
                    <span className="font-medium text-slate-700 truncate">{doc.dept}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>📞</span>
                    <span className="font-medium text-slate-700">{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>⏱</span>
                    <span className="font-medium text-slate-700">{doc.experience || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>👥</span><span className="font-semibold text-slate-700">{doc.patients} patients</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">${doc.fee}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button onClick={e => { e.stopPropagation(); setSelected(doc); }}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl transition-colors"
                    style={{ background: "#EBF5FF", color: "#2F6FED" }}>
                    👁 View
                  </button>
                  <button onClick={e => { e.stopPropagation(); openEdit(doc); }}
                    className="flex-1 py-2 text-xs font-semibold bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition-colors">
                    ✏️ Edit
                  </button>
                  <button onClick={e => { e.stopPropagation(); setPage("appointments"); }}
                    className="flex-1 py-2 text-xs font-semibold bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors">
                    📅 Schedule
                  </button>
                  <button onClick={e => { e.stopPropagation(); setDeleteTarget(doc); }}
                    className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-sm flex-shrink-0">
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditDoctor(null); }} title={editDoctor ? "Edit Doctor Profile" : "Add New Doctor"} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" value={form.name} onChange={v => setForm({...form, name: v})} required placeholder="Dr. Full Name" />
          <FormField label="Specialization" value={form.specialization} onChange={v => setForm({...form, specialization: v})} required placeholder="e.g. Cardiologist" />
          <FormField label="Department" type="select" value={form.dept} onChange={v => setForm({...form, dept: v})} options={departments.map(d => d.name)} required />
          <FormField label="Consultation Fee ($)" type="number" value={form.fee} onChange={v => setForm({...form, fee: v})} required />
          <FormField label="Phone Number" value={form.phone} onChange={v => setForm({...form, phone: v})} required />
          <FormField label="Email Address" type="email" value={form.email} onChange={v => setForm({...form, email: v})} />
          <FormField label="Education / Qualifications" value={form.education} onChange={v => setForm({...form, education: v})} placeholder="e.g. MBBS, FRCS" />
          <FormField label="Experience" value={form.experience} onChange={v => setForm({...form, experience: v})} placeholder="e.g. 10 years" />
          <div className="col-span-2">
            <FormField label="Schedule" value={form.schedule} onChange={v => setForm({...form, schedule: v})} placeholder="e.g. Mon-Fri 8AM-4PM" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setEditDoctor(null); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg,#2F6FED,#4A7DFF)" }}>
            {editDoctor ? "Save Changes" : "Add Doctor"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// APPOINTMENTS PAGE
// ============================================================
const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("list");
  const [calMonth, setCalMonth] = useState(new Date(2024, 2, 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", doctor: "", dept: "", type: "Consultation", date: "", time: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = appointments.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const handleBook = () => {
    if (!form.patient || !form.doctor || !form.date || !form.time) {
      setToast({ msg: "Patient, Doctor, Date and Time are required.", type: "error" }); return;
    }
    const doc = sampleDoctors.find(d => d.name === form.doctor);
    const newId = `AHMS-A${String(appointments.length + 1).padStart(3, "0")}`;
    setAppointments(prev => [...prev, { ...form, id: newId, status: "Pending", fee: doc?.fee || 0, patientId: "" }]);
    setToast({ msg: "Appointment booked successfully.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "Cancelled" } : a));
    setToast({ msg: "Appointment cancelled.", type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Appointments" subtitle={`${appointments.length} total appointments`} action="Book Appointment" onAction={() => setShowModal(true)} />

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        {[["list","📋 List View"],["calendar","📅 Calendar View"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${view === v ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            style={view === v ? { background: "#2F6FED", borderColor: "#2F6FED" } : {}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── CALENDAR VIEW ── */}
      {view === "calendar" && (() => {
        const year = calMonth.getFullYear();
        const month = calMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthName = calMonth.toLocaleString("default", { month: "long", year: "numeric" });
        const statusColors = { Confirmed: "#1BBE9E", Pending: "#F59E0B", Completed: "#2F6FED", Cancelled: "#EF4444" };
        const dayApts = day => sampleAppointments.filter(a => {
          const d = new Date(a.date);
          return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
            {/* Calendar header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <button onClick={() => setCalMonth(new Date(year, month - 1, 1))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold">‹</button>
              <span className="font-bold text-slate-800 text-base">{monthName}</span>
              <button onClick={() => setCalMonth(new Date(year, month + 1, 1))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold">›</button>
            </div>
            {/* Day names */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="min-h-[80px] border-r border-b border-slate-50" />;
                const apts = dayApts(day);
                const isToday = day === 14 && month === 2;
                const isSelected = selectedDay === day;
                return (
                  <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`min-h-[80px] p-1.5 border-r border-b border-slate-50 cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mb-1 ${isToday ? "text-white" : "text-slate-600"}`}
                      style={isToday ? { background: "#2F6FED" } : {}}>
                      {day}
                    </div>
                    {apts.slice(0, 2).map((a, j) => (
                      <div key={j} className="text-xs px-1.5 py-0.5 rounded-md mb-0.5 text-white truncate font-medium"
                        style={{ background: statusColors[a.status] || "#2F6FED" }}>
                        {a.patient.split(" ")[0]}
                      </div>
                    ))}
                    {apts.length > 2 && <div className="text-xs text-slate-400 font-medium">+{apts.length - 2} more</div>}
                  </div>
                );
              })}
            </div>
            {/* Selected day appointments */}
            {selectedDay && dayApts(selectedDay).length > 0 && (
              <div className="border-t border-slate-100 p-4">
                <div className="font-bold text-slate-800 text-sm mb-3">
                  Appointments — {monthName.split(" ")[0]} {selectedDay}, {year}
                </div>
                <div className="space-y-2">
                  {dayApts(selectedDay).map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[a.status] || "#2F6FED" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800">{a.patient}</div>
                        <div className="text-xs text-slate-500">{a.doctor} · {a.dept} · {a.time}</div>
                      </div>
                      <span className="text-xs font-semibold text-green-600">${a.fee}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Today", count: appointments.filter(a => a.date === "2024-03-14").length, color: "blue" },
              { label: "Pending", count: appointments.filter(a => a.status === "Pending").length, color: "amber" },
              { label: "Confirmed", count: appointments.filter(a => a.status === "Confirmed").length, color: "teal" },
              { label: "Completed", count: appointments.filter(a => a.status === "Completed").length, color: "green" },
            ].map(s => (
              <div key={s.label} className={`bg-${s.color}-50 rounded-xl p-3 text-center cursor-pointer`} onClick={() => setFilter(s.label === "Today" ? "All" : s.label)}>
                <div className={`text-xl font-bold text-${s.color}-700`}>{s.count}</div>
                <div className={`text-xs text-${s.color}-500 font-medium`}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="flex-1 min-w-48"><SearchBar placeholder="Search by patient or doctor..." value={search} onChange={setSearch} /></div>
            <button
              onClick={() => exportCSV("AHMS-Appointments", ["ID","Patient","Doctor","Department","Type","Date","Time","Fee","Status"],
                filtered.map(a => [a.id, a.patient, a.doctor, a.dept, a.type, a.date, a.time, a.fee, a.status]))}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
              📊 Export CSV
            </button>
            <div className="flex gap-2 flex-wrap">
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${filter === f ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200"}`}
                  style={filter === f ? { background: "#2F6FED" } : {}}>{f}</button>
              ))}
            </div>
          </div>

          <DataTable
            data={filtered}
            emptyIcon="📅" emptyTitle="No appointments found" emptySubtitle="No appointments match your filters"
            columns={[
              { key: "id", label: "Appt ID", render: a => <span className="font-mono text-xs text-slate-400">{a.id}</span> },
              { key: "patient", label: "Patient", render: a => <span className="font-semibold text-slate-800">{a.patient}</span> },
              { key: "doctor", label: "Doctor", render: a => <span className="text-slate-600 text-xs">{a.doctor}</span> },
              { key: "dept", label: "Department", render: a => <span className="text-slate-500 text-xs">{a.dept}</span> },
              { key: "date", label: "Date & Time", render: a => <div><div className="text-slate-700 font-medium">{a.date}</div><div className="text-xs text-slate-400">{a.time}</div></div> },
              { key: "type", label: "Type", render: a => <span className="text-slate-500 text-xs">{a.type}</span> },
              { key: "fee", label: "Fee", render: a => <span className="font-semibold text-green-600">${a.fee}</span> },
              { key: "status", label: "Status", render: a => <Badge status={a.status} /> },
            ]}
            rowActions={a => (
              a.status !== "Cancelled" && a.status !== "Completed"
                ? <button onClick={() => cancelAppointment(a.id)} className="text-xs text-red-500 hover:underline font-medium">Cancel</button>
                : <span className="text-xs text-slate-300">—</span>
            )}
          />
        </>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Book New Appointment" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <FormField label="Doctor" type="select" value={form.doctor} onChange={v => { const doc = sampleDoctors.find(d => d.name === v); setForm({...form, doctor: v, dept: doc?.dept || ""}); }} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Department" type="select" value={form.dept} onChange={v => setForm({...form, dept: v})} options={departments.map(d => d.name)} required />
          <FormField label="Appointment Type" type="select" value={form.type} onChange={v => setForm({...form, type: v})} options={["Consultation", "Follow-up", "Pre-op Assessment", "Antenatal", "Emergency", "Review"]} />
          <FormField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required />
          <FormField label="Time" type="time" value={form.time} onChange={v => setForm({...form, time: v})} required />
          <div className="col-span-2">
            <FormField label="Notes" type="textarea" value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Additional notes or reason for visit..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleBook} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Book Appointment</button>
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
  const [bills, setBills] = useState(sampleBills);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", desc1: "", amt1: "", desc2: "", amt2: "", paid: "", method: "Cash" };
  const [form, setForm] = useState(emptyForm);

  const totalRevenue = bills.reduce((s, b) => s + b.paid, 0);
  const totalPending = bills.reduce((s, b) => s + b.balance, 0);

  const handleCreateInvoice = () => {
    if (!form.patient || !form.desc1 || !form.amt1) {
      setToast({ msg: "Patient and at least one item are required.", type: "error" }); return;
    }
    const items = [
      { desc: form.desc1, amt: Number(form.amt1) || 0 },
      ...(form.desc2 && form.amt2 ? [{ desc: form.desc2, amt: Number(form.amt2) || 0 }] : []),
    ];
    const total = items.reduce((s, i) => s + i.amt, 0);
    const paid = Math.min(Number(form.paid) || 0, total);
    const balance = total - paid;
    const newId = `INV-2024-${String(bills.length + 1).padStart(3, "0")}`;
    const patObj = samplePatients.find(p => p.name === form.patient);
    setBills(prev => [...prev, {
      id: newId, patient: form.patient, patientId: patObj?.id || "",
      date: new Date().toISOString().slice(0, 10), items, total, paid, balance,
      status: balance === 0 ? "Paid" : paid > 0 ? "Partial" : "Pending",
      method: form.method,
    }]);
    setToast({ msg: "Invoice created successfully.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

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
                <button onClick={() => window.print()} className="px-4 py-2 text-sm bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200">🖨 Print</button>
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
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Billing & Invoices" subtitle="Manage patient billing and payments" action="Create Invoice" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon="💰" label="Total Collected" value={`$${totalRevenue.toFixed(0)}`} color="green" />
        <StatCard icon="⏳" label="Outstanding" value={`$${totalPending.toFixed(0)}`} color="amber" />
        <StatCard icon="📄" label="Total Invoices" value={bills.length} color="blue" />
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search invoices..." value={search} onChange={setSearch} /></div>
        <button
          onClick={() => exportCSV("AHMS-Billing", ["Invoice#","Patient","Date","Total","Paid","Balance","Method","Status"],
            bills.filter(b => b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))
              .map(b => [b.id, b.patient, b.date, b.total.toFixed(2), b.paid.toFixed(2), b.balance.toFixed(2), b.method || "", b.status]))}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
          📊 Export CSV
        </button>
      </div>

      <DataTable
        data={bills.filter(b => b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))}
        emptyIcon="📄" emptyTitle="No invoices found" emptySubtitle="Create an invoice or adjust your search"
        columns={[
          { key: "id", label: "Invoice #", render: b => <span className="font-mono text-xs text-blue-600 font-semibold">{b.id}</span> },
          { key: "patient", label: "Patient", render: b => <span className="font-semibold text-slate-800">{b.patient}</span> },
          { key: "date", label: "Date", render: b => <span className="text-slate-500">{b.date}</span> },
          { key: "total", label: "Total", render: b => <span className="font-medium text-slate-700">${b.total.toFixed(2)}</span> },
          { key: "paid", label: "Paid", render: b => <span className="font-medium text-green-600">${b.paid.toFixed(2)}</span> },
          { key: "balance", label: "Balance", render: b => <span className="font-medium text-red-600">${b.balance.toFixed(2)}</span> },
          { key: "method", label: "Method", render: b => <span className="text-xs text-slate-400">{b.method || "—"}</span> },
          { key: "status", label: "Status", render: b => <Badge status={b.status} /> },
        ]}
        rowActions={b => (
          <button onClick={() => setSelectedBill(b)} className="text-xs text-blue-600 hover:underline font-medium">View</button>
        )}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New Invoice" size="lg">
        <div className="space-y-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice Items</div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Item 1 Description" value={form.desc1} onChange={v => setForm({...form, desc1: v})} required placeholder="e.g. Consultation Fee" />
              <FormField label="Amount ($)" type="number" value={form.amt1} onChange={v => setForm({...form, amt1: v})} required />
              <FormField label="Item 2 Description (optional)" value={form.desc2} onChange={v => setForm({...form, desc2: v})} placeholder="e.g. Lab Test" />
              <FormField label="Amount ($)" type="number" value={form.amt2} onChange={v => setForm({...form, amt2: v})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount Paid ($)" type="number" value={form.paid} onChange={v => setForm({...form, paid: v})} placeholder="0 if unpaid" />
            <FormField label="Payment Method" type="select" value={form.method} onChange={v => setForm({...form, method: v})} options={["Cash", "Mobile Money", "Insurance", "Bank Transfer", "Card"]} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleCreateInvoice} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Create Invoice</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// PHARMACY PAGE (with prescription integration)
// ============================================================
const PharmacyPage = () => {
  const [medicines, setMedicines] = useState(sampleMedicines);
  const [prescriptions, setPrescriptions] = useState(samplePrescriptions);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("stock");
  const [showModal, setShowModal] = useState(false);
  const [dispenseRx, setDispenseRx] = useState(null);
  const [dispensedBy, setDispensedBy] = useState("");
  const [toast, setToast] = useState(null);
  const emptyMedForm = { name: "", category: "Antibiotics", unit: "Tablets", stock: "", price: "", expiry: "", supplier: "", reorder: "" };
  const [medForm, setMedForm] = useState(emptyMedForm);

  const lowStock = medicines.filter(m => m.stock <= m.reorder);

  const filteredMeds = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const pendingRx = prescriptions.filter(rx => rx.status === "Active");
  const dispensedRx = prescriptions.filter(rx => rx.status === "Dispensed");

  const handleAddMedicine = () => {
    if (!medForm.name.trim() || !medForm.stock || !medForm.price) {
      setToast({ msg: "Name, Stock and Price are required.", type: "error" }); return;
    }
    const newId = `MED-${String(medicines.length + 1).padStart(3, "0")}`;
    setMedicines(prev => [...prev, { ...emptyMedForm, ...medForm, id: newId, stock: Number(medForm.stock), price: Number(medForm.price), reorder: Number(medForm.reorder) || 50, batch: `BTX-${Date.now()}` }]);
    setToast({ msg: "Medicine added to stock.", type: "success" });
    setMedForm(emptyMedForm); setShowModal(false);
  };

  const handleDispense = () => {
    if (!dispensedBy.trim()) { setToast({ msg: "Please enter the pharmacist name.", type: "error" }); return; }
    setPrescriptions(prev => prev.map(rx => rx.id === dispenseRx.id ? { ...rx, status: "Dispensed" } : rx));
    setToast({ msg: `Prescription dispensed by ${dispensedBy}.`, type: "success" });
    setDispensedBy(""); setDispenseRx(null);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Pharmacy" subtitle="Medicine stock, dispensing and prescription management" action="Add Medicine" onAction={() => setShowModal(true)} />

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-800">Low Stock Alert — {lowStock.length} item{lowStock.length !== 1 ? "s" : ""} below reorder level</div>
            <div className="text-xs text-amber-600 mt-1">{lowStock.map(m => m.name).join(" · ")}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="💊" label="Total Medicines" value={medicines.length} color="blue" />
        <StatCard icon="⚠️" label="Low Stock" value={lowStock.length} color="amber" />
        <StatCard icon="📋" label="Pending Rx" value={pendingRx.length} sub="Awaiting dispense" color="purple" />
        <StatCard icon="✅" label="Dispensed Today" value={dispensedRx.length} color="green" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
        {[["stock", "💊 Medicine Stock"], ["prescriptions", "📋 Prescriptions Queue"], ["dispensed", "✅ Dispensed"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
        ))}
      </div>

      {/* Medicine Stock Tab */}
      {tab === "stock" && (
        <>
          <div className="flex gap-3 mb-4">
            <div className="flex-1"><SearchBar placeholder="Search medicines by name or category..." value={search} onChange={setSearch} /></div>
            <button
              onClick={() => exportCSV("AHMS-Medicines", ["ID","Name","Category","Stock","Unit","Price","Expiry","Supplier","Batch","Status"],
                filteredMeds.map(m => [m.id, m.name, m.category, m.stock, m.unit, m.price.toFixed(2), m.expiry, m.supplier, m.batch, m.stock <= m.reorder ? "Low Stock" : "In Stock"]))}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
              📊 Export CSV
            </button>
          </div>
          <DataTable
            data={filteredMeds}
            emptyIcon="💊" emptyTitle="No medicines found" emptySubtitle="Add medicines or adjust your search"
            columns={[
              { key: "name", label: "Medicine", render: med => <span className="font-semibold text-slate-800">{med.name}</span> },
              { key: "category", label: "Category", render: med => <span className="text-slate-500 text-xs">{med.category}</span> },
              { key: "stock", label: "Stock", render: med => {
                const isLow = med.stock <= med.reorder;
                return (
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isLow ? "text-red-600" : "text-slate-700"}`}>{med.stock}</span>
                    <span className="text-xs text-slate-400">{med.unit}</span>
                    {isLow && <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-medium">Low</span>}
                  </div>
                );
              }},
              { key: "price", label: "Unit Price", render: med => <span className="font-medium text-green-600">${med.price.toFixed(2)}</span> },
              { key: "expiry", label: "Expiry", render: med => <span className="text-xs text-slate-500">{med.expiry}</span> },
              { key: "supplier", label: "Supplier", render: med => <span className="text-xs text-slate-500">{med.supplier}</span> },
              { key: "batch", label: "Batch", render: med => <span className="font-mono text-xs text-slate-400">{med.batch}</span> },
              { key: "status", label: "Status", render: med => <Badge status={med.stock <= med.reorder ? "Pending" : "Active"} /> },
            ]}
          />
        </>
      )}

      {/* Prescriptions Queue Tab — auto-populated from doctor prescriptions */}
      {tab === "prescriptions" && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700 font-medium">
            📋 Prescriptions written by doctors appear here automatically. Pharmacists can review and dispense.
          </div>
          {pendingRx.length === 0
            ? <EmptyState icon="💊" title="No pending prescriptions" subtitle="All prescriptions have been dispensed." />
            : pendingRx.map(rx => (
              <div key={rx.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-slate-800">{rx.patient}</span>
                      <span className="font-mono text-xs text-slate-400">{rx.id}</span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{rx.date}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">Doctor: <span className="font-medium">{rx.doctor}</span> &nbsp;·&nbsp; Diagnosis: <span className="font-medium text-blue-600">{rx.diagnosis}</span></div>
                    <div className="space-y-1">
                      {rx.medicines.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs bg-slate-50 rounded-lg px-3 py-2">
                          <span className="font-semibold text-slate-700">💊 {m.name}</span>
                          <span className="text-slate-400">—</span>
                          <span className="text-slate-600">{m.dose} · {m.frequency} · {m.duration}</span>
                          <span className="ml-auto font-bold text-blue-600">Qty: {m.qty}</span>
                        </div>
                      ))}
                    </div>
                    {rx.notes && <div className="mt-2 text-xs text-amber-600 italic">{rx.notes}</div>}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Badge status="Active" />
                    <button onClick={() => setDispenseRx(rx)} className="px-4 py-2 text-xs bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700">Dispense</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Dispensed Tab */}
      {tab === "dispensed" && (
        <div className="space-y-3">
          {dispensedRx.length === 0
            ? <EmptyState icon="✅" title="No dispensed prescriptions" subtitle="No prescriptions have been dispensed yet." />
            : dispensedRx.map(rx => (
              <div key={rx.id} className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-slate-800">{rx.patient}</span>
                      <span className="font-mono text-xs text-slate-400">{rx.id}</span>
                    </div>
                    <div className="text-xs text-slate-500">{rx.doctor} · {rx.date} · {rx.diagnosis}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {rx.medicines.map((m, i) => <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">{m.name}</span>)}
                    </div>
                  </div>
                  <Badge status="Completed" />
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Dispense Confirmation Modal */}
      <Modal open={!!dispenseRx} onClose={() => { setDispenseRx(null); setDispensedBy(""); }} title="Confirm Dispense" size="md">
        {dispenseRx && (
          <div>
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-4">
              <div className="font-bold text-teal-800 mb-1">Dispensing to: {dispenseRx.patient}</div>
              <div className="text-xs text-teal-600">{dispenseRx.id} · {dispenseRx.doctor} · {dispenseRx.diagnosis}</div>
            </div>
            <div className="space-y-2 mb-4">
              {dispenseRx.medicines.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
                  <span className="font-semibold text-slate-800">💊 {m.name}</span>
                  <span className="text-slate-500">{m.dose} · {m.frequency}</span>
                  <span className="font-bold text-blue-600">×{m.qty}</span>
                </div>
              ))}
            </div>
            <FormField label="Dispensed By (Pharmacist)" value={dispensedBy} onChange={v => setDispensedBy(v)} placeholder="Your name" required />
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
              <button onClick={() => { setDispenseRx(null); setDispensedBy(""); }} className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">Cancel</button>
              <button onClick={handleDispense} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold">✓ Confirm Dispense</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Medicine Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Medicine" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Medicine Name" value={medForm.name} onChange={v => setMedForm({...medForm, name: v})} required placeholder="e.g. Amoxicillin 500mg" />
          <FormField label="Category" type="select" value={medForm.category} onChange={v => setMedForm({...medForm, category: v})} options={["Antibiotics","Cardiovascular","Diabetes","Analgesics","Gastro","Hormones","Respiratory","Vitamins","Other"]} />
          <FormField label="Unit" type="select" value={medForm.unit} onChange={v => setMedForm({...medForm, unit: v})} options={["Tablets","Capsules","Vials","Ampoules","Bottles","Syrup","Inhaler","Cream"]} />
          <FormField label="Stock Quantity" type="number" value={medForm.stock} onChange={v => setMedForm({...medForm, stock: v})} required />
          <FormField label="Unit Price ($)" type="number" value={medForm.price} onChange={v => setMedForm({...medForm, price: v})} required />
          <FormField label="Reorder Level" type="number" value={medForm.reorder} onChange={v => setMedForm({...medForm, reorder: v})} placeholder="Min stock before alert" />
          <FormField label="Expiry Date" type="date" value={medForm.expiry} onChange={v => setMedForm({...medForm, expiry: v})} />
          <FormField label="Supplier" value={medForm.supplier} onChange={v => setMedForm({...medForm, supplier: v})} placeholder="Supplier name" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleAddMedicine} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Add Medicine</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// LABORATORY PAGE
// ============================================================
const LaboratoryPage = () => {
  const [labTests, setLabTests] = useState(sampleLabTests);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", orderedBy: "", test: "", category: "Hematology", priority: "Routine", fee: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = labTests.filter(l =>
    l.patient.toLowerCase().includes(search.toLowerCase()) ||
    l.test.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrder = () => {
    if (!form.patient || !form.orderedBy || !form.test.trim()) {
      setToast({ msg: "Patient, Doctor and Test Name are required.", type: "error" }); return;
    }
    const newId = `LAB-${String(labTests.length + 1).padStart(3, "0")}`;
    setLabTests(prev => [...prev, {
      id: newId, patient: form.patient, orderedBy: form.orderedBy, test: form.test,
      category: form.category, priority: form.priority, fee: Number(form.fee) || 0,
      notes: form.notes, date: new Date().toISOString().slice(0, 10),
      status: "Pending", result: "", tech: ""
    }]);
    setToast({ msg: "Lab test ordered successfully.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Laboratory" subtitle="Test orders and results management" action="Order Test" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🔬" label="Total Tests" value={labTests.length} color="blue" />
        <StatCard icon="⏳" label="Pending" value={labTests.filter(l => l.status === "Pending").length} color="amber" />
        <StatCard icon="🔄" label="Processing" value={labTests.filter(l => l.status === "Processing").length} color="purple" />
        <StatCard icon="✅" label="Completed" value={labTests.filter(l => l.status === "Completed").length} color="green" />
      </div>

      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search tests..." value={search} onChange={setSearch} /></div>
        <button
          onClick={() => exportCSV("AHMS-LabTests", ["ID","Patient","Test","Ordered By","Date","Technician","Result","Status","Fee"],
            filtered.map(l => [l.id, l.patient, l.test, l.orderedBy, l.date, l.tech || "", l.result || "", l.status, l.fee]))}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
          📊 Export CSV
        </button>
        <button onClick={() => setShowPrint(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0">
          🖨 Print Report
        </button>
      </div>

      <PrintPreviewModal open={showPrint} onClose={() => setShowPrint(false)} title="LABORATORY TEST REPORT" subtitle="Diagnostic Laboratory Department" docId={`LAB-RPT-${new Date().toISOString().slice(0,10)}`} docDate={new Date().toISOString().slice(0,10)}>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50">{["Test ID","Patient","Test","Ordered By","Date","Technician","Result","Status","Fee"].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={l.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                {[l.id, l.patient, l.test, l.orderedBy, l.date, l.tech || "—", l.result || "Pending", l.status, `$${l.fee}`].map((v, j) => (
                  <td key={j} className="px-3 py-2 border border-slate-200 text-slate-700">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PrintPreviewModal>

      <DataTable
        data={filtered}
        emptyIcon="🔬" emptyTitle="No lab tests found" emptySubtitle="Order a test or adjust your search"
        columns={[
          { key: "id", label: "Test ID", render: l => <span className="font-mono text-xs text-slate-400">{l.id}</span> },
          { key: "patient", label: "Patient", render: l => <span className="font-semibold text-slate-800">{l.patient}</span> },
          { key: "test", label: "Test", render: l => <span className="text-slate-700">{l.test}</span> },
          { key: "orderedBy", label: "Ordered By", render: l => <span className="text-xs text-slate-500">{l.orderedBy}</span> },
          { key: "date", label: "Date", render: l => <span className="text-slate-500">{l.date}</span> },
          { key: "tech", label: "Technician", render: l => l.tech ? <span className="text-xs text-slate-500">{l.tech}</span> : <span className="text-slate-300">Unassigned</span> },
          { key: "result", label: "Result", render: l => l.result ? <Badge status={l.result} /> : <span className="text-slate-300 text-xs">Pending</span> },
          { key: "status", label: "Status", render: l => <Badge status={l.status} /> },
          { key: "fee", label: "Fee", render: l => <span className="font-medium text-green-600">${l.fee}</span> },
        ]}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Order Lab Test" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <FormField label="Ordered By (Doctor)" type="select" value={form.orderedBy} onChange={v => setForm({...form, orderedBy: v})} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Test Name" value={form.test} onChange={v => setForm({...form, test: v})} required placeholder="e.g. Complete Blood Count" />
          <FormField label="Test Category" type="select" value={form.category} onChange={v => setForm({...form, category: v})} options={["Hematology", "Biochemistry", "Microbiology", "Urine Analysis", "Hormones", "Imaging"]} />
          <FormField label="Priority" type="select" value={form.priority} onChange={v => setForm({...form, priority: v})} options={["Routine", "Urgent", "STAT"]} />
          <FormField label="Fee ($)" type="number" value={form.fee} onChange={v => setForm({...form, fee: v})} />
          <div className="col-span-2"><FormField label="Clinical Notes" type="textarea" value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Clinical information or special instructions..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleOrder} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Order Test</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// DEPARTMENTS PAGE
// ============================================================
const DepartmentsPage = () => {
  const [depts, setDepts] = useState(departments);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { name: "", head: "", icon: "🏥", desc: "", doctors: "", staff: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = depts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  );
  const totalDoctors = depts.reduce((s, d) => s + d.doctors, 0);
  const totalStaff = depts.reduce((s, d) => s + d.staff, 0);

  const openAdd = () => { setEditDept(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (d) => { setEditDept(d); setForm({ name: d.name, head: d.head, icon: d.icon || "🏥", desc: d.desc || "", doctors: String(d.doctors), staff: String(d.staff) }); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.head.trim()) {
      setToast({ msg: "Department name and head are required.", type: "error" }); return;
    }
    if (editDept) {
      setDepts(prev => prev.map(d => d.id === editDept.id ? { ...editDept, ...form, doctors: Number(form.doctors) || 0, staff: Number(form.staff) || 0 } : d));
      setToast({ msg: "Department updated.", type: "success" });
    } else {
      const newId = `DEPT-${String(depts.length + 1).padStart(2, "0")}`;
      setDepts(prev => [...prev, { ...emptyForm, ...form, id: newId, doctors: Number(form.doctors) || 0, staff: Number(form.staff) || 0, status: "Active" }]);
      setToast({ msg: "Department added.", type: "success" });
    }
    setForm(emptyForm); setShowModal(false); setEditDept(null);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Departments & Specialties" subtitle={`${depts.length} active departments · ${totalDoctors} doctors · ${totalStaff} support staff`} action="Add Department" onAction={openAdd} />
      <div className="mb-4"><SearchBar placeholder="Search departments..." value={search} onChange={setSearch} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(dept => (
          <div key={dept.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors">{dept.icon || "🏥"}</div>
              <Badge status={dept.status} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-2">{dept.name}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{dept.desc}</p>
            <div className="mt-4 pt-3 border-t border-slate-50 space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Head</span><span className="font-medium text-slate-700 text-right">{dept.head}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Doctors</span><span className="font-bold text-blue-600">{dept.doctors}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Support Staff</span><span className="font-medium text-slate-700">{dept.staff}</span></div>
            </div>
            <div className="mt-3 flex gap-1.5">
              <button onClick={() => openEdit(dept)} className="flex-1 py-1.5 text-xs bg-teal-50 text-teal-600 rounded-lg font-medium hover:bg-teal-100">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditDept(null); }} title={editDept ? "Edit Department" : "Add Department"} size="md">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Department Name" value={form.name} onChange={v => setForm({...form, name: v})} required placeholder="e.g. Cardiology" />
          <FormField label="Department Head" value={form.head} onChange={v => setForm({...form, head: v})} required placeholder="Dr. Name or Staff Name" />
          <FormField label="Icon (emoji)" value={form.icon} onChange={v => setForm({...form, icon: v})} placeholder="e.g. ❤️" />
          <FormField label="Doctors Count" type="number" value={form.doctors} onChange={v => setForm({...form, doctors: v})} />
          <FormField label="Support Staff Count" type="number" value={form.staff} onChange={v => setForm({...form, staff: v})} />
          <div className="col-span-2">
            <FormField label="Description" value={form.desc} onChange={v => setForm({...form, desc: v})} placeholder="Short description of department services" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setEditDept(null); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editDept ? "Save Changes" : "Add Department"}</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// STAFF PAGE
// ============================================================
const StaffPage = () => {
  const [staff, setStaff] = useState(sampleStaff);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { name: "", role: "", dept: "", shift: "Morning", phone: "", email: "", salary: "", joinDate: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditStaff(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => { setEditStaff(s); setForm({ name: s.name, role: s.role, dept: s.dept, shift: s.shift, phone: s.phone, email: s.email || "", salary: String(s.salary), joinDate: s.joinDate || "" }); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.role || !form.dept) {
      setToast({ msg: "Name, Role and Department are required.", type: "error" }); return;
    }
    if (editStaff) {
      setStaff(prev => prev.map(s => s.id === editStaff.id ? { ...editStaff, ...form, salary: Number(form.salary) || 0 } : s));
      setToast({ msg: "Staff record updated.", type: "success" });
    } else {
      const newId = `AHMS-S${String(staff.length + 1).padStart(3, "0")}`;
      setStaff(prev => [...prev, { ...emptyForm, ...form, id: newId, salary: Number(form.salary) || 0, status: "Active" }]);
      setToast({ msg: "Staff member added.", type: "success" });
    }
    setForm(emptyForm); setShowModal(false); setEditStaff(null);
  };

  const handleDelete = () => {
    setStaff(prev => prev.filter(s => s.id !== deleteTarget.id));
    setToast({ msg: "Staff record removed.", type: "success" });
    setDeleteTarget(null);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!deleteTarget} title="Remove Staff Member" message={`Remove ${deleteTarget?.name}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      <SectionHeader title="Staff & Nurses" subtitle={`${staff.length} staff members`} action="Add Staff" onAction={openAdd} />
      <div className="flex gap-3 mb-5">
        <div className="flex-1"><SearchBar placeholder="Search staff..." value={search} onChange={setSearch} /></div>
        <button
          onClick={() => exportCSV("AHMS-Staff", ["ID","Name","Role","Department","Shift","Phone","Salary","Join Date","Status"],
            filtered.map(s => [s.id, s.name, s.role, s.dept, s.shift, s.phone || "", s.salary, s.joinDate || "", s.status]))}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
          📊 Export CSV
        </button>
      </div>

      <DataTable
        data={filtered}
        emptyIcon="👥" emptyTitle="No staff found" emptySubtitle="Add staff members or adjust your search"
        columns={[
          { key: "name", label: "Staff Member", render: s => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">{s.name.charAt(0)}</div>
              <div><div className="font-semibold text-slate-800">{s.name}</div><div className="text-xs text-slate-400">{s.email}</div></div>
            </div>
          )},
          { key: "id", label: "ID", render: s => <span className="font-mono text-xs text-slate-400">{s.id}</span> },
          { key: "role", label: "Role", render: s => <span className="text-xs font-medium text-slate-600">{s.role}</span> },
          { key: "dept", label: "Department", render: s => <span className="text-xs text-slate-500">{s.dept}</span> },
          { key: "shift", label: "Shift", render: s => <span className="text-xs text-slate-500">{s.shift}</span> },
          { key: "salary", label: "Salary", render: s => <span className="font-semibold text-green-600">${s.salary}/mo</span> },
          { key: "joinDate", label: "Joined", render: s => <span className="text-xs text-slate-400">{s.joinDate}</span> },
          { key: "status", label: "Status", render: s => <Badge status={s.status} /> },
        ]}
        rowActions={s => (<>
          <button onClick={() => openEdit(s)} className="text-xs text-teal-600 hover:underline font-medium">Edit</button>
          <button onClick={() => setDeleteTarget(s)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
        </>)}
      />

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditStaff(null); }} title={editStaff ? "Edit Staff Member" : "Add Staff Member"} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <FormField label="Role" type="select" value={form.role} onChange={v => setForm({...form, role: v})} options={["Head Nurse", "Nurse", "Receptionist", "Pharmacist", "Lab Technician", "Radiologist", "Accountant", "HR Officer", "Security", "Cleaner"]} required />
          <FormField label="Department" type="select" value={form.dept} onChange={v => setForm({...form, dept: v})} options={departments.map(d => d.name)} required />
          <FormField label="Shift" type="select" value={form.shift} onChange={v => setForm({...form, shift: v})} options={["Morning", "Evening", "Night", "Rotating"]} />
          <FormField label="Phone Number" value={form.phone} onChange={v => setForm({...form, phone: v})} required />
          <FormField label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} />
          <FormField label="Monthly Salary ($)" type="number" value={form.salary} onChange={v => setForm({...form, salary: v})} required />
          <FormField label="Join Date" type="date" value={form.joinDate} onChange={v => setForm({...form, joinDate: v})} required />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setEditStaff(null); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editStaff ? "Save Changes" : "Add Staff"}</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// IPD / ADMISSIONS PAGE
// ============================================================
const IPDPage = () => {
  const [admissions, setAdmissions] = useState(sampleBeds.filter(b => b.status === "Occupied"));
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", doctor: "", ward: "General Ward A", bed: "", admDate: "", reason: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  const handleAdmit = () => {
    if (!form.patient || !form.doctor || !form.ward || !form.admDate || !form.reason.trim()) {
      setToast({ msg: "Patient, Doctor, Ward, Date and Reason are required.", type: "error" }); return;
    }
    const newId = `BED-${String(admissions.length + 101).padStart(3, "0")}`;
    setAdmissions(prev => [...prev, { id: newId, patient: form.patient, doctor: form.doctor, ward: form.ward, admDate: form.admDate, status: "Occupied", reason: form.reason }]);
    setToast({ msg: `${form.patient} admitted to ${form.ward}.`, type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="IPD / Inpatient Admissions" subtitle={`${admissions.length} currently admitted patients`} action="Admit Patient" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🛏" label="Total Admitted" value={admissions.length} color="blue" />
        <StatCard icon="🏥" label="ICU Patients" value={admissions.filter(b => b.ward === "ICU").length} color="red" />
        <StatCard icon="🏨" label="General Ward" value={admissions.filter(b => b.ward && b.ward.includes("General")).length} color="teal" />
        <StatCard icon="📊" label="Occupancy" value={`${Math.round((admissions.length / sampleBeds.length) * 100)}%`} color="purple" />
      </div>

      <div className="space-y-3">
        {admissions.map(bed => (
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
                  <button onClick={() => setToast({ msg: `Progress note recorded for ${bed.patient}.`, type: "success" })} className="px-3 py-1.5 text-xs bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100">Progress Note</button>
                  <button onClick={() => { setAdmissions(prev => prev.filter(a => a.id !== bed.id)); setToast({ msg: `${bed.patient} discharged.`, type: "success" }); }} className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100">Discharge</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setForm(emptyForm); }} title="Admit Patient" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <FormField label="Attending Doctor" type="select" value={form.doctor} onChange={v => setForm({...form, doctor: v})} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Ward" type="select" value={form.ward} onChange={v => setForm({...form, ward: v})} options={["General Ward A", "General Ward B", "ICU", "Maternity Ward", "Pediatric Ward", "Surgical Ward"]} required />
          <FormField label="Bed" type="select" value={form.bed} onChange={v => setForm({...form, bed: v})} options={sampleBeds.filter(b => b.status === "Available").map(b => b.id)} required />
          <FormField label="Admission Date" type="date" value={form.admDate} onChange={v => setForm({...form, admDate: v})} required />
          <FormField label="Reason for Admission" value={form.reason} onChange={v => setForm({...form, reason: v})} placeholder="Primary diagnosis/reason" required />
          <div className="col-span-2"><FormField label="Admission Notes" type="textarea" value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Clinical notes, treatment plan..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setForm(emptyForm); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleAdmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Admit Patient</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// OPD PAGE
// ============================================================
const OPDPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", doctor: "", dept: "", visitType: "Consultation", date: "", time: "", complaint: "" };
  const [form, setForm] = useState(emptyForm);

  const handleRegister = () => {
    if (!form.patient || !form.doctor || !form.date) {
      setToast({ msg: "Patient, Doctor and Date are required.", type: "error" }); return;
    }
    setToast({ msg: `OPD visit registered for ${form.patient}.`, type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  return (
  <div>
    {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    <SectionHeader title="OPD — Outpatient Department" subtitle="Daily outpatient consultations" action="Register Visit" onAction={() => setShowModal(true)} />
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
            <button onClick={() => setToast({ msg: `${p.name} called in.`, type: "success" })}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700">Call In</button>
          </div>
        ))}
      </div>
    </div>

    <Modal open={showModal} onClose={() => { setShowModal(false); setForm(emptyForm); }} title="Register OPD Visit" size="lg">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
        <FormField label="Doctor" type="select" value={form.doctor} onChange={v => setForm({...form, doctor: v})} options={sampleDoctors.map(d => d.name)} required />
        <FormField label="Department" type="select" value={form.dept} onChange={v => setForm({...form, dept: v})} options={departments.map(d => d.name)} />
        <FormField label="Visit Type" type="select" value={form.visitType} onChange={v => setForm({...form, visitType: v})} options={["Consultation", "Follow-up", "Emergency", "Review"]} />
        <FormField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required />
        <FormField label="Time" type="time" value={form.time} onChange={v => setForm({...form, time: v})} />
        <div className="col-span-2"><FormField label="Chief Complaint" type="textarea" value={form.complaint} onChange={v => setForm({...form, complaint: v})} placeholder="Describe the reason for visit..." /></div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <button onClick={() => { setShowModal(false); setForm(emptyForm); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
        <button onClick={handleRegister} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Register Visit</button>
      </div>
    </Modal>
  </div>
  );
};

// ============================================================
// REPORTS PAGE — with PDF Print Preview
// ============================================================
const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState(null);

  const today = "2026-03-15";

  const reportData = {
    revenue: {
      title: "MONTHLY REVENUE REPORT",
      subtitle: "Finance & Billing Department",
      docId: "RPT-REV-2026-03",
      docDate: today,
      content: (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5 text-sm">
            <div className="bg-green-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-green-700">$85,500</div><div className="text-xs text-green-600 mt-1">Total Revenue</div></div>
            <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-blue-700">$12,450</div><div className="text-xs text-blue-600 mt-1">Outstanding</div></div>
            <div className="bg-teal-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-teal-700">$73,050</div><div className="text-xs text-teal-600 mt-1">Collected</div></div>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-50">{["Department","Invoices","Revenue","Collected","Pending"].map(h=><th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">{h}</th>)}</tr></thead>
            <tbody>
              {[["General Medicine",45,"$18,200","$16,800","$1,400"],["Cardiology",28,"$22,400","$21,000","$1,400"],["Surgery",12,"$31,500","$28,000","$3,500"],["Gynecology",18,"$8,400","$7,250","$1,150"],["Pharmacy","—","$5,000","$4,800","$200"]].map((r,i)=>(
                <tr key={i} className={i%2===0?"bg-white":"bg-slate-50/50"}>{r.map((c,j)=><td key={j} className="px-3 py-2 border border-slate-200 text-slate-700">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    patients: {
      title: "PATIENT STATISTICS REPORT",
      subtitle: "Patient Management Department",
      docId: "RPT-PAT-2026-03",
      docDate: today,
      content: (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-5 text-sm">
            {[["1,284","Total Registered","blue"],["18","New This Month","green"],["47","Currently Admitted","amber"],["8","Discharged Today","teal"]].map(([v,l,c])=>(
              <div key={l} className={`bg-${c}-50 rounded-xl p-3 text-center`}><div className={`text-xl font-bold text-${c}-700`}>{v}</div><div className={`text-xs text-${c}-600 mt-1`}>{l}</div></div>
            ))}
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-50">{["Department","Total Patients","Active","Admitted","Discharged"].map(h=><th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">{h}</th>)}</tr></thead>
            <tbody>
              {[["General Medicine",320,290,18,12],["Cardiology",180,155,12,8],["Surgery",95,72,15,8],["Gynecology",210,198,6,4],["Pediatrics",145,130,8,6],["Orthopedics",88,75,5,3]].map((r,i)=>(
                <tr key={i} className={i%2===0?"bg-white":"bg-slate-50/50"}>{r.map((c,j)=><td key={j} className="px-3 py-2 border border-slate-200 text-slate-700">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    pharmacy: {
      title: "PHARMACY SALES REPORT",
      subtitle: "Pharmacy Department",
      docId: "RPT-PHR-2026-03",
      docDate: today,
      content: (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-5 text-sm">
            <div className="bg-amber-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-amber-700">$5,840</div><div className="text-xs text-amber-600 mt-1">Total Sales</div></div>
            <div className="bg-blue-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-blue-700">284</div><div className="text-xs text-blue-600 mt-1">Prescriptions Filled</div></div>
            <div className="bg-red-50 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-red-700">8</div><div className="text-xs text-red-600 mt-1">Low Stock Items</div></div>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-50">{["Medicine","Category","Qty Sold","Revenue","Stock Left"].map(h=><th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">{h}</th>)}</tr></thead>
            <tbody>
              {[["Amoxicillin 500mg","Antibiotic",120,"$360","12"],["Paracetamol 500mg","Analgesic",250,"$125","84"],["Metformin 500mg","Antidiabetic",80,"$240","45"],["Lisinopril 10mg","Antihypertensive",65,"$390","30"],["Omeprazole 20mg","Antacid",90,"$270","56"]].map((r,i)=>(
                <tr key={i} className={i%2===0?"bg-white":"bg-slate-50/50"}>{r.map((c,j)=><td key={j} className="px-3 py-2 border border-slate-200 text-slate-700">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    appointments: {
      title: "APPOINTMENT SUMMARY REPORT",
      subtitle: "Outpatient & Scheduling Department",
      docId: "RPT-APT-2026-03",
      docDate: today,
      content: (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-5 text-sm">
            {[["280","Total","blue"],["45","Confirmed","teal"],["12","Pending","amber"],["8","Cancelled","red"]].map(([v,l,c])=>(
              <div key={l} className={`bg-${c}-50 rounded-xl p-3 text-center`}><div className={`text-xl font-bold text-${c}-700`}>{v}</div><div className={`text-xs text-${c}-600 mt-1`}>{l}</div></div>
            ))}
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-50">{["Patient","Doctor","Department","Date","Status","Fee"].map(h=><th key={h} className="text-left px-3 py-2 font-semibold text-slate-600 border border-slate-200">{h}</th>)}</tr></thead>
            <tbody>
              {sampleAppointments.slice(0,8).map((a,i)=>(
                <tr key={i} className={i%2===0?"bg-white":"bg-slate-50/50"}>
                  {[a.patient,a.doctor,a.dept,a.date,a.status,`$${a.fee}`].map((c,j)=><td key={j} className="px-3 py-2 border border-slate-200 text-slate-700">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
  };

  const reportCards = [
    { key: "revenue",      icon: "💰", title: "Monthly Revenue Report",     desc: "Billing, payments and outstanding amounts",  color: "green"  },
    { key: "patients",     icon: "👤", title: "Patient Statistics Report",   desc: "Registrations, demographics, visit history", color: "blue"   },
    { key: "pharmacy",     icon: "💊", title: "Pharmacy Sales Report",       desc: "Sales, stock and dispensing analytics",       color: "amber"  },
    { key: "appointments", icon: "📅", title: "Appointment Summary Report",  desc: "Scheduling trends and completion rates",      color: "teal"   },
    { key: null, icon: "🛏", title: "Bed Occupancy Report",   desc: "Ward utilization and capacity metrics",    color: "purple" },
    { key: null, icon: "👥", title: "Staff Report",            desc: "Employee records and HR analytics",        color: "blue"   },
    { key: null, icon: "🕐", title: "Attendance Report",       desc: "Daily and monthly attendance tracking",    color: "teal"   },
    { key: null, icon: "🔬", title: "Lab Report",              desc: "Test volumes and turnaround times",        color: "purple" },
    { key: null, icon: "🏥", title: "Admission / Discharge",   desc: "IPD flow and discharge summaries",         color: "red"    },
  ];

  const active = activeReport ? reportData[activeReport] : null;

  return (
    <div>
      <SectionHeader title="Reports & Analytics" subtitle="Generate and export professional hospital reports" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map(r => (
          <div key={r.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all group">
            <div className={`w-11 h-11 rounded-xl bg-${r.color}-50 flex items-center justify-center text-xl mb-3`}>{r.icon}</div>
            <h3 className="font-bold text-slate-800">{r.title}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">{r.desc}</p>
            <div className="flex gap-2">
              <button
                onClick={() => r.key && setActiveReport(r.key)}
                className="px-3 py-1.5 text-xs rounded-lg font-medium transition-colors"
                style={{ background: "#EBF2FF", color: "#2F6FED" }}
              >
                🖨 Print / PDF
              </button>
              <button className="px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100">Export CSV</button>
            </div>
          </div>
        ))}
      </div>

      {/* Print Preview Modal for reports */}
      {active && (
        <PrintPreviewModal
          open={!!activeReport}
          onClose={() => setActiveReport(null)}
          title={active.title}
          subtitle={active.subtitle}
          docId={active.docId}
          docDate={active.docDate}
        >
          {active.content}
        </PrintPreviewModal>
      )}
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
  const [hospitalName, setHospitalName] = useState(HOSPITAL.name);
  const [address, setAddress] = useState(HOSPITAL.address);
  const [tel, setTel] = useState(HOSPITAL.tel);
  const [email, setEmail] = useState(HOSPITAL.email);
  const [website, setWebsite] = useState(HOSPITAL.website);
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("Africa/Mogadishu");
  const [logoPreview, setLogoPreview] = useState(null);
  const [settingsTab, setSettingsTab] = useState("hospital");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <SectionHeader title="System Settings" subtitle="Configure AHMS hospital information and system preferences" />

      {/* Settings Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
        {[["hospital", "🏥 Hospital Info"], ["logo", "🖼 Logo & Branding"], ["system", "⚙️ System"], ["roles", "👥 User Roles"], ["doctors", "🩺 Doctor Signatures"]].map(([id, label]) => (
          <button key={id} onClick={() => setSettingsTab(id)} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${settingsTab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
        ))}
      </div>

      {/* HOSPITAL INFO TAB */}
      {settingsTab === "hospital" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">Hospital Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Hospital Name" value={hospitalName} onChange={setHospitalName} required />
                <FormField label="Short Name / Abbreviation" value={HOSPITAL.shortName} onChange={() => {}} />
                <FormField label="System Name" value={HOSPITAL.systemName} onChange={() => {}} />
                <FormField label="Version" value={HOSPITAL.version} onChange={() => {}} />
                <FormField label="Telephone" value={tel} onChange={setTel} required />
                <FormField label="Email" value={email} onChange={setEmail} type="email" required />
                <FormField label="Website" value={website} onChange={setWebsite} />
                <FormField label="Technology Provider" value={HOSPITAL.tech} onChange={() => {}} />
                <div className="col-span-2"><FormField label="Address" value={address} onChange={setAddress} required /></div>
                <div className="col-span-2"><FormField label="Tagline" value={HOSPITAL.tagline} onChange={() => {}} /></div>
              </div>
              <button className="mt-5 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Hospital Info</button>
            </div>
            {/* Live Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">Document Header Preview</h3>
              <div className="border border-slate-200 rounded-xl p-4">
                <DocumentHeader title="DOCUMENT PREVIEW" docId="PREVIEW-001" docDate={new Date().toISOString().split("T")[0]} />
                <div className="text-center text-xs text-slate-400 mt-2">This is how your hospital header appears on all official documents.</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-600 text-white rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <HospitalLogo size="lg" light />
                <div>
                  <div className="font-extrabold text-lg">{hospitalName}</div>
                  <div className="text-blue-200 text-xs">{HOSPITAL.systemName}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-blue-100">
                <div>📍 {address}</div>
                <div>📞 {tel}</div>
                <div>✉ {email}</div>
                <div>🌐 {website}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 text-xs text-blue-200">
                Powered by {HOSPITAL.tech} &nbsp;·&nbsp; {HOSPITAL.version}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGO & BRANDING TAB */}
      {settingsTab === "logo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-1">Hospital Logo</h3>
            <p className="text-xs text-slate-400 mb-5">Upload your hospital logo. It will appear on login screens, dashboards, and all printed documents.</p>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center mb-4 hover:border-blue-400 transition-colors">
              {logoPreview ? (
                <img src={logoPreview} alt="Hospital Logo" className="max-h-32 max-w-full mx-auto object-contain rounded-xl mb-3" />
              ) : (
                <div className="text-4xl mb-3">🏥</div>
              )}
              <div className="text-sm font-medium text-slate-600 mb-1">{logoPreview ? "Logo uploaded" : "No logo uploaded"}</div>
              <div className="text-xs text-slate-400 mb-4">Recommended: PNG or SVG · 200×200px minimum</div>
              <label className="cursor-pointer px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 inline-block">
                {logoPreview ? "Change Logo" : "Upload Logo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
              {logoPreview && (
                <button onClick={() => setLogoPreview(null)} className="ml-3 px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200">Remove</button>
              )}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              <strong>Where the logo appears:</strong> Login page · Dashboard header · All printed documents (Prescriptions, Lab Reports, Radiology, Invoices, Discharge Summaries)
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4">Logo Preview on Documents</h3>
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3 pb-3 border-b border-blue-200 mb-3">
                  {logoPreview
                    ? <img src={logoPreview} alt="logo" className="w-14 h-14 object-contain rounded-xl border border-slate-100" />
                    : <HospitalLogo size="lg" />
                  }
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{HOSPITAL.name.toUpperCase()}</div>
                    <div className="text-xs text-blue-600 font-semibold">{HOSPITAL.systemName}</div>
                    <div className="text-xs text-slate-400 mt-1">{HOSPITAL.address}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 text-center">Document header preview</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3">Print & PDF Settings</h3>
              <div className="space-y-3">
                {[["Show Logo on Documents", true], ["Show Hospital Address", true], ["Show Powered by Sahal Tech", true], ["Show Doctor Signature Block", true]].map(([label, def]) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-700">{label}</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${def ? "bg-blue-600" : "bg-slate-300"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${def ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM PREFERENCES TAB */}
      {settingsTab === "system" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">System Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Currency" type="select" value={currency} onChange={setCurrency} options={["USD", "SOS", "EUR", "GBP"]} />
              <FormField label="Time Zone" type="select" value={timezone} onChange={setTimezone} options={["Africa/Mogadishu", "Africa/Nairobi", "UTC", "Europe/London"]} />
              <FormField label="Date Format" type="select" value="YYYY-MM-DD" onChange={() => {}} options={["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]} />
              <FormField label="Language" type="select" value="English" onChange={() => {}} options={["English", "Somali", "Arabic"]} />
              <FormField label="Session Timeout (min)" type="number" value="30" onChange={() => {}} />
              <FormField label="Items per Page" type="select" value="25" onChange={() => {}} options={["10", "25", "50", "100"]} />
            </div>
            <button className="mt-5 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Preferences</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">System Information</h3>
            <div className="space-y-3">
              {[["System Name", HOSPITAL.systemName], ["Version", HOSPITAL.version], ["Technology Provider", HOSPITAL.tech], ["Copyright Year", HOSPITAL.year], ["Hospital", HOSPITAL.name], ["Contact", HOSPITAL.tel]].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-400">{k}</span>
                  <span className="text-sm font-medium text-slate-700">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <div className="text-sm font-bold text-blue-800">{HOSPITAL.systemName} {HOSPITAL.version}</div>
              <div className="text-xs text-blue-500 mt-1">© {HOSPITAL.year} {HOSPITAL.name}. All Rights Reserved.</div>
              <div className="text-xs text-blue-400 mt-0.5">Powered by {HOSPITAL.tech}</div>
            </div>
          </div>
        </div>
      )}

      {/* USER ROLES TAB */}
      {settingsTab === "roles" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-4">User Roles & Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { role: "Super Admin", perms: ["Full system access", "User management", "Settings", "Reports"] },
              { role: "Doctor", perms: ["Patients", "Prescriptions", "Lab orders", "Radiology orders"] },
              { role: "Nurse", perms: ["Patients", "Vitals", "IPD notes", "Bed management"] },
              { role: "Receptionist", perms: ["Appointments", "OPD registration", "Billing"] },
              { role: "Pharmacist", perms: ["Pharmacy", "Prescriptions queue", "Inventory"] },
              { role: "Lab Technician", perms: ["Laboratory", "Test results entry"] },
              { role: "Radiologist", perms: ["Radiology", "Imaging reports"] },
              { role: "Accountant", perms: ["Billing", "Reports", "Revenue"] },
              { role: "HR Manager", perms: ["HR & Payroll", "Staff management", "Leave approvals"] },
              { role: "Store Manager", perms: ["Inventory", "Stock movements", "Purchase orders"] },
            ].map(({ role, perms }) => (
              <div key={role} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800 text-sm">{role}</span>
                  <button className="text-xs text-blue-600 hover:underline font-medium">Edit Permissions</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {perms.map(p => <span key={p} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCTOR SIGNATURES TAB */}
      {settingsTab === "doctors" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-1">Electronic Doctor Signatures</h3>
          <p className="text-xs text-slate-400 mb-5">Each doctor can upload their electronic signature. It will automatically appear on prescriptions, lab orders, and radiology reports they issue.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleDoctors.slice(0, 12).map(doc => (
              <div key={doc.id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{doc.name.charAt(2)}</div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{doc.name}</div>
                    <div className="text-xs text-slate-400">{doc.specialization}</div>
                  </div>
                </div>
                <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center mb-3 bg-slate-50 min-h-[60px] flex items-center justify-center">
                  {doc.signature
                    ? <img src={doc.signature} alt="sig" className="max-h-12 object-contain" />
                    : <span className="text-xs text-slate-300">No signature uploaded</span>
                  }
                </div>
                <label className="cursor-pointer block text-center px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 border border-blue-100">
                  {doc.signature ? "Change Signature" : "Upload Signature"}
                  <input type="file" accept="image/*" className="hidden" onChange={() => {}} />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// PLACEHOLDER PAGES
// ============================================================
// ============================================================
// EMERGENCY PAGE
// ============================================================
const EmergencyPage = () => {
  const [emergency, setEmergency] = useState(sampleEmergency);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", age: "", gender: "Male", triage: "Urgent", chiefComplaint: "", bp: "", pulse: "", spo2: "", temp: "", doctor: "", arrivalTime: "" };
  const [form, setForm] = useState(emptyForm);

  const triageColor = { Critical: "border-red-300 bg-red-50", Urgent: "border-orange-200 bg-orange-50", "Semi-urgent": "border-yellow-200 bg-yellow-50", "Non-urgent": "border-green-200 bg-green-50" };
  const triageBadge = { Critical: "bg-red-600 text-white", Urgent: "bg-orange-500 text-white", "Semi-urgent": "bg-yellow-400 text-slate-800", "Non-urgent": "bg-green-500 text-white" };

  const filtered = emergency.filter(e =>
    e.patient.toLowerCase().includes(search.toLowerCase()) ||
    e.chiefComplaint.toLowerCase().includes(search.toLowerCase())
  );
  const critical = emergency.filter(e => e.triage === "Critical").length;
  const inTreatment = emergency.filter(e => e.status === "In Treatment").length;
  const waiting = emergency.filter(e => e.status === "Waiting").length;

  const handleRegister = () => {
    if (!form.patient.trim() || !form.age || !form.chiefComplaint.trim()) {
      setToast({ msg: "Patient Name, Age and Chief Complaint are required.", type: "error" }); return;
    }
    const newId = `ER-${String(emergency.length + 1).padStart(3, "0")}`;
    setEmergency(prev => [...prev, {
      id: newId, patient: form.patient, age: form.age, gender: form.gender,
      triage: form.triage, chiefComplaint: form.chiefComplaint, bp: form.bp,
      pulse: form.pulse, spo2: form.spo2, temp: form.temp,
      doctor: form.doctor, arrivalTime: form.arrivalTime, status: "Waiting"
    }]);
    setToast({ msg: "Emergency patient registered.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Emergency Department" subtitle="24/7 Emergency & Trauma Care" action="Register Emergency" onAction={() => setShowModal(true)} />

      <div className="bg-red-600 text-white rounded-2xl p-4 mb-5 flex items-center gap-4">
        <span className="text-3xl">🚨</span>
        <div className="flex-1">
          <div className="font-bold text-lg">{critical} Critical Patient{critical !== 1 ? "s" : ""} — Immediate Attention Required</div>
          <div className="text-red-100 text-sm">{emergency.length} active ER cases · {waiting} waiting · {inTreatment} in treatment</div>
        </div>
        <span className="bg-white text-red-600 text-xs font-black px-4 py-2 rounded-full animate-pulse">● LIVE</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🔴" label="Critical" value={critical} sub="Immediate care" color="red" />
        <StatCard icon="🟠" label="Urgent" value={emergency.filter(e => e.triage === "Urgent").length} sub="Within 15 min" color="amber" />
        <StatCard icon="🏥" label="In Treatment" value={inTreatment} color="blue" />
        <StatCard icon="⏱" label="Waiting" value={waiting} color="purple" />
      </div>

      <div className="mb-4"><SearchBar placeholder="Search patients or complaints..." value={search} onChange={setSearch} /></div>

      <div className="space-y-3">
        {filtered.map(er => (
          <div key={er.id} className={`rounded-2xl border-2 shadow-sm p-5 ${triageColor[er.triage] || "border-slate-100 bg-white"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${triageBadge[er.triage]}`}>{er.triage}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800">{er.patient}</h3>
                    <span className="text-xs text-slate-500">{er.age}y · {er.gender}</span>
                    <span className="font-mono text-xs text-slate-400">{er.id}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 mt-1">{er.chiefComplaint}</div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                    <span>🕐 Arrived: {er.arrivalTime}</span>
                    {er.doctor && <span>👨‍⚕️ {er.doctor}</span>}
                    <span className={`font-semibold ${er.status === "In Treatment" ? "text-blue-600" : "text-orange-600"}`}>{er.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white/80 rounded-lg px-2 py-1.5 min-w-[52px]"><div className="font-bold text-slate-800">{er.bp}</div><div className="text-slate-400">BP</div></div>
                  <div className="bg-white/80 rounded-lg px-2 py-1.5"><div className="font-bold text-slate-800">{er.pulse}</div><div className="text-slate-400">Pulse</div></div>
                  <div className={`rounded-lg px-2 py-1.5 ${parseFloat(er.spo2) < 95 ? "bg-red-100" : "bg-white/80"}`}><div className={`font-bold ${parseFloat(er.spo2) < 95 ? "text-red-700" : "text-slate-800"}`}>{er.spo2}</div><div className="text-slate-400">SpO₂</div></div>
                  <div className={`rounded-lg px-2 py-1.5 ${parseFloat(er.temp) > 38.5 ? "bg-orange-100" : "bg-white/80"}`}><div className={`font-bold ${parseFloat(er.temp) > 38.5 ? "text-orange-700" : "text-slate-800"}`}>{er.temp}</div><div className="text-slate-400">Temp</div></div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Assess</button>
                  <button className="px-3 py-1.5 text-xs bg-white text-teal-700 border border-teal-200 rounded-lg font-medium hover:bg-teal-50">Admit</button>
                  <button className="px-3 py-1.5 text-xs bg-white text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-50">Discharge</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setForm(emptyForm); }} title="Register Emergency Patient" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient Name" value={form.patient} onChange={v => setForm({...form, patient: v})} required />
          <FormField label="Age" type="number" value={form.age} onChange={v => setForm({...form, age: v})} required />
          <FormField label="Gender" type="select" value={form.gender} onChange={v => setForm({...form, gender: v})} options={["Male", "Female"]} required />
          <FormField label="Triage Level" type="select" value={form.triage} onChange={v => setForm({...form, triage: v})} options={["Critical", "Urgent", "Semi-urgent", "Non-urgent"]} required />
          <div className="col-span-2"><FormField label="Chief Complaint" type="textarea" value={form.chiefComplaint} onChange={v => setForm({...form, chiefComplaint: v})} placeholder="Describe the presenting complaint..." required /></div>
          <FormField label="BP" value={form.bp} onChange={v => setForm({...form, bp: v})} placeholder="e.g. 120/80" />
          <FormField label="Pulse" value={form.pulse} onChange={v => setForm({...form, pulse: v})} placeholder="e.g. 88 bpm" />
          <FormField label="SpO₂" value={form.spo2} onChange={v => setForm({...form, spo2: v})} placeholder="e.g. 98%" />
          <FormField label="Temperature" value={form.temp} onChange={v => setForm({...form, temp: v})} placeholder="e.g. 37.2°C" />
          <FormField label="Assigned Doctor" type="select" value={form.doctor} onChange={v => setForm({...form, doctor: v})} options={sampleDoctors.map(d => d.name)} />
          <FormField label="Arrival Time" type="time" value={form.arrivalTime} onChange={v => setForm({...form, arrivalTime: v})} />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setForm(emptyForm); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleRegister} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700">Register Emergency</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// ICU PAGE
// ============================================================
const ICUPage = () => {
  const occupied = sampleICU.filter(b => b.patient);
  const critical = sampleICU.filter(b => b.status === "Critical");
  const onVent = sampleICU.filter(b => b.ventilator && b.patient);
  const [toast, setToast] = useState(null);
  const [showAssign, setShowAssign] = useState(null);
  const [assignPatient, setAssignPatient] = useState("");

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <Modal open={!!showAssign} onClose={() => { setShowAssign(null); setAssignPatient(""); }} title={`Assign Patient — ${showAssign?.bed}`} size="sm">
        <FormField label="Select Patient" type="select" value={assignPatient} onChange={v => setAssignPatient(v)} options={samplePatients.map(p => p.name)} required />
        <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowAssign(null); setAssignPatient(""); }} className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-xl">Cancel</button>
          <button onClick={() => { if (!assignPatient) { setToast({ msg: "Select a patient first.", type: "error" }); return; } setToast({ msg: `${assignPatient} assigned to ${showAssign.bed}.`, type: "success" }); setShowAssign(null); setAssignPatient(""); }} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl font-semibold">Assign</button>
        </div>
      </Modal>
      <SectionHeader title="ICU — Intensive Care Unit" subtitle="Critical patient monitoring and life support management" />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="🛏" label="Occupancy" value={`${occupied.length}/${sampleICU.length}`} sub="Beds used" color="blue" />
        <StatCard icon="🔴" label="Critical" value={critical.length} sub="Patients" color="red" />
        <StatCard icon="💨" label="On Ventilator" value={onVent.length} color="purple" />
        <StatCard icon="✅" label="Available" value={sampleICU.filter(b => !b.patient).length} sub="Beds free" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sampleICU.map(bed => (
          <div key={bed.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${bed.status === "Critical" ? "border-red-200" : bed.status === "Available" ? "border-green-200" : "border-orange-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${!bed.patient ? "bg-green-500" : bed.status === "Critical" ? "bg-red-500" : "bg-orange-500"}`}>🛏</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{bed.bed}</div>
                  <div className="text-xs text-slate-400">{bed.id}</div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${!bed.patient ? "bg-green-100 text-green-700" : bed.status === "Critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{bed.patient ? bed.status : "Available"}</span>
            </div>

            {bed.patient ? (
              <>
                <div className="mb-3">
                  <div className="font-semibold text-slate-800">{bed.patient}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{bed.age}y · {bed.diagnosis}</div>
                  <div className="text-xs text-slate-400 mt-1">👨‍⚕️ {bed.doctor} · Admitted {bed.admDate}</div>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-xs mb-3">
                  {[["BP", bed.bp, false], ["Pulse", bed.pulse, false], ["SpO₂", bed.spo2, parseFloat(bed.spo2) < 95], ["GCS", bed.gcs, parseInt(bed.gcs) < 13], ["Fluids", bed.fluids?.split("/")[0], false]].map(([label, val, warn]) => (
                    <div key={label} className={`rounded-lg p-2 ${warn ? "bg-red-50" : "bg-slate-50"}`}>
                      <div className={`font-bold text-xs ${warn ? "text-red-600" : "text-slate-700"}`}>{val}</div>
                      <div className="text-slate-400 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
                {bed.ventilator && <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-xs text-purple-700 font-semibold mb-3">💨 On Mechanical Ventilation</div>}
                <div className="flex gap-2">
                  <button onClick={() => setToast({ msg: `Progress note recorded for ${bed.patient}.`, type: "success" })} className="flex-1 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">Progress Note</button>
                  <button onClick={() => setToast({ msg: `Vitals updated for ${bed.patient}.`, type: "success" })} className="flex-1 py-1.5 text-xs bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100">Vitals</button>
                  <button onClick={() => setToast({ msg: `Transfer request submitted for ${bed.patient}.`, type: "success" })} className="flex-1 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100">Transfer</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="text-4xl mb-2">🛏</div>
                <div className="text-sm font-semibold text-green-600">Bed Available</div>
                <div className="text-xs text-slate-400 mt-1">Ready for admission</div>
                <button onClick={() => setShowAssign(bed)} className="mt-3 px-4 py-2 text-xs bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Assign Patient</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// SURGERY / OT PAGE
// ============================================================
const SurgeryPage = () => {
  const [surgeries, setSurgeries] = useState(sampleSurgeries);
  const [showModal, setShowModal] = useState(false);
  const [detailSurgery, setDetailSurgery] = useState(null);
  const [editSurgery, setEditSurgery] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", procedure: "", surgeon: "", anesthetist: "", theater: "OT-1", priority: "Elective", date: "", time: "", duration: "", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const statusStyle = { "Scheduled": "bg-blue-100 text-blue-700", "In Progress": "bg-yellow-100 text-yellow-700", "Completed": "bg-green-100 text-green-700", "Cancelled": "bg-red-100 text-red-700" };
  const priorityStyle = { Emergency: "text-red-600 font-bold", Urgent: "text-orange-600 font-semibold", Elective: "text-blue-600" };

  const handleSchedule = () => {
    if (!form.patient || !form.procedure.trim() || !form.surgeon || !form.date || !form.time) {
      setToast({ msg: "Patient, Procedure, Surgeon, Date and Time are required.", type: "error" }); return;
    }
    if (editSurgery) {
      setSurgeries(prev => prev.map(s => s.id === editSurgery.id ? { ...s, ...form } : s));
      setToast({ msg: "Surgery record updated.", type: "success" });
      setEditSurgery(null);
    } else {
      const newId = `SUR-${String(surgeries.length + 1).padStart(3, "0")}`;
      setSurgeries(prev => [...prev, { ...emptyForm, ...form, id: newId, status: "Scheduled" }]);
      setToast({ msg: "Surgery scheduled successfully.", type: "success" });
    }
    setForm(emptyForm); setShowModal(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Surgery Detail Modal with Print */}
      <Modal open={!!detailSurgery} onClose={() => setDetailSurgery(null)} title="Surgery Details" size="lg">
        {detailSurgery && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {[["Procedure", detailSurgery.procedure], ["Patient", detailSurgery.patient], ["Lead Surgeon", detailSurgery.surgeon], ["Anaesthetist", detailSurgery.anesthetist || "—"], ["Theatre", detailSurgery.theater], ["Priority", detailSurgery.priority], ["Date", detailSurgery.date], ["Time", detailSurgery.time], ["Duration", detailSurgery.duration || "—"], ["Status", detailSurgery.status]].map(([k, v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-3"><div className="text-xs text-slate-400 mb-0.5">{k}</div><div className="font-semibold text-slate-800">{v}</div></div>
              ))}
            </div>
            {detailSurgery.notes && <div className="bg-blue-50 rounded-xl p-4 text-sm text-slate-700 mb-4"><span className="font-semibold">Pre-op Notes: </span>{detailSurgery.notes}</div>}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setDetailSurgery(null)} className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-xl">Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">🖨 Print</button>
              <button onClick={() => { setEditSurgery(detailSurgery); setForm({ patient: detailSurgery.patient, procedure: detailSurgery.procedure, surgeon: detailSurgery.surgeon, anesthetist: detailSurgery.anesthetist || "", theater: detailSurgery.theater, priority: detailSurgery.priority, date: detailSurgery.date, time: detailSurgery.time, duration: detailSurgery.duration || "", notes: detailSurgery.notes || "" }); setDetailSurgery(null); setShowModal(true); }} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold">✏️ Edit</button>
            </div>
          </div>
        )}
      </Modal>

      <SectionHeader title="Surgery & Operating Theatre" subtitle="Surgical scheduling, OR management and operative records" action="Schedule Surgery" onAction={() => { setEditSurgery(null); setForm(emptyForm); setShowModal(true); }} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="📋" label="Total Scheduled" value={surgeries.filter(s => s.status === "Scheduled").length} color="blue" />
        <StatCard icon="⚡" label="In Progress" value={surgeries.filter(s => s.status === "In Progress").length} color="amber" />
        <StatCard icon="✅" label="Completed Today" value={surgeries.filter(s => s.status === "Completed").length} color="green" />
        <StatCard icon="🏥" label="OR Available" value="1/3" sub="Operating rooms" color="teal" />
      </div>

      <div className="space-y-3">
        {surgeries.map(s => (
          <div key={s.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${s.status === "In Progress" ? "border-yellow-300" : s.status === "Completed" ? "border-green-200" : "border-slate-100"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">🔪</div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800">{s.procedure}</h3>
                    <span className={`text-xs ${priorityStyle[s.priority]}`}>[{s.priority}]</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5">Patient: <span className="font-medium">{s.patient}</span></div>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>👨‍⚕️ Surgeon: {s.surgeon}</span>
                    <span>💉 Anaesthetist: {s.anesthetist}</span>
                    <span>🏥 {s.theater}</span>
                    <span>📅 {s.date} · {s.time}</span>
                    <span>⏱ {s.duration}</span>
                  </div>
                  {s.notes && <div className="text-xs text-slate-400 mt-1 italic">{s.notes}</div>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[s.status]}`}>{s.status}</span>
                <span className="font-mono text-xs text-slate-400">{s.id}</span>
                <div className="flex gap-2">
                  <button onClick={() => setDetailSurgery(s)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">Details</button>
                  <button onClick={() => { setEditSurgery(s); setForm({ patient: s.patient, procedure: s.procedure, surgeon: s.surgeon, anesthetist: s.anesthetist || "", theater: s.theater, priority: s.priority, date: s.date, time: s.time, duration: s.duration || "", notes: s.notes || "" }); setShowModal(true); }} className="px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100">Edit</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setForm(emptyForm); setEditSurgery(null); }} title={editSurgery ? "Edit Surgery" : "Schedule Surgery"} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <FormField label="Procedure" value={form.procedure} onChange={v => setForm({...form, procedure: v})} placeholder="e.g. Appendectomy" required />
          <FormField label="Lead Surgeon" type="select" value={form.surgeon} onChange={v => setForm({...form, surgeon: v})} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Anaesthetist" value={form.anesthetist} onChange={v => setForm({...form, anesthetist: v})} placeholder="e.g. Dr. Name" />
          <FormField label="Operating Theatre" type="select" value={form.theater} onChange={v => setForm({...form, theater: v})} options={["OT-1", "OT-2", "OT-3", "Cath Lab", "Maternity OT"]} required />
          <FormField label="Priority" type="select" value={form.priority} onChange={v => setForm({...form, priority: v})} options={["Emergency", "Urgent", "Elective"]} required />
          <FormField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required />
          <FormField label="Time" type="time" value={form.time} onChange={v => setForm({...form, time: v})} required />
          <FormField label="Expected Duration" value={form.duration} onChange={v => setForm({...form, duration: v})} placeholder="e.g. 90 min" />
          <div className="col-span-2"><FormField label="Pre-op Notes" type="textarea" value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Pre-operative assessment, special requirements..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setForm(emptyForm); setEditSurgery(null); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSchedule} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">{editSurgery ? "Save Changes" : "Schedule Surgery"}</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// RADIOLOGY PAGE (FULL)
// ============================================================
const RadiologyPage = () => {
  const [radiology, setRadiology] = useState(sampleRadiology);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewResult, setViewResult] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", type: "X-Ray", test: "", orderedBy: "", date: "", priority: "Routine", notes: "" };
  const [form, setForm] = useState(emptyForm);

  const types = ["All", "X-Ray", "CT Scan", "MRI", "Ultrasound", "Echo", "ECG"];
  const filtered = radiology.filter(r =>
    (filterType === "All" || r.type === filterType) &&
    (r.patient.toLowerCase().includes(search.toLowerCase()) || r.test.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = () => {
    if (!form.patient || !form.test.trim() || !form.orderedBy || !form.date) {
      setToast({ msg: "Patient, Study, Doctor and Date are required.", type: "error" }); return;
    }
    const newId = `RAD-${String(radiology.length + 1).padStart(3, "0")}`;
    setRadiology(prev => [...prev, {
      id: newId, patient: form.patient, type: form.type, test: form.test,
      orderedBy: form.orderedBy, date: form.date, priority: form.priority,
      notes: form.notes, status: "Pending", result: "", fee: 0, tech: ""
    }]);
    setToast({ msg: "Radiology request submitted.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Radiology & Imaging" subtitle="Imaging requests, radiology reports and diagnostic studies" action="New Request" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard icon="📡" label="Total Requests" value={radiology.length} color="blue" />
        <StatCard icon="⏳" label="Pending" value={radiology.filter(r => r.status === "Pending").length} color="amber" />
        <StatCard icon="🔄" label="Processing" value={radiology.filter(r => r.status === "Processing").length} color="purple" />
        <StatCard icon="✅" label="Completed" value={radiology.filter(r => r.status === "Completed").length} color="green" />
      </div>

      <div className="mb-3 space-y-3">
        <SearchBar placeholder="Search patient or imaging study..." value={search} onChange={setSearch} />
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{t}</button>
          ))}
        </div>
      </div>

      <DataTable
        data={filtered}
        emptyIcon="📡" emptyTitle="No radiology requests" emptySubtitle="Submit a new imaging request or adjust filters"
        columns={[
          { key: "id", label: "ID", render: r => <span className="font-mono text-xs text-slate-500">{r.id}</span> },
          { key: "patient", label: "Patient", render: r => <span className="font-semibold text-slate-800">{r.patient}</span> },
          { key: "test", label: "Study / Test", render: r => <span className="text-slate-600 text-xs">{r.test}</span> },
          { key: "type", label: "Type", render: r => <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">{r.type}</span> },
          { key: "orderedBy", label: "Ordered By", render: r => <span className="text-slate-500 text-xs">{r.orderedBy}</span> },
          { key: "date", label: "Date", render: r => <span className="text-slate-500 text-xs">{r.date}</span> },
          { key: "status", label: "Status", render: r => <Badge status={r.status} /> },
          { key: "result", label: "Result", render: r => r.result ? <Badge status={r.result} /> : <span className="text-slate-300 text-xs">—</span> },
          { key: "fee", label: "Fee", render: r => <span className="font-semibold text-slate-700">${r.fee}</span> },
        ]}
        rowActions={r => (
          r.status === "Completed"
            ? <button onClick={() => setViewResult(r)} className="px-2.5 py-1 text-xs bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100">View Report</button>
            : <button className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">Enter Result</button>
        )}
      />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Radiology Request" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <FormField label="Imaging Type" type="select" value={form.type} onChange={v => setForm({...form, type: v})} options={["X-Ray", "CT Scan", "MRI", "Ultrasound", "Echocardiogram", "ECG", "Doppler", "Mammogram", "DEXA Scan"]} required />
          <FormField label="Study / Test Name" value={form.test} onChange={v => setForm({...form, test: v})} placeholder="e.g. Chest X-Ray PA view" required />
          <FormField label="Ordered By" type="select" value={form.orderedBy} onChange={v => setForm({...form, orderedBy: v})} options={sampleDoctors.map(d => d.name)} required />
          <FormField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required />
          <FormField label="Priority" type="select" value={form.priority} onChange={v => setForm({...form, priority: v})} options={["Routine", "Urgent", "STAT"]} />
          <div className="col-span-2"><FormField label="Clinical Indication / History" type="textarea" value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Relevant history and reason for study..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Submit Request</button>
        </div>
      </Modal>

      <PrintPreviewModal
        open={!!viewResult}
        onClose={() => setViewResult(null)}
        title="RADIOLOGY REPORT"
        subtitle="Radiology & Imaging Department"
        docId={viewResult?.id}
        docDate={viewResult?.date}
        doctor="Dr. Hassan Farah"
      >
        {viewResult && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Patient</span><span className="font-semibold">{viewResult.patient}</span></div>
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Study</span><span className="font-semibold">{viewResult.test}</span></div>
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Modality</span><span className="font-semibold">{viewResult.type}</span></div>
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Referring Doctor</span><span className="font-semibold">{viewResult.orderedBy}</span></div>
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Radiographer</span><span className="font-semibold">{viewResult.tech}</span></div>
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Overall Result</span><Badge status={viewResult.result} /></div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="text-sm font-bold text-slate-700 mb-2">Radiologist's Report:</div>
              <p className="text-sm text-slate-700 leading-relaxed">{viewResult.notes || "No additional notes recorded."}</p>
            </div>
          </>
        )}
      </PrintPreviewModal>
    </div>
  );
};

// ============================================================
// PRESCRIPTIONS PAGE (FULL)
// ============================================================
const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState(samplePrescriptions);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewRx, setViewRx] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = { patient: "", doctor: "", diagnosis: "", med1: "", dose1: "", med2: "", dose2: "", duration: "", date: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = prescriptions.filter(rx =>
    rx.patient.toLowerCase().includes(search.toLowerCase()) ||
    rx.doctor.toLowerCase().includes(search.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.patient || !form.doctor || !form.diagnosis.trim() || !form.date) {
      setToast({ msg: "Patient, Doctor, Diagnosis and Date are required.", type: "error" }); return;
    }
    const newId = `RX-${String(prescriptions.length + 1).padStart(3, "0")}`;
    const medicines = [];
    if (form.med1.trim()) medicines.push({ name: form.med1, dose: form.dose1, frequency: form.duration, qty: 1 });
    if (form.med2.trim()) medicines.push({ name: form.med2, dose: form.dose2, frequency: form.duration, qty: 1 });
    setPrescriptions(prev => [...prev, {
      id: newId, patient: form.patient, doctor: form.doctor, diagnosis: form.diagnosis,
      date: form.date, notes: form.notes, medicines, status: "Active"
    }]);
    setToast({ msg: "Prescription saved successfully.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <SectionHeader title="Prescriptions" subtitle="Doctor prescriptions, e-prescriptions and medicine orders" action="New Prescription" onAction={() => setShowModal(true)} />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard icon="📋" label="Total Prescriptions" value={prescriptions.length} color="blue" />
        <StatCard icon="✅" label="Active" value={prescriptions.filter(r => r.status === "Active").length} color="green" />
        <StatCard icon="💊" label="Dispensed" value={prescriptions.filter(r => r.status === "Dispensed").length} color="teal" />
      </div>

      <div className="mb-4"><SearchBar placeholder="Search by patient, doctor or diagnosis..." value={search} onChange={setSearch} /></div>

      <div className="space-y-3">
        {filtered.map(rx => (
          <div key={rx.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">💊</div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800">{rx.patient}</h3>
                    <span className="font-mono text-xs text-slate-400">{rx.id}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-blue-600">{rx.diagnosis}</span>
                    <span className="mx-1.5">·</span>{rx.doctor}
                    <span className="mx-1.5">·</span>{rx.date}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {rx.medicines.map((m, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                        {m.name} — {m.dose}, {m.frequency}
                      </span>
                    ))}
                  </div>
                  {rx.notes && <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 mt-2 italic">{rx.notes}</div>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <Badge status={rx.status === "Active" ? "Active" : rx.status === "Dispensed" ? "Completed" : rx.status} />
                <div className="flex gap-2">
                  <button onClick={() => setViewRx(rx)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">View / Print</button>
                  <button className="px-3 py-1.5 text-xs bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100">Dispense</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setForm(emptyForm); }} title="New Prescription" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Patient" type="select" value={form.patient} onChange={v => setForm({...form, patient: v})} options={samplePatients.map(p => p.name)} required />
          <FormField label="Prescribing Doctor" type="select" value={form.doctor} onChange={v => setForm({...form, doctor: v})} options={sampleDoctors.map(d => d.name)} required />
          <div className="col-span-2"><FormField label="Diagnosis" value={form.diagnosis} onChange={v => setForm({...form, diagnosis: v})} placeholder="Primary diagnosis" required /></div>
          <FormField label="Medicine 1" value={form.med1} onChange={v => setForm({...form, med1: v})} placeholder="Drug name and strength" />
          <FormField label="Dose & Frequency" value={form.dose1} onChange={v => setForm({...form, dose1: v})} placeholder="e.g. 1 tab twice daily" />
          <FormField label="Medicine 2" value={form.med2} onChange={v => setForm({...form, med2: v})} placeholder="Drug name and strength" />
          <FormField label="Dose & Frequency" value={form.dose2} onChange={v => setForm({...form, dose2: v})} placeholder="e.g. 1 tab once daily" />
          <FormField label="Duration" value={form.duration} onChange={v => setForm({...form, duration: v})} placeholder="e.g. 7 days" />
          <FormField label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required />
          <div className="col-span-2"><FormField label="Instructions / Notes" type="textarea" value={form.notes} onChange={v => setForm({...form, notes: v})} placeholder="Special instructions, dietary advice, follow-up..." /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => { setShowModal(false); setForm(emptyForm); }} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Prescription</button>
        </div>
      </Modal>

      <PrintPreviewModal
        open={!!viewRx}
        onClose={() => setViewRx(null)}
        title="PRESCRIPTION"
        subtitle="Outpatient Prescription"
        docId={viewRx?.id}
        docDate={viewRx?.date}
        doctor={viewRx?.doctor}
      >
        {viewRx && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Patient</span><span className="font-semibold">{viewRx.patient}</span></div>
              <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Prescribing Doctor</span><span className="font-semibold">{viewRx.doctor}</span></div>
              <div className="col-span-2 bg-blue-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Diagnosis</span><span className="font-semibold text-blue-700">{viewRx.diagnosis}</span></div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide border-b border-slate-100 pb-2">℞ — Medicines Prescribed</div>
              <div className="space-y-2">
                {viewRx.medicines.map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">{i + 1}. {m.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Dose: {m.dose} &nbsp;·&nbsp; {m.frequency} &nbsp;·&nbsp; Duration: {m.duration}</div>
                    </div>
                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Qty: {m.qty}</div>
                  </div>
                ))}
              </div>
            </div>
            {viewRx.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <div className="text-xs font-bold text-amber-700 mb-1">Instructions to Patient:</div>
                <div className="text-sm text-amber-800">{viewRx.notes}</div>
              </div>
            )}
          </>
        )}
      </PrintPreviewModal>
    </div>
  );
};

// ============================================================
// MEDICAL RECORDS PAGE (FULL)
// ============================================================
const MedicalRecordsPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");

  const filtered = samplePatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.dept.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedPatient) {
    const p = selectedPatient;
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "labs", label: "Lab Results" },
      { id: "prescriptions", label: "Prescriptions" },
      { id: "imaging", label: "Imaging" },
      { id: "visits", label: "Visit History" },
    ];

    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setSelectedPatient(null); setTab("overview"); }} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-2 rounded-xl">← Back to Records</button>
          <span className="text-slate-300">|</span>
          <span className="text-sm text-slate-500 font-mono">{p.id}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">{p.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{p.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                    <span>{p.age}y</span><span>·</span><span>{p.gender}</span><span>·</span>
                    <span>DOB: {p.dob}</span><span>·</span>
                    <span>Blood: <strong className="text-red-600">{p.blood}</strong></span>
                  </div>
                </div>
                <Badge status={p.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Phone</span><span className="font-medium">{p.phone}</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Attending Doctor</span><span className="font-medium">{p.doctor}</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Department</span><span className="font-medium">{p.dept}</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Address</span><span className="font-medium">{p.address}</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Emergency Contact</span><span className="font-medium">{p.emergency}</span></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-400 text-xs block">Insurance</span><span className="font-medium">{p.insurance}</span></div>
              </div>
              <div className="flex gap-2 mt-3">
                {p.allergy !== "None" && <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-full">⚠ Allergy: {p.allergy}</span>}
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">Total Visits: {p.visits}</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">Reg: {p.regDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === t.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t.label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3">Current Diagnosis & Treatment</h3>
              <div className="text-sm font-bold text-blue-600 mb-1">{p.diagnosis}</div>
              <div className="text-sm text-slate-500 mb-3">Department: {p.dept}</div>
              <div className="text-sm text-slate-500">Attending: {p.doctor}</div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-2">Admission Status</div>
                <Badge status={p.status} />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3">Latest Vitals</h3>
              <div className="grid grid-cols-2 gap-3">
                {[["Blood Pressure", "120/80 mmHg"], ["Heart Rate", "76 bpm"], ["Temperature", "98.6°F"], ["SpO₂", "98%"], ["Weight", "72 kg"], ["Height", "168 cm"]].map(([label, val]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <div className="font-bold text-slate-800 text-sm">{val}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "labs" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100 font-bold text-slate-800">Laboratory Test Results</div>
            <div className="divide-y divide-slate-50">
              {sampleLabTests.filter(l => l.patientId === p.id).length === 0
                ? <EmptyState icon="🔬" title="No lab tests found" subtitle="No laboratory tests recorded for this patient." />
                : sampleLabTests.filter(l => l.patientId === p.id).map(l => (
                  <div key={l.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{l.test}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{l.id} · {l.date} · Ordered by {l.orderedBy}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {l.result && <Badge status={l.result} />}
                      <Badge status={l.status === "Completed" ? "Completed" : l.status === "Processing" ? "Processing" : "Pending"} />
                      <span className="text-sm font-semibold text-slate-700">${l.fee}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "prescriptions" && (
          <div className="space-y-3">
            {samplePrescriptions.filter(rx => rx.patientId === p.id).length === 0
              ? <EmptyState icon="💊" title="No prescriptions found" subtitle="No prescriptions recorded for this patient." />
              : samplePrescriptions.filter(rx => rx.patientId === p.id).map(rx => (
                <div key={rx.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-slate-800">{rx.diagnosis}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{rx.id} · {rx.doctor} · {rx.date}</div>
                    </div>
                    <Badge status={rx.status === "Active" ? "Active" : "Completed"} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rx.medicines.map((m, i) => <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{m.name} — {m.dose}</span>)}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === "imaging" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100 font-bold text-slate-800">Radiology & Imaging Studies</div>
            <div className="divide-y divide-slate-50">
              {sampleRadiology.filter(r => r.patientId === p.id).length === 0
                ? <EmptyState icon="📡" title="No imaging records" subtitle="No radiology studies found for this patient." />
                : sampleRadiology.filter(r => r.patientId === p.id).map(r => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{r.test}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.id} · {r.type} · {r.date} · {r.orderedBy}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.result && <Badge status={r.result} />}
                      <Badge status={r.status === "Completed" ? "Completed" : r.status === "Processing" ? "Processing" : "Pending"} />
                      <span className="text-sm font-semibold text-slate-700">${r.fee}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "visits" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-100 font-bold text-slate-800">Appointment & Visit History</div>
            <div className="divide-y divide-slate-50">
              {sampleAppointments.filter(a => a.patientId === p.id).length === 0
                ? <EmptyState icon="📅" title="No visits found" subtitle="No appointment history for this patient." />
                : sampleAppointments.filter(a => a.patientId === p.id).map(a => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{a.type} — {a.dept}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{a.date} at {a.time} · {a.doctor}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-700">${a.fee}</span>
                      <Badge status={a.status} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Medical Records" subtitle="Complete patient clinical history and documentation" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard icon="📁" label="Total Records" value={samplePatients.length} color="blue" />
        <StatCard icon="✅" label="Active Patients" value={samplePatients.filter(p => p.status === "Active").length} color="green" />
        <StatCard icon="🏥" label="Currently Admitted" value={samplePatients.filter(p => p.status === "Admitted").length} color="amber" />
      </div>
      <div className="mb-4"><SearchBar placeholder="Search patient by name, ID or department..." value={search} onChange={setSearch} /></div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="divide-y divide-slate-50">
          {filtered.map(p => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors group" onClick={() => setSelectedPatient(p)}>
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{p.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800">{p.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{p.id} · {p.age}y · {p.gender} · {p.dept}</div>
              </div>
              <div className="hidden md:block text-sm text-slate-500 truncate max-w-[200px]">{p.diagnosis}</div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{p.visits} visits</span>
                <Badge status={p.status} />
                <span className="text-blue-400 group-hover:text-blue-600 text-sm transition-colors">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ============================================================
// INVENTORY MANAGEMENT PAGE
// ============================================================
const InventoryPage = () => {
  const [inventory, setInventory] = useState(sampleInventory);
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);
  const [restockQty, setRestockQty] = useState("");
  const [toast, setToast] = useState(null);
  const emptyForm = { name: "", category: "Antibiotics", dept: "", unit: "Tablets", qty: "", minQty: "", price: "", supplier: "" };
  const [form, setForm] = useState(emptyForm);

  const depts = ["All", ...new Set(inventory.map(i => i.dept))];
  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  const computeStatus = (qty, minQty) => qty === 0 ? "Out of Stock" : qty <= minQty ? "Low Stock" : "In Stock";

  const filtered = inventory.filter(item =>
    (filterDept === "All" || item.dept === filterDept) &&
    (filterStatus === "All" || item.status === filterStatus) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) ||
     item.category.toLowerCase().includes(search.toLowerCase()) ||
     item.dept.toLowerCase().includes(search.toLowerCase()))
  );

  const inStock = inventory.filter(i => i.status === "In Stock").length;
  const lowStock = inventory.filter(i => i.status === "Low Stock").length;
  const outOfStock = inventory.filter(i => i.status === "Out of Stock").length;
  const totalValue = inventory.reduce((s, i) => s + i.qty * i.price, 0);

  const handleAddItem = () => {
    if (!form.name.trim() || !form.dept || !form.qty) {
      setToast({ msg: "Name, Department and Quantity are required.", type: "error" }); return;
    }
    const qty = Number(form.qty) || 0;
    const minQty = Number(form.minQty) || 0;
    const newId = `INV-${String(inventory.length + 1).padStart(3, "0")}`;
    setInventory(prev => [...prev, { ...emptyForm, ...form, id: newId, qty, minQty, price: Number(form.price) || 0, lastUpdated: new Date().toISOString().slice(0, 10), status: computeStatus(qty, minQty) }]);
    setToast({ msg: "Item added to inventory.", type: "success" });
    setForm(emptyForm); setShowModal(false);
  };

  const handleRestock = () => {
    const addQty = Number(restockQty) || 0;
    if (addQty <= 0) { setToast({ msg: "Enter a valid quantity to add.", type: "error" }); return; }
    setInventory(prev => prev.map(i => {
      if (i.id !== updateItem.id) return i;
      const newQty = i.qty + addQty;
      return { ...i, qty: newQty, status: computeStatus(newQty, i.minQty), lastUpdated: new Date().toISOString().slice(0, 10) };
    }));
    setToast({ msg: `Restocked ${addQty} units of ${updateItem.name}.`, type: "success" });
    setUpdateItem(null); setRestockQty("");
  };

  const statusStyle = {
    "In Stock": "bg-green-100 text-green-700",
    "Low Stock": "bg-amber-100 text-amber-700",
    "Out of Stock": "bg-red-100 text-red-700",
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Restock Modal */}
      <Modal open={!!updateItem} onClose={() => { setUpdateItem(null); setRestockQty(""); }} title="Update Stock" size="sm">
        {updateItem && (
          <div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="font-bold text-slate-800">{updateItem.name}</div>
              <div className="text-xs text-slate-500 mt-1">{updateItem.dept} · Current stock: <span className="font-bold text-blue-600">{updateItem.qty} {updateItem.unit}</span></div>
            </div>
            <FormField label="Quantity to Add" type="number" value={restockQty} onChange={v => setRestockQty(v)} required placeholder="e.g. 200" />
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
              <button onClick={() => { setUpdateItem(null); setRestockQty(""); }} className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200">Cancel</button>
              <button onClick={handleRestock} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold">✓ Update Stock</button>
            </div>
          </div>
        )}
      </Modal>

      <SectionHeader
        title="Inventory Management"
        subtitle="Central stock management for all hospital departments"
        action="Add Item"
        onAction={() => setShowModal(true)}
      />

      {/* Alert banner for low/out of stock */}
      {(lowStock + outOfStock) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <div className="font-semibold text-amber-800 text-sm">
              Stock Alert — {outOfStock} out of stock · {lowStock} low stock items
            </div>
            <div className="text-xs text-amber-600 mt-1">
              {inventory.filter(i => i.status !== "In Stock").map(i => i.name).join(" · ")}
            </div>
          </div>
          <button onClick={() => { setFilterStatus("Low Stock"); setTab("items"); }} className="text-xs text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-200 flex-shrink-0">View Alerts</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard icon="📦" label="Total Items" value={inventory.length} sub="All categories" color="blue" />
        <StatCard icon="✅" label="In Stock" value={inStock} color="green" />
        <StatCard icon="⚠️" label="Low Stock" value={lowStock} sub="Below minimum" color="amber" />
        <StatCard icon="🔴" label="Out of Stock" value={outOfStock} color="red" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard icon="💰" label="Total Value" value={`$${totalValue.toLocaleString(undefined, {maximumFractionDigits:0})}`} color="teal" />
        <StatCard icon="🏥" label="Departments" value={depts.length - 1} color="purple" />
        <StatCard icon="📋" label="Categories" value={[...new Set(inventory.map(i => i.category))].length} color="blue" />
        <StatCard icon="🔄" label="Movements" value={stockMovements.length} sub="Recent transactions" color="teal" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
        {[["dashboard", "📊 Overview"], ["items", "📦 All Items"], ["lowstock", "⚠️ Low Stock"], ["movements", "🔄 Stock Movement"], ["reports", "📄 Reports"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${tab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* By Department */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Stock by Department</h3>
            <div className="space-y-3">
              {[...new Set(inventory.map(i => i.dept))].map(dept => {
                const items = inventory.filter(i => i.dept === dept);
                const alerts = items.filter(i => i.status !== "In Stock").length;
                return (
                  <div key={dept} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 text-sm">{dept}</div>
                      <div className="text-xs text-slate-400">{items.length} items</div>
                    </div>
                    {alerts > 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{alerts} alert{alerts > 1 ? "s" : ""}</span>}
                    <div className="w-24 bg-slate-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (items.filter(i => i.status === "In Stock").length / items.length) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">⚠️ Items Requiring Restock</h3>
            <div className="space-y-2">
              {inventory.filter(i => i.status !== "In Stock").map(item => (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl ${item.status === "Out of Stock" ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"}`}>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.dept} · Min: {item.minQty} {item.unit}</div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className={`font-bold text-sm ${item.status === "Out of Stock" ? "text-red-600" : "text-amber-600"}`}>{item.qty} left</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[item.status]}`}>{item.status}</span>
                    <button onClick={() => setUpdateItem(item)} className="text-xs text-blue-600 hover:underline font-medium mt-1">Restock</button>
                  </div>
                </div>
              ))}
              {inventory.filter(i => i.status !== "In Stock").length === 0 && (
                <EmptyState icon="✅" title="All items in stock" subtitle="No alerts at this time." />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ALL ITEMS TAB */}
      {tab === "items" && (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="flex-1 min-w-48"><SearchBar placeholder="Search items, categories, departments..." value={search} onChange={setSearch} /></div>
            <button
              onClick={() => exportCSV("AHMS-Inventory", ["ID","Name","Category","Department","Qty","Unit","Min Level","Price","Supplier","Status","Last Updated"],
                filtered.map(i => [i.id, i.name, i.category, i.dept, i.qty, i.unit, i.minQty, i.price.toFixed(2), i.supplier, i.status, i.lastUpdated]))}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0">
              📊 Export CSV
            </button>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              {depts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <DataTable
            data={filtered}
            emptyIcon="📦" emptyTitle="No items found" emptySubtitle="Adjust your search or filters"
            columns={[
              { key: "name", label: "Item Name", render: item => <div><div className="font-semibold text-slate-800 text-sm">{item.name}</div><div className="font-mono text-xs text-slate-400">{item.id}</div></div> },
              { key: "category", label: "Category", render: item => <span className="text-xs text-slate-500">{item.category}</span> },
              { key: "dept", label: "Department", render: item => <span className="text-xs font-medium text-slate-600">{item.dept}</span> },
              { key: "qty", label: "Qty Available", render: item => <span><span className={`font-bold ${item.status === "Out of Stock" ? "text-red-600" : item.status === "Low Stock" ? "text-amber-600" : "text-slate-700"}`}>{item.qty}</span><span className="text-xs text-slate-400 ml-1">{item.unit}</span></span> },
              { key: "minQty", label: "Min Level", render: item => <span className="text-xs text-slate-500">{item.minQty} {item.unit}</span> },
              { key: "price", label: "Unit Price", render: item => <span className="font-medium text-green-600">${item.price.toFixed(2)}</span> },
              { key: "supplier", label: "Supplier", render: item => <span className="text-xs text-slate-500">{item.supplier}</span> },
              { key: "status", label: "Status", render: item => <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[item.status]}`}>{item.status}</span> },
              { key: "lastUpdated", label: "Updated", render: item => <span className="text-xs text-slate-400">{item.lastUpdated}</span> },
            ]}
            rowActions={item => (
              <button onClick={() => setUpdateItem(item)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">Restock</button>
            )}
          />
        </>
      )}

      {/* LOW STOCK TAB */}
      {tab === "lowstock" && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-medium">
            ⚠️ {lowStock + outOfStock} items need restocking. Contact suppliers to place orders.
          </div>
          {inventory.filter(i => i.status !== "In Stock").map(item => (
            <div key={item.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${item.status === "Out of Stock" ? "border-red-200" : "border-amber-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[item.status]}`}>{item.status}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    {item.id} · {item.category} · {item.dept} · Supplier: {item.supplier}
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className={`font-bold text-lg ${item.status === "Out of Stock" ? "text-red-600" : "text-amber-600"}`}>{item.qty}</div>
                      <div className="text-slate-400">Current Stock</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="font-bold text-lg text-slate-700">{item.minQty}</div>
                      <div className="text-slate-400">Min Required</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="font-bold text-lg text-blue-600">{Math.max(0, item.minQty - item.qty)}</div>
                      <div className="text-slate-400">Units Needed</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="font-bold text-lg text-green-600">${item.price.toFixed(2)}</div>
                      <div className="text-slate-400">Unit Price</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="px-4 py-2 text-xs bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">Order Stock</button>
                  <button onClick={() => setUpdateItem(item)} className="px-4 py-2 text-xs bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200">Update Qty</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STOCK MOVEMENT TAB */}
      {tab === "movements" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Stock Movement History</h3>
            <span className="text-xs text-slate-400">{stockMovements.length} recent records</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                {["ID", "Item", "Movement Type", "Qty Change", "User", "Date", "Reason"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stockMovements.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{m.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 text-sm">{m.item}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${m.type === "Stock Added" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{m.type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-bold ${m.qty > 0 ? "text-green-600" : "text-red-600"}`}>{m.qty > 0 ? "+" : ""}{m.qty}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{m.user}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{m.date}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTS TAB */}
      {tab === "reports" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "📦", title: "Inventory Summary Report", desc: "Complete list of all stock across all departments", color: "blue" },
            { icon: "⚠️", title: "Low Stock Report", desc: "Items below minimum stock level requiring reorder", color: "amber" },
            { icon: "🏥", title: "Department Inventory Report", desc: "Stock breakdown per department or unit", color: "teal" },
            { icon: "🔄", title: "Stock Movement Report", desc: "All stock-in, stock-out, and transfer transactions", color: "purple" },
            { icon: "💰", title: "Inventory Valuation Report", desc: "Total value of current stock by category", color: "green" },
            { icon: "📋", title: "Supplier Order Report", desc: "Pending and completed purchase orders", color: "blue" },
          ].map(r => (
            <div key={r.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
              <div className={`w-11 h-11 rounded-xl bg-${r.color}-50 flex items-center justify-center text-xl mb-3`}>{r.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm">{r.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={handlePrint} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100">View</button>
                <button onClick={handlePrint} className="px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100">Print</button>
                <button onClick={handlePrint} className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100">PDF</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Inventory Item" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Item Name" value={form.name} onChange={v => setForm({...form, name: v})} required placeholder="e.g. Amoxicillin 500mg" />
          <FormField label="Category" type="select" value={form.category} onChange={v => setForm({...form, category: v})} options={["Antibiotics", "Cardiovascular", "Diabetes Drugs", "Analgesics", "GI Drugs", "Lab Consumables", "Lab Reagents", "Radiology Supplies", "PPE & Consumables", "Wound Care", "Equipment", "Other"]} required />
          <FormField label="Department" type="select" value={form.dept} onChange={v => setForm({...form, dept: v})} options={departments.map(d => d.name)} required />
          <FormField label="Unit" type="select" value={form.unit} onChange={v => setForm({...form, unit: v})} options={["Tablets", "Capsules", "Vials", "Ampoules", "Bottles", "Boxes", "Tubes", "Pieces", "Packs", "Kits", "Units"]} required />
          <FormField label="Quantity Available" type="number" value={form.qty} onChange={v => setForm({...form, qty: v})} required />
          <FormField label="Minimum Stock Level" type="number" value={form.minQty} onChange={v => setForm({...form, minQty: v})} required />
          <FormField label="Unit Price ($)" type="number" value={form.price} onChange={v => setForm({...form, price: v})} required />
          <FormField label="Supplier" value={form.supplier} onChange={v => setForm({...form, supplier: v})} placeholder="Supplier name" required />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
          <button onClick={handleAddItem} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Add Item</button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================
// PAGE ROUTER
// ============================================================
const PageRouter = ({ page, setPage }) => {
  const pages = {
    dashboard: <DashboardPage setPage={setPage} />,
    patients: <PatientsPage />,
    doctors: <DoctorsPage setPage={setPage} />,
    staff: <StaffPage />,
    departments: <DepartmentsPage />,
    appointments: <AppointmentsPage />,
    emergency: <EmergencyPage />,
    opd: <OPDPage />,
    ipd: <IPDPage />,
    icu: <ICUPage />,
    surgery: <SurgeryPage />,
    beds: <BedsPage />,
    billing: <BillingPage />,
    pharmacy: <PharmacyPage />,
    laboratory: <LaboratoryPage />,
    radiology: <RadiologyPage />,
    prescriptions: <PrescriptionsPage />,
    records: <MedicalRecordsPage />,
    inventory: <InventoryPage />,
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
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #EBF2FF 0%, #F0FAF8 50%, #F4F7FB 100%)" }}
    >
      {/* TASK 1 — Subtle watermark: opacity 0.02, blur(2px), very large */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <AfgoiShieldSVG style={{ width: 1200, height: 1452, opacity: 0.02, filter: "blur(2px)" }} />
      </div>

      {/* Login card wrapper */}
      <div className="relative z-10 w-full max-w-md">

        {/* TASK 2 — Header: more spacing, larger title */}
        <div className="flex flex-col items-center mb-10">
          <AfgoiShieldSVG style={{ width: 90, height: 109 }} />
          <div className="mt-5 text-center">
            <div
              className="font-extrabold tracking-tight leading-tight"
              style={{ fontSize: "1.75rem", color: "#1B3A6B" }}
            >
              AFGOI <span style={{ color: "#2F6FED" }}>HOSPITAL</span>
            </div>
            <div className="text-sm font-semibold tracking-widest text-slate-400 mt-1 uppercase">
              Management System (AHMS)
            </div>
          </div>
        </div>

        {/* TASK 3 — Premium card: 18px radius, soft deep shadow */}
        <div
          className="bg-white p-8"
          style={{
            borderRadius: 18,
            boxShadow: "0 30px 70px rgba(0,0,0,0.08), 0 8px 24px rgba(47,111,237,0.06)",
            border: "1px solid rgba(226,232,240,0.8)",
          }}
        >
          <div className="mb-7 text-center">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-400 mt-1">Sign in to your AHMS account</p>
          </div>

          <div className="space-y-4">
            <FormField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="admin@ahms.so" required />
            <FormField label="Password" type="password" value={pass} onChange={setPass} placeholder="Enter your password" required />
          </div>

          {/* TASK 4 — Premium button: h-48px, radius 10px, gradient, hover animation */}
          <button
            onClick={onLogin}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            className="w-full mt-6 text-white font-semibold tracking-wide transition-all duration-200"
            style={{
              height: 48,
              borderRadius: 10,
              background: btnHover
                ? "linear-gradient(90deg, #1A56D6, #2F6FED)"
                : "linear-gradient(90deg, #2F6FED, #4A7DFF)",
              boxShadow: btnHover
                ? "0 8px 24px rgba(47,111,237,0.45)"
                : "0 4px 14px rgba(47,111,237,0.30)",
              transform: btnHover ? "translateY(-1px)" : "translateY(0)",
              letterSpacing: "0.02em",
            }}
          >
            Sign In to AHMS
          </button>

          <div
            className="mt-4 p-3 rounded-xl text-xs text-center font-medium"
            style={{ background: "#EBF2FF", color: "#2F6FED" }}
          >
            Demo credentials: admin@ahms.so / any password
          </div>

          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {["Super Admin", "Doctor", "Nurse", "Receptionist"].map(role => (
              <button
                key={role}
                onClick={onLogin}
                className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-100 transition-colors"
              >
                Login as {role}
              </button>
            ))}
          </div>
        </div>

        {/* TASK 5 — Footer: Secure Access · © 2026 · Powered by Sahal Tech */}
        <div className="mt-8 text-center space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
            <span>🔒</span> Secure Access
          </p>
          <p className="text-xs text-slate-400">
            © {HOSPITAL.year} {HOSPITAL.fullName} &nbsp;·&nbsp; {HOSPITAL.address}
          </p>
          <p className="text-xs font-semibold" style={{ color: "#1BBE9E" }}>
            Powered by {HOSPITAL.tech}
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("ahms-dark") === "1"; } catch { return false; }
  });

  const toggleDarkMode = () => setDarkMode(prev => {
    const next = !prev;
    try { localStorage.setItem("ahms-dark", next ? "1" : "0"); } catch {}
    return next;
  });

  const sidebarWidth = collapsed ? 64 : 240;

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  const dk = darkMode;
  return (
    <div className={`min-h-screen${dk ? " ahms-dark" : ""}`} style={{ background: dk ? "#0F172A" : "#F4F7FB", transition: "background 0.3s" }}>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

        /* ── DARK MODE OVERRIDES ── */
        .ahms-dark .bg-white   { background: #1E293B !important; }
        .ahms-dark .bg-slate-50 { background: #162032 !important; }
        .ahms-dark .bg-slate-100 { background: #1E2D45 !important; }
        .ahms-dark .border-slate-100 { border-color: #334155 !important; }
        .ahms-dark .border-slate-200 { border-color: #334155 !important; }
        .ahms-dark .text-slate-800 { color: #E2E8F0 !important; }
        .ahms-dark .text-slate-700 { color: #CBD5E1 !important; }
        .ahms-dark .text-slate-600 { color: #94A3B8 !important; }
        .ahms-dark .text-slate-500 { color: #64748B !important; }
        .ahms-dark .text-slate-400 { color: #475569 !important; }
        .ahms-dark .hover\:bg-slate-50:hover { background: #1A2744 !important; }
        .ahms-dark .hover\:bg-slate-100:hover { background: #1E2D45 !important; }
        .ahms-dark .shadow-sm { box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important; }
        .ahms-dark input, .ahms-dark select, .ahms-dark textarea { background: #162032 !important; color: #E2E8F0 !important; border-color: #334155 !important; }
        .ahms-dark thead tr { background: #162032 !important; }
        .ahms-dark tbody tr:hover { background: #1A2744 !important; }

        /* On screen: hide the print-area (its content is shown inside the modal preview) */
        @media screen {
          .print-area { display: none !important; }
        }

        /* On print: show ONLY the print-area, hide everything else */
        @media print {
          /* 1. Make all body content invisible */
          body * { visibility: hidden !important; }

          /* 2. Make print-area and its children visible */
          .print-area { display: block !important; visibility: visible !important; }
          .print-area * { visibility: visible !important; }

          /* 3. Position print-area at the top of the page */
          .print-area {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 40px !important;
            background: white !important;
            z-index: 999999 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }

          /* 4. Hide UI chrome */
          .no-print { display: none !important; }
          .print-header { display: flex !important; }

          /* 5. A4 page settings */
          @page { size: A4; margin: 20mm; }
        }
      `}</style>

      {/* ── Background watermark — AFGOI shield logo, fixed, hidden on print */}
      <div
        aria-hidden="true"
        className="no-print"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <AfgoiShieldSVG style={{ width: 680, height: 820, opacity: 0.055 }} />
      </div>

      <Sidebar
        active={page} setActive={setPage}
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />
      <Navbar
        sidebarWidth={typeof window !== "undefined" && window.innerWidth < 1024 ? 0 : sidebarWidth}
        setPage={setPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onMenuOpen={() => setMobileOpen(true)}
      />

      <main
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: typeof window !== "undefined" && window.innerWidth < 1024 ? 0 : sidebarWidth, position: "relative", zIndex: 1 }}
      >
        <div className="p-6 max-w-screen-2xl mx-auto">
          <PageRouter page={page} setPage={setPage} />
          <SystemFooter />
        </div>
      </main>
    </div>
  );
}
