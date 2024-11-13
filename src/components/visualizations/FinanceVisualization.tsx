import { useRef } from 'react';
import { Line, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { motion as motion3d } from 'framer-motion-3d';

const data = {
  moneyIn: { value: 1270000, color: '#4488ff' },
  moneyOut: { value: 645000, color: '#ff4444' },
  profit: { value: 625000, color: '#44ff88' }
};

const Bar = ({ position, height, color }: { position: [number, number, number]; height: number; color: string }) => {
  return (
    <motion3d.mesh
      position={position}
      scale={[0.6, height, 0.6]}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: height }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <boxGeometry />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </motion3d.mesh>
  );
};

const GridLines = ({ size, divisions, color }: { size: number; divisions: number; color: string }) => {
  return (
    <motion3d.group
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {[...Array(divisions + 1)].map((_, i) => {
        const pos = (i / divisions) * size - size / 2;
        return (
          <group key={i}>
            <Line
              points={[[pos, 0, -size/2], [pos, 0, size/2]]}
              color={color}
              lineWidth={1}
              transparent
              opacity={0.15}
            />
            <Line
              points={[[-size/2, 0, pos], [size/2, 0, pos]]}
              color={color}
              lineWidth={1}
              transparent
              opacity={0.15}
            />
          </group>
        );
      })}
    </motion3d.group>
  );
};

export function FinanceVisualization() {
  const groupRef = useRef<Group>(null);
  const maxValue = Math.max(...Object.values(data).map(d => d.value));
  const normalize = (value: number) => (value / maxValue) * 3;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1 + Math.PI / 6;
    }
  });

  return (
    <group position={[0, -1.5, -4]}>
      <motion3d.group
        ref={groupRef}
        initial={{ scale: 0, rotateX: 0 }}
        animate={{ 
          scale: 1.2,
          rotateX: Math.PI / 6,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        <GridLines size={4} divisions={8} color="#44ff88" />

        {Object.entries(data).map(([key, { value, color }], index) => {
          const x = (index - 1) * 1.2;
          return (
            <Bar
              key={key}
              position={[x, normalize(value) / 2, 0]}
              height={normalize(value)}
              color={color}
            />
          );
        })}

        {Object.entries(data).map(([key, { value, color }], index) => {
          const x = (index - 1) * 1.2;
          const height = normalize(value);
          return (
            <Text
              key={`label-${key}`}
              position={[x, height + 0.3, 0]}
              fontSize={0.25}
              color={color}
              anchorX="center"
              anchorY="bottom"
            >
              ${(value / 1000).toFixed(0)}k
            </Text>
          );
        })}
      </motion3d.group>
    </group>
  );
}