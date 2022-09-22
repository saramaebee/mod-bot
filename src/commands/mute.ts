import { ApplicationCommandOptionType, CommandInteraction, GuildMember, ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption } from "discordx";
import { ModAction, ModService } from "../services/mod.js";
import { Action } from "../types";
import Command from "./command.js";

@Discord()
export class Mute extends Command {
	@Slash({ name: "mute", description: "mutes a user" })
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "muted-user" }) mentionable: GuildMember,
			interaction: CommandInteraction
	): Promise<void> {
		interaction.showModal(
			this.makeModal({
				action: ModAction.Mute,
				customId: "MuteForm",
				username: mentionable.user.username,
				discrim: mentionable.user.discriminator,
				id: mentionable.user.id,
				modUsername: interaction.user.username
			})
		);
	}

	@ModalComponent()
	async MuteForm(interaction: ModalSubmitInteraction): Promise<void> {
		const [userId, rulesBroken, extraComments] =
				["userId", "rulesBroken", "extraComments"]
					.map(x => interaction.fields.getTextInputValue(x));

		if (!interaction.guild) return;

		const action: Action = {
			typeDiscriminator: ModAction.Mute,
			mod: interaction.user,
			slashInteraction: interaction,
			user: await ModService.getMemberById(interaction.guild, userId),
			rulesBroken: rulesBroken.split(","),
			extraComments: extraComments
		};

		ModService.handleAction(action);
	}
}