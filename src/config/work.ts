// Work-with-me page settings. Prices are floors ("from €X"); set after the market check.
export const BOOKING_URL = "https://calendar.app.google/WKpVpaFhFaaFUpCC9";
export const PRICES = {
  scoping: 1000,  // paid scoping session
  build: 1000,    // fixed-scope build, floor
  review: 1000,   // advisory / review
};
export const eur = (n: number) => "€" + n.toLocaleString("en-GB");
