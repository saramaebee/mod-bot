import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ModAction } from "../services/mod.js";

interface modalData {
  action: ModAction;
  customId: string;
  username: string;
  discrim: string;
	id: string;
  modUsername: string;
  extraComponents?: TextInputBuilder[];
}

export default abstract class Command {
	makeModal(data: modalData): ModalBuilder {
		const modal = new ModalBuilder()
			.setTitle(`${data.action.toString()} ${data.username}?`)
			.setCustomId(data.customId);

		const userId = new TextInputBuilder()
			.setCustomId("userId")
			.setLabel("User ID")
			.setStyle(TextInputStyle.Short)
			.setValue(data.id);

		const rulesBrokenComponent = new TextInputBuilder()
			.setCustomId("rulesBroken")
			.setLabel("What rules were broken?")
			.setStyle(TextInputStyle.Short)
			.setValue("");

		const extraCommentsComponent = new TextInputBuilder()
			.setCustomId("extraComments")
			.setLabel("Extra Comments")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(false);

		[userId, rulesBrokenComponent, extraCommentsComponent].concat(data.extraComponents || []).forEach(c => {
			const row = new ActionRowBuilder<TextInputBuilder>()
				.addComponents(c);

			modal.addComponents(row);
		});

		return modal;
	}
}