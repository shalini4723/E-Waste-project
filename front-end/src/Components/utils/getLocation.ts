import mapboxgl from "mapbox-gl";

const getLocation = (): Promise<{ coordinates: [number, number] | null; address: string | null }> => {
  mapboxgl.accessToken = "pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw";

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      resolve({ coordinates: null, address: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const coordinates: [number, number] = [lon, lat];

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          const address = data.features[0]?.place_name || null;
          resolve({ coordinates, address });
        } catch (error) {
          console.error("Error fetching address:", error);
          resolve({ coordinates, address: null });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        resolve({ coordinates: null, address: null });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

export default getLocation;
