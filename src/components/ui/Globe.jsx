/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Color, Scene, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../../data/globe.json";

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

export function Globe({ globeConfig, data }) {
  const [globeData, setGlobeData] = useState(null);
  const globeRef = useRef(null);
  const dataRef = useRef(data);
  const globeConfigRef = useRef(globeConfig);

  useEffect(() => { dataRef.current = data; });
  useEffect(() => { globeConfigRef.current = globeConfig; });

  const buildMaterial = useCallback((config, globe) => {
    if (!globe) return;
    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new Color(config.globeColor);
    globeMaterial.emissive = new Color(config.emissive);
    globeMaterial.emissiveIntensity = config.emissiveIntensity || 0.1;
    globeMaterial.shininess = config.shininess || 0.9;
  }, []);

  const buildData = useCallback((arcsData, globe) => {
    const defaultProps = {
      pointSize: 1,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
    };
    const points = [];
    for (let i = 0; i < arcsData.length; i++) {
      const arc = arcsData[i];
      const rgb = hexToRgb(arc.color);
      const colorStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: colorStr,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: colorStr,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every((k) => v2[k] === v[k])
        ) === i
    );
    setGlobeData(filteredPoints);

    if (globe) {
      globe
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(globeConfigRef.current.showAtmosphere)
        .atmosphereColor(globeConfigRef.current.atmosphereColor)
        .atmosphereAltitude(globeConfigRef.current.atmosphereAltitude)
        .hexPolygonColor(() => globeConfigRef.current.polygonColor);

      globe
        .arcsData(arcsData)
        .arcStartLat((d) => d.startLat * 1)
        .arcStartLng((d) => d.startLng * 1)
        .arcEndLat((d) => d.endLat * 1)
        .arcEndLng((d) => d.endLng * 1)
        .arcColor((e) => e.color)
        .arcAltitude((e) => e.arcAlt * 1)
        .arcStroke(0.3)
        .arcDashLength(globeConfigRef.current.arcLength)
        .arcDashInitialGap((e) => e.order * 1)
        .arcDashGap(15)
        .arcDashAnimateTime(() => globeConfigRef.current.arcTime);

      globe
        .pointsData(filteredPoints)
        .pointColor((e) => e.color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      globe
        .ringsData([])
        .ringColor((e) => (t) => e.color)
        .ringMaxRadius(globeConfigRef.current.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (globeConfigRef.current.arcTime * globeConfigRef.current.arcLength) /
            globeConfigRef.current.rings
        );
    }
  }, []);

  const setGlobe = useCallback((instance) => {
    if (instance && instance !== globeRef.current) {
      globeRef.current = instance;
      buildData(dataRef.current, instance);
      buildMaterial(globeConfigRef.current, instance);
    }
  }, [buildData, buildMaterial]);

  useEffect(() => {
    if (!globeRef.current || !globeData) return;
    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      numbersOfRings = genRandomNumbers(
        0,
        dataRef.current.length,
        Math.floor((dataRef.current.length * 4) / 5)
      );
      globeRef.current.ringsData(
        globeData.filter((d, i) => numbersOfRings.includes(i))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [globeData]);

  useFrame((_, delta) => {
    if (globeRef.current && globeConfig.autoRotate) {
      globeRef.current.rotation.y += delta * (globeConfig.autoRotateSpeed || 0.45);
    }
  });

  return <threeGlobe ref={setGlobe} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, []);
  return null;
}

export function World({ globeConfig, data }) {
  const scene = useMemo(() => {
    const s = new Scene();
    return s;
  }, []);

  const camera = useMemo(
    () => new PerspectiveCamera(50, aspect, 180, 1800),
    []
  );

  return (
    <Canvas scene={scene} camera={camera}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={1.5} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
        intensity={2}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
        intensity={2}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={2}
      />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        enableRotate={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

let numbersOfRings = [0];

export function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count && new Set(arr).size < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
