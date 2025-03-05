
import { useCallback } from 'react';

export const useDeviceInfo = () => {
  // Function to handle device information collection
  const getDeviceInfo = useCallback(() => {
    const userAgent = navigator.userAgent;
    const browserInfo = userAgent.match(/(chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);
    const browser = browserInfo ? browserInfo[1] : 'Unknown Browser';
    const osInfo = userAgent.match(/\(([^)]+)\)/);
    const os = osInfo ? osInfo[1] : 'Unknown OS';
    return `${browser} on ${os}`;
  }, []);

  // Function to estimate location (in production, you would use a geolocation service)
  const estimateLocation = useCallback(async () => {
    try {
      // In a real app, you would use a geolocation API
      // This is just a placeholder
      return "Location inconnue";
    } catch (error) {
      console.error("Error getting location:", error);
      return "Location inconnue";
    }
  }, []);

  return {
    getDeviceInfo,
    estimateLocation
  };
};
