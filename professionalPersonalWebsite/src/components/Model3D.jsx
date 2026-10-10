import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TURNS = 16;
const PTS_PER_TURN = 90;
const RADIUS = 1.05;
const TOTAL_HEIGHT = 32;
const RIBBON_WIDTH = 0.38;
const TOTAL_PTS = TURNS * PTS_PER_TURN;
const RUNG_EVERY = 18;

function buildGeometries() {
  const ribbonPos = [];
  const ribbonIdx = [];
  const edge1Pos = [];
  const edge2Pos = [];
  const rungPos = [];
  const nodePos = [];

  for (let i = 0; i <= TOTAL_PTS; i++) {
    const t = i / TOTAL_PTS;
    const angle = t * TURNS * Math.PI * 2;
    const y = (t - 0.5) * TOTAL_HEIGHT;

    const x = Math.cos(angle) * RADIUS;
    const z = Math.sin(angle) * RADIUS;

    // Helix tangent (un-normalised, then normalised)
    const da = (TURNS * Math.PI * 2) / TOTAL_PTS;
    const dy = TOTAL_HEIGHT / TOTAL_PTS;
    const tx = -Math.sin(angle) * RADIUS * da;
    const ty = dy;
    const tz = Math.cos(angle) * RADIUS * da;
    const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz);
    const Tx = tx / tLen, Ty = ty / tLen, Tz = tz / tLen;

    // Radial outward normal
    const Nx = Math.cos(angle), Ny = 0, Nz = Math.sin(angle);

    // Binormal = T × N  →  ribbon width direction
    let Bx = Ty * Nz - Tz * Ny;
    let By = Tz * Nx - Tx * Nz;
    let Bz = Tx * Ny - Ty * Nx;
    const bLen = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
    Bx /= bLen; By /= bLen; Bz /= bLen;

    const half = RIBBON_WIDTH / 2;
    const v1x = x + Bx * half, v1y = y + By * half, v1z = z + Bz * half;
    const v2x = x - Bx * half, v2y = y - By * half, v2z = z - Bz * half;

    ribbonPos.push(v1x, v1y, v1z, v2x, v2y, v2z);
    edge1Pos.push(v1x, v1y, v1z);
    edge2Pos.push(v2x, v2y, v2z);

    if (i % RUNG_EVERY === 0) {
      rungPos.push(v1x, v1y, v1z, v2x, v2y, v2z);
      nodePos.push([v1x, v1y, v1z], [v2x, v2y, v2z]);
    }

    if (i < TOTAL_PTS) {
      const b = i * 2;
      ribbonIdx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
    }
  }

  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribbonPos, 3));
  ribbonGeo.setIndex(ribbonIdx);
  ribbonGeo.computeVertexNormals();

  const edge1Geo = new THREE.BufferGeometry();
  edge1Geo.setAttribute('position', new THREE.Float32BufferAttribute(edge1Pos, 3));

  const edge2Geo = new THREE.BufferGeometry();
  edge2Geo.setAttribute('position', new THREE.Float32BufferAttribute(edge2Pos, 3));

  const rungGeo = new THREE.BufferGeometry();
  rungGeo.setAttribute('position', new THREE.Float32BufferAttribute(rungPos, 3));

  return { ribbonGeo, edge1Geo, edge2Geo, rungGeo, nodePos };
}

// Instanced glowing dots at rung endpoints
function Nodes({ positions, parentRef }) {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.07);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#fdf2f8" />
    </instancedMesh>
  );
}

function SpiralRibbon({ scrollY }) {
  const groupRef = useRef();
  const { ribbonGeo, edge1Geo, edge2Geo, rungGeo, nodePos } = useMemo(buildGeometries, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Scroll lifts the ribbon so you travel through it
    const targetY = -scrollY * 0.0028;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.055
    );

    // Scroll + constant Y spin
    const targetRotY = scrollY * 0.002;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.055
    );
    groupRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group ref={groupRef}>
      {/* Ribbon face */}
      <mesh geometry={ribbonGeo}>
        <meshStandardMaterial
          color="#ec4899"
          emissive="#be185d"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Glowing edge lines */}
      <primitive object={new THREE.Line(edge1Geo, new THREE.LineBasicMaterial({ color: '#f9a8d4' }))} />
      <primitive object={new THREE.Line(edge2Geo, new THREE.LineBasicMaterial({ color: '#f9a8d4' }))} />

      {/* Horizontal rung connections */}
      <primitive object={new THREE.LineSegments(rungGeo, new THREE.LineBasicMaterial({ color: '#ec4899', transparent: true, opacity: 0.55 }))} />

      {/* Node dots */}
      <Nodes positions={nodePos} />
    </group>
  );
}

export default function Model3D() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 75 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 4, 4]} color="#ec4899" intensity={5} />
      <pointLight position={[-4, -4, 3]} color="#7c3aed" intensity={2.5} />

      <SpiralRibbon scrollY={scrollY} />
    </Canvas>
  );
}
