// Work-with-me page settings. Prices are floors ("from €X"). Set 2026-10-15 by Gil from the market check (Work/Market/independents-benchmark-2026-10).
export const BOOKING_URL = "https://calendar.app.google/WKpVpaFhFaaFUpCC9";
export const PRICES = {
  scoping: 1000,  // paid scoping session, credited against the build
  build: 5000,    // fixed-scope build, floor
  review: 2500,   // advisory / review
};
export const eur = (n: number) => "€" + n.toLocaleString("en-GB");
