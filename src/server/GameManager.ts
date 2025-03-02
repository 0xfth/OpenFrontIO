import { ServerConfig } from "../core/configuration/Config";
import { GameConfig, GameID } from "../core/Schemas";
import { Client } from "./Client";
import { GamePhase, GameServer } from "./GameServer";
import { Difficulty, GameMapType, GameType } from "../core/game/Game";

export class GameManager {
  private games: GameServer[] = [];

  constructor(private config: ServerConfig) {}

  public game(id: GameID): GameServer | null {
    return this.games.find((g) => g.id == id);
  }

  gamesByPhase(phase: GamePhase): GameServer[] {
    return this.games.filter((g) => g.phase() == phase);
  }

  addClient(client: Client, gameID: GameID, lastTurn: number): boolean {
    const game = this.games.find((g) => g.id == gameID);
    if (game) {
      game.addClient(client, lastTurn);
      return true;
    }
    return false;
  }

  createGame(id: GameID, gameConfig: GameConfig | undefined) {
    const game = new GameServer(id, Date.now(), this.config, {
      gameMap: GameMapType.World,
      gameType: GameType.Private,
      difficulty: Difficulty.Medium,
      disableNPCs: false,
      infiniteGold: false,
      infiniteTroops: false,
      instantBuild: false,
      bots: 400,
      ...gameConfig, // TODO: make sure this works
    });
    this.games.push(game);
    return game;
  }

  hasActiveGame(gameID: GameID): boolean {
    const game = this.games
      .filter((g) => g.id == gameID)
      .filter(
        (g) => g.phase() == GamePhase.Lobby || g.phase() == GamePhase.Active,
      );
    return game.length > 0;
  }

  tick() {
    const lobbies = this.gamesByPhase(GamePhase.Lobby);
    const active = this.gamesByPhase(GamePhase.Active);
    const finished = this.gamesByPhase(GamePhase.Finished);

    active
      .filter((g) => !g.hasStarted() && g.isPublic)
      .forEach((g) => {
        g.start();
      });
    finished.forEach((g) => {
      try {
        g.endGame();
      } catch (error) {
        console.log(`error ending game ${g.id}: `, error);
      }
    });
    this.games = [...lobbies, ...active];
  }
}
