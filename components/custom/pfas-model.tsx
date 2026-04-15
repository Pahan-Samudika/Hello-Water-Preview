"use client";

import React, { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, ContactShadows, OrbitControls, Center } from "@react-three/drei";
import * as THREE from "three";

const COLORS = {
  CARBON: "#404040",   // Dark Gray
  FLUORINE: "#a3e635", // Lime Green
  SULFUR: "#fbbf24",   // Orange
  OXYGEN: "#ef4444",   // Red
  HYDROGEN: "#e5e7eb", // Light Gray
  BOND: "#94a3b8",     // Slate Gray
};

const ATOM_SIZES = {
  CARBON: 0.35,
  FLUORINE: 0.3,
  SULFUR: 0.5,
  OXYGEN: 0.35,
  HYDROGEN: 0.2,
};

const Atom = ({ position, color, size }: { position: THREE.Vector3; color: string; size: number }) => (
  <mesh position={position}>
    <sphereGeometry args={[size, 32, 32]} />
    <meshStandardMaterial 
        color={color} 
        roughness={0.2} 
        metalness={0.4} 
        emissive={color}
        emissiveIntensity={0.05}
    />
  </mesh>
);

const SingleBond = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const { midpoint, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { midpoint: mid, quaternion: quat, length: len };
  }, [start, end]);

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.07, 0.07, length, 12]} />
      <meshStandardMaterial color={COLORS.BOND} roughness={0.3} metalness={0.5} />
    </mesh>
  );
};

const DoubleBond = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const { midpoint, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { midpoint: mid, quaternion: quat, length: len };
  }, [start, end]);

  return (
    <group position={midpoint} quaternion={quaternion}>
      <mesh position={[0.1, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, length, 12]} />
        <meshStandardMaterial color={COLORS.BOND} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[-0.1, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, length, 12]} />
        <meshStandardMaterial color={COLORS.BOND} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
};

const PFOSMolecule = () => {
  const data = useMemo(() => {
    const atoms: { pos: THREE.Vector3; color: string; size: number; id: string }[] = [];
    const sBonds: [THREE.Vector3, THREE.Vector3][] = [];
    const dBonds: [THREE.Vector3, THREE.Vector3][] = [];

    // Configuration
    const cBondLen = 1.15;
    const fBondLen = 0.95;
    const sBondLen = 1.4;
    const oBondLen = 1.0;

    const cPos: THREE.Vector3[] = [];

    // 1. Generate Carbon Chain with proper tetrahedral angles
    // Tetrahedral angle ~109.5 deg. In our simplified 3D zigzag:
    const angleRad = (109.5 * Math.PI) / 180;
    const stepX = cBondLen * Math.sin(angleRad / 2);
    const stepY = cBondLen * Math.cos(angleRad / 2);

    for (let i = 0; i < 8; i++) {
        const x = i * stepX - 3.5;
        const y = (i % 2 === 0) ? -stepY / 2 : stepY / 2;
        const z = (i % 4 < 2) ? 0.2 : -0.2; // 3D twist
        cPos.push(new THREE.Vector3(x, y, z));
        atoms.push({ pos: cPos[i], color: COLORS.CARBON, size: ATOM_SIZES.CARBON, id: `c-${i}` });
        if (i > 0) sBonds.push([cPos[i-1], cPos[i]]);
    }

    // 2. Add Fluorines based on tetrahedral remaining vectors
    cPos.forEach((c, i) => {
        const isPeak = (i % 2 !== 0);
        const fY = isPeak ? stepY : -stepY;
        const fZ = 0.7;

        if (i === 0) {
            // CF3
            atoms.push({ pos: new THREE.Vector3(c.x - fBondLen, c.y, c.z), color: COLORS.FLUORINE, size: ATOM_SIZES.FLUORINE, id: `f-${i}-1` });
            atoms.push({ pos: new THREE.Vector3(c.x, c.y + fY, c.z + fZ), color: COLORS.FLUORINE, size: ATOM_SIZES.FLUORINE, id: `f-${i}-2` });
            atoms.push({ pos: new THREE.Vector3(c.x, c.y + fY, c.z - fZ), color: COLORS.FLUORINE, size: ATOM_SIZES.FLUORINE, id: `f-${i}-3` });
        } else {
            // CF2
            atoms.push({ pos: new THREE.Vector3(c.x, c.y + fY, c.z + fZ), color: COLORS.FLUORINE, size: ATOM_SIZES.FLUORINE, id: `f-${i}-1` });
            atoms.push({ pos: new THREE.Vector3(c.x, c.y + fY, c.z - fZ), color: COLORS.FLUORINE, size: ATOM_SIZES.FLUORINE, id: `f-${i}-2` });
        }
    });

    // Add C-F Bonds
    atoms.filter(a => a.id.startsWith('f-')).forEach(f => {
        const cIdx = parseInt(f.id.split('-')[1]);
        sBonds.push([cPos[cIdx], f.pos]);
    });

    // 3. Sulfonyl Group (-SO3H)
    const lastC = cPos[7];
    const sPos = new THREE.Vector3(lastC.x + sBondLen, lastC.y, lastC.z);
    atoms.push({ pos: sPos, color: COLORS.SULFUR, size: ATOM_SIZES.SULFUR, id: 'sulfur' });
    sBonds.push([lastC, sPos]);

    // Oxygens: 2 double bonded, 1 single bonded to H
    const oTop = new THREE.Vector3(sPos.x + 0.3, sPos.y + 0.9, sPos.z + 0.4);
    const oBottom = new THREE.Vector3(sPos.x + 0.3, sPos.y - 0.9, sPos.z - 0.4);
    const oRight = new THREE.Vector3(sPos.x + 1.1, sPos.y, sPos.z + 0.1);

    atoms.push({ pos: oTop, color: COLORS.OXYGEN, size: ATOM_SIZES.OXYGEN, id: 'o-1' });
    atoms.push({ pos: oBottom, color: COLORS.OXYGEN, size: ATOM_SIZES.OXYGEN, id: 'o-2' });
    atoms.push({ pos: oRight, color: COLORS.OXYGEN, size: ATOM_SIZES.OXYGEN, id: 'o-3' });

    dBonds.push([sPos, oTop]);
    dBonds.push([sPos, oBottom]);
    sBonds.push([sPos, oRight]);

    const hPos = new THREE.Vector3(oRight.x + 0.5, oRight.y + 0.2, oRight.z + 0.2);
    atoms.push({ pos: hPos, color: COLORS.HYDROGEN, size: ATOM_SIZES.HYDROGEN, id: 'h' });
    sBonds.push([oRight, hPos]);

    return { atoms, sBonds, dBonds };
  }, []);

  return (
    <group>
      {data.sBonds.map((pair, i) => <SingleBond key={`sb-${i}`} start={pair[0]} end={pair[1]} />)}
      {data.dBonds.map((pair, i) => <DoubleBond key={`db-${i}`} start={pair[0]} end={pair[1]} />)}
      {data.atoms.map(a => <Atom key={a.id} position={a.pos} color={a.color} size={a.size} />)}
    </group>
  );
};

export const PFASModel = () => {
  return (
    <div className="h-full w-full min-h-[300px] sm:min-h-[300px] lg:min-h-[400px]">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={40} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#3b82f6" />
        
        <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
          <Center>
            <PFOSMolecule />
          </Center>
        </Float>

        <OrbitControls enableZoom={false} enableRotate={false} makeDefault />
        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={15} blur={2.5} far={5} />
      </Canvas>
    </div>
  );
};
