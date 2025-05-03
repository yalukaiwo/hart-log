import { useEffect, useState } from "react";
import TrackMap from "./TrackMap";

const TrackMapWrapper = () => {
  const [isClient, setIsClient] = useState(false);
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    if (!isClient) return null;
  return <TrackMap />;
}
 
export default TrackMapWrapper;