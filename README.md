# DragonSpeak

Reusable game engine for Mandarin-learning RPG quests.

## Packages

Single package `dragonspeak` — import everything from one entry point:

```ts
import { gameReducer, questSocket, getDictionary, getSceneLoader } from "dragonspeak";
```

### What's inside

| Module | Purpose |
|--------|---------|
| `events.ts` | Typed game events (`QUEST_STARTED`, `NPC_MESSAGE`, `WORD_UNLOCKED`, ...) |
| `state.ts` | Game state shape, `initialGameState` |
| `reducer.ts` | Pure `gameReducer` — events → state |
| `questMachine.ts` | 3-step Shanghai restaurant quest (drink → food → bill) |
| `i18n.ts` | EN/RU dictionaries, translation helpers |
| `mockQuestSocket.ts` | `MockQuestSocket` — simulated WebSocket for development |
| `registry.ts` | Scene registry — maps `questId` to 3D scene component |
| `RestaurantThreeScene.tsx` | Three.js 3D restaurant scene |

## Usage

### Consume via symlink

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

### Develop

```bash
npm install
npm test
npx tsc -b
```
