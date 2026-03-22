import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Float, Sphere, shaderMaterial, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { AstroSnapshot } from "./astronomy";
import { createEarthTexture } from "./earthTexture";

// --- Texture-based Earth Shader ---

const EarthShaderMaterial = shaderMaterial(
  {
    uSunDir: new THREE.Vector3(1, 0, 0),
    uMap: new THREE.Texture(),
  },
  // vertex
  `
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment — texture-based earth with lighting
  `
    uniform vec3 uSunDir;
    uniform sampler2D uMap;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      // Sample the continent texture
      vec3 texColor = texture2D(uMap, vUv).rgb;

      // Detect land vs ocean from texture (land is greenish, ocean is blue)
      float landMask = step(0.15, texColor.g - texColor.b);

      vec3 color = texColor;

      // Sun lighting
      float light = dot(vWorldNormal, normalize(uSunDir));
      float daylight = smoothstep(-0.15, 0.8, light);
      color *= mix(0.2, 1.0, daylight);

      // City lights on night side (land only)
      float nightMask = smoothstep(0.1, -0.15, light) * landMask;
      float cities = smoothstep(0.72, 0.78, fbm(vUv * 40.0 + vec2(1.1, 7.3)));
      color += vec3(1.0, 0.85, 0.5) * cities * nightMask * 0.3;

      // Atmosphere rim
      float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
      vec3 atmosColor = mix(vec3(0.3, 0.5, 0.9), vec3(0.1, 0.15, 0.4), 1.0 - daylight);
      color = mix(color, atmosColor, pow(rim, 2.5) * 0.45);

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ EarthShaderMaterial });

// --- Moon crater shader (lit by sun direction for accurate phase illumination) ---

const MoonShaderMaterial = shaderMaterial(
  { uSunDir: new THREE.Vector3(1, 0, 0) },
  `
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 uSunDir;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec2 vUv;
    varying vec3 vWorldPos;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    void main() {
      vec3 baseColor = vec3(0.78, 0.76, 0.72);
      vec3 craterColor = vec3(0.62, 0.60, 0.56);
      vec3 mariaColor = vec3(0.50, 0.48, 0.45);

      float n = noise(vUv * 12.0);
      float craters = smoothstep(0.55, 0.6, n);
      float maria = smoothstep(0.45, 0.50, noise(vUv * 4.0 + vec2(3.1, 1.7)));

      vec3 color = mix(baseColor, craterColor, craters);
      color = mix(color, mariaColor, maria * 0.3);

      // Light from actual sun direction toward moon's world position
      float light = dot(vWorldNormal, normalize(uSunDir));
      float daylight = smoothstep(-0.05, 0.6, light);
      color *= mix(0.08, 1.0, daylight);

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ MoonShaderMaterial });

// --- Sun component with glow ---

const Sun: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#F2C94C" />
      </Sphere>
      <Sphere ref={glowRef} args={[1.0, 32, 32]}>
        <meshBasicMaterial color="#F2C94C" transparent opacity={0.25} />
      </Sphere>
      <Sphere args={[1.4, 32, 32]}>
        <meshBasicMaterial color="#E3955A" transparent opacity={0.08} />
      </Sphere>
      <pointLight intensity={3} distance={30} color="#F2C94C" />
    </group>
  );
};

// --- Moon component (lit by sun for accurate phase) ---

const Moon: React.FC<{
  position: [number, number, number];
  sunDir: THREE.Vector3;
}> = ({ position, sunDir }) => {
  const matRef = useRef<any>(null);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uSunDir = sunDir;
    }
  });

  return (
    <group position={position}>
      <Sphere args={[0.35, 32, 32]}>
        {/* @ts-ignore: custom r3f material */}
        <moonShaderMaterial ref={matRef} />
      </Sphere>
    </group>
  );
};

// --- Sunbeam from Sun toward Earth ---

const Sunbeam: React.FC<{
  sunPos: [number, number, number];
}> = ({ sunPos }) => {
  const beamRef = useRef<THREE.Mesh>(null);

  const { midpoint, length, rotation } = useMemo(() => {
    const sun = new THREE.Vector3(sunPos[0], sunPos[1], sunPos[2]);
    const earth = new THREE.Vector3(0, 0, 0);
    const dir = earth.clone().sub(sun);
    const len = dir.length();
    const mid = sun.clone().add(earth).multiplyScalar(0.5);
    const angle = Math.atan2(dir.y, dir.x);
    return {
      midpoint: [mid.x, mid.y, mid.z] as [number, number, number],
      length: len,
      rotation: angle,
    };
  }, [sunPos]);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(clock.getElapsedTime() * 3) * 0.02;
    }
  });

  return (
    <mesh ref={beamRef} position={midpoint} rotation={[0, 0, rotation]}>
      <planeGeometry args={[length, 1.2]} />
      <meshBasicMaterial
        color="#F2C94C"
        transparent
        opacity={0.07}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

// --- Orbit ring ---

const OrbitRing: React.FC<{
  radius: number;
  color: string;
  opacity: number;
}> = ({ radius, color, opacity }) => {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={1}
    />
  );
};

// --- Starfield ---

const Stars: React.FC<{ count: number }> = ({ count }) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 15 + Math.random() * 10;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#F5F2EA"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

// --- Earth with rotation, lit by sun ---

const Earth: React.FC<{ sunDir: THREE.Vector3 }> = ({ sunDir }) => {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<any>(null);

  const earthTexture = useMemo(() => createEarthTexture(), []);

  useFrame((_, delta) => {
    if (ref.current) {
      // One full rotation per 24 hours: 2π / 86400 ≈ 0.0000727 rad/s
      ref.current.rotation.y += delta * (Math.PI * 2) / 86400;
    }
    if (matRef.current) {
      matRef.current.uSunDir = sunDir;
      matRef.current.uMap = earthTexture;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.2}>
      <Sphere ref={ref} args={[1, 64, 64]} position={[0, 0, 0]}>
        {/* @ts-ignore: custom r3f material */}
        <earthShaderMaterial ref={matRef} />
      </Sphere>
    </Float>
  );
};

// --- Main scene ---

interface ConstructionSceneProps {
  astro: AstroSnapshot;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const SolarSystem: React.FC<{ astro: AstroSnapshot }> = ({ astro }) => {
  const sunDir = useRef(new THREE.Vector3());

  const sunRadius = 5.5;
  const moonRadius = 2.8;

  const sunX = Math.cos(astro.sunAngle) * sunRadius;
  const sunY = Math.sin(astro.sunAngle) * sunRadius + astro.sunTilt;
  const moonX = Math.cos(astro.moonAngle) * moonRadius;
  const moonY = Math.sin(astro.moonAngle) * moonRadius;

  sunDir.current.set(sunX, sunY, 0).normalize();

  return (
    <>
      <OrbitRing radius={sunRadius} color="#D5C9BE" opacity={0.08} />
      <OrbitRing radius={moonRadius} color="#D5C9BE" opacity={0.12} />

      <Sun position={[sunX, sunY, 0]} />
      <Sunbeam sunPos={[sunX, sunY, 0]} />
      <Moon position={[moonX, moonY, 0.5]} sunDir={sunDir.current} />
      <Earth sunDir={sunDir.current} />
      <Stars count={400} />
    </>
  );
};

const ConstructionScene: React.FC<ConstructionSceneProps> = ({
  astro,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#0a0a12"]} />
      <ambientLight intensity={0.15} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        onStart={onDragStart}
        onEnd={onDragEnd}
      />
      <SolarSystem astro={astro} />
    </Canvas>
  );
};

export default ConstructionScene;
