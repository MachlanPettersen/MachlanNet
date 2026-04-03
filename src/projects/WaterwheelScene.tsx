import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Water shader ────────────────────────────────────────────────────────────

const WaterMaterial = shaderMaterial(
  { uTime: 0 },
  /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 1.4 + uTime * 1.7) * 0.045;
      pos.z += cos(pos.y * 2.1 + uTime * 1.2) * 0.028;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      float w1 = sin(vUv.x * 11.0 - uTime * 2.3) * 0.5 + 0.5;
      float w2 = sin(vUv.x * 6.5 + vUv.y * 4.2 - uTime * 1.7) * 0.5 + 0.5;
      vec3 deep    = vec3(0.17, 0.40, 0.58);
      vec3 shallow = vec3(0.28, 0.57, 0.72);
      vec3 foam    = vec3(0.76, 0.90, 0.95);
      vec3 col = mix(deep, shallow, w1 * 0.5 + w2 * 0.32);
      col = mix(col, foam, smoothstep(0.76, 1.0, w1) * 0.38);
      gl_FragColor = vec4(col, 1.0);
    }
  `
);

extend({ WaterMaterial });

// ─── River ───────────────────────────────────────────────────────────────────

const River: React.FC = () => {
  const matRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
      <planeGeometry args={[26, 2.9, 28, 10]} />
      {/* @ts-ignore */}
      <waterMaterial ref={matRef} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ─── Ground ──────────────────────────────────────────────────────────────────

const Ground: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
    <planeGeometry args={[36, 22]} />
    <meshLambertMaterial color="#8A9F71" />
  </mesh>
);

// ─── Tree ────────────────────────────────────────────────────────────────────

interface TreeProps {
  position: [number, number, number];
  s?: number;
}

const Tree: React.FC<TreeProps> = ({ position, s = 1 }) => (
  <group position={position} scale={[s, s, s]}>
    <mesh position={[0, 0.58, 0]}>
      <cylinderGeometry args={[0.13, 0.18, 1.15, 6]} />
      <meshLambertMaterial color="#4A362B" />
    </mesh>
    <mesh position={[0, 1.55, 0]}>
      <coneGeometry args={[0.92, 1.25, 7]} />
      <meshLambertMaterial color="#446030" />
    </mesh>
    <mesh position={[0, 2.25, 0]}>
      <coneGeometry args={[0.67, 1.05, 7]} />
      <meshLambertMaterial color="#567840" />
    </mesh>
    <mesh position={[0, 2.92, 0]}>
      <coneGeometry args={[0.38, 0.78, 7]} />
      <meshLambertMaterial color="#688A4C" />
    </mesh>
  </group>
);

// ─── Mill ────────────────────────────────────────────────────────────────────

const Mill: React.FC = () => (
  <group>
    {/* Stone walls */}
    <mesh position={[3.2, 1.5, -0.4]}>
      <boxGeometry args={[3.0, 3.0, 2.5]} />
      <meshLambertMaterial color="#C8B89A" />
    </mesh>

    {/* Wall texture bands (subtle dark lines) */}
    <mesh position={[3.2, 0.55, -0.4]}>
      <boxGeometry args={[3.02, 0.06, 2.52]} />
      <meshLambertMaterial color="#B0A088" />
    </mesh>
    <mesh position={[3.2, 1.4, -0.4]}>
      <boxGeometry args={[3.02, 0.06, 2.52]} />
      <meshLambertMaterial color="#B0A088" />
    </mesh>
    <mesh position={[3.2, 2.2, -0.4]}>
      <boxGeometry args={[3.02, 0.06, 2.52]} />
      <meshLambertMaterial color="#B0A088" />
    </mesh>

    {/* Pitched roof (square cone rotated 45°) */}
    <mesh position={[3.2, 3.55, -0.4]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[2.28, 1.95, 4]} />
      <meshLambertMaterial color="#8B5E50" />
    </mesh>

    {/* Chimney shaft */}
    <mesh position={[3.82, 4.55, -0.72]}>
      <boxGeometry args={[0.36, 1.05, 0.36]} />
      <meshLambertMaterial color="#9A8878" />
    </mesh>
    {/* Chimney cap */}
    <mesh position={[3.82, 5.12, -0.72]}>
      <boxGeometry args={[0.5, 0.09, 0.5]} />
      <meshLambertMaterial color="#4A362B" />
    </mesh>

    {/* Door */}
    <mesh position={[1.71, 0.62, -0.4]}>
      <boxGeometry args={[0.07, 1.18, 0.65]} />
      <meshLambertMaterial color="#2A1810" />
    </mesh>

    {/* Window — front lower left */}
    <mesh position={[1.71, 1.92, 0.42]}>
      <boxGeometry args={[0.07, 0.5, 0.5]} />
      <meshLambertMaterial color="#5C8FAA" />
    </mesh>
    {/* Window — front lower right */}
    <mesh position={[1.71, 1.92, -1.22]}>
      <boxGeometry args={[0.07, 0.5, 0.5]} />
      <meshLambertMaterial color="#5C8FAA" />
    </mesh>
    {/* Window — front upper center */}
    <mesh position={[1.71, 2.7, -0.4]}>
      <boxGeometry args={[0.07, 0.44, 0.44]} />
      <meshLambertMaterial color="#5C8FAA" />
    </mesh>
    {/* Window — side */}
    <mesh position={[3.2, 1.92, 0.77]}>
      <boxGeometry args={[0.5, 0.5, 0.07]} />
      <meshLambertMaterial color="#5C8FAA" />
    </mesh>

    {/* Millrace channel wall (small ledge between mill and river) */}
    <mesh position={[2.2, 0.18, 0.62]}>
      <boxGeometry args={[2.0, 0.35, 0.22]} />
      <meshLambertMaterial color="#B0A088" />
    </mesh>
  </group>
);

// ─── Water Wheel ─────────────────────────────────────────────────────────────

const WHEEL_RADIUS = 1.35;
const SPOKE_COUNT = 8;

const WaterWheel: React.FC = () => {
  const wheelRef = useRef<THREE.Group>(null);

  const WHEEL_X = 1.7;
  const WHEEL_Y = 1.42;
  const WHEEL_Z = 0.5;

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z -= delta * 0.55;
    }
  });

  const spokes = useMemo(
    () =>
      Array.from({ length: SPOKE_COUNT }, (_, i) => ({
        angle: (i / SPOKE_COUNT) * Math.PI * 2,
        key: i,
      })),
    []
  );

  return (
    <group position={[WHEEL_X, WHEEL_Y, WHEEL_Z]}>
      {/* Front support post */}
      <mesh position={[0, -WHEEL_Y * 0.5 - 0.04, 0.46]}>
        <boxGeometry args={[0.13, WHEEL_Y + 0.08, 0.13]} />
        <meshLambertMaterial color="#4A362B" />
      </mesh>
      {/* Rear support post */}
      <mesh position={[0, -WHEEL_Y * 0.5 - 0.04, -0.46]}>
        <boxGeometry args={[0.13, WHEEL_Y + 0.08, 0.13]} />
        <meshLambertMaterial color="#4A362B" />
      </mesh>
      {/* Lower cross-brace */}
      <mesh position={[0, -WHEEL_Y + 0.38, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.02]} />
        <meshLambertMaterial color="#5C3D2A" />
      </mesh>
      {/* Upper cross-brace */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.02]} />
        <meshLambertMaterial color="#5C3D2A" />
      </mesh>
      {/* Axle stub going into the mill wall */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.1, 8]} />
        <meshLambertMaterial color="#5C3D2A" />
      </mesh>

      {/* ── Rotating wheel group ── */}
      <group ref={wheelRef}>
        {/* Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.96, 10]} />
          <meshLambertMaterial color="#6B4E3D" />
        </mesh>

        {/* Outer rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[WHEEL_RADIUS, 0.09, 8, 44]} />
          <meshLambertMaterial color="#4A362B" />
        </mesh>

        {/* Inner brace ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[WHEEL_RADIUS * 0.56, 0.055, 8, 28]} />
          <meshLambertMaterial color="#5C3D2A" />
        </mesh>

        {/* Spokes + paddles */}
        {spokes.map(({ angle, key }) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return (
            <group key={key}>
              {/* Spoke — from hub to rim */}
              <mesh
                position={[cos * WHEEL_RADIUS * 0.5, sin * WHEEL_RADIUS * 0.5, 0]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[WHEEL_RADIUS, 0.07, 0.07]} />
                <meshLambertMaterial color="#5C3D2A" />
              </mesh>

              {/* Paddle — tangential at rim */}
              <mesh
                position={[cos * WHEEL_RADIUS, sin * WHEEL_RADIUS, 0]}
                rotation={[0, 0, angle + Math.PI / 2]}
              >
                <boxGeometry args={[0.52, 0.1, 0.78]} />
                <meshLambertMaterial color="#7B5040" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// ─── Rock ────────────────────────────────────────────────────────────────────

interface RockProps {
  pos: [number, number, number];
  sc?: [number, number, number];
}

const Rock: React.FC<RockProps> = ({ pos, sc = [1, 0.58, 0.85] }) => (
  <mesh position={pos} scale={sc}>
    <sphereGeometry args={[0.27, 5, 4]} />
    <meshLambertMaterial color="#9A8878" />
  </mesh>
);

// ─── Cloud ───────────────────────────────────────────────────────────────────

interface CloudProps {
  position: [number, number, number];
}

const Cloud: React.FC<CloudProps> = ({ position }) => {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = position[1];
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        baseY + Math.sin(clock.getElapsedTime() * 0.28 + phase) * 0.13;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.74, 7, 6]} />
        <meshLambertMaterial color="#F2F0ED" />
      </mesh>
      <mesh position={[0.88, -0.07, 0]}>
        <sphereGeometry args={[0.53, 7, 6]} />
        <meshLambertMaterial color="#EEECEA" />
      </mesh>
      <mesh position={[-0.78, -0.12, 0]}>
        <sphereGeometry args={[0.48, 7, 6]} />
        <meshLambertMaterial color="#F0EEEB" />
      </mesh>
      <mesh position={[0.18, 0.32, 0]}>
        <sphereGeometry args={[0.58, 7, 6]} />
        <meshLambertMaterial color="#F5F4F2" />
      </mesh>
    </group>
  );
};

// ─── Full scene graph ─────────────────────────────────────────────────────────

const WaterwheelSceneInner: React.FC = () => (
  <>
    <color attach="background" args={["#C5E2F0"]} />

    <ambientLight intensity={1.05} color="#FFF8E0" />
    <directionalLight position={[8, 12, 6]} intensity={1.35} color="#FFFAE0" />
    <directionalLight position={[-6, 4, -4]} intensity={0.28} color="#C8E8FF" />

    <Ground />
    <River />
    <Mill />
    <WaterWheel />

    {/* Trees */}
    <Tree position={[-3.5, 0, -2.2]} s={1.0} />
    <Tree position={[-2.2, 0, -3.3]} s={0.85} />
    <Tree position={[5.9, 0, -2.4]} s={1.1} />
    <Tree position={[-4.6, 0, 1.5]} s={0.9} />
    <Tree position={[5.4, 0, 2.1]} s={0.78} />
    <Tree position={[-5.5, 0, -0.6]} s={1.05} />
    <Tree position={[6.8, 0, -0.5]} s={0.88} />

    {/* Rocks along banks */}
    <Rock pos={[-2.3, 0.04, 1.9]} sc={[1.1, 0.55, 0.9]} />
    <Rock pos={[-1.2, 0.04, -0.55]} sc={[0.8, 0.5, 0.75]} />
    <Rock pos={[0.05, 0.04, 2.15]} sc={[1.3, 0.58, 1.0]} />
    <Rock pos={[-3.6, 0.04, 1.25]} sc={[0.7, 0.45, 0.8]} />
    <Rock pos={[4.5, 0.04, 1.8]} sc={[0.95, 0.5, 0.85]} />

    {/* Clouds */}
    <Cloud position={[-4.5, 7.5, -5.5]} />
    <Cloud position={[2.2, 8.3, -7.0]} />
    <Cloud position={[7.5, 7.8, -5.0]} />
  </>
);

// ─── Exported canvas component ────────────────────────────────────────────────

interface WaterwheelSceneProps {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const WaterwheelScene: React.FC<WaterwheelSceneProps> = ({
  onDragStart,
  onDragEnd,
}) => (
  <Canvas
    camera={{ position: [3, 4.2, 10.5], fov: 48 }}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }}
    gl={{ antialias: true, alpha: false }}
  >
    <WaterwheelSceneInner />
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.4}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.15}
      onStart={onDragStart}
      onEnd={onDragEnd}
    />
  </Canvas>
);

export default WaterwheelScene;
