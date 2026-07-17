import { World } from "./Globe.jsx";

// Arc data — mewakili jangkauan nasional Sidomulyo Advertising.
// Warna disesuaikan dengan palet brand (oranye/merah profesional).
const colors = ["#ff6b35", "#f7931e", "#ff3b3b"];

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
  pointSize: 4,
  globeColor: "#0c1528",
  showAtmosphere: true,
  atmosphereColor: "#f97316",
  atmosphereAltitude: 0.15,
  emissive: "#1a0800",
  emissiveIntensity: 0.15,
  shininess: 1,
  polygonColor: "rgba(249, 115, 22, 0.15)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#f97316",
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
