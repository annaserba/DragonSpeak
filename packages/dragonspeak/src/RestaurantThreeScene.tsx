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
    dragon.scale.setScalar(0.85);
    root.add(dragon);

    const dRed = new MeshStandardMaterial({
      color: "#d1433a",
      emissive: "#3a1010",
      emissiveIntensity: 0.1,
      roughness: 0.35,
    });
    const dDark = new MeshStandardMaterial({
      color: "#9b2d28",
      roughness: 0.3,
    });
    const dBelly = new MeshStandardMaterial({
      color: "#f5d5b0",
      roughness: 0.4,
    });
    const dEyeWhite = new MeshStandardMaterial({
      color: "#fafaf5",
      roughness: 0.1,
    });
    const dIris = new MeshStandardMaterial({
      color: "#f4c259",
      emissive: "#cc6600",
      emissiveIntensity: 0.5,
      roughness: 0.08,
    });
    const dPupil = new MeshStandardMaterial({ color: "#111" });
    const dHorn = new MeshStandardMaterial({
      color: "#f5e6d3",
      roughness: 0.2,
    });
    const dSpike = new MeshStandardMaterial({
      color: "#ff6655",
      roughness: 0.3,
    });
    const dWing = new MeshStandardMaterial({
      color: "#e06055",
      emissive: "#3a1010",
      emissiveIntensity: 0.06,
      roughness: 0.3,
      side: DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const dSmile = new MeshStandardMaterial({
      color: "#3a1515",
      roughness: 0.2,
    });

    // === BODY — round potato shape ===
    addMesh(dragon, new SphereGeometry(0.4, 32, 24), dRed, [0.15, -0.05, 0], [1, 0.85, 0.9]);
    addMesh(dragon, new SphereGeometry(0.35, 28, 20), dBelly, [0.15, -0.18, 0.28], [0.8, 0.55, 0.45]);

    // === HEAD — big and round ===
    const head = new Group();
    head.position.set(-0.35, 0.3, 0);
    dragon.add(head);
    addMesh(head, new SphereGeometry(0.32, 32, 24), dRed, [0, 0, 0], [1, 0.92, 1]);

    // Snout
    addMesh(head, new SphereGeometry(0.19, 24, 16), dRed, [0.25, -0.06, 0], [0.9, 0.65, 0.7]);
    addMesh(head, new SphereGeometry(0.13, 20, 14), dBelly, [0.32, -0.1, 0], [0.6, 0.4, 0.45]);

    // Nostrils
    addMesh(head, new SphereGeometry(0.025, 8, 6), dDark, [0.42, -0.04, 0.05]);
    addMesh(head, new SphereGeometry(0.025, 8, 6), dDark, [0.42, -0.04, -0.05]);

    // Smile
    const smile = addMesh(
      head,
      new TorusGeometry(0.08, 0.012, 8, 12, Math.PI),
      dSmile,
      [0.39, -0.1, 0],
      [1, 0.8, 1],
    );
    smile.rotation.z = 0.15;

    // === EYES — big anime-style ===
    const eyeGroupL = new Group();
    eyeGroupL.position.set(0.06, 0.08, 0.16);
    head.add(eyeGroupL);
    addMesh(eyeGroupL, new SphereGeometry(0.08, 20, 14), dEyeWhite, [0, 0, 0]);
    addMesh(eyeGroupL, new SphereGeometry(0.055, 16, 12), dIris, [0.02, 0, 0.04]);
    addMesh(eyeGroupL, new SphereGeometry(0.03, 12, 8), dPupil, [0.03, -0.005, 0.06]);
    // Catchlight
    addMesh(
      eyeGroupL,
      new SphereGeometry(0.015, 8, 6),
      new MeshStandardMaterial({ color: "#fff", emissive: "#fff", emissiveIntensity: 0.8 }),
      [0.04, 0.01, 0.07],
    );

    const eyeGroupR = new Group();
    eyeGroupR.position.set(0.06, 0.08, -0.16);
    head.add(eyeGroupR);
    addMesh(eyeGroupR, new SphereGeometry(0.08, 20, 14), dEyeWhite, [0, 0, 0]);
    addMesh(eyeGroupR, new SphereGeometry(0.055, 16, 12), dIris, [0.02, 0, -0.04]);
    addMesh(eyeGroupR, new SphereGeometry(0.03, 12, 8), dPupil, [0.03, -0.005, -0.06]);
    addMesh(
      eyeGroupR,
      new SphereGeometry(0.015, 8, 6),
      new MeshStandardMaterial({ color: "#fff", emissive: "#fff", emissiveIntensity: 0.8 }),
      [0.04, 0.01, -0.07],
    );

    // Eyebrows
    addMesh(head, new CylinderGeometry(0.01, 0.025, 0.06, 8), dDark, [0.04, 0.16, 0.16], [1, 1, 1]);
    addMesh(head, new CylinderGeometry(0.01, 0.025, 0.06, 8), dDark, [0.04, 0.16, -0.16], [1, 1, 1]);

    // === HORNS — curved ===
    const hornL = new Group();
    hornL.position.set(-0.08, 0.22, 0.12);
    head.add(hornL);
    hornL.rotation.z = -0.5;
    addMesh(hornL, new ConeGeometry(0.05, 0.2, 12, 8), dHorn, [0.06, 0, 0]);

    const hornR = new Group();
    hornR.position.set(-0.08, 0.22, -0.12);
    head.add(hornR);
    hornR.rotation.z = -0.5;
    addMesh(hornR, new ConeGeometry(0.05, 0.2, 12, 8), dHorn, [0.06, 0, 0]);

    // === SPIKES ===
    for (let i = 0; i < 4; i += 1) {
      const t = i / 3;
      addMesh(
        dragon,
        new ConeGeometry(0.04, 0.1, 8, 6),
        dSpike,
        [0.0 + t * 0.35, 0.2 - t * 0.02, 0],
        [1, 1, 1],
      );
    }

    // === TAIL — short and cute ===
    const tail = new Group();
    tail.position.set(0.52, -0.15, 0);
    dragon.add(tail);
    tail.rotation.z = -0.25;
    for (let i = 0; i < 3; i += 1) {
      const s = 1 - i * 0.3;
      addMesh(tail, new SphereGeometry(0.12 * s, 16, 12), dRed, [i * 0.11, 0, 0], [s, s * 0.7, s * 0.6]);
    }
    addMesh(tail, new ConeGeometry(0.04, 0.12, 8, 6), dSpike, [0.3, 0, 0]);

    // === LEGS — stubby ===
    const legData: [number, number, number, number][] = [
      [0, -0.3, 0.17, 0],
      [0.18, -0.3, 0.19, 0],
      [0, -0.3, -0.17, 0],
      [0.18, -0.3, -0.19, 0],
    ];
    legData.forEach(([lx, ly, lz]) => {
      const leg = new Group();
      leg.position.set(lx, ly, lz);
      dragon.add(leg);
      addMesh(leg, new CylinderGeometry(0.06, 0.07, 0.14, 12), dRed, [0, -0.06, 0]);
      addMesh(
        leg,
        new SphereGeometry(0.06, 12, 8),
        dRed,
        [0, -0.15, 0],
        [1, 0.25, 1.1],
      );
    });

    // === WINGS — small and cute ===
    const wingL = new Group();
    wingL.position.set(0, 0.1, 0.22);
    dragon.add(wingL);
    wingL.rotation.z = 0.4;
    wingL.rotation.x = -0.35;
    addMesh(wingL, new ConeGeometry(0.3, 0.06, 8, 4), dWing, [0.15, 0.03, 0], [1, 1, 1.3]);

    const wingR = new Group();
    wingR.position.set(0, 0.1, -0.22);
    dragon.add(wingR);
    wingR.rotation.z = 0.4;
    wingR.rotation.x = 0.35;
    addMesh(wingR, new ConeGeometry(0.3, 0.06, 8, 4), dWing, [0.15, 0.03, 0], [1, 1, 1.3]);

    // === CHEEK SPOTS ===
    addMesh(
      head,
      new SphereGeometry(0.04, 12, 8),
      new MeshStandardMaterial({
        color: "#ff8877",
        emissive: "#ff5544",
        emissiveIntensity: 0.15,
        roughness: 0.2,
      }),
      [0.38, -0.08, 0.13],
      [1, 0.6, 0.5],
    );
    addMesh(
      head,
      new SphereGeometry(0.04, 12, 8),
      new MeshStandardMaterial({
        color: "#ff8877",
        emissive: "#ff5544",
        emissiveIntensity: 0.15,
        roughness: 0.2,
      }),
      [0.38, -0.08, -0.13],
      [1, 0.6, 0.5],
    );

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
      dragon.position.y = 0.55 + Math.sin(elapsed * 1.6) * 0.035;
      cup.rotation.y = elapsed * 0.55;
      steam.forEach((particle, index) => {
        const drift = elapsed * 0.42 + index * 0.7;
        particle.position.y = 0.34 + index * 0.08 + (drift % 0.34);
        particle.position.x = -1.2 + Math.sin(drift * 2.2) * 0.06;
        particle.scale.setScalar(0.75 + (drift % 0.6));
      });
      wingL.rotation.z = 0.3 + Math.sin(elapsed * 2.4) * 0.15;
      wingR.rotation.z = 0.3 + Math.sin(elapsed * 2.4) * 0.15;
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
