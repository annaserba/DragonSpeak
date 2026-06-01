# DragonSpeak

DragonSpeak is the shared public package behind the DragonSpeak demo apps. It contains the typed quest engine, mock realtime transport, EN/RU dictionaries, scene registry, and the lazy-loadable Three.js Shanghai restaurant scene.

The consuming apps, such as `DragonSpeak-demo`, keep route-level UI, Zustand integration, and Feature-Sliced-style component composition. This repository is the source of truth for domain events, state transitions, translations, and reusable 3D quest scenes.

## Package

Single workspace package: `packages/dragonspeak`.

Import everything from one entry point:

```ts
import { gameReducer, questSocket, getDictionary, getSceneLoader } from "dragonspeak";
```

## Current Architecture

```text
DragonSpeak-demo / consuming app
  src/app/                 router, providers, Zustand integration
  src/pages/               home, quest, vocabulary, architecture
  src/widgets/             quest scene shell, leaderboard, inspector
  src/features/            answer choices, language switcher, connection controls
  src/entities/            app-level view models
  node_modules/dragonspeak -> ../DragonSpeak/packages/dragonspeak

DragonSpeak / shared package
  packages/dragonspeak/src/
    events.ts              typed GameEvent contract
    state.ts               GameState and initial state
    reducer.ts             pure event -> state reducer
    questMachine.ts        deterministic Shanghai restaurant quest
    mockQuestSocket.ts     simulated realtime transport
    i18n.ts                English/Russian dictionaries
    registry.ts            questId -> lazy scene loader
    RestaurantThreeScene.tsx
    DragonSeller.ts        reusable 3D seller model factory
```

Runtime flow:

```text
React UI intent
  -> MockQuestSocket from dragonspeak
  -> typed GameEvent stream
  -> consuming app Zustand event buffer
  -> gameReducer from dragonspeak
  -> derived GameState
  -> quest UI + Developer Event Inspector
```

The UI does not mutate quest state directly. Player actions go through the mock socket, and every visible quest change is derived from typed events.

## What's Inside

| Module                     | Purpose                                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| `events.ts`                | Typed game events (`QUEST_STARTED`, `NPC_MESSAGE`, `WORD_UNLOCKED`, ...) |
| `state.ts`                 | Game state shape, `initialGameState`                                     |
| `reducer.ts`               | Pure `gameReducer` — events → state                                      |
| `questMachine.ts`          | 3-step Shanghai restaurant quest (drink → food → bill)                   |
| `i18n.ts`                  | EN/RU dictionaries, translation helpers                                  |
| `mockQuestSocket.ts`       | `MockQuestSocket` — simulated WebSocket for development                  |
| `registry.ts`              | Scene registry — maps `questId` to 3D scene component                    |
| `RestaurantThreeScene.tsx` | Three.js 3D restaurant scene                                             |
| `DragonSeller.ts`          | Extracted 3D restaurant seller model and animation rig handles           |

## Usage

### Consume From Demo Apps

```bash
git clone https://github.com/annaserba/DragonSpeak.git
```

In your app's `package.json`:

```json
{
  "dependencies": {
    "dragonspeak": "file:../DragonSpeak/packages/dragonspeak"
  }
}
```

Or use the provided `scripts/setup.sh` from consuming repos.

## Demo vs Commercial Version

This public package intentionally contains no real AI, billing, external secrets, or production backend. Those can be introduced later behind the same typed event contract.

Commercial replacements would keep the frontend shape stable:

- real backend transport behind `MockQuestSocket`
- AI dialogue generation behind `NPC_MESSAGE`
- multiplayer presence behind `PLAYER_ANSWERED` and `LEADERBOARD_UPDATED`
- persistence behind `WORD_UNLOCKED`
- payments outside this public package

## Develop

```bash
npm install
npm test
npm run lint
npx tsc -b
```
