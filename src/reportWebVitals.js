import { onCLS, onFID, onLCP } from "web-vitals";

// This function will log the performance metrics to the console
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry); // CLS (Cumulative Layout Shift)
    onFID(onPerfEntry); // FID (First Input Delay)
    onLCP(onPerfEntry); // LCP (Largest Contentful Paint)
  }
};

export default reportWebVitals;
