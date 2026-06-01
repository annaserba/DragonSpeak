import {
  BufferGeometry,
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from "three";

type AddMesh = (
  group: Group,
  geometry: BufferGeometry,
  material: MeshStandardMaterial,
  position: [number, number, number],
  scale?: [number, number, number],
) => Mesh;

export type DragonSellerRig = {
  group: Group;
  head: Group;
  whiskers: Mesh[];
  maneTufts: Mesh[];
  browTufts: Mesh[];
};

export function createDragonSeller(
  addMesh: AddMesh,
  goldMaterial: MeshStandardMaterial,
): DragonSellerRig {
  const seller = new Group();
  seller.position.set(0.9, -0.08, -1.82);
  seller.scale.setScalar(0.94);

  const scaleMaterial = new MeshStandardMaterial({
    color: "#d89a2f",
    emissive: "#6a3c0b",
    emissiveIntensity: 0.2,
    roughness: 0.28,
    metalness: 0.05,
  });
  const snoutMaterial = new MeshStandardMaterial({
    color: "#e6aa54",
    emissive: "#7a430e",
    emissiveIntensity: 0.15,
    roughness: 0.25,
  });
  const robeMaterial = new MeshStandardMaterial({
    color: "#16110f",
    roughness: 0.76,
    metalness: 0.03,
  });
  const ivoryMaterial = new MeshStandardMaterial({
    color: "#efe2c8",
    roughness: 0.42,
  });
  const hornMaterial = new MeshStandardMaterial({
    color: "#b9772c",
    emissive: "#3d1c08",
    emissiveIntensity: 0.08,
    roughness: 0.32,
  });
  const eyeMaterial = new MeshStandardMaterial({
    color: "#d6a24c",
    emissive: "#f0a11e",
    emissiveIntensity: 0.34,
    roughness: 0.18,
  });
  const pupilMaterial = new MeshStandardMaterial({ color: "#1a0f09", roughness: 0.22 });
  const embroideryMaterial = new MeshStandardMaterial({
    color: "#f4c259",
    emissive: "#7a4d12",
    emissiveIntensity: 0.24,
    roughness: 0.28,
  });

  const robe = addMesh(
    seller,
    new CylinderGeometry(0.7, 0.95, 1.06, 36),
    robeMaterial,
    [0, 0.16, 0],
    [1, 1, 0.72],
  );
  robe.rotation.y = 0.04;
  addMesh(seller, new CylinderGeometry(0.05, 0.05, 1.12, 16), embroideryMaterial, [0, 0.28, 0.54]);
  [-0.24, 0.06, 0.36].forEach((y) => {
    addMesh(
      seller,
      new TorusGeometry(0.18, 0.012, 8, 36),
      embroideryMaterial,
      [0, y, 0.56],
      [1, 0.28, 1],
    );
  });

  const addEmbroideryDragon = (xOffset: number) => {
    const curve = new CatmullRomCurve3([
      new Vector3(xOffset, 0.54, 0.57),
      new Vector3(xOffset * 0.82, 0.36, 0.6),
      new Vector3(xOffset * 1.08, 0.15, 0.58),
      new Vector3(xOffset * 0.78, -0.1, 0.6),
    ]);
    const stitch = new Mesh(new TubeGeometry(curve, 36, 0.012, 8, false), embroideryMaterial);
    seller.add(stitch);
    addMesh(seller, new SphereGeometry(0.035, 10, 8), embroideryMaterial, [xOffset, 0.58, 0.58]);
  };
  addEmbroideryDragon(-0.32);
  addEmbroideryDragon(0.32);
  [-0.18, 0, 0.18].forEach((x, index) => {
    addMesh(seller, new SphereGeometry(0.035, 12, 8), embroideryMaterial, [
      x,
      0.42 - index * 0.24,
      0.59,
    ]);
  });

  const head = new Group();
  head.position.set(0, 1.04, 0.1);
  seller.add(head);
  addMesh(head, new SphereGeometry(0.42, 36, 24), scaleMaterial, [0, 0, 0], [1.04, 0.94, 0.9]);
  addMesh(
    head,
    new SphereGeometry(0.24, 28, 18),
    snoutMaterial,
    [0.03, -0.08, 0.34],
    [1.24, 0.62, 0.82],
  );
  addMesh(
    head,
    new SphereGeometry(0.18, 24, 16),
    snoutMaterial,
    [0.03, -0.22, 0.31],
    [1.08, 0.35, 0.72],
  );
  addMesh(
    head,
    new SphereGeometry(0.18, 24, 16),
    snoutMaterial,
    [-0.18, 0.02, 0.24],
    [0.86, 0.5, 0.6],
  );
  addMesh(
    head,
    new SphereGeometry(0.18, 24, 16),
    snoutMaterial,
    [0.18, 0.02, 0.24],
    [0.86, 0.5, 0.6],
  );
  addMesh(head, new SphereGeometry(0.035, 12, 8), pupilMaterial, [-0.08, -0.08, 0.56]);
  addMesh(head, new SphereGeometry(0.035, 12, 8), pupilMaterial, [0.08, -0.08, 0.56]);
  [-0.1, -0.03, 0.04, 0.11].forEach((x) => {
    const tooth = addMesh(head, new ConeGeometry(0.022, 0.09, 8, 3), ivoryMaterial, [
      x,
      -0.27,
      0.49,
    ]);
    tooth.rotation.x = Math.PI;
  });
  [
    [-0.18, 0.18],
    [0, 0.21],
    [0.18, 0.18],
    [-0.12, 0.02],
    [0.12, 0.02],
  ].forEach(([x, y]) => {
    addMesh(head, new SphereGeometry(0.028, 10, 8), goldMaterial, [x, y, 0.39], [1, 0.42, 0.36]);
  });

  addMesh(
    head,
    new SphereGeometry(0.075, 18, 12),
    eyeMaterial,
    [-0.15, 0.08, 0.35],
    [1.14, 0.72, 0.38],
  );
  addMesh(
    head,
    new SphereGeometry(0.075, 18, 12),
    eyeMaterial,
    [0.15, 0.08, 0.35],
    [1.14, 0.72, 0.38],
  );
  addMesh(head, new SphereGeometry(0.028, 10, 8), pupilMaterial, [-0.14, 0.08, 0.39]);
  addMesh(head, new SphereGeometry(0.028, 10, 8), pupilMaterial, [0.14, 0.08, 0.39]);

  const browTufts: Mesh[] = [];
  [-0.17, 0.17].forEach((x) => {
    for (let index = 0; index < 4; index += 1) {
      const tuft = addMesh(
        head,
        new ConeGeometry(0.045, 0.22, 8, 3),
        ivoryMaterial,
        [x + index * 0.035 * Math.sign(x), 0.19 + index * 0.015, 0.34],
        [1, 1, 0.5],
      );
      tuft.rotation.z = Math.sign(x) * 1.2;
      tuft.rotation.x = -0.42;
      browTufts.push(tuft);
    }
  });

  const maneTufts: Mesh[] = [];
  for (let index = 0; index < 9; index += 1) {
    const tuft = addMesh(head, new ConeGeometry(0.07, 0.34 - index * 0.015, 8, 3), ivoryMaterial, [
      Math.sin(index * 0.8) * 0.08,
      0.34 + index * 0.035,
      -0.1 - index * 0.025,
    ]);
    tuft.rotation.x = -0.6;
    tuft.rotation.z = Math.sin(index) * 0.35;
    maneTufts.push(tuft);
  }

  for (let index = 0; index < 6; index += 1) {
    const beard = addMesh(
      head,
      new ConeGeometry(0.055, 0.28 - index * 0.015, 8, 3),
      ivoryMaterial,
      [Math.sin(index) * 0.08, -0.36 - index * 0.035, 0.28 - index * 0.018],
    );
    beard.rotation.x = Math.PI;
    beard.rotation.z = Math.sin(index * 1.4) * 0.32;
    maneTufts.push(beard);
  }

  [-0.24, 0.24].forEach((x) => {
    const ear = addMesh(head, new ConeGeometry(0.08, 0.28, 12, 4), scaleMaterial, [
      x * 1.55,
      0.15,
      -0.04,
    ]);
    ear.rotation.z = -Math.sign(x) * 1.18;
    ear.rotation.x = -0.28;

    const horn = addMesh(head, new ConeGeometry(0.085, 0.58, 18, 8), hornMaterial, [
      x,
      0.38,
      -0.04,
    ]);
    horn.rotation.z = -Math.sign(x) * 0.45;
    horn.rotation.x = -0.18;
    const sideHorn = addMesh(head, new ConeGeometry(0.055, 0.28, 14, 6), hornMaterial, [
      x * 1.28,
      0.18,
      0.04,
    ]);
    sideHorn.rotation.z = -Math.sign(x) * 1.02;
    sideHorn.rotation.x = 0.3;
  });

  [-1, 1].forEach((side) => {
    for (let index = 0; index < 6; index += 1) {
      const sideMane = addMesh(
        head,
        new ConeGeometry(0.045, 0.25 - index * 0.012, 8, 3),
        ivoryMaterial,
        [side * (0.34 + index * 0.025), -0.02 - index * 0.04, -0.08],
      );
      sideMane.rotation.z = side * 1.24;
      sideMane.rotation.x = -0.36;
      maneTufts.push(sideMane);
    }
  });

  const whiskers: Mesh[] = [];
  [-1, 1].forEach((side) => {
    const curve = new CatmullRomCurve3([
      new Vector3(0.08 * side, -0.13, 0.5),
      new Vector3(0.36 * side, -0.06, 0.62),
      new Vector3(0.72 * side, -0.01, 0.56),
      new Vector3(1.02 * side, -0.13, 0.42),
    ]);
    const whisker = new Mesh(new TubeGeometry(curve, 48, 0.012, 8, false), ivoryMaterial);
    head.add(whisker);
    whiskers.push(whisker);
  });

  const leftArm = addMesh(
    seller,
    new CylinderGeometry(0.16, 0.2, 0.94, 24),
    robeMaterial,
    [-0.62, -0.08, 0.34],
  );
  leftArm.rotation.z = 1.16;
  leftArm.rotation.x = 0.24;
  const rightArm = addMesh(
    seller,
    new CylinderGeometry(0.16, 0.2, 0.94, 24),
    robeMaterial,
    [0.62, -0.08, 0.34],
  );
  rightArm.rotation.z = -1.16;
  rightArm.rotation.x = 0.24;

  [-0.74, 0.74].forEach((x) => {
    const hand = new Group();
    hand.position.set(x, -0.46, 0.78);
    seller.add(hand);
    addMesh(hand, new SphereGeometry(0.17, 20, 14), scaleMaterial, [0, 0, 0], [1.1, 0.55, 0.78]);
    [-0.09, 0, 0.09].forEach((scaleX) => {
      addMesh(
        hand,
        new SphereGeometry(0.022, 8, 6),
        goldMaterial,
        [scaleX, 0.035, 0.08],
        [1, 0.38, 0.35],
      );
    });
    [-0.09, 0, 0.09].forEach((fingerX) => {
      const claw = addMesh(hand, new ConeGeometry(0.03, 0.13, 10, 4), hornMaterial, [
        fingerX,
        -0.01,
        0.12,
      ]);
      claw.rotation.x = Math.PI / 2;
    });
  });

  return {
    group: seller,
    head,
    whiskers,
    maneTufts,
    browTufts,
  };
}
