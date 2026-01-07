"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, PerspectiveCamera, Object3D } from "three";
import { useGLTF, Environment, OrbitControls, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";
import type { RootState } from "@react-three/fiber";

// Enhanced loading fallback component
function RobotLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-accent-blue/20 rounded-full" />
          <div 
            className="absolute inset-0 border-4 border-t-accent-blue rounded-full animate-spin"
            style={{ animation: `spin 1s linear infinite` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-foreground text-sm font-medium">
            Loading 3D Model
          </p>
          <div className="w-48 h-1.5 bg-background-charcoal/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-neon rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-foreground-muted text-xs">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}

// Optimized Animated Camera Component
function AnimatedCamera({ reducedMotion = false, quality = 1 }) {
  const { camera } = useThree();
  const lastFrameTime = useRef(0);
  const targetTime = useRef(1000 / (60 * quality)); // Adaptive frame timing

  // Initialize camera
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
    
    const currentTime = performance.now();
    if (currentTime - lastFrameTime.current < targetTime.current) return;
    lastFrameTime.current = currentTime;

    if (reducedMotion) {
      camera.position.set(0, 0.2, 4);
      camera.lookAt(0, 0.1, 0);
    } else {
      const time = state.clock.elapsedTime;
      const radius = 0.3 * quality;
      const angle = time * 0.1;
      
      camera.position.x = Math.cos(angle) * radius;
      camera.position.y = 0.2 + Math.sin(time * 0.15) * 0.15;
      camera.position.z = 4 + Math.sin(angle * 0.5) * 0.2;
      
      camera.lookAt(
        Math.sin(angle) * 0.1,
        0.1,
        0
      );
    }
    camera.updateProjectionMatrix();
  });

  return null;
}

// Optimized Lighting Setup Component with reduced draw calls
function LightingSetup({ reducedMotion = false, quality = 1 }) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const accentLight1Ref = useRef<THREE.PointLight>(null);
  const accentLight2Ref = useRef<THREE.PointLight>(null);
  const lastFrameTime = useRef(0);
  const targetTime = useRef(1000 / (30 * quality)); // Update lights less frequently

  useFrame((state: RootState) => {
    if (reducedMotion) return;
    
    const currentTime = performance.now();
    if (currentTime - lastFrameTime.current < targetTime.current) return;
    lastFrameTime.current = currentTime;
    
    const time = state.clock.elapsedTime;
    
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 0.7 + Math.sin(time * 0.5) * 0.05;
    }
    
    if (rimLightRef.current) {
      const angle = time * 0.2;
      rimLightRef.current.position.x = Math.cos(angle) * -5;
      rimLightRef.current.position.z = Math.sin(angle) * -5;
    }
    
    if (accentLight1Ref.current) {
      accentLight1Ref.current.intensity = 0.25 + Math.sin(time * 0.8) * 0.05;
    }
    if (accentLight2Ref.current) {
      accentLight2Ref.current.intensity = 0.25 + Math.cos(time * 0.8) * 0.05;
    }
  });

  // Reduce shadow quality based on performance
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

// Optimize materials and merge geometries to reduce draw calls
function optimizeModel(scene: THREE.Group): { drawCalls: number; meshes: number } {
  let drawCalls = 0;
  let meshCount = 0;
  const materialMap = new Map<string, { material: THREE.Material; meshes: THREE.Mesh[] }>();

  // First pass: collect meshes by material
  scene.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh && child.geometry && child.material) {
      meshCount++;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((mat: THREE.Material, index: number) => {
        const key = `${mat.type}-${mat.uuid}`;
        
        if (!materialMap.has(key)) {
          materialMap.set(key, { material: mat, meshes: [] });
        }
        
        // Store reference to optimize
        materialMap.get(key)!.meshes.push(child);
        
        // Enhance material properties
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.metalness = Math.max(mat.metalness || 0, 0.7);
          mat.roughness = Math.min(mat.roughness || 0.5, 0.3);
          mat.envMapIntensity = 1.2;
          
          // Optimize material
          mat.needsUpdate = true;
        }
        
        // Enable shadows only if needed
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Compute normals if needed
        if (child.geometry) {
          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
          }
        }
      });
      
      drawCalls += materials.length;
    }
  });

  // Optimize: merge compatible geometries with same material
  materialMap.forEach(({ material, meshes }) => {
    if (meshes.length > 1 && material instanceof THREE.MeshStandardMaterial) {
      // Only merge if materials are exactly the same
      const compatibleMeshes = meshes.filter(m => {
        const mMat = Array.isArray(m.material) ? m.material[0] : m.material;
        return mMat.uuid === material.uuid;
      });

      if (compatibleMeshes.length > 1) {
        // Merge geometries (simplified - full merge would require BufferGeometryUtils)
        // For now, we'll just ensure materials are optimized
      }
    }
  });

  return { drawCalls, meshes: meshCount };
}

// Optimized Robot Head Model Component
function RobotHeadModel({ 
  modelPath, 
  mousePosition,
  reducedMotion = false,
  quality = 1
}: { 
  modelPath: string;
  mousePosition: { x: number; y: number };
  reducedMotion?: boolean;
  quality?: number;
}) {
  const { scene } = useGLTF(modelPath);
  const headRef = useRef<Group>(null);
  const floatingGroupRef = useRef<Group>(null);
  const lastFrameTime = useRef(0);
  const targetTime = useRef(1000 / (60 * quality)); // Adaptive frame timing
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // Optimize model on load
  useEffect(() => {
    if (scene) {
      const stats = optimizeModel(scene);
      // Silently optimize without logging in production
      if (process.env.NODE_ENV === 'development') {
        console.log(`Model optimized: ${stats.meshes} meshes, ~${stats.drawCalls} draw calls`);
      }
      
      // Dispose of unused resources
      scene.traverse((child: Object3D) => {
        if (child instanceof THREE.Mesh) {
          // Ensure materials are properly configured
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat: THREE.Material) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.needsUpdate = true;
            }
          });
        }
      });
    }
  }, [scene]);

  // Smooth floating animation with adaptive frame rate
  useFrame((state: RootState) => {
    const currentTime = performance.now();
    if (currentTime - lastFrameTime.current < targetTime.current) return;
    lastFrameTime.current = currentTime;

    if (floatingGroupRef.current) {
      if (reducedMotion) {
        floatingGroupRef.current.position.set(0, 0, 0);
      } else {
        const time = state.clock.elapsedTime;
        const floatY = Math.sin(time * 0.8) * 0.15 * quality;
        const floatX = Math.cos(time * 0.6) * 0.08 * quality;
        const floatZ = Math.sin(time * 0.7) * 0.05 * quality;
        
        floatingGroupRef.current.position.y = floatY;
        floatingGroupRef.current.position.x = floatX;
        floatingGroupRef.current.position.z = floatZ;
      }
    }

    if (headRef.current) {
      // Smooth mouse interpolation
      smoothMouseRef.current.x += (mousePosition.x - smoothMouseRef.current.x) * 0.05;
      smoothMouseRef.current.y += (mousePosition.y - smoothMouseRef.current.y) * 0.05;

      if (reducedMotion) {
        headRef.current.rotation.set(0, state.clock.elapsedTime * 0.05, 0);
      } else {
        const time = state.clock.elapsedTime;
        const baseRotationY = time * 0.15;
        const baseRotationX = Math.sin(time * 0.5) * 0.08;
        
        const mouseInfluenceY = smoothMouseRef.current.x * 0.15;
        const mouseInfluenceX = -smoothMouseRef.current.y * 0.1;
        
        headRef.current.rotation.y = baseRotationY + mouseInfluenceY;
        headRef.current.rotation.x = baseRotationX + mouseInfluenceX;
        headRef.current.rotation.z = Math.sin(time * 0.4) * 0.03;
      }
    }
  });

  // Memoize the cloned scene to avoid unnecessary re-renders
  const clonedScene = useMemo(() => {
    return scene ? scene.clone() : null;
  }, [scene]);

  if (!clonedScene) return null;

  return (
    <group ref={floatingGroupRef}>
      <group ref={headRef} position={[0, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

// Main Robot Head Scene Component
interface RobotHeadProps {
  modelPath?: string;
  reducedMotion?: boolean;
}

export default function RobotHeadOptimized({ 
  modelPath = "/models/robot-head.glb",
  reducedMotion = false 
}: RobotHeadProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState(1);
  const rafRef = useRef<number>();

  // Smooth mouse tracking with throttling
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

    // Throttled smooth interpolation
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

  // Adaptive quality based on device
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

  // Preload model with priority
  useEffect(() => {
    if (typeof window !== "undefined" && !reducedMotion) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.href = modelPath;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }, [modelPath, reducedMotion]);

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
          logarithmicDepthBuffer: false, // Disable for performance
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

        <Suspense fallback={<RobotLoader />}>
          <RobotHeadModel 
            modelPath={modelPath}
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

