"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mergeGeometries as mergeGeos } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";

// ---- Particles ----
function Particles({ count = 500 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const scrollRef = useRef(0);
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.03;
    meshRef.current.rotation.x += delta * 0.01;
    const targetY = -scrollRef.current * 2;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
  });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#667799" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ---- Cute eyes that follow mouse ----
function EyePair({ position, mouseRef }: { position: [number, number, number]; mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!leftPupilRef.current || !rightPupilRef.current) return;
    const mx = mouseRef.current.x * 0.08;
    const my = mouseRef.current.y * 0.08;
    const clampX = Math.max(-0.06, Math.min(0.06, mx));
    const clampY = Math.max(-0.06, Math.min(0.06, my));
    leftPupilRef.current.position.set(clampX, clampY, 0.08);
    rightPupilRef.current.position.set(clampX, clampY, 0.08);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Left eye - white sphere */}
      <mesh position={[-0.22, 0, 0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Left pupil - black dot */}
      <mesh ref={leftPupilRef} position={[-0.22, 0, 0.13]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.22, 0, 0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Right pupil */}
      <mesh ref={rightPupilRef} position={[0.22, 0, 0.13]}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#111111" roughness={0.1} />
      </mesh>
    </group>
  );
}

// ---- 3D Text with per-letter positioning + A-eyes ----
function DataTitle3D() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);
  const [font, setFont] = useState<any>(null);
  const startedRef = useRef(false);
  const entranceDoneRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Track mouse globally
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Load font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_bold.typeface.json", (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  // Start rotation + scale animation
  useEffect(() => {
    if (!font || !groupRef.current || startedRef.current) return;
    startedRef.current = true;

    const tl = gsap.timeline({ onComplete: () => { entranceDoneRef.current = true; } });
    const fadeTarget = { opacity: 0 };
    tl.to(fadeTarget, {
      opacity: 1, duration: 1.2, ease: "power2.in",
      onUpdate: () => {
        if (materialRef.current) materialRef.current.opacity = fadeTarget.opacity;
      },
    }, 0);
    tl.to(groupRef.current.rotation, { y: 0, duration: 6.0, ease: "none" }, 0);
    tl.to(groupRef.current.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 6.0, ease: "none" }, 0);
  }, [font]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    if (!entranceDoneRef.current) return;
    const s = scrollRef.current;
    groupRef.current.rotation.y += (s * 0.8 - groupRef.current.rotation.y) * 0.04;
    if (materialRef.current) {
      materialRef.current.opacity += (Math.max(0, 1 - s * 1.3) - materialRef.current.opacity) * 0.05;
    }
  });

  // Build per-letter geometry + find A positions
  const { letters, aPositions } = useMemo(() => {
    if (!font) return { letters: null, aPositions: [] as [number, number, number][] };

    const chars = ["D", "A", "T", "A"];
    const size = 2.8;
    const depth = 0.6;
    let cursorX = 0;
    const result: { char: string; geo: THREE.BufferGeometry; x: number }[] = [];
    const aPos: [number, number, number][] = [];

    chars.forEach((char, i) => {
      const geo = new TextGeometry(char, {
        font, size, depth,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.04,
        bevelSegments: 3,
      });
      geo.computeBoundingBox();
      const box = geo.boundingBox!;
      const width = box.max.x - box.min.x;
      const height = box.max.y - box.min.y;

      // Shift geometry so its left edge aligns with cursorX
      geo.translate(cursorX - box.min.x, -box.min.y, 0);

      // If this is an A, record eye position (center of the A gap, near top)
      if (char === "A") {
        const centerX = cursorX + width / 2;
        // Eyes sit roughly at 70% height of the A (the triangular gap area)
        const eyeY = height * 0.65;
        const eyeZ = depth / 2 + 0.02;
        aPos.push([centerX, eyeY, eyeZ]);
      }

      cursorX += width + 0.25; // letter spacing
      result.push({ char, geo, x: cursorX - width });
    });

    // Merge all into one geometry
    const merged = mergeGeos(result.map(r => r.geo), false);
    merged.computeBoundingBox();
    const box = merged.boundingBox!;
    const cx = -(box.max.x - box.min.x) / 2 - box.min.x;
    const cy = -(box.max.y - box.min.y) / 2 - box.min.y;

    // Adjust A positions for centering
    const centeredAPos = aPos.map(([x, y, z]) => [x + cx, y + cy, z] as [number, number, number]);

    // Center the merged geometry
    merged.translate(cx, cy, 0);

    return { letters: { geometry: merged }, aPositions: centeredAPos };
  }, [font]);

  if (!letters || !letters.geometry) return null;

  // Set initial state
  const setGroupRef = (el: THREE.Group | null) => {
    groupRef.current = el;
    if (el && !startedRef.current) {
      el.rotation.y = Math.PI * 0.44;
      el.scale.set(1.8, 1.8, 1.8);
    }
  };

  return (
    <group ref={setGroupRef} position={[0, 1.0, 0]}>
      <mesh geometry={letters.geometry}>
        <meshStandardMaterial
          ref={materialRef}
          color="#e8e8e8"
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={0}
        />
      </mesh>
      {/* Eyes on each A */}
      {aPositions.map((pos, i) => (
        <EyePair key={i} position={pos} mouseRef={mouseRef} />
      ))}
    </group>
  );
}

// ---- Scene ----
function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 5, 8]} intensity={2.0} />
      <directionalLight position={[-5, 3, -3]} intensity={0.8} />
      <directionalLight position={[0, -2, 5]} intensity={0.4} />
      <pointLight position={[0, 0, 6]} intensity={0.5} color="#ffffff" />
      <Suspense fallback={null}>
        <DataTitle3D />
      </Suspense>
      <Particles count={500} />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#000000" }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
