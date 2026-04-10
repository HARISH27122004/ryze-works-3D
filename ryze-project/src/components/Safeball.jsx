import { useEffect, useState } from "react";
import Ballpit from './Ballpit.jsx'

export default function SafeBall() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div style={{ width: "100%", height: "100%" }}>
<Ballpit
  count={20}
  colors={[0x2255dd, 0x0a0a14, 0x909098]}
  minSize={1.2}
  maxSize={2.0}
  materialParams={{ metalness: 0.0, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.05 }}
  ambientIntensity={0.4}
  lightIntensity={80}
  followCursor={false}
/>
    </div>
  );
}