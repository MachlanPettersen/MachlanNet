import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Toon cel-shading gradient ───────────────────────────────────────────────

let _grad: THREE.Texture | null = null;
function toonGrad(): THREE.Texture {
  if (_grad) return _grad;
  const c = document.createElement("canvas");
  c.width = 3; c.height = 1;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = "#8a8a8a"; ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(2, 0, 1, 1);
  _grad = new THREE.CanvasTexture(c);
  _grad.minFilter = _grad.magFilter = THREE.NearestFilter;
  return _grad;
}
const tm = (color: string): React.ComponentProps<"meshToonMaterial"> =>
  ({ color, gradientMap: toonGrad() } as any);

// ─── Day / Night palette ─────────────────────────────────────────────────────

const SKY_DAY    = new THREE.Color("#7BBDE0");
const SKY_NIGHT  = new THREE.Color("#070A14");
const GND_DAY    = new THREE.Color("#7DB55A");
const GND_NIGHT  = new THREE.Color("#2E4020");
const WAT_DAY    = new THREE.Color(0.15, 0.44, 0.67);
const WAT_NIGHT  = new THREE.Color(0.04, 0.08, 0.22);
const AMB_DAY    = new THREE.Color("#FFF4D8");
const AMB_NIGHT  = new THREE.Color("#1A2A50");
const CHIMNEY_TOP = new THREE.Vector3(3.7, 5.15, -1.0);

// ─── Water shader ────────────────────────────────────────────────────────────

const WaterMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color(0.15, 0.44, 0.67) },
  `uniform float uTime;
   varying vec2 vUv;
   void main() {
     vUv = uv;
     vec3 p = position;
     p.z += sin(p.x * 1.5 + uTime * 1.9) * 0.04
          + cos(p.y * 2.0 + uTime * 1.3) * 0.025;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
   }`,
  `uniform float uTime;
   uniform vec3 uColor;
   varying vec2 vUv;
   void main() {
     float s = sin(vUv.x * 9.5 - uTime * 2.6) * 0.5 + 0.5;
     vec3 col = mix(uColor * 0.7, uColor, s * 0.65);
     col = mix(col, vec3(0.85, 0.94, 0.97), step(0.83, s) * 0.5);
     gl_FragColor = vec4(col, 1.0);
   }`
);
extend({ WaterMaterial });

// ─── Scene Lighting + sky (lerps between day/night) ─────────────────────────

const SceneLighting: React.FC<{ isDaytime: boolean }> = ({ isDaytime }) => {
  const { scene } = useThree();
  const skyCol  = useRef(SKY_DAY.clone());
  const ambRef  = useRef<THREE.AmbientLight>(null);
  const sunRef  = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const k = 0.04;
    skyCol.current.lerp(isDaytime ? SKY_DAY : SKY_NIGHT, k);
    scene.background = skyCol.current;
    if (scene.fog instanceof THREE.FogExp2)
      (scene.fog as THREE.FogExp2).color.copy(skyCol.current);

    if (ambRef.current) {
      const ti = isDaytime ? 1.0 : 0.1;
      ambRef.current.intensity += (ti - ambRef.current.intensity) * k;
      ambRef.current.color.lerp(isDaytime ? AMB_DAY : AMB_NIGHT, k);
    }
    if (sunRef.current) {
      const ti = isDaytime ? 1.6 : 0.0;
      sunRef.current.intensity += (ti - sunRef.current.intensity) * k;
    }
    if (moonRef.current) {
      const ti = isDaytime ? 0.0 : 0.75;
      moonRef.current.intensity += (ti - moonRef.current.intensity) * k;
    }
    if (fillRef.current) {
      const ti = isDaytime ? 0.3 : 0.0;
      fillRef.current.intensity += (ti - fillRef.current.intensity) * k;
    }
  });

  return (
    <>
      <ambientLight ref={ambRef} intensity={1.0} color="#FFF4D8" />
      <directionalLight ref={sunRef}  position={[8, 14, 6]}   intensity={1.6} color="#FFFBE8" />
      <directionalLight ref={moonRef} position={[-7, 10, -5]} intensity={0.0} color="#7090C0" />
      <directionalLight ref={fillRef} position={[-5, 4, -5]}  intensity={0.3} color="#C8E8FF" />
      <pointLight position={[3.7, 3.2, -1.0]} intensity={isDaytime ? 0.4 : 1.2}
                  color="#FF6820" distance={5} decay={2} />
    </>
  );
};

// ─── River ───────────────────────────────────────────────────────────────────

const River: React.FC<{ isDaytime: boolean }> = ({ isDaytime }) => {
  const matRef  = useRef<any>(null);
  const colRef  = useRef(WAT_DAY.clone());

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.getElapsedTime();
    colRef.current.lerp(isDaytime ? WAT_DAY : WAT_NIGHT, 0.04);
    matRef.current.uColor = colRef.current;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[28, 2.9, 28, 10]} />
      {/* @ts-ignore */}
      <waterMaterial ref={matRef} />
    </mesh>
  );
};

// ─── Ground ──────────────────────────────────────────────────────────────────

const Ground: React.FC<{ isDaytime: boolean }> = ({ isDaytime }) => {
  const matRef = useRef<THREE.MeshLambertMaterial>(null);
  useFrame(() => {
    matRef.current?.color.lerp(isDaytime ? GND_DAY : GND_NIGHT, 0.04);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 24]} />
      <meshLambertMaterial ref={matRef} color="#7DB55A" />
    </mesh>
  );
};

// ─── Mill ────────────────────────────────────────────────────────────────────
// Body center [3.0, 1.4, -0.4], size 3.0 × 2.8 × 2.5  → top at Y=2.8
// Roof cone base at Y=2.8, height 2.2 → apex at Y=5.0

const Mill: React.FC = () => (
  <group>
    {/* ── Stone walls (outline shell) */}
    <mesh position={[3.0, 1.4, -0.4]} scale={[1.015, 1.015, 1.015]}>
      <boxGeometry args={[3.0, 2.8, 2.5]} />
      <meshBasicMaterial color="#1a0a04" side={THREE.BackSide} />
    </mesh>
    {/* ── Stone walls */}
    <mesh position={[3.0, 1.4, -0.4]}>
      <boxGeometry args={[3.0, 2.8, 2.5]} />
      <meshToonMaterial {...tm("#C8B490")} />
    </mesh>

    {/* ── Stone mortar bands */}
    {[0.45, 1.38, 2.28].map((y) => (
      <mesh key={y} position={[3.0, y, -0.4]}>
        <boxGeometry args={[3.02, 0.06, 2.52]} />
        <meshToonMaterial {...tm("#B09878")} />
      </mesh>
    ))}

    {/* ── Roof — square pyramid: base at Y=2.8, apex at Y=5.0 */}
    <mesh position={[3.0, 3.9, -0.4]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[2.1, 2.2, 4]} />
      <meshToonMaterial {...tm("#B84030")} />
    </mesh>

    {/* ── Chimney shaft (emerges through roof) */}
    <mesh position={[3.7, 4.4, -1.0]}>
      <boxGeometry args={[0.38, 1.3, 0.38]} />
      <meshToonMaterial {...tm("#9A8878")} />
    </mesh>
    {/* ── Chimney cap */}
    <mesh position={[3.7, 5.1, -1.0]}>
      <boxGeometry args={[0.52, 0.1, 0.52]} />
      <meshToonMaterial {...tm("#4A362B")} />
    </mesh>

    {/* ── Door (front face Z=0.85) */}
    <mesh position={[3.0, 0.62, 0.88]}>
      <boxGeometry args={[0.72, 1.2, 0.08]} />
      <meshToonMaterial {...tm("#2A1810")} />
    </mesh>
    {/* Door arch top */}
    <mesh position={[3.0, 1.26, 0.88]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.36, 0.36, 0.08, 12, 1, false, 0, Math.PI]} />
      <meshToonMaterial {...tm("#2A1810")} />
    </mesh>

    {/* ── Windows */}
    <mesh position={[2.2, 2.05, 0.88]}>
      <boxGeometry args={[0.52, 0.52, 0.08]} />
      <meshToonMaterial {...tm("#5C8FAA")} />
    </mesh>
    <mesh position={[3.8, 2.05, 0.88]}>
      <boxGeometry args={[0.52, 0.52, 0.08]} />
      <meshToonMaterial {...tm("#5C8FAA")} />
    </mesh>
    <mesh position={[3.0, 2.62, 0.88]}>
      <boxGeometry args={[0.44, 0.44, 0.08]} />
      <meshToonMaterial {...tm("#5C8FAA")} />
    </mesh>
    {/* Side window (right face X=4.52) */}
    <mesh position={[4.52, 1.9, -0.4]}>
      <boxGeometry args={[0.08, 0.52, 0.52]} />
      <meshToonMaterial {...tm("#5C8FAA")} />
    </mesh>

    {/* ── Millrace ledge */}
    <mesh position={[2.0, 0.18, 0.72]}>
      <boxGeometry args={[2.0, 0.32, 0.22]} />
      <meshToonMaterial {...tm("#B09878")} />
    </mesh>
  </group>
);

// ─── Water Wheel ─────────────────────────────────────────────────────────────
// Center at [-0.5, 1.4, 0]  — radius 1.4
// Right edge X = 0.9,  mill left wall X = 1.5  → no overlap

const WHEEL_R = 1.4;
const WHEEL_POS: [number, number, number] = [-0.5, 1.4, 0];
const SPOKE_N = 8;

const WaterWheel: React.FC = () => {
  const wheelRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (wheelRef.current) wheelRef.current.rotation.z -= dt * 0.55;
  });

  const spokes = useMemo(
    () => Array.from({ length: SPOKE_N }, (_, i) => (i / SPOKE_N) * Math.PI * 2),
    []
  );

  const WY = WHEEL_POS[1]; // 1.4

  return (
    <group position={WHEEL_POS}>
      {/* Support posts (front/back) */}
      <mesh position={[0, -WY / 2 - 0.06, 0.46]}>
        <boxGeometry args={[0.14, WY + 0.12, 0.14]} />
        <meshToonMaterial {...tm("#4A362B")} />
      </mesh>
      <mesh position={[0, -WY / 2 - 0.06, -0.46]}>
        <boxGeometry args={[0.14, WY + 0.12, 0.14]} />
        <meshToonMaterial {...tm("#4A362B")} />
      </mesh>

      {/* Lower cross-brace */}
      <mesh position={[0, -WY + 0.38, 0]}>
        <boxGeometry args={[0.1, 0.1, 1.02]} />
        <meshToonMaterial {...tm("#5C3D2A")} />
      </mesh>

      {/* Axle to mill: wheel center [-0.5,1.4,0] → mill wall [1.5,1.4,0], len=2.0 */}
      <mesh position={[1.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 2.0, 8]} />
        <meshToonMaterial {...tm("#5C3D2A")} />
      </mesh>

      {/* ── Rotating wheel */}
      <group ref={wheelRef}>
        {/* Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.96, 10]} />
          <meshToonMaterial {...tm("#6B4E3D")} />
        </mesh>
        {/* Outer rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[WHEEL_R, 0.09, 8, 44]} />
          <meshToonMaterial {...tm("#4A362B")} />
        </mesh>
        {/* Inner brace ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[WHEEL_R * 0.55, 0.055, 8, 28]} />
          <meshToonMaterial {...tm("#5C3D2A")} />
        </mesh>

        {spokes.map((angle, i) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return (
            <group key={i}>
              {/* Spoke */}
              <mesh
                position={[cos * WHEEL_R * 0.5, sin * WHEEL_R * 0.5, 0]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[WHEEL_R, 0.07, 0.07]} />
                <meshToonMaterial {...tm("#5C3D2A")} />
              </mesh>
              {/* Paddle (tangential) */}
              <mesh
                position={[cos * WHEEL_R, sin * WHEEL_R, 0]}
                rotation={[0, 0, angle + Math.PI / 2]}
              >
                <boxGeometry args={[0.52, 0.1, 0.8]} />
                <meshToonMaterial {...tm("#7B5040")} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// ─── Billowing smoke ─────────────────────────────────────────────────────────

interface Puff { pos: THREE.Vector3; age: number; maxAge: number; spd: number; dx: number; dz: number; }

const SMOKE_N = 10;

const Smoke: React.FC = () => {
  const refs = useRef<(THREE.Mesh | null)[]>(Array(SMOKE_N).fill(null));

  const puffs = useRef<Puff[]>(
    Array.from({ length: SMOKE_N }, (_, i) => {
      const maxAge = 3.0 + Math.random() * 1.8;
      return {
        pos: new THREE.Vector3(
          CHIMNEY_TOP.x + (Math.random() - 0.5) * 0.12,
          CHIMNEY_TOP.y - (i / SMOKE_N) * maxAge * 0.32,
          CHIMNEY_TOP.z + (Math.random() - 0.5) * 0.12,
        ),
        age: (i / SMOKE_N) * maxAge,
        maxAge,
        spd: 0.28 + Math.random() * 0.2,
        dx: (Math.random() - 0.5) * 0.1,
        dz: (Math.random() - 0.5) * 0.07,
      };
    })
  );

  useFrame((_, dt) => {
    puffs.current.forEach((p, i) => {
      p.age += dt;
      if (p.age >= p.maxAge) {
        p.pos.set(
          CHIMNEY_TOP.x + (Math.random() - 0.5) * 0.14,
          CHIMNEY_TOP.y,
          CHIMNEY_TOP.z + (Math.random() - 0.5) * 0.14,
        );
        p.age = 0;
        p.maxAge = 3.0 + Math.random() * 1.8;
        p.spd = 0.28 + Math.random() * 0.2;
        p.dx  = (Math.random() - 0.5) * 0.1;
        p.dz  = (Math.random() - 0.5) * 0.07;
      }
      p.pos.y += p.spd * dt;
      p.pos.x += p.dx * dt;
      p.pos.z += p.dz * dt;

      const mesh = refs.current[i];
      if (mesh) {
        mesh.position.copy(p.pos);
        const t = p.age / p.maxAge;
        mesh.scale.setScalar(0.12 + t * 0.55);
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          Math.sin(t * Math.PI) * 0.52;
      }
    });
  });

  return (
    <>
      {Array.from({ length: SMOKE_N }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshBasicMaterial color="#C5BDB5" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
};

// ─── Tree ────────────────────────────────────────────────────────────────────

interface TreeProps { position: [number, number, number]; s?: number }

const Tree: React.FC<TreeProps> = ({ position, s = 1 }) => (
  <group position={position} scale={[s, s, s]}>
    <mesh position={[0, 0.6, 0]}>
      <cylinderGeometry args={[0.13, 0.19, 1.2, 6]} />
      <meshToonMaterial {...tm("#4A2E1A")} />
    </mesh>
    <mesh position={[0, 1.65, 0]}>
      <coneGeometry args={[0.95, 1.3, 7]} />
      <meshToonMaterial {...tm("#355A28")} />
    </mesh>
    <mesh position={[0, 2.45, 0]}>
      <coneGeometry args={[0.65, 1.05, 7]} />
      <meshToonMaterial {...tm("#3D6E30")} />
    </mesh>
  </group>
);

// ─── Rock ─────────────────────────────────────────────────────────────────────

const Rock: React.FC<{ pos: [number, number, number]; sc?: [number, number, number] }> =
  ({ pos, sc = [1, 0.58, 0.88] }) => (
    <mesh position={pos} scale={sc}>
      <sphereGeometry args={[0.27, 5, 4]} />
      <meshToonMaterial {...tm("#8A7868")} />
    </mesh>
  );

// ─── Bobbing cloud ────────────────────────────────────────────────────────────

const Cloud: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const ref  = useRef<THREE.Group>(null);
  const baseY = position[1];
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 0.28 + phase) * 0.14;
  });
  return (
    <group ref={ref} position={position}>
      <mesh><sphereGeometry args={[0.76, 7, 6]} /><meshToonMaterial {...tm("#F2F0ED")} /></mesh>
      <mesh position={[0.9, -0.08, 0]}><sphereGeometry args={[0.54, 7, 6]} /><meshToonMaterial {...tm("#EEECEA")} /></mesh>
      <mesh position={[-0.8, -0.12, 0]}><sphereGeometry args={[0.48, 7, 6]} /><meshToonMaterial {...tm("#F0EEEB")} /></mesh>
      <mesh position={[0.2, 0.34, 0]}><sphereGeometry args={[0.58, 7, 6]} /><meshToonMaterial {...tm("#F5F4F2")} /></mesh>
    </group>
  );
};

// ─── Stars (fade in at night) ─────────────────────────────────────────────────

const Stars: React.FC<{ isDaytime: boolean }> = ({ isDaytime }) => {
  const matRef = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 28 + Math.random() * 8;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (matRef.current) {
      const target = isDaytime ? 0 : 0.85;
      matRef.current.opacity += (target - matRef.current.opacity) * 0.04;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} size={0.09} color="#F5F2EA"
                      transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  );
};

// ─── Sun & Moon orbs ─────────────────────────────────────────────────────────

const CelestialOrbs: React.FC<{ isDaytime: boolean }> = ({ isDaytime }) => {
  const sunRef  = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const moonRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const k = 0.04;
    if (sunRef.current)  sunRef.current.opacity  += ((isDaytime ? 1.0 : 0.0) - sunRef.current.opacity) * k;
    if (glowRef.current) glowRef.current.opacity += ((isDaytime ? 0.18 : 0.0) - glowRef.current.opacity) * k;
    if (moonRef.current) moonRef.current.opacity += ((isDaytime ? 0.0 : 1.0) - moonRef.current.opacity) * k;
  });

  return (
    <>
      {/* Sun */}
      <group position={[18, 16, 8]}>
        <mesh>
          <sphereGeometry args={[1.3, 16, 12]} />
          <meshBasicMaterial ref={sunRef} color="#FFE060" transparent opacity={1} />
        </mesh>
        <mesh scale={1.5}>
          <sphereGeometry args={[1.3, 16, 12]} />
          <meshBasicMaterial ref={glowRef} color="#FFE060" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      </group>
      {/* Moon */}
      <group position={[-16, 14, -10]}>
        <mesh>
          <sphereGeometry args={[1.1, 16, 12]} />
          <meshBasicMaterial ref={moonRef} color="#E8E0C8" transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
};

// ─── Full scene graph ─────────────────────────────────────────────────────────

interface InnerProps { isDaytime: boolean }

const WaterwheelSceneInner: React.FC<InnerProps> = ({ isDaytime }) => {
  const { scene } = useThree();
  // Set up fog once
  React.useEffect(() => {
    scene.fog = new THREE.FogExp2(SKY_DAY.getHex(), 0.016);
    return () => { scene.fog = null; };
  }, [scene]);

  return (
    <>
      <SceneLighting isDaytime={isDaytime} />
      <Ground      isDaytime={isDaytime} />
      <River       isDaytime={isDaytime} />
      <Stars       isDaytime={isDaytime} />
      <CelestialOrbs isDaytime={isDaytime} />
      <Mill />
      <WaterWheel />
      <Smoke />

      {/* Trees */}
      <Tree position={[-3.5, 0, -2.2]} s={1.0} />
      <Tree position={[-2.2, 0, -3.3]} s={0.88} />
      <Tree position={[5.8,  0, -2.4]} s={1.1} />
      <Tree position={[-4.6, 0, 1.6]}  s={0.92} />
      <Tree position={[5.3,  0, 2.1]}  s={0.78} />
      <Tree position={[-5.5, 0, -0.6]} s={1.05} />
      <Tree position={[6.8,  0, -0.4]} s={0.85} />

      {/* Rocks */}
      <Rock pos={[-2.3, 0.04, 1.9]}  sc={[1.1,  0.55, 0.9]} />
      <Rock pos={[-1.2, 0.04, -0.6]} sc={[0.8,  0.5,  0.75]} />
      <Rock pos={[0.1,  0.04, 2.1]}  sc={[1.3,  0.58, 1.0]} />
      <Rock pos={[-3.6, 0.04, 1.2]}  sc={[0.7,  0.45, 0.8]} />
      <Rock pos={[4.5,  0.04, 1.8]}  sc={[0.95, 0.5,  0.85]} />

      {/* Clouds */}
      <Cloud position={[-4.5, 7.5, -5.5]} />
      <Cloud position={[2.2,  8.3, -7.0]} />
      <Cloud position={[7.5,  7.8, -5.0]} />

    </>
  );
};

// ─── Exported canvas ──────────────────────────────────────────────────────────

interface WaterwheelSceneProps {
  isDaytime: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const WaterwheelScene: React.FC<WaterwheelSceneProps> = ({
  isDaytime,
  onDragStart,
  onDragEnd,
}) => (
  <Canvas
    camera={{ position: [9, 8, 11], fov: 25 }}
    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    gl={{ antialias: true, alpha: false }}
  >
    <WaterwheelSceneInner isDaytime={isDaytime} />
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.45}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      onStart={onDragStart}
      onEnd={onDragEnd}
    />
  </Canvas>
);

export default WaterwheelScene;
