import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ModAction } from "../api/mod";

interface modalData {
  action: ModAction;
  customId: string;
  username: string;
  discrim: string;
  modUsername: string;
  extraComponents?: TextInputBuilder[];
}

export default class Command {
	makeModal(data: modalData): ModalBuilder {
		const modal = new ModalBuilder()
			.setTitle(`${data.action} ${data.username}?`)
			.setCustomId(data.customId);

		const user = new TextInputBuilder()
			.setCustomId("user")
			.setLabel("user")
			.setStyle(TextInputStyle.Short);

		// TODO: checkboxes/multiselect? or hacky solution with multiple dropdowns
		const rulesBrokenComponent = new TextInputBuilder()
			.setCustomId("brokenRules")
			.setLabel("What rules were broken?")
			.setStyle(TextInputStyle.Short);

		const extraCommentsComponent = new TextInputBuilder()
			.setCustomId("extraComments")
			.setLabel("Extra Comments")
			.setStyle(TextInputStyle.Paragraph);

		[user, rulesBrokenComponent, extraCommentsComponent].concat(data.extraComponents || []).forEach(c => {
			const row = new ActionRowBuilder<TextInputBuilder>()
				.addComponents(c);

			modal.addComponents(row);
		});

		return modal;
	}
}