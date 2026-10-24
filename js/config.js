const BASURA_CONFIG = {
  community: {
    barangay: "[BARANGAY / NEIGHBORHOOD TO BE ADDED]",
    city: "[CITY / MUNICIPALITY TO BE ADDED]",
    contact: "[CONTACT DETAILS TO BE ADDED]",
  },
  schedule: {
    biodegradable: { days: [], time: "" },
    recyclable: { days: [], time: "" },
    residual: { days: [], time: "" },
    special: { days: [], time: "" },
  },
  reminder: { leadMinutes: 60 },
  verification: { status: false, source: "", verifiedOn: "" },
  // DEMO ONLY - never official
  demo: {
    enabled: false,
    schedule: {
      biodegradable: { days: ["Monday", "Thursday"], time: "07:00" },
    },
    leadMinutes: 60,
  },
};
window.BASURA_CONFIG = BASURA_CONFIG;
