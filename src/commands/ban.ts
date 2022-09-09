import { ApplicationCommandOptionType, CommandInteraction, GuildMember, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption } from "discordx";
import Command from "./command.js";
import { ModAction, ModService } from "../api/mod.js";
import { Action, Ban as BanAction } from "../types";

@Discord()
export class Ban extends Command {
	@Slash({ name: "ban", description: "bans a user (5 strikes)" })
	async run(
		@SlashOption({ type: ApplicationCommandOptionType.User, name: "banned-user" }) mentionable: GuildMember,
			interaction: CommandInteraction
	): Promise<void> {
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
					// TODO: manually submit API request for select component
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
		const [user, userId, rulesBroken, extraComments, banLength] =
				["user", "userId", "rulesBroken", "extraComments", "banLength"]
					.map(x => interaction.fields.getTextInputValue(x));

		if (!interaction.guild) return;

		const action: BanAction = {
			typeDiscriminator: ModAction.Ban,
			mod: interaction.user,
			slashInteraction: interaction,
			user: await ModService.getMemberById(interaction.guild, userId),
			/*
			 * TODO: Find a better way to handle broken rules
			 * 	see: https://discord.com/channels/240880736851329024/625285981871800332/1017409849216208987
			 */
			rulesBroken: rulesBroken.split(","),
			banLength: banLength,
			extraComments: extraComments
		};

		ModService.handleAction(action);
	}
}