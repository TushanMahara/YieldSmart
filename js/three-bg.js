/**
 * three-bg.js
 * High-performance 3D Agricultural Particle & Molecule Background using Three.js
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
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.crops = [];
    this.molecules = [];

    this.init();
    this.createBioParticles();
    this.createCropNodes();
    this.createNPKMolecules();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 7;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 1.2);
    dirLight.position.set(3, 5, 4);
    this.scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 1.5, 20);
    blueLight.position.set(-5, -2, 2);
    this.scene.add(blueLight);
  }

  createBioParticles() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x10b981); // Emerald
    const color2 = new THREE.Color(0x3b82f6); // Sky blue
    const color3 = new THREE.Color(0xa78bfa); // Purple

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const pickColor = [color1, color2, color3][Math.floor(Math.random() * 3)];
      colors[i * 3] = pickColor.r;
      colors[i * 3 + 1] = pickColor.g;
      colors[i * 3 + 2] = pickColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    this.particleCloud = new THREE.Points(geometry, material);
    this.scene.add(this.particleCloud);
  }

  createCropNodes() {
    const geom = new THREE.IcosahedronGeometry(0.12, 1);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < 18; i++) {
      const node = new THREE.Mesh(geom, mat);
      node.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );
      node.userData = {
        speedY: Math.random() * 0.008 + 0.004,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        initialY: node.position.y
      };
      this.crops.push(node);
      this.scene.add(node);
    }
  }

  createNPKMolecules() {
    // 3 Compound cluster groups representing Nitrogen, Phosphorus, Potassium
    const nutrientColors = [0x3b82f6, 0xf97316, 0x8b5cf6]; // N (Blue), P (Orange), K (Purple)

    for (let i = 0; i < 12; i++) {
      const group = new THREE.Group();
      const color = nutrientColors[i % 3];
      const atomMat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 90
      });

      // Core Atom
      const coreGeom = new THREE.SphereGeometry(0.1, 12, 12);
      const core = new THREE.Mesh(coreGeom, atomMat);
      group.add(core);

      // 2 Satellite mini-atoms
      for (let s = 0; s < 2; s++) {
        const satGeom = new THREE.SphereGeometry(0.05, 8, 8);
        const sat = new THREE.Mesh(satGeom, atomMat);
        const angle = s * Math.PI;
        sat.position.set(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0);
        group.add(sat);
      }

      group.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );

      group.userData = {
        floatSpeed: Math.random() * 0.01 + 0.005,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        baseY: group.position.y
      };

      this.molecules.push(group);
      this.scene.add(group);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Smooth mouse easing
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Rotate Camera subtle parallax
    this.camera.position.x = this.mouseX * 0.8;
    this.camera.position.y = -this.mouseY * 0.6;
    this.camera.lookAt(this.scene.position);

    // Particle Cloud slow rotation
    if (this.particleCloud) {
      this.particleCloud.rotation.y = time * 0.04;
      this.particleCloud.rotation.x = time * 0.02;
    }

    // Floating Crops
    this.crops.forEach((crop, idx) => {
      crop.rotation.x += crop.userData.rotSpeed;
      crop.rotation.y += crop.userData.rotSpeed;
      crop.position.y = crop.userData.initialY + Math.sin(time + idx) * 0.35;
    });

    // Floating NPK Molecules
    this.molecules.forEach((mol, idx) => {
      mol.rotation.x += mol.userData.rotSpeedX;
      mol.rotation.y += mol.userData.rotSpeedY;
      mol.position.y = mol.userData.baseY + Math.cos(time * 0.8 + idx) * 0.4;
    });

    this.renderer.render(this.scene, this.camera);
  }
}
