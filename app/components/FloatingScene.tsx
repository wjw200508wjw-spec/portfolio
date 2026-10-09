"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";
import { useMotionSettings } from "./MotionSystem";

function Lighting() {
  const { gl } = useThree();
  const environment = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    room.dispose(); pmrem.dispose();
    return target;
  }, [gl]);
  useEffect(() => () => environment.dispose(), [environment]);
  return <><primitive object={environment.texture} attach="environment" /><ambientLight intensity={1.3} /><directionalLight position={[-4, 5, 4]} intensity={4} color="#d8b4fe" /><pointLight position={[4, -2, 3]} intensity={45} color="#80dfff" /></>;
}
function Objects({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const compact = size.width < 850;
  const side = viewport.width * .33;
  const positions: [number,number,number][] = compact
    ? [[-side,-.35,0],[side,.9,-.4],[side*.85,-1.35,0],[-side*.85,1.3,-.8]]
    : [[-3.3,-.2,0],[3.2,.65,-.4],[2.1,-.85,0],[-2.2,.8,-.8]];
  useFrame(({ clock }) => {
    if (!group.current || !animate) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, index) => {
      child.rotation.x = Math.sin(t * 0.24 + index) * 0.3 + index * 0.45;
      child.rotation.y = t * 0.16 + index;
      child.rotation.z = Math.sin(t * 0.18 + index) * 0.25;
      child.position.y = positions[index][1] + Math.sin(t * 0.7 + index * 1.8) * (compact ? .1 : .17);
    });
  });
  const material = <meshPhysicalMaterial color="#9a70fa" metalness={0.85} roughness={0.14} iridescence={1} iridescenceIOR={1.5} clearcoat={1} envMapIntensity={1.5} />;
  return <group ref={group}>
    <mesh position={positions[0]} scale={compact ? .72 : 1} rotation={[0.4, 0.1, -0.6]}><torusGeometry args={[0.62, 0.2, 24, 64]} />{material}</mesh>
    <mesh position={positions[1]} scale={compact ? .72 : 1} rotation={[0.4, 0.8, 0]}><torusKnotGeometry args={[0.52, 0.17, 80, 12]} />{material}</mesh>
    <RoundedBox position={positions[2]} scale={compact ? .82 : 1} args={[0.65, 0.65, 0.65]} radius={0.1} smoothness={3} rotation={[0.5, 0.5, 0.2]}>{material}</RoundedBox>
    <mesh position={positions[3]} scale={compact ? .8 : 1} rotation={[0.2, 0.5, 0.5]}><octahedronGeometry args={[0.45, 0]} />{material}</mesh>
  </group>;
}
export default function FloatingScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const { paused, reduced } = useMotionSettings();
  const animate = visible && tabVisible && !paused && !reduced;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    const change = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", change); };
  }, []);
  return <div ref={ref} className="scene-canvas"><Canvas camera={{ position: [0, 0, 7], fov: 44 }} dpr={[1, 1.5]} frameloop={animate ? "always" : "demand"} gl={{ alpha: true, antialias: true }} fallback={<div className="scene-fallback"><i /><i /><i /></div>}><Lighting /><Objects animate={animate} /></Canvas></div>;
}
