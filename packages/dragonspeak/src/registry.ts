import type { ComponentType } from "react";

type SceneProps = {
  active: boolean;
};

type SceneModule = {
  default: ComponentType<SceneProps>;
};

export const sceneRegistry: Record<string, () => Promise<SceneModule>> = {
  "restaurant-shanghai": () => import("./RestaurantThreeScene"),
};

export const getSceneLoader = (questId: string | null) => {
  if (questId && sceneRegistry[questId]) {
    return sceneRegistry[questId];
  }
  return null;
};
