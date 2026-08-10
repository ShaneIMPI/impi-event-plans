// IMPI RMS company details — used in every document footer / cover page.
// Update here once and it propagates to every generated document.
export const IMPI = {
  legalName: "IMPI RMS (Pty) Ltd",
  tradingAs: "Amandla Protection Services",
  address: "10 Kosmos Crescent, Rynoue AH, Roodeplaat, Pretoria",
  phone: "012 543 0640",
  altPhone: "012 543 2004",
  email: "info@impi-secure.co.za",
  website: "www.impi-secure.co.za",
  vatNo: "4120277498",
  coRegNo: "2017/099360/07",
  psiraNo: "2689596",
  directors: ["Jaco Van Dyk", "Charné de Jager"],
  contactPerson: {
    name: "Shane Steynfaardt",
    mobile: "083 782 2207",
  },
  colours: {
    red: "#DE1819",
    gold: "#B8942E",
    goldBright: "#FDDB07",
    dark: "#231F20",
  },
  // Path relative to the deployed site root — computed from Vite's BASE_URL
  // so it resolves correctly whether the app is served at the domain root
  // (local dev) or under a subpath like /impi-event-plans/ (GitHub Pages).
  masterLogoPath: `${import.meta.env?.BASE_URL || "/"}assets/impi-master-logo.png`,
};
