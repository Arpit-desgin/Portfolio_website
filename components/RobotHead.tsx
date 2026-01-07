"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Mesh, Group, MeshStandardMaterial, PerspectiveCamera } from "three";
import { useGLTF, Environment, OrbitControls, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";

// Loading fallback component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
        <p className="text-foreground-muted text-sm">
          Loading model... {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

// Animated Camera Component
function AnimatedCamera({ reducedMotion = false }) {
  const { camera } = useThree();
  const cameraRef = useRef<PerspectiveCamera>(null);

  useFrame((state) => {
    if (cameraRef.current) {
      if (reducedMotion) {
        // Minimal camera movement on mobile
        cameraRef.current.position.set(0, 0.2, 4);
        cameraRef.current.lookAt(0, 0.1, 0);
      } else {
        // Slow camera position shift for cinematic feel
        const time = state.clock.elapsedTime;
        
        // Circular motion around the robot (subtle)
        const radius = 0.3;
        const angle = time * 0.1; // Slow rotation
        
        cameraRef.current.position.x = Math.cos(angle) * radius;
        cameraRef.current.position.y = 0.2 + Math.sin(time * 0.15) * 0.15; // Vertical breathing
        cameraRef.current.position.z = 4 + Math.sin(angle * 0.5) * 0.2; // Slight zoom variation
        
        // Camera looks at robot with slight offset
        cameraRef.current.lookAt(
          Math.sin(angle) * 0.1,
          0.1,
          0
        );
      }
    }
  });

  return (
    <perspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={45}
      near={0.1}
      far={100}
      position={[0, 0.2, 4]}
    />
  );
}

// Lighting Setup Component
function LightingSetup({ reducedMotion = false }) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const accentLight1Ref = useRef<THREE.PointLight>(null);
  const accentLight2Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return; // Skip animations on mobile
    
    const time = state.clock.elapsedTime;
    
    // Subtle key light intensity variation
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 0.7 + Math.sin(time * 0.5) * 0.05;
    }
    
    // Rim light subtle movement
    if (rimLightRef.current) {
      const angle = time * 0.2;
      rimLightRef.current.position.x = Math.cos(angle) * -5;
      rimLightRef.current.position.z = Math.sin(angle) * -5;
    }
    
    // Accent lights subtle pulse
    if (accentLight1Ref.current) {
      accentLight1Ref.current.intensity = 0.25 + Math.sin(time * 0.8) * 0.05;
    }
    if (accentLight2Ref.current) {
      accentLight2Ref.current.intensity = 0.25 + Math.cos(time * 0.8) * 0.05;
    }
  });

  return (
    <>
      {/* Minimal ambient light for base illumination */}
      <ambientLight intensity={0.25} color="#ffffff" />
      
      {/* Soft key light from front - main illumination */}
      <directionalLight
        ref={keyLightRef}
        position={[2, 4, 5]}
        intensity={0.7}
        color="#b8a5ff" // Soft purple
        castShadow
        shadow-mapSize-width={reducedMotion ? 512 : 1024}
        shadow-mapSize-height={reducedMotion ? 512 : 1024}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      
      {/* Rim light from side/back for silhouette glow */}
      <directionalLight
        ref={rimLightRef}
        position={[-5, 2, -5]}
        intensity={0.6}
        color="#7dd3fc" // Soft blue
        castShadow={false}
      />
      
      {/* Additional rim light from opposite side */}
      <directionalLight
        position={[5, 1, -4]}
        intensity={0.4}
        color="#a855f7" // Soft purple
        castShadow={false}
      />
      
      {/* Accent point lights for depth and color */}
      <pointLight
        ref={accentLight1Ref}
        position={[3, 3, 3]}
        intensity={0.25}
        color="#00d4ff" // Cyan blue
        distance={10}
        decay={2}
      />
      
      <pointLight
        ref={accentLight2Ref}
        position={[-3, 3, 3]}
        intensity={0.25}
        color="#a855f7" // Purple
        distance={10}
        decay={2}
      />
      
      {/* Subtle fill light from below */}
      <hemisphereLight
        intensity={0.15}
        color="#ffffff"
        groundColor="#1a1a1a"
      />
    </>
  );
}

// Optimize and enhance materials
function enhanceMaterials(scene: THREE.Group) {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Enable shadows
      child.castShadow = true;
      child.receiveShadow = true;

      // Enhance materials
      if (child.material instanceof THREE.MeshStandardMaterial) {
        // Improve material properties for better shading
        child.material.metalness = Math.max(child.material.metalness || 0, 0.7);
        child.material.roughness = Math.min(child.material.roughness || 0.5, 0.3);
        child.material.envMapIntensity = 1.2;
        
        // Enable smooth shading
        if (child.geometry) {
          child.geometry.computeVertexNormals();
        }
      } else if (Array.isArray(child.material)) {
        // Handle multi-material meshes
        child.material.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.metalness = Math.max(mat.metalness || 0, 0.7);
            mat.roughness = Math.min(mat.roughness || 0.5, 0.3);
            mat.envMapIntensity = 1.2;
          }
        });
      }
    }
  });
}

// Robot Head Model Component (loaded from GLTF)
function RobotHeadModel({ 
  modelPath, 
  mousePosition,
  reducedMotion = false
}: { 
  modelPath: string;
  mousePosition: { x: number; y: number };
  reducedMotion?: boolean;
}) {
  const { scene } = useGLTF(modelPath);
  const headRef = useRef<Group>(null);
  const floatingGroupRef = useRef<Group>(null);

  // Optimize and enhance the loaded model
  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid modifying the original
      const clonedScene = scene.clone();
      
      // Enhance materials and enable shadows
      enhanceMaterials(clonedScene);
      
      // Update the scene reference
      if (headRef.current) {
        headRef.current.clear();
        headRef.current.add(clonedScene);
      }
    }
  }, [scene]);

  // Smooth floating animation (breathing/hovering effect)
  useFrame((state) => {
    if (floatingGroupRef.current) {
      if (reducedMotion) {
        // Minimal movement on mobile
        floatingGroupRef.current.position.set(0, 0, 0);
      } else {
        // Slow vertical floating (breathing effect)
        const floatY = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
        // Subtle horizontal drift
        const floatX = Math.cos(state.clock.elapsedTime * 0.6) * 0.08;
        // Subtle Z-axis movement
        const floatZ = Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
        
        floatingGroupRef.current.position.y = floatY;
        floatingGroupRef.current.position.x = floatX;
        floatingGroupRef.current.position.z = floatZ;
      }
    }

    if (headRef.current) {
      if (reducedMotion) {
        // Minimal rotation on mobile
        headRef.current.rotation.set(0, state.clock.elapsedTime * 0.05, 0);
      } else {
        // Slow continuous Y-axis rotation
        const baseRotationY = state.clock.elapsedTime * 0.15;
        
        // Subtle X-axis rotation (nodding motion)
        const baseRotationX = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
        
        // Mouse parallax effect (smooth and subtle)
        const mouseInfluenceY = mousePosition.x * 0.15; // Horizontal mouse affects Y rotation
        const mouseInfluenceX = -mousePosition.y * 0.1; // Vertical mouse affects X rotation
        
        // Combine base rotation with mouse influence
        headRef.current.rotation.y = baseRotationY + mouseInfluenceY;
        headRef.current.rotation.x = baseRotationX + mouseInfluenceX;
        
        // Subtle Z-axis rotation for more dynamic feel
        headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
      }
    }
  });

  return (
    <group ref={floatingGroupRef}>
      <group ref={headRef} position={[0, 0, 0]}>
        {scene && <primitive object={scene.clone()} />}
      </group>
    </group>
  );
}

// Main Robot Head Scene Component
interface RobotHeadProps {
  modelPath?: string;
  reducedMotion?: boolean;
}

export default function RobotHead({ 
  modelPath = "/models/robot-head.glb",
  reducedMotion = false 
}: RobotHeadProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tracking with easing (disabled on mobile)
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
      
      // Normalize mouse position (-1 to 1)
      targetX = ((e.clientX - centerX) / (rect.width / 2)) * 0.5;
      targetY = ((e.clientY - centerY) / (rect.height / 2)) * 0.5;
    };

    // Smooth interpolation for mouse position
    const animate = () => {
      currentX += (targetX - currentX) * 0.05; // Smooth easing
      currentY += (targetY - currentY) * 0.05;
      
      setMousePosition({ x: currentX, y: currentY });
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion]);

  // Preload the model for better performance (only on desktop)
  useEffect(() => {
    if (!reducedMotion && typeof window !== "undefined") {
      // Preload in the background
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.href = modelPath;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  }, [modelPath, reducedMotion]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        gl={{ 
          antialias: !reducedMotion, // Disable antialiasing on mobile for performance
          alpha: true,
          powerPreference: reducedMotion ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={reducedMotion ? 1 : [1, 2]} // Lower DPR on mobile
        performance={{ min: reducedMotion ? 0.5 : 0.8 }}
        shadows={!reducedMotion} // Disable shadows on mobile
      >
        {/* Animated Camera */}
        <AnimatedCamera reducedMotion={reducedMotion} />

        {/* Lighting Setup */}
        <LightingSetup reducedMotion={reducedMotion} />

        {/* Robot Head Model with Suspense for loading */}
        <Suspense fallback={<Loader />}>
          <RobotHeadModel 
            modelPath={modelPath}
            mousePosition={mousePosition}
            reducedMotion={reducedMotion}
          />
        </Suspense>

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Disable default controls - we handle rotation manually */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

