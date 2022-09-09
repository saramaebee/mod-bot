import { GuildMember, Interaction, ModalSubmitInteraction, User } from "discord.js";
import { ModAction } from "./api/mod";

interface Action {
	typeDiscriminator: ModAction;
	slashInteraction: ModalSubmitInteraction;
	mod: User;
	user: GuildMember;
	rulesBroken?: string[];
	extraComments?: string;
}

interface Ban extends Action {
	banLength: string;
}

interface BanOptions {
	deleteMessageSeconds: number;
}