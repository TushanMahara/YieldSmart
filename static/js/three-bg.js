/**
 * three-bg.js
 * Minimal & Elegant 3D Agricultural Topography Wave & Bio-Particle Background
 */

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class ThreeAgricultureScene {
  constructor(containerId = 'three-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Three.js container '${containerId}' not found`);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.clock = new THREE.Clock();

    this.init();
    this.createTerrainMesh();
    this.createGentleSpores();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Position camera with angled perspective looking across the digital landscape
    this.camera.position.set(0, 3.5, 9);
    this.camera.rotation.x = -0.32;
  }

  createTerrainMesh() {
    // Elegant undulating agricultural grid / topography mesh
    const cols = 55;
    const rows = 45;
    const count = cols * rows;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x059669); // Emerald green
    const c2 = new THREE.Color(0x10b981); // Mint green
    const c3 = new THREE.Color(0x0284c7); // Sky teal accent

    let idx = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j - cols / 2) * 0.48;
        const z = (i - rows / 2) * 0.48;
        const y = -1.8;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        // Gradient color based on depth
        const mix = (i / rows) * 0.7 + (j / cols) * 0.3;
        const col = c1.clone().lerp(c2, mix).lerp(c3, (1 - i / rows) * 0.4);
        colors[idx * 3] = col.r;
        colors[idx * 3 + 1] = col.g;
        colors[idx * 3 + 2] = col.b;

        idx++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending
    });

    this.terrain = new THREE.Points(geometry, material);
    this.terrainCols = cols;
    this.terrainRows = rows;
    this.scene.add(this.terrain);
  }

  createGentleSpores() {
    // Subtle, minimal drifting ambient bio-spores
    const sporeCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(sporeCount * 3);

    for (let i = 0; i < sporeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.035,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    this.spores = new THREE.Points(geometry, material);
    this.sporeSpeeds = Array.from({ length: sporeCount }, () => Math.random() * 0.003 + 0.001);
    this.scene.add(this.spores);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = this.clock.getElapsedTime();

    // Smooth cursor parallax lerp
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    this.camera.position.x = this.mouseX * 2.0;
    this.camera.position.y = 3.5 - this.mouseY * 1.2;
    this.camera.lookAt(0, -0.8, 0);

    // Subtle terrain ripple wave (like wind moving across crops)
    if (this.terrain) {
      const pos = this.terrain.geometry.attributes.position.array;
      let idx = 0;
      for (let i = 0; i < this.terrainRows; i++) {
        for (let j = 0; j < this.terrainCols; j++) {
          const x = pos[idx * 3];
          const z = pos[idx * 3 + 2];
          pos[idx * 3 + 1] = -1.8 + Math.sin(x * 0.45 + t * 0.75) * Math.cos(z * 0.35 + t * 0.55) * 0.32;
          idx++;
        }
      }
      this.terrain.geometry.attributes.position.needsUpdate = true;
    }

    // Gentle upward spore drift
    if (this.spores) {
      const pos = this.spores.geometry.attributes.position.array;
      for (let i = 0; i < 50; i++) {
        pos[i * 3 + 1] += this.sporeSpeeds[i];
        if (pos[i * 3 + 1] > 6) {
          pos[i * 3 + 1] = -2;
        }
      }
      this.spores.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
