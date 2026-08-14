"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const createSnowTexture = () => {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.translate(32, 32);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    
    // Add a soft glow
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";

    // Draw a 6-point snowflake
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -24);
      
      // Add small branches to each arm
      ctx.moveTo(0, -10);
      ctx.lineTo(6, -16);
      ctx.moveTo(0, -10);
      ctx.lineTo(-6, -16);
      
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
  }
  return new THREE.CanvasTexture(canvas);
};

const SnowParticles = ({ count = 1500 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create texture once
  const snowTexture = useMemo(() => createSnowTexture(), []);

  // Generate initial state
  const { positions, basePositions, velocities, orbitParams } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const orbitParams = new Float32Array(count * 4); // radiusX, radiusZ, speed, phase
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = Math.random() * 30 - 15;
      const z = (Math.random() - 0.5) * 15;
      
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      const isFront = z > 2;
      velocities[i] = isFront ? 0.003 + Math.random() * 0.007 : 0.01 + Math.random() * 0.04;
      
      orbitParams[i * 4] = Math.random() * 0.4;       // Random X orbit radius
      orbitParams[i * 4 + 1] = Math.random() * 0.4;   // Random Z orbit radius
      orbitParams[i * 4 + 2] = 0.5 + Math.random();   // Orbit speed
      orbitParams[i * 4 + 3] = Math.random() * Math.PI * 2; // Orbit phase
    }
    return { positions, basePositions, velocities, orbitParams };
  }, [count]);

  // Animate the particles
  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        // Fall downwards on the base Y axis
        basePositions[i * 3 + 1] -= velocities[i];
        
        // Reset particle to top with new random positions when it falls out of view
        if (basePositions[i * 3 + 1] < -15) {
          basePositions[i * 3 + 1] = 15;
          basePositions[i * 3] = (Math.random() - 0.5) * 30; // Randomize X again
          basePositions[i * 3 + 2] = (Math.random() - 0.5) * 15; // Randomize Z again
        }

        // Apply 3D orbital motion
        const radX = orbitParams[i * 4];
        const radZ = orbitParams[i * 4 + 1];
        const speed = orbitParams[i * 4 + 2];
        const phase = orbitParams[i * 4 + 3];
        
        pos[i * 3] = basePositions[i * 3] + Math.cos(time * speed + phase) * radX;
        pos[i * 3 + 1] = basePositions[i * 3 + 1];
        pos[i * 3 + 2] = basePositions[i * 3 + 2] + Math.sin(time * speed + phase) * radZ;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        map={snowTexture || undefined}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const Snowfall = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-70" style={{ pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ pointerEvents: "none" }} eventSource={undefined}>
        <SnowParticles count={1000} />
      </Canvas>
    </div>
  );
};
