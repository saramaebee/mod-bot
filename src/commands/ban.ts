import { ActionRowBuilder, ApplicationCommandOptionType, CommandInteraction, GuildMember, InteractionCollector, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, ModalComponent, Slash, SlashChoice, SlashOption } from "discordx";

@Discord()
export class Ban {
	@Slash({ name: "ban", description: "bans a user (5 strikes)"})
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "banned-user" }) searchText: string,
			mentionable: GuildMember,
			interaction: CommandInteraction
	) : Promise<void> {
		// TODO: mute user when command is fired

		const modal = new ModalBuilder()
			.setTitle(`Ban ${mentionable.displayName}?`)
			.setCustomId("BanForm");

		const extraCommentsComponent = new TextInputBuilder()
			.setCustomId("extraComments")
			.setLabel("Extra Comments")
			.setStyle(TextInputStyle.Paragraph);

		// TODO: checkboxes/multiselect? or hacky solution with multiple dropdowns
		const rulesBrokenComponent = new TextInputBuilder()
			.setCustomId("brokenRules")
			.setLabel("What rules were broken?")
			.setStyle(TextInputStyle.Short);

		const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(
			rulesBrokenComponent
		);

		const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
			extraCommentsComponent
		);

		modal.addComponents(row1, row2);

		interaction.showModal(modal);
	}

	@ModalComponent()
	async BanForm(interaction: ModalSubmitInteraction): Promise<void> {
		const [rulesBroken, extraComments] = ["rulesBroken", "extraComments"].map(id =>
			interaction.fields.getTextInputValue(id)
		);

		await interaction.reply(`Ban ${interaction.member?.user.username} for ${rulesBroken}?\nExtra comments: ${extraComments}`);
	}
}
