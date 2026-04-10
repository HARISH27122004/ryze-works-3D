import { useEffect, useRef } from 'react';
import {
  Vector3 as a,
  MeshPhysicalMaterial as c,
  InstancedMesh as d,
  Timer as e,
  AmbientLight as f,
  ShaderChunk as h,
  Scene as i,
  Color as l,
  Object3D as m,
  SRGBColorSpace as n,
  MathUtils as o,
  PMREMGenerator as p,
  Vector2 as r,
  WebGLRenderer as s,
  PerspectiveCamera as t,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Plane as w,
  Raycaster as y,
  CylinderGeometry,
  Euler,
  Quaternion
} from 'three';
import { RoomEnvironment as z } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function createCrossGeometry() {
  const armRadius = 0.32, armLength = 1.9, centerRadius = 0.48, centerHeight = 0.6, segments = 18;
  const cylX = new CylinderGeometry(armRadius, armRadius, armLength, segments); cylX.rotateZ(Math.PI / 2);
  const cylY = new CylinderGeometry(armRadius, armRadius, armLength, segments);
  const cylZ = new CylinderGeometry(armRadius, armRadius, armLength, segments); cylZ.rotateX(Math.PI / 2);
  const hubXY = new CylinderGeometry(centerRadius, centerRadius, centerHeight, segments);
  const hubXZ = new CylinderGeometry(centerRadius, centerRadius, centerHeight, segments); hubXZ.rotateX(Math.PI / 2);
  const hubYZ = new CylinderGeometry(centerRadius, centerRadius, centerHeight, segments); hubYZ.rotateZ(Math.PI / 2);
  const merged = mergeGeometries([cylX, cylY, cylZ, hubXY, hubXZ, hubYZ]);
  merged.computeVertexNormals();
  return merged;
}

class x {
  #e; canvas; camera; cameraMinAspect; cameraMaxAspect; cameraFov;
  maxPixelRatio; minPixelRatio; scene; renderer; #t;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#i;
  onBeforeRender = () => {}; onAfterRender = () => {}; onAfterResize = () => {};
  #s = false; #n = false; isDisposed = false; #o; #r; #a;
  #c = new e(); #h = { elapsed: 0, delta: 0 }; #l;
  constructor(e) { this.#e = { ...e }; this.#m(); this.#d(); this.#p(); if (!this.renderer) return; this.resize(); this.#g(); }
  #m() { this.camera = new t(); this.cameraFov = this.camera.fov; }
  #d() { this.scene = new i(); }
  #p() {
    if (this.#e.canvas) this.canvas = this.#e.canvas;
    else if (this.#e.id) this.canvas = document.getElementById(this.#e.id);
    else { console.error('Three: Missing canvas or id parameter'); return; }
    if (!this.canvas) { console.error('Three: Canvas element not found in DOM'); return; }
    this.canvas.style.display = 'block';
    try { this.renderer = new s({ canvas: this.canvas, powerPreference: 'high-performance', ...(this.#e.rendererOptions ?? {}) }); }
    catch (err) { console.error('Three: WebGLRenderer failed:', err); return; }
    this.renderer.outputColorSpace = n;
    this.canvas.addEventListener('webglcontextlost', (ev) => { ev.preventDefault(); this.#z(); }, false);
    this.canvas.addEventListener('webglcontextrestored', () => { if (this.renderer) this.renderer.outputColorSpace = n; }, false);
  } 
  #g() {
    if (!this.canvas) return;
    if (!(this.#e.size instanceof Object)) {
      window.addEventListener('resize', this.#f.bind(this));
      if (this.#e.size === 'parent' && this.canvas.parentNode) { this.#r = new ResizeObserver(this.#f.bind(this)); this.#r.observe(this.canvas.parentNode); }
    }
    this.#o = new IntersectionObserver(this.#u.bind(this), { root: null, rootMargin: '0px', threshold: 0 });
    this.#o.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#v.bind(this));
  }
  #y() { window.removeEventListener('resize', this.#f.bind(this)); this.#r?.disconnect(); this.#o?.disconnect(); document.removeEventListener('visibilitychange', this.#v.bind(this)); }
  #u(e) { this.#s = e[0].isIntersecting; this.#s ? this.#w() : this.#z(); }
  #v() { if (this.#s) { document.hidden ? this.#z() : this.#w(); } }
  #f() { if (this.#a) clearTimeout(this.#a); this.#a = setTimeout(this.resize.bind(this), 100); }
  resize() {
    let e, t;
    if (this.#e.size instanceof Object) { e = this.#e.size.width; t = this.#e.size.height; }
    else if (this.#e.size === 'parent' && this.canvas.parentNode) { e = this.canvas.parentNode.offsetWidth; t = this.canvas.parentNode.offsetHeight; }
    else { e = window.innerWidth; t = window.innerHeight; }
    this.size.width = e; this.size.height = t; this.size.ratio = e / t;
    this.#x(); this.#b(); this.onAfterResize(this.size);
  }
  #x() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) this.#A(this.cameraMinAspect);
      else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) this.#A(this.cameraMaxAspect);
      else this.camera.fov = this.cameraFov;
    }
    this.camera.updateProjectionMatrix(); this.updateWorldSize();
  }
  #A(e) { const t = Math.tan(o.degToRad(this.cameraFov / 2)) / (this.camera.aspect / e); this.camera.fov = 2 * o.radToDeg(Math.atan(t)); }
  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const e = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(e / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }
  #b() {
    if (!this.renderer) return;
    this.renderer.setSize(this.size.width, this.size.height);
    this.#t?.setSize(this.size.width, this.size.height);
    let e = window.devicePixelRatio;
    if (this.maxPixelRatio && e > this.maxPixelRatio) e = this.maxPixelRatio;
    else if (this.minPixelRatio && e < this.minPixelRatio) e = this.minPixelRatio;
    this.renderer.setPixelRatio(e); this.size.pixelRatio = e;
  }
  get postprocessing() { return this.#t; }
  set postprocessing(e) { this.#t = e; this.render = e.render.bind(e); }
  #w() {
    if (this.#n) return;
    const animate = () => {
      this.#l = requestAnimationFrame(animate);
      this.#c.update(); this.#h.delta = this.#c.getDelta(); this.#h.elapsed += this.#h.delta;
      this.onBeforeRender(this.#h); this.render(); this.onAfterRender(this.#h);
    };
    this.#n = true; animate();
  }
  #z() { if (this.#n) { cancelAnimationFrame(this.#l); this.#n = false; } }
  #i() { if (!this.renderer) return; this.renderer.render(this.scene, this.camera); }
  clear() {
    this.scene.traverse(e => {
      if (e.isMesh && typeof e.material === 'object' && e.material !== null) {
        Object.keys(e.material).forEach(t => { const i = e.material[t]; if (i !== null && typeof i === 'object' && typeof i.dispose === 'function') i.dispose(); });
        e.material.dispose(); e.geometry.dispose();
      }
    });
    this.scene.clear();
  }
  dispose() { this.#y(); this.#z(); this.clear(); this.#t?.dispose(); this.renderer.dispose(); this.renderer.forceContextLoss(); this.isDisposed = true; }
}

const b = new Map(), A = new r();
let R = false;
function S(e) {
  const t = { position: new r(), nPosition: new r(), hover: false, touching: false, onEnter() {}, onMove() {}, onClick() {}, onLeave() {}, ...e };
  (function (e, t) {
    if (!b.has(e)) {
      b.set(e, t);
      if (!R) {
        document.body.addEventListener('pointermove', M); document.body.addEventListener('pointerleave', L); document.body.addEventListener('click', C);
        document.body.addEventListener('touchstart', TouchStart, { passive: false }); document.body.addEventListener('touchmove', TouchMove, { passive: false });
        document.body.addEventListener('touchend', TouchEnd, { passive: false }); document.body.addEventListener('touchcancel', TouchEnd, { passive: false });
        R = true;
      }
    }
  })(e.domElement, t);
  t.dispose = () => {
    b.delete(e.domElement);
    if (b.size === 0) {
      document.body.removeEventListener('pointermove', M); document.body.removeEventListener('pointerleave', L); document.body.removeEventListener('click', C);
      document.body.removeEventListener('touchstart', TouchStart); document.body.removeEventListener('touchmove', TouchMove);
      document.body.removeEventListener('touchend', TouchEnd); document.body.removeEventListener('touchcancel', TouchEnd);
      R = false;
    }
  };
  return t;
}
function M(e) { A.x = e.clientX; A.y = e.clientY; processInteraction(); }
function processInteraction() {
  for (const [elem, t] of b) {
    const i = elem.getBoundingClientRect();
    if (D(i)) { P(t, i); if (!t.hover) { t.hover = true; t.onEnter(t); } t.onMove(t); }
    else if (t.hover && !t.touching) { t.hover = false; t.onLeave(t); }
  }
}
function C(e) { A.x = e.clientX; A.y = e.clientY; for (const [elem, t] of b) { const i = elem.getBoundingClientRect(); P(t, i); if (D(i)) t.onClick(t); } }
function L() { for (const t of b.values()) { if (t.hover) { t.hover = false; t.onLeave(t); } } }
function TouchStart(e) {
  if (e.touches.length > 0) {
    e.preventDefault(); A.x = e.touches[0].clientX; A.y = e.touches[0].clientY;
    for (const [elem, t] of b) { const rect = elem.getBoundingClientRect(); if (D(rect)) { t.touching = true; P(t, rect); if (!t.hover) { t.hover = true; t.onEnter(t); } t.onMove(t); } }
  }
}
function TouchMove(e) {
  if (e.touches.length > 0) {
    e.preventDefault(); A.x = e.touches[0].clientX; A.y = e.touches[0].clientY;
    for (const [elem, t] of b) {
      const rect = elem.getBoundingClientRect(); P(t, rect);
      if (D(rect)) { if (!t.hover) { t.hover = true; t.touching = true; t.onEnter(t); } t.onMove(t); }
      else if (t.hover && t.touching) t.onMove(t);
    }
  }
}
function TouchEnd() { for (const [, t] of b) { if (t.touching) { t.touching = false; if (t.hover) { t.hover = false; t.onLeave(t); } } } }
function P(e, t) { const { position: i, nPosition: s } = e; i.x = A.x - t.left; i.y = A.y - t.top; s.x = (i.x / t.width) * 2 - 1; s.y = (-i.y / t.height) * 2 + 1; }
function D(e) { const { x: t, y: i } = A; const { left: s, top: n, width: o, height: r } = e; return t >= s && t <= s + o && i >= n && i <= n + r; }

const { randFloat: k, randFloatSpread: E } = o;
const I = new a(), O = new a(), B = new a(), N = new a(), _ = new a(), j = new a(), H = new a(), T = new a();

class W {
  constructor(e) {
    this.config = e;
    this.positionData       = new Float32Array(3 * e.count).fill(0);
    this.velocityData       = new Float32Array(3 * e.count).fill(0);
    this.sizeData           = new Float32Array(e.count).fill(1);
    this.rotationData       = new Float32Array(3 * e.count).fill(0);
    this.angularVelocity    = new Float32Array(3 * e.count).fill(0);
    this.cursorPos          = new a();
    this.cursorActive       = false;
    this.#R(); this.setSizes(); this.#initRotations();
  }
  #R() {
    const { config: e, positionData: t } = this;
    for (let i = 0; i < e.count; i++) {
      const s = 3 * i;
      t[s] = E(1.5); t[s + 1] = E(1.5); t[s + 2] = E(0.8);
    }
  }
  #initRotations() {
    const { rotationData: t, angularVelocity: av, config: e } = this;
    for (let i = 0; i < e.count; i++) {
      const base = 3 * i;
      t[base]     = Math.random() * Math.PI * 2;
      t[base + 1] = Math.random() * Math.PI * 2;
      t[base + 2] = Math.random() * Math.PI * 2;
      av[base]     = (Math.random() - 0.5) * 0.5;
      av[base + 1] = (Math.random() - 0.5) * 0.4;
      av[base + 2] = (Math.random() - 0.5) * 0.3;
    }
  }
  setSizes() {
    const { config: e, sizeData: t } = this;
    t[0] = e.size0;
    for (let i = 1; i < e.count; i++) t[i] = k(e.minSize, e.maxSize);
  }
  update(dt) {
    const { config: cfg, positionData: pos, sizeData: sz, velocityData: vel, rotationData: rot, angularVelocity: av } = this;

    for (let idx = 0; idx < cfg.count; idx++) {
      const base = 3 * idx;
      I.fromArray(pos, base);
      B.fromArray(vel, base);

      const attraction = 0.06;
      B.x -= I.x * attraction * dt.delta;
      B.y -= I.y * attraction * dt.delta;
      B.z -= I.z * attraction * dt.delta;

      if (this.cursorActive) {
        const dx = I.x - this.cursorPos.x;
        const dy = I.y - this.cursorPos.y;
        const dz = I.z - this.cursorPos.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const repR = 4.5;
        if (dist < repR && dist > 0.01) {
          const t = 1 - dist / repR;
          const force = t * t * 1.1;
          B.x += (dx / dist) * force;
          B.y += (dy / dist) * force;
          B.z += (dz / dist) * force;
          av[base]     += (Math.random() - 0.5) * force * 3;
          av[base + 1] += (Math.random() - 0.5) * force * 3;
          av[base + 2] += (Math.random() - 0.5) * force * 2;
        }
      }

      B.multiplyScalar(cfg.friction);
      B.clampLength(0, cfg.maxVelocity);
      I.add(B);
      I.toArray(pos, base);
      B.toArray(vel, base);

      const idleX = (idx % 3 === 0) ? 0.4 : (idx % 3 === 1 ? -0.3 : 0.25);
      const idleY = (idx % 2 === 0) ? 0.3 : -0.35;
      const idleZ = (idx % 5 === 0) ? -0.2 : 0.18;
      av[base]     += (idleX - av[base])     * 0.01;
      av[base + 1] += (idleY - av[base + 1]) * 0.01;
      av[base + 2] += (idleZ - av[base + 2]) * 0.01;

      const maxAV = 4.0;
      av[base]     = Math.max(-maxAV, Math.min(maxAV, av[base]));
      av[base + 1] = Math.max(-maxAV, Math.min(maxAV, av[base + 1]));
      av[base + 2] = Math.max(-maxAV, Math.min(maxAV, av[base + 2]));

      rot[base]     += av[base]     * dt.delta;
      rot[base + 1] += av[base + 1] * dt.delta;
      rot[base + 2] += av[base + 2] * dt.delta;
    }

    for (let idx = 0; idx < cfg.count; idx++) {
      const base = 3 * idx;
      I.fromArray(pos, base); B.fromArray(vel, base);
      const radius = sz[idx];
      for (let jdx = idx + 1; jdx < cfg.count; jdx++) {
        const otherBase = 3 * jdx;
        O.fromArray(pos, otherBase); N.fromArray(vel, otherBase);
        const otherRadius = sz[jdx];
        _.copy(O).sub(I);
        const dist = _.length();
        const sumR = radius + otherRadius;
        if (dist < sumR) {
          const overlap = sumR - dist;
          j.copy(_).normalize().multiplyScalar(0.5 * overlap);
          H.copy(j).multiplyScalar(Math.max(B.length(), 1));
          T.copy(j).multiplyScalar(Math.max(N.length(), 1));
          I.sub(j); B.sub(H); I.toArray(pos, base); B.toArray(vel, base);
          O.add(j); N.add(T); O.toArray(pos, otherBase); N.toArray(vel, otherBase);
        }
      }
      if (Math.abs(I.x) + radius > cfg.maxX) { I.x = Math.sign(I.x) * (cfg.maxX - radius); B.x = -B.x * cfg.wallBounce; }
      if (Math.abs(I.y) + radius > cfg.maxY) { I.y = Math.sign(I.y) * (cfg.maxY - radius); B.y = -B.y * cfg.wallBounce; }
      const maxZ = Math.max(cfg.maxZ, cfg.maxSize);
      if (Math.abs(I.z) + radius > maxZ) { I.z = Math.sign(I.z) * (cfg.maxZ - radius); B.z = -B.z * cfg.wallBounce; }
      I.toArray(pos, base); B.toArray(vel, base);
    }
  }
}

class Y extends c {
  constructor(e) {
    super(e);
    this.uniforms = { thicknessDistortion: { value: 0.1 }, thicknessAmbient: { value: 0 }, thicknessAttenuation: { value: 0.1 }, thicknessPower: { value: 2 }, thicknessScale: { value: 10 } };
    this.defines.USE_UV = '';
    this.onBeforeCompile = e => {
      Object.assign(e.uniforms, this.uniforms);
      e.fragmentShader = '\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      ' + e.fragmentShader;
      e.fragmentShader = e.fragmentShader.replace('void main() {', '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      ');
      const t = h.lights_fragment_begin.replaceAll('RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );', '\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        ');
      e.fragmentShader = e.fragmentShader.replace('#include <lights_fragment_begin>', t);
      if (this.onBeforeCompile2) this.onBeforeCompile2(e);
    };
  }
}

// ─── COLOR PRESETS ────────────────────────────────────────────────────────────
// Each preset is [primary, dark, highlight] — click the canvas to cycle through
const COLOR_PRESETS = [
  [0x2255dd, 0x0a0a14, 0x909098],   // blue & silver (default)
  [0xdd2255, 0x0a0a14, 0x909098],   // rose & crimson
  [0x22dd88, 0x0a0a14, 0x909098],   // emerald & mint
  [0xddaa22, 0x0a0a14, 0x909098],   // gold & amber
  [0x9922dd, 0x0a0a14, 0x909098],   // violet & lavender
];

// ─── DEFAULT CONFIG ────────────────────────────────────────────────────────────
const X = {
  count: 10,
  colors: COLOR_PRESETS[0],
  ambientColor: 0xffffff,
  ambientIntensity: 0.4,    // ↓ reduced from 1.5
  lightIntensity: 80,       // ↓ reduced from 500
  materialParams: { metalness: 0.0, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.05 },
  minSize: 1.2,
  maxSize: 2.0,
  size0: 1.5,
  gravity: 0,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.25,
  maxX: 5, maxY: 5, maxZ: 2.5,
  controlSphere0: false,
  followCursor: false
};

const _euler = new Euler(), _quat = new Quaternion(), U = new m();

class Z extends d {
  constructor(e, t = {}) {
    const i = { ...X, ...t };
    const roomEnv = new z();
    const envTex = new p(e, 0.04).fromScene(roomEnv).texture;
    const crossGeo = createCrossGeometry();
    const mat = new Y({ envMap: envTex, ...i.materialParams });
    mat.envMapRotation.x = -Math.PI / 2;
    super(crossGeo, mat, i.count);
    this.config = i;
    this.physics = new W(i);
    this.#S();
    this.setColors(i.colors);
  }
  #S() {
    this.ambientLight = new f(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new u(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }
  setColors(e) {
    if (Array.isArray(e) && e.length > 1) {
      const gradient = (() => {
        const colors = e.map(col => new l(col));
        return {
          getColorAt(ratio, out = new l()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (colors.length - 1);
            const idx = Math.floor(scaled);
            if (idx >= colors.length - 1) return colors[idx].clone();
            const alpha = scaled - idx;
            const s = colors[idx], end = colors[idx + 1];
            out.r = s.r + alpha * (end.r - s.r);
            out.g = s.g + alpha * (end.g - s.g);
            out.b = s.b + alpha * (end.b - s.b);
            return out;
          }
        };
      })();
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, gradient.getColorAt(idx / this.count));
        if (idx === 0) this.light.color.copy(gradient.getColorAt(0));
      }
      this.instanceColor.needsUpdate = true;
    }
  }

  // Update ambient and point light brightness at runtime
  setBrightness(ambientIntensity, lightIntensity) {
    this.ambientLight.intensity = ambientIntensity;
    this.light.intensity = lightIntensity;
  }

  update(e) {
    this.physics.update(e);
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx);
      U.scale.setScalar(this.physics.sizeData[idx]);
      const rb = 3 * idx;
      _euler.set(this.physics.rotationData[rb], this.physics.rotationData[rb + 1], this.physics.rotationData[rb + 2]);
      _quat.setFromEuler(_euler);
      U.quaternion.copy(_quat);
      U.updateMatrix();
      this.setMatrixAt(idx, U.matrix);
      if (idx === 0) this.light.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas, t = {}) {
  if (!canvas) { console.error('createBallpit: canvas element is null'); return null; }
  const three = new x({ canvas, size: 'parent', rendererOptions: { antialias: true, alpha: true } });
  if (!three.renderer) { console.error('createBallpit: renderer failed to initialize'); return null; }

  let spheres;
  three.renderer.toneMapping = v;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();
  initialize(t);

  const raycaster = new y();
  const plane = new w(new a(0, 0, 1), 0);
  const hitPoint = new a();
  let paused = false;

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';
  canvas.style.cursor = 'pointer';  // hint that the canvas is clickable

  // ─── COLOR CYCLING ON CLICK ───────────────────────────────────────────────
  let colorIndex = 0;
  const handleClick = () => {
    colorIndex = (colorIndex + 1) % COLOR_PRESETS.length;
    spheres.setColors(COLOR_PRESETS[colorIndex]);
  };
  canvas.addEventListener('click', handleClick);

  const pointer = S({
    domElement: canvas,
    onMove() {
      raycaster.setFromCamera(pointer.nPosition, three.camera);
      three.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, hitPoint);
      spheres.physics.cursorPos.copy(hitPoint);
      spheres.physics.cursorActive = true;
    },
    onLeave() {
      spheres.physics.cursorActive = false;
    }
  });

  function initialize(opts) {
    if (spheres) { three.clear(); three.scene.remove(spheres); }
    spheres = new Z(three.renderer, opts);
    three.scene.add(spheres);
  }

  three.onBeforeRender = e => { if (!paused) spheres.update(e); };
  three.onAfterResize = e => { spheres.config.maxX = e.wWidth / 2; spheres.config.maxY = e.wHeight / 2; };

  return {
    three,
    get spheres() { return spheres; },
    setCount(n) { initialize({ ...spheres.config, count: n }); },
    togglePause() { paused = !paused; },
    // Manually jump to a specific color preset index (0–4)
    setColorPreset(index) {
      colorIndex = Math.max(0, Math.min(COLOR_PRESETS.length - 1, index));
      spheres.setColors(COLOR_PRESETS[colorIndex]);
    },
    // Cycle to next preset programmatically
    cycleColors() {
      colorIndex = (colorIndex + 1) % COLOR_PRESETS.length;
      spheres.setColors(COLOR_PRESETS[colorIndex]);
    },
    // Adjust brightness at runtime: 0.0–1.0 ambient, 0–200 light
    setBrightness(ambientIntensity, lightIntensity) {
      spheres.setBrightness(ambientIntensity, lightIntensity);
    },
    dispose() {
      canvas.removeEventListener('click', handleClick);
      pointer.dispose();
      three.dispose();
    }
  };
}

// ─── REACT COMPONENT ──────────────────────────────────────────────────────────
const Ballpit = ({
  className = '',
  followCursor = false,
  ambientIntensity = 0.4,   // reduced default brightness
  lightIntensity = 80,      // reduced default brightness
  ...props
}) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const instance = createBallpit(canvas, {
      followCursor,
      ambientIntensity,
      lightIntensity,
      ...props
    });
    if (!instance) { if (canvas.parentNode === container) container.removeChild(canvas); return; }

    instanceRef.current = instance;

    return () => {
      if (instanceRef.current) { instanceRef.current.dispose(); instanceRef.current = null; }
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
};

export default Ballpit;