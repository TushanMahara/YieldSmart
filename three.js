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
    this.createParticles();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
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

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x2dbd6e,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    // Add floating crop elements
    this.createCropElements();
  }
  
  createCropElements() {
    // Create simple geometric shapes representing crops
    const cropGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const cropMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50, transparent: true, opacity: 0.7 });
    
    this.crops = [];
    for (let i = 0; i < 20; i++) {
      const crop = new THREE.Mesh(cropGeometry, cropMaterial);
      crop.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      crop.userData = {
        initialY: crop.position.y,
        speed: Math.random() * 0.02 + 0.01
      };
      this.crops.push(crop);
      this.scene.add(crop);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotate particles
    if (this.particles) {
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x += 0.0005;
    }
    
    // Animate crops
    this.crops.forEach(crop => {
      crop.rotation.y += 0.01;
      crop.position.y = crop.userData.initialY + Math.sin(Date.now() * crop.userData.speed * 0.001) * 0.5;
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}