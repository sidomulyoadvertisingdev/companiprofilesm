import { World } from "./Globe.jsx";

// Arc data — mewakili jangkauan nasional Sidomulyo Advertising.
// Palet elegan: globe navy brand, arc emas/putih lembut.
const colors = ["#fbbf24", "#e5e7eb", "#fcd34d"];

const arcs = [
  { order: 1, startLat: -6.2, startLng: 106.8, endLat: -7.33, endLng: 110.5, arcAlt: 0.3, color: colors[0] }, // Jakarta -> Salatiga
  { order: 2, startLat: -7.55, startLng: 110.33, endLat: -7.33, endLng: 110.5, arcAlt: 0.2, color: colors[1] }, // Surakarta -> Salatiga
  { order: 3, startLat: -6.96, startLng: 107.6, endLat: -7.33, endLng: 110.5, arcAlt: 0.25, color: colors[2] }, // Bandung -> Salatiga
  { order: 4, startLat: -7.33, startLng: 110.5, endLat: -8.65, endLng: 115.22, arcAlt: 0.35, color: colors[0] }, // Salatiga -> Bali
  { order: 5, startLat: -7.33, startLng: 110.5, endLat: 3.6, endLng: 98.67, arcAlt: 0.5, color: colors[1] }, // Salatiga -> Medan
  { order: 6, startLat: -7.33, startLng: 110.5, endLat: -5.13, endLng: 119.43, arcAlt: 0.4, color: colors[2] }, // Salatiga -> Makassar
  { order: 7, startLat: 3.6, startLng: 98.67, endLat: -7.33, endLng: 110.5, arcAlt: 0.5, color: colors[0] },
  { order: 8, startLat: -8.65, startLng: 115.22, endLat: -7.33, endLng: 110.5, arcAlt: 0.35, color: colors[1] },
];

const globeConfig = {
  pointSize: 3,
  globeColor: "#0a2a5e",
  showAtmosphere: true,
  atmosphereColor: "#1e63c4",
  atmosphereAltitude: 0.18,
  emissive: "#0a2a5e",
  emissiveIntensity: 0.25,
  shininess: 1,
  polygonColor: "rgba(147, 197, 253, 0.35)",
  ambientLight: "#bcd4ff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#bcd4ff",
  arcTime: 2200,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 0.45,
  initialPosition: { lat: -7.33, lng: 110.5 },
};

export default function GlobeShowcase({ className = "" }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <World globeConfig={globeConfig} data={arcs} />
    </div>
  );
}
