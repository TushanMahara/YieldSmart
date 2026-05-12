import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class ThreeBG {
  constructor(containerId = 'three-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Three.js container '${containerId}' not found`);
      return;
    }
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    this.init();
    this.createFertilizerElements();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // <-- fix: fully transparent
    this.container.appendChild(this.renderer.domElement);
    
    this.camera.position.z = 5;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  createFertilizerElements() {
    // Create NPK particles with different colors
    this.createNPKParticles();
    this.createFloatingMolecules();
  }
  
  createNPKParticles() {
    // Nitrogen particles (blue)
    const nGeometry = new THREE.BufferGeometry();
    const nCount = 30;
    const nPositions = new Float32Array(nCount * 3);
    
    for (let i = 0; i < nCount * 3; i++) {
      nPositions[i] = (Math.random() - 0.5) * 8;
    }
    
    nGeometry.setAttribute('position', new THREE.BufferAttribute(nPositions, 3));
    const nMaterial = new THREE.PointsMaterial({ color: 0x0066ff, size: 0.08 });
    this.nParticles = new THREE.Points(nGeometry, nMaterial);
    this.scene.add(this.nParticles);
    
    // Phosphorus particles (red)
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(nCount * 3);
    
    for (let i = 0; i < nCount * 3; i++) {
      pPositions[i] = (Math.random() - 0.5) * 8;
    }
    
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({ color: 0xff6600, size: 0.08 });
    this.pParticles = new THREE.Points(pGeometry, pMaterial);
    this.scene.add(this.pParticles);
    
    // Potassium particles (purple)
    const kGeometry = new THREE.BufferGeometry();
    const kPositions = new Float32Array(nCount * 3);
    
    for (let i = 0; i < nCount * 3; i++) {
      kPositions[i] = (Math.random() - 0.5) * 8;
    }
    
    kGeometry.setAttribute('position', new THREE.BufferAttribute(kPositions, 3));
    const kMaterial = new THREE.PointsMaterial({ color: 0x9966ff, size: 0.08 });
    this.kParticles = new THREE.Points(kGeometry, kMaterial);
    this.scene.add(this.kParticles);
  }
  
  createFloatingMolecules() {
    this.molecules = [];
    const moleculeGeometry = new THREE.OctahedronGeometry(0.05);
    
    for (let i = 0; i < 15; i++) {
      const color = [0x2dbd6e, 0x4CAF50, 0x8BC34A][Math.floor(Math.random() * 3)];
      const material = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.6 });
      const molecule = new THREE.Mesh(moleculeGeometry, material);
      
      molecule.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      
      molecule.userData = {
        initialPosition: molecule.position.clone(),
        speed: Math.random() * 0.02 + 0.01
      };
      
      this.molecules.push(molecule);
      this.scene.add(molecule);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotate NPK particles
    if (this.nParticles) this.nParticles.rotation.y += 0.002;
    if (this.pParticles) this.pParticles.rotation.x += 0.0015;
    if (this.kParticles) this.kParticles.rotation.z += 0.001;
    
    // Animate molecules
    this.molecules.forEach((molecule, index) => {
      molecule.rotation.x += 0.01;
      molecule.rotation.y += 0.015;
      
      const time = Date.now() * molecule.userData.speed * 0.001;
      molecule.position.y = molecule.userData.initialPosition.y + Math.sin(time + index) * 0.3;
      molecule.position.x = molecule.userData.initialPosition.x + Math.cos(time + index * 0.5) * 0.2;
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}