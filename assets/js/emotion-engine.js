/**
 * ==============================================================================
 * Emotion Agency 3D WebGL Engine & 3D Interactive UI System
 * - 3D Background: Low-poly Mountains, Water Horizon, Central Particle Emblem
 * - 3D Containers: Layered Parallax Cards with Depth & Specular Glare Tracking
 * - 3D Typography: Interactive Perspective Tilt, Kinetic Float & Dynamic Light
 * - Portfolio Engine: Interactive Project Filters & Dynamic Metric Counters
 * ==============================================================================
 */

class EmotionAgency3DEngine {
    constructor() {
        this.container = document.getElementById('emotion-webgl-canvas');
        if (!this.container || typeof THREE === 'undefined') return;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;

        this.initThree();
        this.createMountains();
        this.createWaterPlane();
        this.createCentralParticleCloud();
        this.createFloatingPetals();
        this.setupLights();
        this.setupEvents();
        this.setupScrollReveals();
        this.setup3DContainers();
        this.setup3DText();
        this.setupCounters();
        this.setupProjectFilters();
        this.setupSmoothScroll();
        this.setup3DContactForm();
        this.setupHeroOrbital();
        this.animate();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x1e1338, 0.045);

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(0, 0, 8);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;

        this.container.appendChild(this.renderer.domElement);
    }

    createMountains() {
        const width = 42;
        const height = 14;
        const segmentsW = 40;
        const segmentsH = 16;
        const mountainGeo = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH);

        const posAttr = mountainGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            if (y > -2) {
                const noise = Math.sin(x * 0.45) * 1.8 + Math.cos(x * 0.9) * 1.2 + Math.sin(x * 1.5 + y) * 0.8;
                posAttr.setZ(i, Math.max(0, noise * 2.2));
            }
        }
        mountainGeo.computeVertexNormals();

        const mountainMat = new THREE.MeshLambertMaterial({
            color: 0x3d1c68,
            emissive: 0x1f0b38,
            flatShading: true,
            roughness: 0.8
        });

        this.mountains = new THREE.Mesh(mountainGeo, mountainMat);
        this.mountains.position.set(0, -1.8, -4);
        this.scene.add(this.mountains);
    }

    createWaterPlane() {
        const waterGeo = new THREE.PlaneGeometry(45, 18, 32, 32);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x140a2a,
            emissive: 0x170d2c,
            emissiveIntensity: 0.15,
            roughness: 0.95,
            metalness: 0.05
        });

        this.water = new THREE.Mesh(waterGeo, waterMat);
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.set(0, -3.2, 0);
        this.scene.add(this.water);
    }

    createCentralParticleCloud() {
        this.particleCloudGroup = new THREE.Group();
        this.particleCloudGroup.position.set(0, 0.4, 0);

        this.particleCount = 1400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // 4 Geometric Morphs linked to Scroll Sections (Matching Emotion Agency)
        this.shapeSphere = new Float32Array(this.particleCount * 3);
        this.shapeCube = new Float32Array(this.particleCount * 3);
        this.shapeTorus = new Float32Array(this.particleCount * 3);
        this.shapeGalaxy = new Float32Array(this.particleCount * 3);

        const pink = new THREE.Color(0xf472b6);
        const magenta = new THREE.Color(0xec4899);
        const violet = new THREE.Color(0xa855f7);
        const white = new THREE.Color(0xffffff);

        for (let i = 0; i < this.particleCount; i++) {
            // 1. Organic Spherical Cloud (Hero)
            const u = Math.random() * Math.PI * 2;
            const v = (Math.random() - 0.5) * Math.PI;
            const radius = 1.35 + Math.sin(u * 3 + v * 2) * 0.35 + (Math.random() - 0.5) * 0.25;

            const sx = radius * Math.cos(v) * Math.cos(u) * 1.1;
            const sy = radius * Math.sin(v) * 1.25;
            const sz = radius * Math.cos(v) * Math.sin(u) * 0.9;

            this.shapeSphere[i * 3] = sx;
            this.shapeSphere[i * 3 + 1] = sy;
            this.shapeSphere[i * 3 + 2] = sz;

            // Start positions at sphere
            positions[i * 3] = sx;
            positions[i * 3 + 1] = sy;
            positions[i * 3 + 2] = sz;

            // 2. 3D Cube (About / Approach Section - Matching Emotion Agency)
            const face = i % 6;
            const side = 2.4;
            const half = side / 2;
            const c1 = (Math.random() - 0.5) * side;
            const c2 = (Math.random() - 0.5) * side;
            let cx = 0, cy = 0, cz = 0;
            if (face === 0) { cx = half; cy = c1; cz = c2; }
            else if (face === 1) { cx = -half; cy = c1; cz = c2; }
            else if (face === 2) { cx = c1; cy = half; cz = c2; }
            else if (face === 3) { cx = c1; cy = -half; cz = c2; }
            else if (face === 4) { cx = c1; cy = c2; cz = half; }
            else { cx = c1; cy = c2; cz = -half; }

            this.shapeCube[i * 3] = cx * 0.95;
            this.shapeCube[i * 3 + 1] = cy * 0.95;
            this.shapeCube[i * 3 + 2] = cz * 0.95;

            // 3. Torus Ring (Experience / Skills Section - Matching Emotion Agency)
            const R = 1.7;
            const rTube = 0.45;
            const tAngle = Math.random() * Math.PI * 2;
            const pAngle = Math.random() * Math.PI * 2;

            this.shapeTorus[i * 3] = (R + rTube * Math.cos(pAngle)) * Math.cos(tAngle);
            this.shapeTorus[i * 3 + 1] = (R + rTube * Math.cos(pAngle)) * Math.sin(tAngle);
            this.shapeTorus[i * 3 + 2] = rTube * Math.sin(pAngle);

            // 4. Double Spiral Galaxy (Projects & Contact Section)
            const arm = (i % 2 === 0 ? 0 : Math.PI);
            const dist = 0.35 + Math.pow(Math.random(), 0.8) * 2.5;
            const gAngle = dist * 2.5 + arm + (Math.random() - 0.5) * 0.3;

            this.shapeGalaxy[i * 3] = Math.cos(gAngle) * dist;
            this.shapeGalaxy[i * 3 + 1] = (Math.random() - 0.5) * 0.55;
            this.shapeGalaxy[i * 3 + 2] = Math.sin(gAngle) * dist;

            // Colors
            const rand = Math.random();
            const col = rand > 0.65 ? white : (rand > 0.35 ? pink : (rand > 0.15 ? magenta : violet));
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.055,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        this.particleCloud = new THREE.Points(geometry, material);
        this.particleCloudGroup.add(this.particleCloud);

        this.cloudLight = new THREE.PointLight(0xf472b6, 1.8, 6);
        this.particleCloudGroup.add(this.cloudLight);

        this.scene.add(this.particleCloudGroup);
    }

    createFloatingPetals() {
        const count = 120;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        this.petalVelocities = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 12 - 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            this.petalVelocities.push({
                vy: -(0.008 + Math.random() * 0.015),
                vx: (Math.random() - 0.5) * 0.006,
                rot: (Math.random() - 0.5) * 0.02
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x1f1035,
            transparent: true,
            opacity: 0.85
        });

        this.petals = new THREE.Points(geometry, material);
        this.scene.add(this.petals);
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0xc4b5fd, 0.75);
        this.scene.add(ambient);

        const violetLight = new THREE.DirectionalLight(0x8b5cf6, 1.8);
        violetLight.position.set(0, 5, 2);
        this.scene.add(violetLight);

        this.mouseLight = new THREE.PointLight(0xec4899, 2.5, 12);
        this.mouseLight.position.set(0, 0, 4);
        this.scene.add(this.mouseLight);
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            if (this.width < 1024) {
                this.particleCloudGroup.scale.set(0.75, 0.75, 0.75);
                this.mountains.scale.set(0.85, 0.85, 0.85);
            } else {
                this.particleCloudGroup.scale.set(1, 1, 1);
                this.mountains.scale.set(1, 1, 1);
            }
        });

        if (this.width < 1024) {
            this.particleCloudGroup.scale.set(0.75, 0.75, 0.75);
            this.mountains.scale.set(0.85, 0.85, 0.85);
        }

        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
            this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;
        });

        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            this.targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        }, { passive: true });
    }

    // Fast & Fluid Scroll Reveal Engine (Zero-Lag Ahead-of-Time Triggering)
    setupScrollReveals() {
        const reveals = document.querySelectorAll(
            '.emotion-scroll-reveal, .emotion-scroll-reveal-badge, .emotion-scroll-reveal-heading, .emotion-card-3d'
        );

        if (!reveals.length) return;

        // Reveal elements visible or approaching viewport
        const triggerImmediate = () => {
            const vh = window.innerHeight;
            reveals.forEach(el => {
                if (!el.classList.contains('is-revealed')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < vh + 200) {
                        el.classList.add('is-revealed');
                    }
                }
            });
        };

        // Scroll observer for elements entering during smooth scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '200px 0px 320px 0px'
        });

        reveals.forEach(el => observer.observe(el));

        // Fast passive scroll listener to guarantee instantaneous reveal on rapid scrolling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    triggerImmediate();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial triggers on load
        triggerImmediate();
        window.addEventListener('load', triggerImmediate);
        setTimeout(triggerImmediate, 50);
        setTimeout(triggerImmediate, 200);
    }

    // 3D Containers with Dynamic Specular Glare & Multi-Layer Parallax
    setup3DContainers() {
        const cards = document.querySelectorAll('.emotion-card-3d');
        cards.forEach(card => {
            // Append glare reflection overlay if not present
            if (!card.querySelector('.card-3d-glare')) {
                const glare = document.createElement('div');
                glare.className = 'card-3d-glare';
                card.appendChild(glare);
            }
            const glare = card.querySelector('.card-3d-glare');

            card.addEventListener('mousemove', (e) => {
                if (!card.classList.contains('is-revealed')) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;

                const rx = ((y - cy) / cy) * -8;
                const ry = ((x - cx) / cx) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;

                if (glare) {
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(244, 114, 182, 0.28) 0%, transparent 65%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                // Clear inline style so continuous floating animation takes over cleanly
                card.style.transform = '';
            });
        });
    }

    // 3D Text Parallax Tilt (Scoped directly to title elements, disconnected from icons container)
    setup3DText() {
        const textElements = document.querySelectorAll('.text-3d-interactive');
        if (!textElements.length) return;

        textElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;

                const rx = -my * 8;
                const ry = mx * 8;
                el.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(12px)`;
                el.style.textShadow = `
                    ${(-mx * 6).toFixed(1)}px ${(my * 6).toFixed(1)}px 20px rgba(236, 72, 153, 0.4),
                    ${(-mx * 12).toFixed(1)}px ${(my * 12).toFixed(1)}px 35px rgba(144, 71, 255, 0.35)
                `;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.textShadow = '';
            });
        });
    }

    // Dynamic Metric Number Counters
    setupCounters() {
        const counters = document.querySelectorAll('.counter-val');
        if (!counters.length) return;
        let animated = false;

        const runCount = () => {
            counters.forEach(c => {
                const target = +c.getAttribute('data-target');
                const suffix = c.getAttribute('data-suffix') || '';
                let current = 0;
                const step = target / 50;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        c.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        c.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    runCount();
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.getElementById('stats-ribbon');
        if (statsSection) observer.observe(statsSection);
    }

    // Dynamic Category Filters
    setupProjectFilters() {
        const buttons = document.querySelectorAll('.project-filter-btn');
        const items = document.querySelectorAll('.project-item');

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                buttons.forEach(b => {
                    b.classList.remove('active', '!bg-purple-600', '!text-white', '!border-purple-400');
                });
                e.currentTarget.classList.add('active', '!bg-purple-600', '!text-white', '!border-purple-400');

                const filter = e.currentTarget.dataset.filter;
                items.forEach(item => {
                    const category = item.dataset.category || '';
                    if (filter === 'all' || category.includes(filter)) {
                        item.style.display = 'flex';
                        item.classList.remove('opacity-0', 'scale-95');
                        item.classList.add('opacity-100', 'scale-100');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('opacity-100', 'scale-100');
                        item.classList.add('opacity-0', 'scale-95');
                    }
                });
            });
        });
    }

    // Butter-Smooth Navigation Scrolling with Header Offset & Mobile Menu Handling
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#' || !targetId) return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Auto-close mobile menu on selection
                    const mobileMenu = document.getElementById('mobile-menu');
                    const menuIcon = document.querySelector('#mobile-menu-btn i');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        if (menuIcon) {
                            menuIcon.classList.remove('fa-times');
                            menuIcon.classList.add('fa-bars');
                        }
                    }
                }
            });
        });
    }

    // Direct Contact Collaboration Hub (Clipboard Copy & Direct Actions)
    setup3DContactForm() {
        const copyEmailBtn = document.getElementById('copy-email-btn');

        // Copy email to clipboard with animated feedback
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', () => {
                const email = 'haritharshinit@gmail.com';
                navigator.clipboard.writeText(email).then(() => {
                    const originalHtml = copyEmailBtn.innerHTML;
                    copyEmailBtn.innerHTML = '<i class="fas fa-check text-emerald-400"></i> <span class="hidden sm:inline">Copied!</span>';
                    setTimeout(() => {
                        copyEmailBtn.innerHTML = originalHtml;
                    }, 2000);
                }).catch(() => {
                    window.location.href = `mailto:${email}`;
                });
            });
        }
    }

    // 3D Hero Orbital Constellation Physics & Tilt Parallax
    // 3D Hero Orbital Constellation (Hover/tilt animation removed to keep container stable)
    setupHeroOrbital() {
        // Hover/tilt animation removed as requested: icons container remains peaceful and stable
    }

    updateScrollChoreography() {
        const p = this.scrollProgress;
        const isMobile = this.width < 1024;

        let targetY = 0.4 - p * 1.5;
        let targetX = 0;

        if (!isMobile) {
            if (p < 0.25) {
                targetX = Math.sin(p * Math.PI * 2) * 2.2;
            } else if (p < 0.6) {
                targetX = Math.cos(p * Math.PI * 2) * 2.5;
            } else {
                targetX = 0;
            }
        }

        this.particleCloudGroup.position.x += (targetX - this.particleCloudGroup.position.x) * 0.05;
        this.particleCloudGroup.position.y += (targetY - this.particleCloudGroup.position.y) * 0.05;

        this.camera.position.y = (this.mouse.y * 0.4) - (p * 2.5);
        this.camera.position.x = (this.mouse.x * 0.6);
        this.camera.lookAt(0, -p * 2, 0);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
        this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

        this.updateScrollChoreography();

        const time = Date.now() * 0.001;

        // Dynamic 3D Particle Morphing Linked to Scroll Position (Emotion Agency Style)
        if (this.particleCloud) {
            const p = this.scrollProgress;
            let targetShape = this.shapeSphere;

            if (p < 0.20) {
                targetShape = this.shapeSphere; // Hero: Organic Sphere
            } else if (p < 0.45) {
                targetShape = this.shapeCube; // About / Approach: Glowing 3D Cube
            } else if (p < 0.72) {
                targetShape = this.shapeTorus; // Experience & Skills: Glowing Torus Ring
            } else {
                targetShape = this.shapeGalaxy; // Projects & Contact: Spiral Galaxy
            }

            const posAttr = this.particleCloud.geometry.attributes.position;
            const posArr = posAttr.array;
            const lerpSpeed = 0.05;

            for (let i = 0; i < this.particleCount * 3; i++) {
                posArr[i] += (targetShape[i] - posArr[i]) * lerpSpeed;
            }
            posAttr.needsUpdate = true;

            this.particleCloud.rotation.y += 0.0035;
            this.particleCloud.rotation.x = Math.sin(time * 0.8) * 0.1;
            const scale = 1 + Math.sin(time * 1.5) * 0.04;
            this.particleCloud.scale.set(scale, scale, scale);
        }

        if (this.petals) {
            const posAttr = this.petals.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                let y = posAttr.getY(i) + this.petalVelocities[i].vy;
                let x = posAttr.getX(i) + this.petalVelocities[i].vx;
                if (y < -5) y = 6;
                posAttr.setY(i, y);
                posAttr.setX(i, x);
            }
            posAttr.needsUpdate = true;
        }

        if (this.mouseLight) {
            this.mouseLight.position.x = this.mouse.x * 5;
            this.mouseLight.position.y = this.mouse.y * 3;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.emotion3DEngine = new EmotionAgency3DEngine();
});
