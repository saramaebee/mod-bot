import { Guild, GuildMember } from "discord.js";
import { Action, Ban, BanOptions } from "../types";

export enum ModAction {
  Ban = "ban",
  Kick = "kick",
  Warn = "warn",
  Mute = "mute",
}

export class ModService {
	static async getMemberById(guild: Guild, id: string): Promise<GuildMember> {
		return await guild.members.fetch(id);
	}

	static async handleAction(action: Action): Promise<void> {
		if (Object.values(ModAction).includes(action.typeDiscriminator)) {
			ModService.log(action);
			ModService.submitToDb(action);
		}
		switch (action.typeDiscriminator) {
			case ModAction.Ban:
				const banAction = action as Ban;
				const banLength = ModService.banLengthToSeconds(banAction.banLength);

				banAction.slashInteraction.reply(`Banned ${banAction.user} because they broke the following rules:
${banAction.rulesBroken}
Action taken by: ${banAction.mod}
Messages from the last ${banLength} were deleted. (I'll fix this eventually);
Extra Comments: ${banAction.extraComments}`);
				break;
			default:
				console.log("testing");
				break;
		}
	}

	static submitToDb(action: Action): void {
		return;
	}

	static log(action: Action): void {
		return;
	}

	static banLengthToSeconds(length: "1h" | "6h" | "12h" | "24h" | "3d" | "7d" | "none" | string): number | undefined {
		const seconds = {
			"1h": 3600,
			"6h": 21600,
			"12h": 43200,
			"24h": 86400,
			"3d": 259200,
			"7d": 604800,
			"none": undefined
		};

		return;
	}
}
