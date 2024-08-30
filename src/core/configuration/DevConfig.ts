import {PlayerInfo} from "../Game";
import {PlayerConfig} from "./Config";
import {DefaultConfig, DefaultPlayerConfig, defaultPlayerConfig} from "./DefaultConfig";

export const devConfig = new class extends DefaultConfig {
    numSpawnPhaseTurns(): number {
        return 60
    }
    gameCreationRate(): number {
        return 3 * 1000
    }
    lobbyLifetime(): number {
        return 3 * 1000
    }
    turnIntervalMs(): number {
        return 100
    }
    player(): PlayerConfig {
        return devPlayerConfig
    }
    numBots(): number {
        return 50
    }
}

export const devPlayerConfig = new class extends DefaultPlayerConfig {
    startTroops(playerInfo: PlayerInfo): number {
        if (playerInfo.isBot) {
            return 5000
        }
        return 5000
    }
}