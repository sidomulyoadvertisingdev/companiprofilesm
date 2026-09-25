let googleMapsPromise;

export function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const callback = "__sidomulyoGoogleMapsReady";
    const script = document.createElement("script");
    window[callback] = () => {
      delete window[callback];
      resolve(window.google.maps);
    };
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&language=id&region=ID&callback=${callback}`;
    script.async = true;
    script.onerror = () => {
      delete window[callback];
      script.remove();
      googleMapsPromise = undefined;
      reject(new Error("Google Maps gagal dimuat."));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
