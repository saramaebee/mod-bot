import { ApplicationCommandOptionType, CommandInteraction, GuildMember, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption } from "discordx";
import { ModAction, ModService } from "../services/mod.js";
import { Mute as MuteAction } from "../types";
import Command from "./command.js";

@Discord()
export class Mute extends Command {
	@Slash({ name: "mute", description: "mutes a user" })
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "muted-user", description: "Mutes a user" }) mentionable: GuildMember,
			interaction: CommandInteraction
	): Promise<void> {
		if (!mentionable) {
			interaction.reply("Please mention a user when trying to use that command.");
			return;
		}
		interaction.showModal(
			this.makeModal({
				action: ModAction.Mute,
				customId: "MuteForm",
				username: mentionable.user.username,
				discrim: mentionable.user.discriminator,
				id: mentionable.user.id,
				modUsername: interaction.user.username,
				extraComponents: [
					new TextInputBuilder()
						.setCustomId("muteLength")
						.setLabel("Mute length? (ms)")
						.setStyle(TextInputStyle.Short)
				]
			})
		);
	}

	@ModalComponent()
	async MuteForm(interaction: ModalSubmitInteraction): Promise<void> {
		const [userId, rulesBroken, extraComments, muteLength] =
				["userId", "rulesBroken", "extraComments", "muteLength"]
					.map(x => interaction.fields.getTextInputValue(x));

		if (!interaction.guild) return;

		const action: MuteAction = {
			typeDiscriminator: ModAction.Mute,
			mod: interaction.user,
			slashInteraction: interaction,
			user: await ModService.getMemberById(interaction.guild, userId),
			rulesBroken: rulesBroken.split(","),
			extraComments: extraComments,
			muteLength: muteLength
		};

		ModService.handleAction(action);
	}
}