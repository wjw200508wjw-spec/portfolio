"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GlowSprite() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Ultra-soft radial glow
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.02, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.08, "rgba(240,245,255,0.6)");
    gradient.addColorStop(0.2, "rgba(180,200,240,0.2)");
    gradient.addColorStop(0.4, "rgba(80,120,180,0.05)");
    gradient.addColorStop(0.65, "rgba(20,40,80,0.01)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

interface CelestialBody {
  mesh: THREE.Mesh;
  speed: number;
  axis: THREE.Vector3;
  orbitRadius: number;
  baseAngle: number;
  yOffset: number;
}

function CelestialField() {
  const groupRef = useRef<THREE.Group>(null);
  const twinkleRef = useRef(0);
  const glowTexture = GlowSprite();
  const bodiesRef = useRef<CelestialBody[]>([]);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Create background stars (points) with glow texture
  const { starsGeo, planetData } = useMemo(() => {
    const starCount = 250;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const planets: { pos: THREE.Vector3; size: number; color: THREE.Color }[] = [];

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // Distribute across layers: near (4-7), mid (7-12), far (12-20)
      const layer = Math.random();
      let radius: number;
      if (layer < 0.15) {
        radius = 4 + Math.random() * 3;   // near - fewer, brighter
      } else if (layer < 0.5) {
        radius = 7 + Math.random() * 5;   // mid
      } else {
        radius = 12 + Math.random() * 8;  // far - many, dim
      }

      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.7;
      positions[i * 3 + 2] = Math.cos(phi) * radius;

      // Color temperature based on distance: near=warmer, far=cooler
      const dist = radius / 20;
      if (Math.random() < 0.1) {
        // Golden warm stars
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0.6;
      } else if (Math.random() < 0.2) {
        // Cool blue
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0;
      } else {
        // Neutral white-blue
        const b = 0.75 + (1 - dist) * 0.25;
        colors[i * 3] = b * 0.85; colors[i * 3 + 1] = b * 0.9; colors[i * 3 + 2] = b;
      }

      // Size: closer = larger, farther = smaller
      sizes[i] = (0.015 + (1 - dist) * 0.08) * (0.5 + Math.random() * 0.5);

      // Collect a few for planet meshes
      if (i < 12) {
        planets.push({
          pos: new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]),
          size: 0.03 + Math.random() * 0.08,
          color: new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]),
        });
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return { starsGeo: geo, planetData: planets };
  }, []);

  // Initialize orbiting celestial bodies on first render
  const initialized = useRef(false);
  if (!initialized.current && groupRef.current) {
    planetData.forEach((p) => {
      const sphereGeo = new THREE.SphereGeometry(p.size, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.copy(p.pos);
      groupRef.current!.add(mesh);
      bodiesRef.current.push({
        mesh,
        speed: 0.02 + Math.random() * 0.08,
        axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        orbitRadius: p.pos.length(),
        baseAngle: Math.random() * Math.PI * 2,
        yOffset: p.pos.y,
      });
    });
    initialized.current = true;
  }

  const starsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    // Slow rotation of starfield
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.015;
      starsRef.current.rotation.x += delta * 0.006;
    }

    // Orbit the planet meshes
    bodiesRef.current.forEach((b) => {
      b.baseAngle += delta * b.speed;
      b.mesh.position.x = Math.cos(b.baseAngle) * b.orbitRadius;
      b.mesh.position.z = Math.sin(b.baseAngle) * b.orbitRadius;
      b.mesh.position.y = b.yOffset + Math.sin(b.baseAngle * 0.5) * 0.3;
    });

    // Subtle twinkle on stars
    if (materialRef.current) {
      twinkleRef.current += delta * 0.3;
      materialRef.current.opacity = 0.6 + Math.sin(twinkleRef.current) * 0.08;
    }

    // Globe group slow rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={starsRef} geometry={starsGeo}>
        <pointsMaterial
          ref={materialRef}
          map={glowTexture}
          size={0.3}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#000000" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <CelestialField />
      </Canvas>
    </div>
  );
}
