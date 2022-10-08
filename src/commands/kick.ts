import { ApplicationCommandOptionType, CommandInteraction, GuildMember, ModalSubmitInteraction } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption } from "discordx";
import { ModAction, ModService } from "../services/mod.js";
import { Action } from "../types";
import Command from "./command.js";

@Discord()
export class Kick extends Command {
	@Slash({ name: "kick", description: "kicks a user" })
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "kicked-user", description: "Who to kick" }) mentionable: GuildMember,
			interaction: CommandInteraction
	): Promise<void> {
		if (!mentionable) {
			interaction.reply("Please mention a user when trying to use that command.");
			return;
		}
		interaction.showModal(
			this.makeModal({
				action: ModAction.Kick,
				customId: "KickForm",
				username: mentionable.user.username,
				discrim: mentionable.user.discriminator,
				id: mentionable.user.id,
				modUsername: interaction.user.username
			})
		);
	}

	@ModalComponent()
	async KickForm(interaction: ModalSubmitInteraction): Promise<void> {
		const [userId, rulesBroken, extraComments] =
				["userId", "rulesBroken", "extraComments"]
					.map(x => interaction.fields.getTextInputValue(x));

		if (!interaction.guild) return;

		const action: Action = {
			typeDiscriminator: ModAction.Kick,
			mod: interaction.user,
			slashInteraction: interaction,
			user: await ModService.getMemberById(interaction.guild, userId),
			rulesBroken: rulesBroken.split(","),
			extraComments: extraComments
		};

		ModService.handleAction(action);
	}
}