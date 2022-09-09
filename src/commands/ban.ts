import { ApplicationCommandOptionType, CommandInteraction, GuildMember, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption } from "discordx";
import Command from "./command";
import { ModAction } from "../api/mod";

@Discord()
export class Ban extends Command {
	@Slash({ name: "ban", description: "bans a user (5 strikes)" })
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "banned-user" }) mentionable: GuildMember,
			interaction: CommandInteraction
	): Promise<void> {
		// TODO: mute user when command is fired

		interaction.showModal(
			this.makeModal({
				action: ModAction.Ban,
				customId: "BanForm",
				username: mentionable.user.username,
				discrim: mentionable.user.discriminator,
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
		console.log("test");
		const [brokenRules, extraComments] = ["brokenRules", "extraComments"].map(id =>
			interaction.fields.getTextInputValue(id)
		);

		await interaction.reply(`Bantesting ${interaction.user.username} for ${brokenRules}?\nExtra comments: ${extraComments}`);
	}
}