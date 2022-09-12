import { GuildMember, ModalSubmitInteraction, ThreadChannel, User } from "discord.js";
import { ModAction } from "./services/mod";

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

interface CsMember {
	user: GuildMember;
	aliases: string[];
	usernames: string[];
	userId: string;
	infractions: Action[];
	// TODO: fix this type?
	logForum: ThreadChannel | undefined;
}