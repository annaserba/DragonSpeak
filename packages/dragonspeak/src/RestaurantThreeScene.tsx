import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Fog,
  Group,
  Mesh,
  Object3D,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  TorusGeometry,
  WebGLRenderer,
} from "three";

type Props = {
  active: boolean;
};

const createTextTexture = (text: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    return new Texture();
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgba(70, 24, 24, 0.98)");
  gradient.addColorStop(1, "rgba(17, 12, 12, 0.96)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#f4c259";
  context.lineWidth = 10;
  context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
  context.strokeStyle = "rgba(244, 194, 89, 0.3)";
  context.lineWidth = 3;
  context.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);
  context.fillStyle = "#f4c259";
  context.font = "800 96px serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const addMesh = (
  group: Group,
  geometry: BufferGeometry,
  material: MeshStandardMaterial,
  position: [number, number, number],
  scale: [number, number, number] = [1, 1, 1],
) => {
  const mesh = new Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
};

const addSprite = (
  group: Group,
  texture: Texture,
  position: [number, number, number],
  scale: [number, number, number],
) => {
  const sprite = new Sprite(new SpriteMaterial({ map: texture, transparent: true }));
  sprite.position.set(...position);
  sprite.scale.set(...scale);
  group.add(sprite);
  return sprite;
};

const addLantern = (
  group: Group,
  redMaterial: MeshStandardMaterial,
  goldMaterial: MeshStandardMaterial,
  position: [number, number, number],
) => {
  const lantern = new Group();
  lantern.position.set(...position);
  group.add(lantern);

  const body = addMesh(
    lantern,
    new SphereGeometry(0.28, 32, 18),
    redMaterial,
    [0, 0, 0],
    [1, 1.22, 1],
  );
  body.castShadow = false;
  addMesh(lantern, new CylinderGeometry(0.16, 0.16, 0.06, 24), goldMaterial, [0, 0.35, 0]);
  addMesh(lantern, new CylinderGeometry(0.15, 0.15, 0.05, 24), goldMaterial, [0, -0.35, 0]);
  addMesh(lantern, new TorusGeometry(0.2, 0.012, 8, 32), goldMaterial, [0, 0.01, 0]);
  const light = new PointLight("#ffb64f", 1.1, 2.4);
  light.position.set(position[0], position[1] - 0.1, position[2] + 0.15);
  group.add(light);

  return lantern;
};

const addRoundTable = (
  group: Group,
  woodMaterial: MeshStandardMaterial,
  goldMaterial: MeshStandardMaterial,
  position: [number, number, number],
) => {
  const table = new Group();
  table.position.set(...position);
  group.add(table);

  addMesh(table, new CylinderGeometry(0.52, 0.52, 0.08, 40), woodMaterial, [0, 0.18, 0]);
  addMesh(table, new CylinderGeometry(0.08, 0.1, 0.46, 24), woodMaterial, [0, -0.08, 0]);
  addMesh(table, new CylinderGeometry(0.32, 0.38, 0.05, 32), goldMaterial, [0, -0.34, 0]);

  const seatPositions: [number, number, number][] = [
    [-0.74, -0.26, 0],
    [0.74, -0.26, 0],
    [0, -0.26, -0.74],
  ];

  seatPositions.forEach((seatPosition) => {
    addMesh(table, new CylinderGeometry(0.17, 0.18, 0.08, 24), woodMaterial, seatPosition);
    addMesh(table, new CylinderGeometry(0.04, 0.05, 0.3, 16), woodMaterial, [
      seatPosition[0],
      -0.44,
      seatPosition[2],
    ]);
  });

  return table;
};

function RestaurantThreeScene({ active }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new Scene();
    scene.background = new Color("#16100f");
    scene.fog = new Fog("#16100f", 5, 12);

    const camera = new PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 2.2, 7.2);

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const root = new Group();
    scene.add(root);
    const floatingDetails = new Group();
    root.add(floatingDetails);

    const floorMaterial = new MeshStandardMaterial({ color: "#15110f", roughness: 0.9 });
    const backWallMaterial = new MeshStandardMaterial({ color: "#2a1716", roughness: 0.78 });
    const redMaterial = new MeshStandardMaterial({
      color: "#8e202d",
      emissive: "#260405",
      emissiveIntensity: 0.12,
      roughness: 0.62,
    });
    const lanternMaterial = new MeshStandardMaterial({
      color: "#b33139",
      emissive: "#8e202d",
      emissiveIntensity: 0.42,
      roughness: 0.42,
    });
    const woodMaterial = new MeshStandardMaterial({ color: "#8a542c", roughness: 0.68 });
    const darkWoodMaterial = new MeshStandardMaterial({ color: "#4a2a19", roughness: 0.72 });
    const jadeMaterial = new MeshStandardMaterial({
      color: "#5d8f78",
      emissive: "#183229",
      emissiveIntensity: 0.08,
      roughness: 0.48,
    });
    const goldMaterial = new MeshStandardMaterial({
      color: "#f4c259",
      emissive: "#6a4312",
      emissiveIntensity: active ? 0.42 : 0.18,
      roughness: 0.35,
    });
    const teaMaterial = new MeshStandardMaterial({ color: "#d8ead0", roughness: 0.42 });
    const porcelainMaterial = new MeshStandardMaterial({
      color: "#f3efe0",
      roughness: 0.34,
      metalness: 0.02,
    });
    const windowMaterial = new MeshStandardMaterial({
      color: "#13202c",
      emissive: "#1b344a",
      emissiveIntensity: 0.22,
      roughness: 0.56,
      side: DoubleSide,
    });
    const skylineMaterial = new MeshStandardMaterial({
      color: "#05080d",
      emissive: "#152b46",
      emissiveIntensity: 0.24,
      roughness: 0.9,
    });
    const steamMaterial = new MeshStandardMaterial({
      color: "#fff3d4",
      emissive: "#ffe7b0",
      emissiveIntensity: 0.26,
      opacity: 0.34,
      transparent: true,
      roughness: 0.2,
    });

    addMesh(root, new PlaneGeometry(10, 7), floorMaterial, [0, -1.05, 0], [1, 1, 1]).rotation.x =
      -Math.PI / 2;
    addMesh(root, new PlaneGeometry(10, 5), backWallMaterial, [0, 1.38, -2.8]);
    addMesh(root, new PlaneGeometry(5.2, 2), windowMaterial, [0.2, 1.25, -2.72]);
    addMesh(root, new BoxGeometry(5.45, 0.08, 0.08), goldMaterial, [0.2, 2.28, -2.62]);
    addMesh(root, new BoxGeometry(5.45, 0.08, 0.08), goldMaterial, [0.2, 0.22, -2.62]);
    addMesh(root, new BoxGeometry(0.08, 2.08, 0.08), goldMaterial, [-2.54, 1.25, -2.62]);
    addMesh(root, new BoxGeometry(0.08, 2.08, 0.08), goldMaterial, [2.94, 1.25, -2.62]);
    addMesh(root, new BoxGeometry(0.06, 2, 0.07), goldMaterial, [0.2, 1.25, -2.6]);

    [-1.9, -1.35, -0.75, -0.2, 0.42, 1.05, 1.62, 2.18].forEach((x, index) => {
      const height = 0.26 + (index % 4) * 0.17;
      addMesh(root, new BoxGeometry(0.28, height, 0.08), skylineMaterial, [
        x,
        0.36 + height / 2,
        -2.54,
      ]);
    });
    addMesh(root, new SphereGeometry(0.11, 18, 12), goldMaterial, [2.38, 1.7, -2.5]);

    addMesh(root, new BoxGeometry(8.1, 0.12, 0.22), goldMaterial, [0, 2.5, -2.47]);
    addMesh(root, new BoxGeometry(5.8, 0.62, 1.45), woodMaterial, [0, -0.45, -1.05]);
    addMesh(root, new BoxGeometry(5.9, 0.08, 1.5), darkWoodMaterial, [0, -0.08, -1.02]);
    addMesh(root, new BoxGeometry(0.2, 2.8, 0.2), redMaterial, [-3.7, 0.35, -2.55]);
    addMesh(root, new BoxGeometry(0.2, 2.8, 0.2), redMaterial, [3.7, 0.35, -2.55]);
    addMesh(root, new BoxGeometry(6.2, 0.18, 0.28), goldMaterial, [0, 1.78, -2.48]);
    addMesh(root, new BoxGeometry(2.3, 0.12, 0.36), darkWoodMaterial, [-2.4, 0.72, -2.34]);
    addMesh(root, new BoxGeometry(2.3, 0.12, 0.36), darkWoodMaterial, [-2.4, 1.16, -2.34]);

    [-3.15, -2.65, -2.12, -1.65].forEach((x, index) => {
      addMesh(root, new CylinderGeometry(0.1, 0.12, 0.12, 24), porcelainMaterial, [
        x,
        0.86 + (index % 2) * 0.44,
        -2.12,
      ]);
      addMesh(root, new SphereGeometry(0.06, 16, 10), jadeMaterial, [
        x + 0.08,
        0.97 + (index % 2) * 0.44,
        -2.12,
      ]);
    });

    const dragon = new Group();
    dragon.position.set(1.8, 0.55, -1.32);
    root.add(dragon);

    const dBody = new MeshStandardMaterial({
      color: "#cc3b35",
      roughness: 0.32,
    });
    const dDark = new MeshStandardMaterial({
      color: "#8b2220",
      roughness: 0.28,
    });
    const dBelly = new MeshStandardMaterial({
      color: "#fae3c8",
      roughness: 0.38,
    });
    const dWing = new MeshStandardMaterial({
      color: "#d1544e",
      roughness: 0.3,
      side: DoubleSide,
      transparent: true,
      opacity: 0.82,
    });
    const dHorn = new MeshStandardMaterial({
      color: "#f5ede0",
      roughness: 0.18,
    });
    const dSpine = new MeshStandardMaterial({
      color: "#ff7060",
      roughness: 0.25,
    });
    const dEyeWhite = new MeshStandardMaterial({
      color: "#fefef8",
      roughness: 0.08,
    });
    const dIris = new MeshStandardMaterial({
      color: "#5cb840",
      emissive: "#22441a",
      emissiveIntensity: 0.4,
      roughness: 0.06,
    });
    const dPupil = new MeshStandardMaterial({ color: "#111" });
    const dCatchlight = new MeshStandardMaterial({
      color: "#fff",
      emissive: "#fff",
      emissiveIntensity: 0.9,
    });
    const dNose = new MeshStandardMaterial({
      color: "#5a1818",
      roughness: 0.2,
    });

    // Body — smooth oval
    addMesh(dragon, new SphereGeometry(0.34, 36, 24), dBody, [0.15, -0.08, 0], [1, 0.82, 0.88]);
    addMesh(dragon, new SphereGeometry(0.28, 28, 20), dBelly, [0.15, -0.2, 0.25], [0.75, 0.5, 0.42]);

    // Head group
    const head = new Group();
    head.position.set(-0.32, 0.28, 0);
    dragon.add(head);

    // Main head sphere
    addMesh(head, new SphereGeometry(0.3, 32, 24), dBody, [0, 0, 0], [1, 0.94, 0.96]);

    // Snout
    addMesh(head, new SphereGeometry(0.18, 24, 16), dBody, [0.22, -0.06, 0], [0.9, 0.62, 0.68]);
    addMesh(head, new SphereGeometry(0.11, 20, 14), dBelly, [0.3, -0.09, 0], [0.55, 0.38, 0.4]);

    // Nostrils
    addMesh(head, new SphereGeometry(0.022, 8, 6), dNose, [0.38, -0.02, 0.05]);
    addMesh(head, new SphereGeometry(0.022, 8, 6), dNose, [0.38, -0.02, -0.05]);

    // Tiny smile
    const smileMesh = new Mesh(
      new TorusGeometry(0.06, 0.01, 6, 10, Math.PI),
      new MeshStandardMaterial({ color: "#3a1212", roughness: 0.15 }),
    );
    smileMesh.position.set(0.35, -0.11, 0);
    smileMesh.rotation.z = 0.2;
    smileMesh.rotation.y = 0;
    head.add(smileMesh);

    // Eyes
    [-0.18, 0.18].forEach((z) => {
      const eyeZ = z * 0.85;
      const eyeG = new Group();
      eyeG.position.set(0.02, 0.07, eyeZ);
      head.add(eyeG);
      addMesh(eyeG, new SphereGeometry(0.085, 20, 16), dEyeWhite, [0, 0, 0]);
      addMesh(eyeG, new SphereGeometry(0.058, 16, 12), dIris, [0.02, -0.005, Math.sign(eyeZ) * 0.04]);
      addMesh(eyeG, new SphereGeometry(0.032, 12, 8), dPupil, [0.03, -0.008, Math.sign(eyeZ) * 0.06]);
      addMesh(eyeG, new SphereGeometry(0.016, 8, 6), dCatchlight, [0.045, 0.006, Math.sign(eyeZ) * 0.07]);
    });

    // Head fins (Toothless-style)
    [
      [0.08, 0.18, 0.08, -0.7],
      [0.08, 0.18, -0.08, 0.7],
      [0.05, 0.24, 0.03, -0.35],
      [0.05, 0.24, -0.03, 0.35],
    ].forEach(([fx, fy, fz, fr]) => {
      const fin = new Group();
      fin.position.set(fx, fy, fz);
      fin.rotation.z = fr as number;
      head.add(fin);
      addMesh(fin, new ConeGeometry(0.06, 0.16, 8, 4), dDark, [0.06, 0, 0], [1, 1, 1]);
    });

    // Horns
    const hL = new Group();
    hL.position.set(-0.06, 0.18, 0.14);
    hL.rotation.z = -0.6;
    head.add(hL);
    addMesh(hL, new ConeGeometry(0.04, 0.18, 12, 8), dHorn, [0.05, 0, 0]);

    const hR = new Group();
    hR.position.set(-0.06, 0.18, -0.14);
    hR.rotation.z = -0.6;
    head.add(hR);
    addMesh(hR, new ConeGeometry(0.04, 0.18, 12, 8), dHorn, [0.05, 0, 0]);

    // Spine ridge
    for (let i = 0; i < 5; i += 1) {
      const t = i / 4;
      addMesh(
        dragon,
        new ConeGeometry(0.035, 0.09, 6, 4),
        dSpine,
        [0.0 + t * 0.33, 0.17 - t * 0.02, 0],
        [1, 1, 1],
      );
    }

    // Tail
    const tailG = new Group();
    tailG.position.set(0.48, -0.16, 0);
    tailG.rotation.z = -0.2;
    dragon.add(tailG);

    for (let i = 0; i < 3; i += 1) {
      const s = 1 - i * 0.32;
      addMesh(tailG, new SphereGeometry(0.1 * s, 16, 12), dBody, [i * 0.1, 0, 0], [s, s * 0.7, s * 0.65]);
    }

    // Tail spade
    const spade = new Group();
    spade.position.set(0.26, 0, 0);
    tailG.add(spade);
    addMesh(spade, new ConeGeometry(0.07, 0.04, 6, 4), dSpine, [0, 0.04, 0], [1.4, 1, 1]);
    addMesh(spade, new ConeGeometry(0.07, 0.04, 6, 4), dSpine, [0, -0.04, 0], [1.4, 1, -1]);

    // Legs
    [
      [-0.02, -0.28, 0.16],
      [0.16, -0.3, 0.18],
      [-0.02, -0.28, -0.16],
      [0.16, -0.3, -0.18],
    ].forEach(([lx, ly, lz]) => {
      const leg = new Group();
      leg.position.set(lx, ly, lz);
      dragon.add(leg);
      addMesh(leg, new CylinderGeometry(0.055, 0.065, 0.13, 10), dBody, [0, -0.05, 0]);
      addMesh(leg, new SphereGeometry(0.055, 10, 8), dBody, [0, -0.14, 0], [1, 0.22, 1.1]);
    });

    // Wings
    [-0.18, 0.18].forEach((z) => {
      const wG = new Group();
      wG.position.set(0.0, 0.08, z * 1.15);
      wG.rotation.z = 0.45;
      wG.rotation.x = z > 0 ? -0.3 : 0.3;
      wG.scale.set(1, 1, z > 0 ? 1.4 : 1.4);
      dragon.add(wG);

      addMesh(wG, new ConeGeometry(0.06, 0.3, 8, 4), dWing, [0.12, 0.02, 0.06], [1, 1, 1.1]);
      addMesh(wG, new ConeGeometry(0.06, 0.25, 8, 4), dWing, [0.12, 0.02, -0.06], [1, 1, 1.1]);
    });

    // Wing animation references for render loop
    const wingGroups: Group[] = [];
    dragon.children.forEach((c) => {
      if (c instanceof Group) {
        const pos = c.position;
        if (Math.abs(pos.x) < 0.1 && Math.abs(pos.z) > 0.15 && pos.y > 0.05) {
          wingGroups.push(c);
        }
      }
    });

    const sideTable = addRoundTable(root, woodMaterial, goldMaterial, [-2.15, -0.45, 0.55]);
    sideTable.rotation.y = -0.35;
    const frontTable = addRoundTable(root, woodMaterial, goldMaterial, [1.8, -0.5, 0.92]);
    frontTable.rotation.y = 0.55;

    const cup = new Group();
    cup.position.set(-1.2, 0.05, -0.32);
    root.add(cup);
    addMesh(cup, new CylinderGeometry(0.2, 0.24, 0.36, 32), teaMaterial, [0, 0, 0]);
    addMesh(cup, new CylinderGeometry(0.22, 0.22, 0.02, 32), goldMaterial, [0, 0.2, 0]);
    addMesh(cup, new SphereGeometry(0.05, 16, 12), goldMaterial, [0.3, 0.05, 0]);

    const steam: Mesh[] = [];
    for (let index = 0; index < 7; index += 1) {
      const particle = addMesh(
        floatingDetails,
        new SphereGeometry(0.045, 12, 8),
        steamMaterial,
        [-1.2 + Math.sin(index) * 0.06, 0.36 + index * 0.08, -0.32 + Math.cos(index) * 0.04],
        [1, 1.55, 1],
      );
      particle.castShadow = false;
      steam.push(particle);
    }

    const lanterns = [
      addLantern(root, lanternMaterial, goldMaterial, [-3.1, 1.9, -1.95]),
      addLantern(root, lanternMaterial, goldMaterial, [3.05, 1.9, -1.95]),
      addLantern(root, lanternMaterial, goldMaterial, [-0.6, 2.14, -1.9]),
    ];

    const signTexture = createTextTexture("上海小馆");
    addSprite(root, signTexture, [-1.42, 1.48, -2.16], [2.55, 0.86, 1]);
    const menuTexture = createTextTexture("茶  面  饺子");
    addSprite(root, menuTexture, [2.72, 0.86, -2.08], [1.26, 0.48, 1]);

    const ambient = new AmbientLight("#fff4de", 1.8);
    scene.add(ambient);
    const key = new DirectionalLight("#ffd889", 2.8);
    key.position.set(4, 5, 4);
    key.castShadow = true;
    scene.add(key);
    const rim = new DirectionalLight("#b33139", 1.4);
    rim.position.set(-4, 2, 2);
    scene.add(rim);
    const tableGlow = new PointLight("#f4c259", 1.1, 3.4);
    tableGlow.position.set(-1.1, 0.55, 0.35);
    scene.add(tableGlow);

    const startedAt = performance.now();
    let frameId = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const animate = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const pointer = pointerRef.current;
      root.rotation.y = pointer.x * 0.16 + Math.sin(elapsed * 0.35) * 0.035;
      root.rotation.x = -pointer.y * 0.04;
      dragon.position.y = 0.55 + Math.sin(elapsed * 1.4) * 0.03;
      cup.rotation.y = elapsed * 0.55;
      steam.forEach((particle, index) => {
        const drift = elapsed * 0.42 + index * 0.7;
        particle.position.y = 0.34 + index * 0.08 + (drift % 0.34);
        particle.position.x = -1.2 + Math.sin(drift * 2.2) * 0.06;
        particle.scale.setScalar(0.75 + (drift % 0.6));
      });
      wingGroups.forEach((wg, i) => {
        wg.rotation.z = 0.45 + Math.sin(elapsed * 3.2 + i * 0.5) * 0.18;
      });
      lanterns.forEach((lantern, index) => {
        lantern.rotation.z = Math.sin(elapsed * 1.2 + index) * 0.035;
      });
      goldMaterial.emissiveIntensity = active ? 0.38 + Math.sin(elapsed * 3) * 0.08 : 0.2;
      lanternMaterial.emissiveIntensity = 0.36 + Math.sin(elapsed * 2.4) * 0.08;
      tableGlow.intensity = 0.9 + Math.sin(elapsed * 1.7) * 0.18;
      camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04;
      camera.lookAt(0, 0.15, -1.2);
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    container.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      signTexture.dispose();
      menuTexture.dispose();
      root.traverse((object: Object3D) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
        if (object instanceof Sprite) {
          object.material.dispose();
        }
      });
      renderer.domElement.remove();
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="restaurant-three-scene"
      aria-label="Interactive 3D restaurant scene"
    />
  );
}

export default RestaurantThreeScene;
