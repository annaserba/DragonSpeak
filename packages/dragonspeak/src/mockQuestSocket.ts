import type { GameEvent } from "./events";
import { createTimestamp } from "./events";
import {
  createAnswerEvents,
  createFakePlayerEvent,
  createQuestStartEvents,
  initialLeaderboard,
  PLAYER_ID,
} from "./questMachine";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting";

type Listener = (event: GameEvent) => void;
type StatusListener = (status: ConnectionStatus) => void;
type LatencyListener = (latency: number) => void;

const ONLINE_TICKS = [
  "Lin joined the Shanghai room",
  "Masha is reviewing tones",
  "Alex unlocked 请",
  "Demo server batched 3 events",
];

export class MockQuestSocket {
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private latencyListeners = new Set<LatencyListener>();
  private timers: number[] = [];
  private status: ConnectionStatus = "disconnected";
  private latency = 42;

  onEvent(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  onLatency(listener: LatencyListener) {
    this.latencyListeners.add(listener);
    listener(this.latency);
    return () => this.latencyListeners.delete(listener);
  }

  connect() {
    this.clearTimers();
    this.setStatus("connecting");
    this.timers.push(
      window.setTimeout(() => {
        this.setStatus("connected");
        this.emitBuffered(createQuestStartEvents());
        this.startAmbientEvents();
      }, 500),
    );
  }

  disconnect() {
    this.clearTimers();
    this.setStatus("disconnected");
  }

  simulateReconnect() {
    this.setStatus("reconnecting");
    this.timers.push(
      window.setTimeout(() => {
        this.setStatus("connected");
        this.setLatency(35 + Math.round(Math.random() * 80));
        this.emit({
          type: "LEADERBOARD_UPDATED",
          players: initialLeaderboard.map((player) =>
            player.playerId === PLAYER_ID
              ? { ...player, score: Math.max(player.score, 0) }
              : player,
          ),
          timestamp: createTimestamp(),
        });
      }, 900),
    );
  }

  sendAnswer(answerId: string) {
    if (this.status !== "connected") {
      return;
    }

    this.emitBuffered(createAnswerEvents(answerId), 140);
  }

  private startAmbientEvents() {
    this.timers.push(
      window.setInterval(() => {
        if (this.status !== "connected") {
          return;
        }
        this.setLatency(30 + Math.round(Math.random() * 95));
        this.emit(createFakePlayerEvent());
      }, 4200),
    );

    this.timers.push(
      window.setInterval(() => {
        const message = ONLINE_TICKS[Math.floor(Math.random() * ONLINE_TICKS.length)];
        window.dispatchEvent(new CustomEvent("dragonspeak:online-tick", { detail: message }));
      }, 6500),
    );
  }

  private emitBuffered(events: GameEvent[], spacing = 240) {
    events.forEach((event, index) => {
      this.timers.push(window.setTimeout(() => this.emit(event), index * spacing));
    });
  }

  private emit(event: GameEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  private setLatency(latency: number) {
    this.latency = latency;
    this.latencyListeners.forEach((listener) => listener(latency));
  }

  private clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
  }
}

export const questSocket = new MockQuestSocket();
