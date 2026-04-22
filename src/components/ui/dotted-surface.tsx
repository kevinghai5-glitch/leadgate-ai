'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    animationId: number;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    geometry: THREE.BufferGeometry;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const scene = new THREE.Scene();
    const w = containerRef.current.offsetWidth || window.innerWidth;
    const h = containerRef.current.offsetHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    // Premium gold palette — randomly assigned per dot for variation
    const goldPalette: Array<[number, number, number]> = [
      [164 / 255, 122 / 255, 30 / 255],   // #a47a1e
      [211 / 255, 168 / 255, 76 / 255],   // #d3a84c
      [255 / 255, 236 / 255, 148 / 255],  // #ffec94
      [230 / 255, 190 / 255, 105 / 255],  // #e6be69
      [255 / 255, 216 / 255, 124 / 255],  // #ffd87c
      [181 / 255, 143 / 255, 62 / 255],   // #b58f3e
      [149 / 255, 109 / 255, 19 / 255],   // #956d13
    ];

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        const c = goldPalette[Math.floor(Math.random() * goldPalette.length)];
        colors.push(c[0], c[1], c[2]);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 7,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const posAttr = geometry.attributes.position;
      const pos = posAttr.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.07;
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const rw = containerRef.current.offsetWidth || window.innerWidth;
      const rh = containerRef.current.offsetHeight || window.innerHeight;
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    };

    window.addEventListener('resize', handleResize);
    animate();

    sceneRef.current = { animationId, renderer, scene, geometry };
    const container = containerRef.current;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.scene.traverse((obj) => {
          if (obj instanceof THREE.Points) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              (obj.material as THREE.Material).dispose();
            }
          }
        });
        sceneRef.current.renderer.dispose();
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none', className)}
      {...props}
    />
  );
}
