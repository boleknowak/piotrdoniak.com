export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
export const disable = () => {
  window[`ga-disable-${GA_TRACKING_ID}`] = true;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
export const enable = () => {
  delete window[`ga-disable-${GA_TRACKING_ID}`];
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings
export const timing = ({ name, value, category, label }) => {
  window.gtag('event', 'timing_complete', {
    name,
    value,
    event_category: category,
    event_label: label,
  });
};

export const manageConsent = (consent) => {
  if (consent === 'accepted') {
    enable();
  } else {
    disable();
  }
};
