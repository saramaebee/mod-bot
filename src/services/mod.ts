import { AnyThreadChannel, BanOptions, ChannelType, ColorResolvable, EmbedBuilder, Guild, GuildMember, MessagePayload, PermissionsBitField } from "discord.js";

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
		action.user.timeout(60 * 1000);
		let shouldLog = true;

		const mod = await action.user.guild.members.fetch(action.mod);

		switch (action.typeDiscriminator) {
			case ModAction.Ban:
				if (mod.permissions.has(PermissionsBitField.Flags.BanMembers)) return;
				const banAction = action as Ban;
				const deleteMessagesFrom = ModService.convertToSeconds(banAction.deleteMessagesFrom);

				banAction.user.ban({ deleteMessageSeconds: deleteMessagesFrom });
				break;
			case ModAction.Kick:
				if (mod.permissions.has(PermissionsBitField.Flags.KickMembers)) return;
				action.user.kick();
				break;
			case ModAction.Mute:
				if (mod.permissions.has(PermissionsBitField.Flags.MuteMembers)) return;
				const muteAction = action as Mute;
				let muteLength;

				try {
					muteLength = Number.parseInt(muteAction.muteLength);
					action.user.timeout(muteLength);
				} catch (e) {
					action.slashInteraction.reply("Timeout length could not be parsed, please try again.");
					shouldLog = false;
				}
				break;
		}
		if (shouldLog) {
			ModService.log(action);
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

		const active = (await logChannel.threads.fetchActive(false)).threads.find(c => c.name === action.user.user.id);
		const archived = (await logChannel.threads.fetchArchived({fetchAll: true})).threads.find(c => c.name === action.user.user.id);

		const thread = active || archived;

		if (thread) {
			const embed = this.makeActionEmbed(action, thread);

			thread?.send({embeds: [embed]});
			logChannel.send({embeds: [embed]});
		} else {
			const newThread = await logChannel.send(`Member notes for: ${action.user}`);
			const newThreadChannel = await newThread.startThread({name: action.user.user.id});
			const newEmbed = this.makeActionEmbed(action, newThreadChannel);

			newThreadChannel.send({embeds: [newEmbed]});
			logChannel.send({embeds: [newEmbed]});
		}

		return;
	}

	static makeActionEmbed(action: Action, threadChannel: AnyThreadChannel): EmbedBuilder {
		const extraFields = [];

		if (action.extraComments && action.extraComments.length > 0) {
			extraFields.push({ name: "Extra Comments:", value: action.extraComments });
		}

		if (action.typeDiscriminator === ModAction.Ban) {
			/* eslint-disable no-extra-parens */
			extraFields.push({ name: "Messages removed from the last:", value: (action as Ban).deleteMessagesFrom });
		} else if (action.typeDiscriminator === ModAction.Mute) {
			/* eslint-disable no-extra-parens */
			extraFields.push({ name: "Timeout duration:", value: (action as Mute).muteLength});
		}

		const actionEmbed = new EmbedBuilder()
			.setColor(config.EMBED_COLOR as ColorResolvable)
			.setTitle(action.user.user.username)
			.setURL(`https://discord.com/channels/${threadChannel.guildId}/${threadChannel.id}`)
			.setAuthor({ name: action.mod.username, iconURL: action.mod.displayAvatarURL()})
			.setDescription(`${action.user} had the following action taken against them: ${action.typeDiscriminator}`)
			.addFields(extraFields);

		return actionEmbed;
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
