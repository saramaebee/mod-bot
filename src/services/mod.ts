import { BanOptions, ChannelType, Guild, GuildMember, MessagePayload } from "discord.js";

import { config } from "../config.js";
import { Action, Ban, Mute, DeleteMessagesLength } from "../types";

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
		if (!Object.values(ModAction).includes(action.typeDiscriminator)) {
			return;
		}
		// Mute the user for 1 minute while waiting for the modal to be submit.
		// Mentionable.timeout(60 * 1000);
		ModService.log(action);

		switch (action.typeDiscriminator) {
			case ModAction.Ban:
				const banAction = action as Ban;
				const deleteMessagesFrom = ModService.convertToSeconds(banAction.banLength);

				banAction.user.ban({ deleteMessageSeconds: deleteMessagesFrom } as BanOptions);
				break;
			case ModAction.Kick:
				action.user.kick();
				break;
			case ModAction.Mute:
				const muteAction = action as Mute;

				action.user.timeout(muteAction.muteLength);
				break;
		}
	}

	static async log(action: Action): Promise<void> {
		const logChannel = await action.user.guild.channels.fetch(config.LOG_CHANNEL_ID);

		if (!logChannel) {
			throw new Error(`Channel with ID ${config.LOG_CHANNEL_ID} not found.`);
		}
		if (logChannel?.type !== ChannelType.GuildText) {
			throw new Error(`Not implemented yet: ${logChannel?.type}`);
		}

		const thread = logChannel.threads.cache.find(c => c.name === action.user.user.id);

		const embed = this.makeActionEmbed(action);

		if (thread) {
			thread?.send(embed);
			logChannel.send(embed);
		} else {
			const newThread = await logChannel.send(`Member notes for: ${action.user}`);
			const threadChannel = await newThread.startThread({name: action.user.user.id});

			threadChannel.send(embed);
			logChannel.send(embed);
		}

		return;
	}

	static makeActionEmbed(action: Action): MessagePayload | string {
		let additional: string;

		switch (action.typeDiscriminator) {
			case ModAction.Ban:
				/* eslint-disable no-extra-parens */
				additional = `Messages from the last ${(action as Ban).banLength} were deleted.`;
				break;
			case ModAction.Mute:
				/* eslint-disable no-extra-parens */
				additional = `User timed out for: ${(action as Mute).muteLength}.`;
				break;
			default:
				additional = "";
		}
		return `**Infraction:** ${action.user}: ${action.typeDiscriminator}
**They broke the following rules:**
${action.rulesBroken}

**Action taken by:** ${action.mod}
${additional}
**Extra Comments:**
${action.extraComments}`;
	}

	static convertToSeconds(length: DeleteMessagesLength): number | undefined {
		const seconds = {
			"1h": 3600,
			"6h": 21600,
			"12h": 43200,
			"24h": 86400,
			"3d": 259200,
			"7d": 604800,
			"none": undefined
		};

		return seconds[length];
	}
}
