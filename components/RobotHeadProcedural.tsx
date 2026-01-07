"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, PerspectiveCamera, Object3D, BoxGeometry, CylinderGeometry, SphereGeometry, MeshStandardMaterial } from "three";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { RootState } from "@react-three/fiber";

// Procedural Robot Head Component
function ProceduralRobotHead({ 
  mousePosition,
  reducedMotion = false,
  quality = 1
}: { 
  mousePosition: { x: number; y: number };
  reducedMotion?: boolean;
  quality?: number;
}) {
  const headRef = useRef<Group>(null);
  const floatingGroupRef = useRef<Group>(null);
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // Smooth floating animation - stabilized to prevent vibration
  useFrame((state: RootState) => {
    // Use delta time for smooth, frame-independent animations
    const delta = state.clock.getDelta();
    const elapsedTime = state.clock.elapsedTime;

    if (floatingGroupRef.current) {
      if (reducedMotion) {
        floatingGroupRef.current.position.set(0, 0, 0);
      } else {
        // Smooth floating animation
        const floatY = Math.sin(elapsedTime * 0.8) * 0.15 * quality;
        const floatX = Math.cos(elapsedTime * 0.6) * 0.08 * quality;
        const floatZ = Math.sin(elapsedTime * 0.7) * 0.05 * quality;
        
        // Use lerp for smooth position updates
        floatingGroupRef.current.position.lerp(
          new THREE.Vector3(floatX, floatY, floatZ),
          0.1
        );
      }
    }

    if (headRef.current) {
      // Smooth mouse interpolation - updated less frequently
      smoothMouseRef.current.x += (mousePosition.x - smoothMouseRef.current.x) * 0.03;
      smoothMouseRef.current.y += (mousePosition.y - smoothMouseRef.current.y) * 0.03;

      if (reducedMotion) {
        // Simple steady rotation
        headRef.current.rotation.y = elapsedTime * 0.05;
      } else {
        // Stable rotation calculations - avoid rapid updates
        const baseRotationY = elapsedTime * 0.15;
        const baseRotationX = Math.sin(elapsedTime * 0.5) * 0.08;
        
        // Reduced mouse influence for stability
        const mouseInfluenceY = smoothMouseRef.current.x * 0.1;
        const mouseInfluenceX = -smoothMouseRef.current.y * 0.08;
        
        // Direct assignment instead of multiple updates
        headRef.current.rotation.set(
          baseRotationX + mouseInfluenceX,
          baseRotationY + mouseInfluenceY,
          Math.sin(elapsedTime * 0.4) * 0.03
        );
      }
    }
  });

  // Robot head materials
  const headMaterial = useMemo(() => new MeshStandardMaterial({
    color: "#4a5568",
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1.2,
  }), []);

  const eyeMaterial = useMemo(() => new MeshStandardMaterial({
    color: "#00d4ff",
    emissive: "#00d4ff",
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const accentMaterial = useMemo(() => new MeshStandardMaterial({
    color: "#a855f7",
    metalness: 0.7,
    roughness: 0.3,
  }), []);

  return (
    <group ref={floatingGroupRef}>
      <group ref={headRef} position={[0, 0, 0]}>
        {/* Main head (rounded cube) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.2, 1]} />
          <primitive object={headMaterial} attach="material" />
        </mesh>

        {/* Top antenna/crown */}
        <mesh castShadow position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
        <mesh castShadow position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        {/* Left eye */}
        <mesh castShadow position={[-0.3, 0.2, 0.55]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        {/* Right eye */}
        <mesh castShadow position={[0.3, 0.2, 0.55]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        {/* Mouth/grill */}
        <mesh castShadow position={[0, -0.3, 0.55]}>
          <boxGeometry args={[0.6, 0.15, 0.1]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        {/* Side accents */}
        <mesh castShadow position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
        <mesh castShadow position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>

        {/* Cheek accents */}
        <mesh castShadow position={[-0.5, -0.1, 0.52]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
        <mesh castShadow position={[0.5, -0.1, 0.52]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

// Optimized Animated Camera Component
function AnimatedCamera({ reducedMotion = false, quality = 1 }) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.position.set(0, 0.2, 4);
      camera.fov = 45;
      camera.near = 0.1;
      camera.far = 100;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((state: RootState) => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const elapsedTime = state.clock.elapsedTime;

    if (reducedMotion) {
      camera.position.set(0, 0.2, 4);
      camera.lookAt(0, 0.1, 0);
    } else {
      // Smooth, stable camera movement
      const radius = 0.3 * quality;
      const angle = elapsedTime * 0.1;
      
      // Calculate target position
      const targetX = Math.cos(angle) * radius;
      const targetY = 0.2 + Math.sin(elapsedTime * 0.15) * 0.15;
      const targetZ = 4 + Math.sin(angle * 0.5) * 0.2;
      
      // Smooth lerp to target position to prevent jitter
      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
      
      // Smooth lookAt
      camera.lookAt(
        Math.sin(angle) * 0.1,
        0.1,
        0
      );
    }
  });

  return null;
}

// Optimized Lighting Setup
function LightingSetup({ reducedMotion = false, quality = 1 }) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const accentLight1Ref = useRef<THREE.PointLight>(null);
  const accentLight2Ref = useRef<THREE.PointLight>(null);
  const lastFrameTime = useRef(0);
  const targetTime = useRef(33); // ~30fps for lighting updates

  useFrame((state: RootState) => {
    if (reducedMotion) return;
    
    // Throttle light updates to reduce jitter
    const currentTime = performance.now();
    if (currentTime - lastFrameTime.current < targetTime.current) return;
    lastFrameTime.current = currentTime;
    
    const elapsedTime = state.clock.elapsedTime;
    
    // Smooth light intensity updates
    if (keyLightRef.current) {
      const targetIntensity = 0.7 + Math.sin(elapsedTime * 0.5) * 0.05;
      keyLightRef.current.intensity += (targetIntensity - keyLightRef.current.intensity) * 0.1;
    }
    
    // Smooth rim light movement
    if (rimLightRef.current) {
      const angle = elapsedTime * 0.2;
      const targetX = Math.cos(angle) * -5;
      const targetZ = Math.sin(angle) * -5;
      
      rimLightRef.current.position.lerp(new THREE.Vector3(targetX, rimLightRef.current.position.y, targetZ), 0.1);
    }
    
    // Smooth accent light intensity
    if (accentLight1Ref.current) {
      const targetIntensity = 0.25 + Math.sin(elapsedTime * 0.8) * 0.05;
      accentLight1Ref.current.intensity += (targetIntensity - accentLight1Ref.current.intensity) * 0.1;
    }
    if (accentLight2Ref.current) {
      const targetIntensity = 0.25 + Math.cos(elapsedTime * 0.8) * 0.05;
      accentLight2Ref.current.intensity += (targetIntensity - accentLight2Ref.current.intensity) * 0.1;
    }
  });

  const shadowMapSize = quality > 0.8 ? 1024 : quality > 0.6 ? 512 : 256;

  return (
    <>
      <ambientLight intensity={0.25} color="#ffffff" />
      
      <directionalLight
        ref={keyLightRef}
        position={[2, 4, 5]}
        intensity={0.7}
        color="#b8a5ff"
        castShadow={quality > 0.6}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      
      <directionalLight
        ref={rimLightRef}
        position={[-5, 2, -5]}
        intensity={0.6}
        color="#7dd3fc"
        castShadow={false}
      />
      
      <directionalLight
        position={[5, 1, -4]}
        intensity={0.4}
        color="#a855f7"
        castShadow={false}
      />
      
      {quality > 0.7 && (
        <>
          <pointLight
            ref={accentLight1Ref}
            position={[3, 3, 3]}
            intensity={0.25}
            color="#00d4ff"
            distance={10}
            decay={2}
          />
          
          <pointLight
            ref={accentLight2Ref}
            position={[-3, 3, 3]}
            intensity={0.25}
            color="#a855f7"
            distance={10}
            decay={2}
          />
        </>
      )}
      
      <hemisphereLight
        intensity={0.15}
        color="#ffffff"
        groundColor="#1a1a1a"
      />
    </>
  );
}

interface RobotHeadProceduralProps {
  reducedMotion?: boolean;
}

export default function RobotHeadProcedural({ 
  reducedMotion = false 
}: RobotHeadProceduralProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState(1);
  const rafRef = useRef<number>();

  // Smooth mouse tracking
  useEffect(() => {
    if (reducedMotion) return;
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      targetX = ((e.clientX - centerX) / (rect.width / 2)) * 0.5;
      targetY = ((e.clientY - centerY) / (rect.height / 2)) * 0.5;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      
      setMousePosition({ x: currentX, y: currentY });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  // Adaptive quality
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkPerformance = () => {
      const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const isMobile = window.innerWidth < 768;
      
      if (isLowEnd || isMobile) {
        setQuality(0.6);
      } else {
        setQuality(1);
      }
    };

    checkPerformance();
    window.addEventListener("resize", checkPerformance);
    return () => window.removeEventListener("resize", checkPerformance);
  }, []);

  const canvasQuality = reducedMotion ? 0.5 : quality;

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        gl={{ 
          antialias: canvasQuality > 0.7,
          alpha: true,
          powerPreference: reducedMotion ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
        }}
        dpr={canvasQuality > 0.8 ? [1, 2] : canvasQuality > 0.6 ? [1, 1.5] : 1}
        performance={{ 
          min: canvasQuality > 0.7 ? 0.8 : 0.5,
          max: 0.95,
          debounce: 200
        }}
        shadows={canvasQuality > 0.6}
        frameloop="always"
      >
        <AnimatedCamera reducedMotion={reducedMotion} quality={canvasQuality} />

        <LightingSetup reducedMotion={reducedMotion} quality={canvasQuality} />

        <Suspense fallback={null}>
          <ProceduralRobotHead 
            mousePosition={mousePosition}
            reducedMotion={reducedMotion}
            quality={canvasQuality}
          />
        </Suspense>

        {canvasQuality > 0.7 && (
          <Environment preset="city" />
        )}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

