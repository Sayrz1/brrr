import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ------------------------------------------------------------------ data */
const SLUSH = [
  { id: 'blue-raspberry', name: 'Blue Raspberry', word: 'BLUE', color: '#1e8fff', garnish: 'blueberry', note: 'Sharp, sweet and very blue. The one that stains your tongue for an hour.' },
  { id: 'watermelon', name: 'Watermelon', word: 'MELON', color: '#ff3b55', garnish: 'watermelon', note: 'Pressed watermelon with a squeeze of lime. Tastes like the first warm day of June.' },
  { id: 'mango', name: 'Mango', word: 'MANGO', color: '#ffa21a', garnish: 'mango', note: 'Alphonso mango purée. Ask for a pinch of chilli salt on top.' },
  { id: 'lemon-sherbet', name: 'Lemon Sherbet', word: 'LEMON', color: '#ffe03a', garnish: 'lemon', note: 'Fizzy, tangy and straight out of the sweet-shop jar.' },
  { id: 'cherry-bakewell', name: 'Cherry Bakewell', word: 'CHERRY', color: '#c8103f', garnish: 'cherry', note: 'Black cherry and toasted almond. A jam tart, frozen.', tag: 'Bestseller' },
  { id: 'sour-apple', name: 'Sour Apple', word: 'APPLE', color: '#86d93a', garnish: 'apple', note: 'Granny Smith sharpness that makes your face do the thing.' },
  { id: 'cola-bottle', name: 'Cola Bottle', word: 'COLA', color: '#8a3a12', garnish: 'gummy', note: 'Fizzy cola-bottle sweets, blitzed and frozen. Pick and mix in a cup.' },
];
const SHAKES = [
  { id: 'cookies-cream', name: 'Cookies & Cream', color: '#efe8dc', speck: '#2a1d17', speckAmt: .9, garnish: 'cookie', note: 'Vanilla soft serve and crushed chocolate biscuits, thick enough to need the big straw.', tag: 'New' },
  { id: 'strawberries-cream', name: 'Strawberries & Cream', color: '#ff9fb5', speck: '#ffffff', speckAmt: .5, garnish: 'cherry', note: 'Kent strawberries and fresh cream. Wimbledon in a cup.' },
  { id: 'banoffee', name: 'Banoffee', color: '#e6bf86', speck: '#6b4422', speckAmt: .6, garnish: 'cookie', note: 'Banana, toffee sauce and a digestive biscuit crumb.' },
  { id: 'choc-fudge', name: 'Chocolate Fudge', color: '#6e3d22', speck: '#2a140a', speckAmt: .7, garnish: 'cookie', note: 'Dark chocolate and fudge pieces. Not for the faint-hearted.' },
];
const MYSTERY_ITEM = { id: 'mystery-cup', name: 'Mystery Cup', color: '#ffa21a', colorB: '#1e8fff', note: 'Two flavours, half and half, chosen at random by whoever is on the machine. You find out at the counter.', tag: 'Two flavours' };
const PRICES = { slush: [3, 3.8], shake: [4.2, 4.9] };
const HERO_FLAVOUR = SLUSH[1];
const PRICE_FLAVOUR = SHAKES[0];

const SHOPS = [
  { name: 'Northern Quarter', addr: 'Oldham Street, M1', area: 'City centre', lat: 53.4836, lon: -2.2337 },
  { name: 'Deansgate', addr: 'Deansgate, M3', area: 'City centre', lat: 53.4790, lon: -2.2492 },
  { name: 'Ancoats', addr: 'Cutting Room Square, M4', area: 'City centre', lat: 53.4852, lon: -2.2262 },
  { name: 'Salford Quays', addr: 'The Quays, M50', area: 'West', lat: 53.4712, lon: -2.2962 },
  { name: 'Chorlton', addr: 'Beech Road, M21', area: 'South', lat: 53.4425, lon: -2.2771 },
  { name: 'Didsbury', addr: 'Wilmslow Road, M20', area: 'South', lat: 53.4163, lon: -2.2310 },
  { name: 'Stockport', addr: 'Little Underbank, SK1', area: 'South', lat: 53.4080, lon: -2.1580 },
  { name: 'Altrincham', addr: 'Greenwood Street, WA14', area: 'South', lat: 53.3880, lon: -2.3500 },
];
// Mon-Thu 11-22, Fri-Sat 11-23, Sun 12-21 (UK time)
const HOURS = { Mon: [11, 22], Tue: [11, 22], Wed: [11, 22], Thu: [11, 22], Fri: [11, 23], Sat: [11, 23], Sun: [12, 21] };

const fmt = n => '£' + n.toFixed(2);
const root = document.documentElement;

/* ------------------------------------------------------------- textures */
function grainTexture() {
  const S = 256;
  const a = document.createElement('canvas'); a.width = a.height = S;
  const ca = a.getContext('2d');
  ca.fillStyle = '#808080'; ca.fillRect(0, 0, S, S);
  for (let i = 0; i < 2600; i++) {
    const r = 1 + Math.random() * 4.5;
    ca.fillStyle = Math.random() < .55 ? `rgba(255,255,255,${.12 + Math.random() * .35})` : `rgba(0,0,0,${.1 + Math.random() * .3})`;
    ca.beginPath(); ca.arc(Math.random() * S, Math.random() * S, r, 0, 7); ca.fill();
  }
  const b = document.createElement('canvas'); b.width = b.height = S;
  const cb = b.getContext('2d');
  cb.fillStyle = '#000'; cb.fillRect(0, 0, S, S);
  cb.fillStyle = '#fff';
  for (let i = 0; i < 140; i++) {
    cb.beginPath();
    cb.ellipse(Math.random() * S, Math.random() * S, 1.5 + Math.random() * 3.5, 1 + Math.random() * 2.5, Math.random() * 3, 0, 7);
    cb.fill();
  }
  const da = ca.getImageData(0, 0, S, S).data, db = cb.getImageData(0, 0, S, S).data;
  const out = new Uint8Array(S * S * 4);
  for (let i = 0; i < S * S; i++) { out[i * 4] = da[i * 4]; out[i * 4 + 1] = db[i * 4]; out[i * 4 + 2] = 0; out[i * 4 + 3] = 255; }
  const t = new THREE.DataTexture(out, S, S);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2);
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

function labelTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '800 190px "Bricolage Grotesque", Arial Black, sans-serif';
  g.save(); g.translate(256, 225); g.rotate(-.08); g.fillText('brrr.', 0, 0); g.restore();
  g.font = '700 46px "DM Sans", Arial, sans-serif';
  g.fillText('S L U S H   C O .', 256, 350);
  g.lineWidth = 8; g.strokeStyle = '#fff';
  g.beginPath(); g.moveTo(150, 405); g.lineTo(362, 405); g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function discTexture({ rind, pith, flesh, seg = 0, seeds = 0, seedColor = '#1a1210', core = false }) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'); const m = 128;
  g.fillStyle = rind; g.beginPath(); g.arc(m, m, 128, 0, 7); g.fill();
  if (pith) { g.fillStyle = pith; g.beginPath(); g.arc(m, m, 116, 0, 7); g.fill(); }
  g.fillStyle = flesh; g.beginPath(); g.arc(m, m, pith ? 104 : 114, 0, 7); g.fill();
  const grd = g.createRadialGradient(m, m, 10, m, m, 110);
  grd.addColorStop(0, 'rgba(255,255,255,.25)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.beginPath(); g.arc(m, m, 110, 0, 7); g.fill();
  if (seg) {
    g.strokeStyle = pith; g.lineWidth = 5;
    for (let i = 0; i < seg; i++) { const a = i / seg * Math.PI * 2; g.beginPath(); g.moveTo(m, m); g.lineTo(m + Math.cos(a) * 104, m + Math.sin(a) * 104); g.stroke(); }
    g.fillStyle = pith; g.beginPath(); g.arc(m, m, 10, 0, 7); g.fill();
  }
  if (core) { g.fillStyle = '#e9e0a8'; g.beginPath(); g.arc(m, m, 30, 0, 7); g.fill(); }
  for (let i = 0; i < seeds; i++) {
    const a = i / seeds * Math.PI * 2 + .3, r = core ? 22 : 62 + (i % 2) * 12;
    g.save(); g.translate(m + Math.cos(a) * r, m + Math.sin(a) * r); g.rotate(a);
    g.fillStyle = seedColor; g.beginPath(); g.ellipse(0, 0, 8, 4.5, 0, 0, 7); g.fill(); g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* --------------------------------------------------- slush material */
function slushMaterial(grain) {
  const u = {
    uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uSplit: { value: 1.2 },
    uSpeck: { value: new THREE.Color('#2a1d17') }, uSpeckAmt: { value: 0 },
  };
  const m = new THREE.MeshStandardMaterial({ map: grain, bumpMap: grain, bumpScale: 1.6, roughness: .5, metalness: 0 });
  m.onBeforeCompile = s => {
    Object.assign(s.uniforms, u);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vH;\nvarying float vW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvH = position.y;\nvW = sin(atan(position.z, position.x) * 4.0) * 0.07;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vH;\nvarying float vW;\nuniform vec3 uA;\nuniform vec3 uB;\nuniform float uSplit;\nuniform vec3 uSpeck;\nuniform float uSpeckAmt;')
      .replace('#include <map_fragment>', `
        vec4 tx = texture2D(map, vMapUv);
        float k = smoothstep(uSplit - 0.05, uSplit + 0.05, vH + vW);
        vec3 col = mix(uA, uB, k) * (0.74 + 0.5 * tx.r);
        col = mix(col, uSpeck, tx.g * uSpeckAmt);
        diffuseColor.rgb = col;`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * 0.12;');
  };
  m.userData.u = u;
  return m;
}

/* ------------------------------------------------------------- cup */
const H = 2.2, R_BOT = .6, R_TOP = .86;
const CUP_H = 3.3; // bottom of cup to top of straw, used to fit the viewport
const rAt = y => R_BOT + (R_TOP - R_BOT) * (y / H);

function makeCup(shared) {
  const body = new THREE.Group();
  body.position.y = -1.55;

  const wallPts = [new THREE.Vector2(0, 0), new THREE.Vector2(R_BOT - .04, 0), new THREE.Vector2(R_BOT, .04)];
  for (let i = 1; i <= 20; i++) { const y = H * i / 20; wallPts.push(new THREE.Vector2(rAt(y), y)); }
  const wall = new THREE.Mesh(new THREE.LatheGeometry(wallPts, 72), shared.plastic);
  wall.renderOrder = 2;

  const slushPts = [new THREE.Vector2(0, .03), new THREE.Vector2(R_BOT - .05, .03)];
  const topY = H - .04;
  for (let i = 1; i <= 20; i++) { const y = .03 + (topY - .03) * i / 20; slushPts.push(new THREE.Vector2(rAt(y) - .035, y)); }
  const mat = slushMaterial(shared.grain);
  const slush = new THREE.Mesh(new THREE.LatheGeometry(slushPts, 72), mat);

  const rTop = rAt(topY) - .035;
  const dome = new THREE.SphereGeometry(rTop, 72, 28, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = dome.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const h = v.y / rTop;
    const lump = (.06 * Math.sin(v.x * 9 + 1.3) * Math.cos(v.z * 8.5) + .04 * Math.sin(v.y * 15 + v.x * 6) + .03 * Math.cos(v.z * 13 - v.x * 4)) * h;
    const n = v.clone().normalize();
    v.y *= .66; v.addScaledVector(n, lump); v.y += topY;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  dome.computeVertexNormals();
  const heap = new THREE.Mesh(dome, mat);

  const lidR = R_TOP + .03;
  const lidGeo = new THREE.SphereGeometry(lidR, 72, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  lidGeo.scale(1, .74, 1); lidGeo.translate(0, H + .04, 0);
  const lid = new THREE.Mesh(lidGeo, shared.plastic); lid.renderOrder = 3;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(lidR, .045, 12, 96), shared.rim);
  rim.rotation.x = Math.PI / 2; rim.position.y = H + .03;

  const straw = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.9, 20), shared.straw);
  straw.position.set(.2, 2.75, -.05); straw.rotation.z = -.2;

  const y0 = .5, y1 = 1.62;
  const labelGeo = new THREE.CylinderGeometry(rAt(y1) + .006, rAt(y0) + .006, y1 - y0, 40, 1, true, -.78, 1.56);
  const labelMat = new THREE.MeshStandardMaterial({ map: shared.label, transparent: true, roughness: .45, color: '#121110', polygonOffset: true, polygonOffsetFactor: -2 });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.y = (y0 + y1) / 2; label.renderOrder = 4;

  body.add(slush, heap, label, wall, lid, rim, straw);
  return { body, mat, labelMat };
}

/* ---------------------------------------------------------- garnish */
function extrudedDisc(r, a0, a1, depth, capTex) {
  const s = new THREE.Shape();
  if (a1 - a0 < Math.PI * 2 - .01) { s.moveTo(0, 0); s.lineTo(Math.cos(a0) * r, Math.sin(a0) * r); }
  s.absarc(0, 0, r, a0, a1, false);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: .015, bevelSize: .015, bevelSegments: 2, curveSegments: 40 });
  // map the disc texture straight from shape coordinates so the cut face shows flesh, pith and rind
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (2 * r) * .96 + .5, pos.getY(i) / (2 * r) * .96 + .5);
  uv.needsUpdate = true;
  geo.center();
  // one material for caps and walls: the arc wall samples the rind, the cut walls sample the flesh
  geo.clearGroups();
  return new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: capTex, roughness: .35, clearcoat: .6 }));
}

function makeGarnishFactory() {
  const tex = {
    lemon: discTexture({ rind: '#f2c200', pith: '#fff6cf', flesh: '#ffe55a', seg: 9 }),
    watermelon: discTexture({ rind: '#2f8f3a', pith: '#dcf7c8', flesh: '#ff3b55', seeds: 7 }),
    apple: discTexture({ rind: '#6cc23a', pith: '', flesh: '#f6f2cf', seeds: 4, seedColor: '#4a2a14', core: true }),
  };
  const mats = {
    berry: new THREE.MeshPhysicalMaterial({ color: '#1d2558', roughness: .45, clearcoat: .5, sheen: 1, sheenColor: '#8fa0d8' }),
    mango: new THREE.MeshPhysicalMaterial({ color: '#ffa21a', roughness: .3, clearcoat: 1, emissive: '#7a3b00', emissiveIntensity: .25 }),
    cherry: new THREE.MeshPhysicalMaterial({ color: '#b3102f', roughness: .2, clearcoat: 1 }),
    stem: new THREE.MeshStandardMaterial({ color: '#5a6b1f', roughness: .7 }),
    gummy: new THREE.MeshPhysicalMaterial({ color: '#7b3510', roughness: .25, clearcoat: 1, emissive: '#3a1404', emissiveIntensity: .4 }),
    gummyTop: new THREE.MeshPhysicalMaterial({ color: '#d9a067', roughness: .3, clearcoat: 1 }),
    cookie: new THREE.MeshStandardMaterial({ color: '#2b1b14', roughness: .85 }),
    cream: new THREE.MeshStandardMaterial({ color: '#f3ecdf', roughness: .7 }),
  };
  const bottle = (() => {
    const pts = [[0, 0], [.13, 0], [.16, .06], [.16, .2], [.12, .27], [.07, .33], [.07, .42], [.085, .44], [0, .45]].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 32); g.translate(0, -.22, 0); return g;
  })();

  return kind => {
    const g = new THREE.Group();
    switch (kind) {
      case 'lemon': g.add(extrudedDisc(.34, 0, Math.PI * 2, .07, tex.lemon)); break;
      case 'watermelon': g.add(extrudedDisc(.62, Math.PI / 3, Math.PI * 2 / 3, .14, tex.watermelon)); break;
      case 'apple': g.add(extrudedDisc(.42, 0, Math.PI, .1, tex.apple)); break;
      case 'mango': g.add(new THREE.Mesh(new RoundedBoxGeometry(.32, .32, .32, 3, .07), mats.mango)); break;
      case 'blueberry': {
        for (let i = 0; i < 2; i++) {
          const b = new THREE.Mesh(new THREE.SphereGeometry(.12, 24, 16), mats.berry);
          b.position.set(i * .2 - .1, i * .06, i * .05); g.add(b);
          const crown = new THREE.Mesh(new THREE.TorusGeometry(.035, .012, 6, 12), mats.stem);
          crown.position.set(i * .2 - .1, i * .06 + .115, i * .05); crown.rotation.x = Math.PI / 2; g.add(crown);
        }
        break;
      }
      case 'cherry': {
        const c = new THREE.Mesh(new THREE.SphereGeometry(.2, 28, 20), mats.cherry); c.scale.set(1, .92, 1); g.add(c);
        const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, .16, 0), new THREE.Vector3(.04, .4, 0), new THREE.Vector3(.2, .55, 0));
        g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, .018, 8), mats.stem));
        break;
      }
      case 'gummy': {
        const m = new THREE.Mesh(bottle, mats.gummy); g.add(m);
        const top = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .14, 20), mats.gummyTop); top.position.y = .14; g.add(top);
        g.scale.setScalar(1.15);
        break;
      }
      case 'cookie': {
        const a = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .07, 36), mats.cookie); a.position.y = .06;
        const b = a.clone(); b.position.y = -.06;
        const cr = new THREE.Mesh(new THREE.CylinderGeometry(.27, .27, .06, 36), mats.cream);
        g.add(a, b, cr);
        break;
      }
    }
    return g;
  };
}

const SLOTS = [
  [-1.6, 1.05, .3], [1.55, 1.4, -.3], [-1.4, -.8, .7], [1.5, -.6, .55], [-1.05, 1.8, -.7], [1.05, -1.55, .9],
];
const ICE_SLOTS = [[-1.2, 1.95, .5], [1.3, .45, -.9], [-.65, -1.6, 1]];

/* ----------------------------------------------------------- stage */
function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

const S = { x: .45, y: -.04, s: .74, rz: 0, intro: reduce ? 1 : 0 };
let stage = null;
let thumbs = {};

function buildStage() {
  const canvas = $('#stage');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 860 ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = .95;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
  camera.position.set(0, 0, 14);

  const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(3, 5, 5);
  const rimL = new THREE.DirectionalLight(0xffffff, 1.4); rimL.position.set(-3, 2, -4);
  scene.add(key, rimL, new THREE.AmbientLight(0xffffff, .25));

  const shared = {
    grain: grainTexture(),
    label: labelTexture(),
    plastic: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .2, roughness: .05, clearcoat: 1, clearcoatRoughness: .04, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 }),
    rim: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .55, roughness: .1, clearcoat: 1 }),
    straw: new THREE.MeshStandardMaterial({ color: '#ffe01a', roughness: .35 }),
  };

  const rig = new THREE.Group();
  const spinner = new THREE.Group();
  const cup = makeCup(shared);
  spinner.add(cup.body);
  const garnish = new THREE.Group();
  rig.add(spinner, garnish);
  scene.add(rig);

  const iceMat = new THREE.MeshPhysicalMaterial({ color: '#eaf6ff', transparent: true, opacity: .55, roughness: .08, clearcoat: 1, envMapIntensity: 2 });
  const ice = ICE_SLOTS.map(([x, y, z], i) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(.38, .38, .38, 3, .07), iceMat);
    m.position.set(x, y, z); m.rotation.set(i, i * 2, i * .5);
    m.userData = { base: new THREE.Vector3(x, y, z), phase: i * 1.7, spin: new THREE.Vector3(.2, .3, .1) };
    garnish.add(m); return m;
  });

  const makeGarnish = makeGarnishFactory();
  let garnishItems = [];

  function setGarnish(kindA, kindB = kindA) {
    const old = garnishItems;
    old.forEach(o => gsap.to(o.scale, { x: 0, y: 0, z: 0, duration: reduce ? 0 : .3, ease: 'power2.in', onComplete: () => garnish.remove(o) }));
    garnishItems = SLOTS.map(([x, y, z], i) => {
      const o = makeGarnish(i % 2 ? kindB : kindA);
      const base = new THREE.Vector3(x, y, z);
      o.userData = { base, phase: Math.random() * 6, spin: new THREE.Vector3(Math.random() * .6 - .3, Math.random() * .8 - .4, Math.random() * .4 - .2), burst: 0 };
      o.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      garnish.add(o);
      if (reduce) return o;
      o.scale.setScalar(0);
      gsap.to(o.scale, { x: 1, y: 1, z: 1, duration: .8, delay: .15 + i * .05, ease: 'back.out(2.2)' });
      o.userData.burst = 1;
      gsap.to(o.userData, { burst: 0, duration: 1.1, delay: .1 + i * .05, ease: 'expo.out' });
      return o;
    });
  }

  const u = cup.mat.userData.u;
  const colA = new THREE.Color(), colB = new THREE.Color();
  const glowEl = $('.glow');
  const spin = { v: 0 }, shake = { v: 0 };
  let current = null;

  function luminance(hex) { const c = new THREE.Color(hex); return .2126 * c.r + .7152 * c.g + .0722 * c.b; }

  // flavour: { a, b?, speck?, speckAmt?, garnishA, garnishB? }
  function setFlavour(f, { immediate = false, twirl = true } = {}) {
    const key = [f.a, f.b, f.speckAmt, f.garnishA, f.garnishB].join('|');
    if (key === current) return;
    current = key;
    const d = immediate || reduce ? 0 : .7;
    colA.set(f.a); colB.set(f.b || f.a);
    gsap.to(u.uA.value, { r: colA.r, g: colA.g, b: colA.b, duration: d, ease: 'power2.out' });
    gsap.to(u.uB.value, { r: colB.r, g: colB.g, b: colB.b, duration: d, ease: 'power2.out' });
    if (f.speck) u.uSpeck.value.set(f.speck);
    gsap.to(u.uSpeckAmt, { value: f.speckAmt || 0, duration: d });
    const lc = new THREE.Color(luminance(f.a) > .3 ? '#121110' : '#f6f4ee');
    gsap.to(cup.labelMat.color, { r: lc.r, g: lc.g, b: lc.b, duration: d });
    root.style.setProperty('--flavour', f.a);
    setGarnish(f.garnishA, f.garnishB);
    if (twirl && !reduce && !immediate) gsap.fromTo(spin, { v: 0 }, { v: Math.PI * 2, duration: 1.2, ease: 'power3.inOut' });
  }

  function doShake() {
    if (reduce) return;
    gsap.fromTo(shake, { v: 0 }, { v: 1, duration: .9, ease: 'none' });
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', e => { pointer.tx = e.clientX / innerWidth - .5; pointer.ty = e.clientY / innerHeight - .5; }, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const tmp = new THREE.Vector3();
  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const vw = vh * camera.aspect;
    const sc = Math.max(.001, S.s * S.intro * vh / CUP_H);
    const offscreen = S.y > 1.5;
    glowEl.style.opacity = offscreen ? 0 : '';
    if (offscreen) { renderer.clear(); return; }

    pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05;
    const idle = reduce ? 0 : 1;
    const bob = Math.sin(t * 1.2) * .05 * idle;
    rig.position.set(S.x * vw / 2, S.y * vh / 2 + bob * sc, 0);
    rig.scale.setScalar(sc);
    const shakeZ = Math.sin(shake.v * Math.PI * 10) * .22 * Math.sin(shake.v * Math.PI);
    rig.rotation.z = S.rz + shakeZ;
    spinner.rotation.y = -.35 + spin.v + (Math.sin(t * .5) * .3 + pointer.x * .5) * idle + (1 - S.intro) * -3;
    spinner.rotation.x = (pointer.y * .15) * idle + .06;
    garnish.rotation.y = t * .08 * idle;

    for (const o of [...garnishItems, ...ice]) {
      const d = o.userData;
      const k = 1 - d.burst * .75;
      o.position.set(d.base.x * k, d.base.y * k + Math.sin(t * .9 + d.phase) * .09 * idle, d.base.z * k);
      if (idle) { o.rotation.x += d.spin.x * .01; o.rotation.y += d.spin.y * .01; o.rotation.z += d.spin.z * .01; }
    }

    renderer.render(scene, camera);

    tmp.copy(rig.position).project(camera);
    glowEl.style.setProperty('--gx', ((tmp.x + 1) / 2 * innerWidth) + 'px');
    glowEl.style.setProperty('--gy', ((1 - tmp.y) / 2 * innerHeight) + 'px');
    glowEl.style.setProperty('--gs', (S.s * S.intro * 1.6).toFixed(3));
  }
  gsap.ticker.add(frame);

  // Thumbnails: same cup model, rendered once per drink to a PNG.
  function renderThumbs(items) {
    const w = 360, h = 440;
    const r2 = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r2.setSize(w, h); r2.outputColorSpace = THREE.SRGBColorSpace;
    r2.toneMapping = THREE.LinearToneMapping; r2.toneMappingExposure = .95;
    const s2 = new THREE.Scene();
    s2.environment = new THREE.PMREMGenerator(r2).fromScene(new RoomEnvironment(r2), .04).texture;
    const k2 = key.clone(), rl2 = rimL.clone();
    s2.add(k2, rl2, new THREE.AmbientLight(0xffffff, .25));
    const cam = new THREE.PerspectiveCamera(30, w / h, .1, 100); cam.position.set(0, .2, 6.9);
    const c2 = makeCup(shared);
    c2.body.rotation.set(.12, -.35, 0); c2.body.position.y = -1.6;
    s2.add(c2.body);
    const u2 = c2.mat.userData.u;
    const out = {};
    for (const it of items) {
      u2.uA.value.set(it.color); u2.uB.value.set(it.colorB || it.color);
      u2.uSplit.value = 1.2;
      u2.uSpeckAmt.value = it.speckAmt || 0; if (it.speck) u2.uSpeck.value.set(it.speck);
      c2.labelMat.color.set(luminance(it.color) > .3 ? '#121110' : '#f6f4ee');
      r2.render(s2, cam);
      out[it.id] = r2.domElement.toDataURL('image/png');
    }
    r2.dispose(); r2.forceContextLoss();
    return out;
  }

  return { setFlavour, doShake, renderThumbs, uSplit: u.uSplit };
}

/* ------------------------------------------- fallback thumbnails (no WebGL) */
function svgCup(color, colorB = color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset=".5" stop-color="${colorB}"/><stop offset=".5" stop-color="${color}"/></linearGradient></defs><path d="M38 70h104l-12 136a8 8 0 0 1-8 7H58a8 8 0 0 1-8-7z" fill="url(#g)"/><path d="M32 70a58 46 0 0 1 116 0z" fill="${color}" opacity=".9"/><path d="M28 70a62 52 0 0 1 124 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/><rect x="96" y="2" width="9" height="60" rx="4" fill="#ffe01a" transform="rotate(12 100 60)"/></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

/* -------------------------------------------------------------- picker */
const picker = { idx: 0 };
function flavourOf(item) {
  return { a: item.color, speck: item.speck, speckAmt: item.speckAmt || 0, garnishA: item.garnish };
}

function initPicker() {
  const list = $('.picker-list');
  list.innerHTML = SLUSH.map((f, i) => `<li><button type="button" data-i="${i}">${f.name}</button></li>`).join('');
  $('.picker-count span').textContent = String(SLUSH.length).padStart(2, '0');
  // without the pinned scroll (reduced motion), the list is a plain set of buttons
  if (reduce) list.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showPicker(+b.dataset.i); });
  showPicker(0, true);
}

function showPicker(i, first = false) {
  picker.idx = i;
  const f = SLUSH[i];
  $$('.picker-list button').forEach((b, j) => b.setAttribute('aria-current', j === i ? 'true' : 'false'));
  const list = $('.picker-list'), active = $$('.picker-list button')[i];
  // on mobile the list is a horizontal chip row: keep the active chip in view
  if (active && list.scrollWidth > list.clientWidth) list.scrollTo({ left: active.parentElement.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  $('.picker-count b').textContent = String(i + 1).padStart(2, '0');
  const word = $('.picker-word');
  word.textContent = f.word;
  $('.picker-name').textContent = f.name;
  $('.picker-note').textContent = f.note;
  $('.picker-price').innerHTML = `${fmt(PRICES.slush[0])} <span>regular</span>`;
  const img = $('.picker-thumb');
  img.src = thumbs[f.id] || ''; img.alt = `${f.name} slush`;
  if (!first && !reduce) {
    gsap.fromTo(word, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .7, ease: 'expo.out' });
    gsap.fromTo('.picker-card > *', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, stagger: .06, ease: 'power3.out' });
  }
  if (zone === 'picker') stage?.setFlavour(flavourOf(f));
  else root.style.setProperty('--flavour', f.color);
}

/* -------------------------------------------------------------- mystery */
const mix = { a: SLUSH[2], b: SLUSH[0] };
function mixFlavour() { return { a: mix.a.color, b: mix.b.color, garnishA: mix.a.garnish, garnishB: mix.b.garnish }; }
function initMystery() {
  const btn = $('.shake-btn'), out = $('.mystery-result');
  let busy = false;
  btn.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    let a, b;
    do { a = SLUSH[Math.floor(Math.random() * SLUSH.length)]; b = SLUSH[Math.floor(Math.random() * SLUSH.length)]; }
    while (a === b || (a === mix.a && b === mix.b));
    const finish = () => {
      mix.a = a; mix.b = b;
      out.innerHTML = `You got: <b>${a.name}</b> and <b>${b.name}</b>`;
      if (zone === 'mystery') stage?.setFlavour(mixFlavour(), { twirl: true });
      busy = false;
    };
    if (reduce || !stage) return finish();
    stage.doShake();
    out.textContent = 'Shaking…';
    // quick slot-machine flicker of colours before landing on the mix
    let n = 0;
    const tick = () => {
      const r = SLUSH[n % SLUSH.length], q = SLUSH[(n * 3 + 2) % SLUSH.length];
      if (zone === 'mystery') stage.setFlavour({ a: r.color, b: q.color, garnishA: mix.a.garnish, garnishB: mix.b.garnish }, { immediate: true });
      if (++n < 9) setTimeout(tick, 80); else finish();
    };
    tick();
  });
}

/* ---------------------------------------------------------------- menu */
function initMenu() {
  const grid = $('.menu-grid');
  const tabs = $$('.tabs [role=tab]');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  const render = cat => {
    const items = cat === 'slush' ? [...SLUSH, MYSTERY_ITEM] : SHAKES;
    const [pr] = PRICES[cat];
    grid.innerHTML = items.map((it, i) => `
      <li style="--i:${i}">
        <button class="menu-item" type="button" data-id="${it.id}" style="--c:${it.color}">
          ${it.tag ? `<span class="tag">${it.tag}</span>` : ''}
          <img src="${thumbs[it.id]}" alt="" width="360" height="440" loading="lazy">
          <span class="name">${it.name}</span>
          <span class="meta"><span>${cat === 'slush' ? 'Slush' : 'Shake'}</span><b>from ${fmt(pr)}</b></span>
        </button>
      </li>`).join('');
    $$('li', grid).forEach(li => reduce ? li.classList.add('in') : io.observe(li));
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-selected', x === t ? 'true' : 'false'));
    render(t.dataset.cat);
  }));
  $('.tabs').addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); n.click();
  });
  render('slush');

  const dlg = $('.item-dialog');
  grid.addEventListener('click', e => {
    const b = e.target.closest('.menu-item'); if (!b) return;
    const it = [...SLUSH, MYSTERY_ITEM, ...SHAKES].find(x => x.id === b.dataset.id);
    const cat = SHAKES.includes(it) ? 'shake' : 'slush';
    dlg.style.setProperty('--c', it.color);
    $('.dlg-img', dlg).src = thumbs[it.id]; $('.dlg-img', dlg).alt = `${it.name} ${cat}`;
    $('#dlg-name').textContent = it.name;
    $('.dlg-note', dlg).textContent = it.note;
    $('.p-r', dlg).textContent = fmt(PRICES[cat][0]);
    $('.p-l', dlg).textContent = fmt(PRICES[cat][1]);
    dlg.showModal();
    lenis?.stop();
  });
  dlg.addEventListener('close', () => lenis?.start());
  $('.dlg-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  $('.dlg-cta').addEventListener('click', () => dlg.close());
}

/* --------------------------------------------------------------- shops */
function londonNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map(p => [p.type, p.value]));
  return { day: parts.weekday, h: +parts.hour + +parts.minute / 60 };
}
function status() {
  const { day, h } = londonNow();
  const [o, c] = HOURS[day] || [11, 22];
  if (h >= o && h < c) return { open: true, text: `Open now, until ${c}:00` };
  return { open: false, text: h < o ? `Closed, opens at ${o}:00` : 'Closed, opens tomorrow' };
}

function initShops() {
  const list = $('.shop-list'), pins = $('.pins');
  const st = status();
  // simple equirectangular projection onto the 600x500 map
  const px = lon => (lon + 2.37) / .23 * 100, py = lat => (53.5 - lat) / .13 * 100;
  list.innerHTML = SHOPS.map((s, i) => `
    <li data-area="${s.area}">
      <button class="shop" type="button" data-i="${i}">
        <span class="shop-name">${s.name}</span>
        <span class="shop-addr">${s.addr}</span>
        <span class="shop-status ${st.open ? 'open' : ''}"><i class="ph-bold ph-clock"></i>${st.text}</span>
      </button>
    </li>`).join('');
  pins.innerHTML = SHOPS.map((s, i) => `
    <button class="pin" type="button" data-i="${i}" data-area="${s.area}" style="left:${px(s.lon)}%;top:${py(s.lat)}%" aria-label="${s.name}">
      <i class="ph-fill ph-map-pin"></i><span class="tip">${s.name}</span>
    </button>`).join('');
  const select = i => {
    $$('.shop').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
    $$('.pin').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
  };
  list.addEventListener('click', e => { const b = e.target.closest('.shop'); if (b) select(+b.dataset.i); });
  pins.addEventListener('click', e => { const b = e.target.closest('.pin'); if (b) select(+b.dataset.i); });
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));
    const a = c.dataset.area;
    $$('li', list).forEach(li => li.hidden = a !== 'all' && li.dataset.area !== a);
    $$('.pin').forEach(p => p.hidden = a !== 'all' && p.dataset.area !== a);
  }));
  select(0);
}

/* ------------------------------------------------------------ scroll */
let zone = 'hero';
let lenis = null;
const STATIONS = {
  desktop: { hero: { x: .45, y: -.04, s: .74, rz: -.06 }, picker: { x: 0, y: -.1, s: .6, rz: 0 }, price: { x: -.5, y: -.1, s: .66, rz: .12 }, mystery: { x: .48, y: -.02, s: .72, rz: -.08 }, gone: { x: .48, y: 1.7, s: .3, rz: -.4 } },
  mobile: { hero: { x: 0, y: .4, s: .42, rz: -.05 }, picker: { x: 0, y: .12, s: .4, rz: 0 }, price: { x: .3, y: .44, s: .4, rz: .12 }, mystery: { x: .25, y: .42, s: .4, rz: -.08 }, gone: { x: .25, y: 1.7, s: .3, rz: -.4 } },
};

function setZone(z) {
  if (zone === z) return;
  zone = z;
  if (!stage) return;
  if (z === 'hero') stage.setFlavour(flavourOf(HERO_FLAVOUR));
  if (z === 'picker') stage.setFlavour(flavourOf(SLUSH[picker.idx]));
  if (z === 'price') stage.setFlavour(flavourOf(PRICE_FLAVOUR));
  if (z === 'mystery') stage.setFlavour(mixFlavour());
}

function initScroll() {
  if (!reduce) {
    lenis = new window.Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = id === '#top' ? document.body : $(id);
    if (!el) return;
    e.preventDefault();
    closeMobileNav();
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView();
  }));

  const n = SLUSH.length;
  const mm = gsap.matchMedia();
  mm.add({ d: '(min-width: 861px)', m: '(max-width: 860px)' }, ctx => {
    const st = ctx.conditions.d ? STATIONS.desktop : STATIONS.mobile;
    Object.assign(S, st.hero);

    // Zones switch when the next section's top reaches mid-screen. One resolver reads the marks' starts,
    // which ScrollTrigger keeps correct after the picker's pin spacing is added.
    const ZONES = ['hero', 'picker', 'price', 'mystery', 'none'];
    // (created after the pin so their positions include its spacing)
    const zoneResolver = () => {
      const marks = ['#flavours', '#price', '#mystery', '#menu'].map(trigger => ScrollTrigger.create({ trigger, start: 'top 50%' }));
      const resolve = () => {
        const z = ZONES[marks.filter(m => scrollY >= m.start).length];
        if (reduce) Object.assign(S, st[z === 'none' ? 'gone' : z]);
        setZone(z);
      };
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: resolve, onRefresh: resolve });
      // nav swaps to dark-on-yellow while it sits over a yellow block
      ['#price', '.story', '.order-card'].forEach(trigger => ScrollTrigger.create({
        trigger, start: 'top 60px', end: 'bottom 60px', toggleClass: { targets: '.nav', className: 'on-yellow' },
      }));
    };

    if (reduce) return zoneResolver();

    const pin = ScrollTrigger.create({
      trigger: '#flavours', start: 'top top', end: () => '+=' + innerHeight * n * .55, pin: true, anticipatePin: 1,
      onUpdate: self => {
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        if (i !== picker.idx) showPicker(i);
      },
    });
    zoneResolver();
    $('.picker-list').onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      const i = +b.dataset.i;
      const y = pin.start + (pin.end - pin.start) * (i + .5) / n;
      lenis ? lenis.scrollTo(y, { duration: 1 }) : scrollTo(0, y);
    };

    const seg = (from, to, trigger, start = 'top bottom', end = 'top top') =>
      gsap.fromTo(S, { ...from }, { ...to, ease: 'none', immediateRender: false, scrollTrigger: { trigger, start, end, scrub: 1 } });
    seg(st.hero, st.picker, '#flavours');
    seg(st.picker, st.price, '#price');
    seg(st.price, st.mystery, '#mystery');
    seg(st.mystery, st.gone, '#menu', 'top bottom', 'top 30%');

    // section reveals
    gsap.from('.price-copy > *', { y: 60, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#price', start: 'top 60%' } });
    gsap.from('.mystery-copy > *', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#mystery', start: 'top 60%' } });
    gsap.from('.story-copy > *, .story-art', { y: 50, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.story', start: 'top 70%' } });
    gsap.from('.order-card', { y: 60, opacity: 0, scale: .97, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.order', start: 'top 80%' } });
    gsap.from('.shop-list li', { y: 24, opacity: 0, stagger: .04, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.shops-body', start: 'top 75%' } });
  });

  // mascot waves while in view
  if (!reduce) {
    const wave = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true })
      .to('.mascot .arm-r', { rotate: -18, duration: .25, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to('.mascot', { y: -10, duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' }, 0);
    ScrollTrigger.create({ trigger: '.story', start: 'top bottom', end: 'bottom top', onToggle: s => s.isActive ? wave.play() : wave.pause() });
  }

  // nav highlight
  [['#flavours', 0], ['#menu', 1], ['#shops', 2]].forEach(([id, i]) => ScrollTrigger.create({
    trigger: id, start: 'top 50%', end: 'bottom 50%',
    onToggle: s => $$('.nav-links a')[i].setAttribute('aria-current', s.isActive ? 'true' : 'false'),
  }));
}

function intro() {
  if (reduce) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-title .line > span', { yPercent: 110, duration: 1.2, stagger: .12 })
    .from('.badge, .hero-sub, .hero-ctas', { y: 24, opacity: 0, duration: 1, stagger: .08 }, .25)
    .from('.nav', { y: -30, opacity: 0, duration: 1 }, .1)
    .to(S, { intro: 1, duration: 1.6, ease: 'expo.out' }, .15);
}

/* ------------------------------------------------------------- mobile nav */
const toggle = $('.nav-toggle'), mnav = $('#mobile-nav');
function closeMobileNav() { mnav.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.innerHTML = '<i class="ph-bold ph-list"></i>'; }
toggle.addEventListener('click', () => {
  const open = mnav.hidden;
  mnav.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  toggle.innerHTML = `<i class="ph-bold ${open ? 'ph-x' : 'ph-list'}"></i>`;
});
addEventListener('keydown', e => { if (e.key === 'Escape' && !mnav.hidden) { closeMobileNav(); toggle.focus(); } });

/* --------------------------------------------------------------- boot */
(async function boot() {
  try { await Promise.race([document.fonts.load('800 100px "Bricolage Grotesque"'), new Promise(r => setTimeout(r, 1500))]); } catch { /* fonts are optional */ }

  const all = [...SLUSH, MYSTERY_ITEM, ...SHAKES];
  if (webglOK()) {
    try {
      stage = buildStage();
      thumbs = stage.renderThumbs(all);
      stage.setFlavour(flavourOf(HERO_FLAVOUR), { immediate: true });
    } catch (err) {
      console.warn('3D stage unavailable, using flat fallback', err);
      stage = null;
    }
  }
  if (!stage) {
    root.classList.add('no-webgl');
    S.intro = 1;
    all.forEach(it => thumbs[it.id] = svgCup(it.color, it.colorB));
  }

  initPicker();
  initMystery();
  initMenu();
  initShops();
  initScroll();
  intro();
  ScrollTrigger.refresh();
})();
