import { ApplicationCommandOptionType, CommandInteraction, GuildMember, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption } from "discordx";
import Command from "./command.js";
import { ModAction, ModService } from "../services/mod.js";
import { Ban as BanAction } from "../types";

@Discord()
export class Ban extends Command {
	@Slash({ name: "ban", description: "bans a user" })
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "banned-user" }) mentionable: GuildMember,
			interaction: CommandInteraction
	): Promise<void> {
		// Mute the user for 1 minute while waiting for the modal to be submit.
		mentionable.timeout(60 * 1000);

		interaction.showModal(
			this.makeModal({
				action: ModAction.Ban,
				customId: "BanForm",
				username: mentionable.user.username,
				discrim: mentionable.user.discriminator,
				id: mentionable.user.id,
				modUsername: interaction.user.username,
				extraComponents: [
					new TextInputBuilder()
						.setCustomId("banLength")
						.setLabel("How far back should we delete messages?")
						.setStyle(TextInputStyle.Short)
				]
			})
		);
	}

	@ModalComponent()
	async BanForm(interaction: ModalSubmitInteraction): Promise<void> {
		const [userId, rulesBroken, extraComments, banLength] =
				["userId", "rulesBroken", "extraComments", "banLength"]
					.map(x => interaction.fields.getTextInputValue(x));

		if (!interaction.guild) return;

		const action: BanAction = {
			typeDiscriminator: ModAction.Ban,
			mod: interaction.user,
			slashInteraction: interaction,
			user: await ModService.getMemberById(interaction.guild, userId),
			rulesBroken: rulesBroken.split(","),
			banLength: banLength,
			extraComments: extraComments
		};

		ModService.handleAction(action);
	}
}