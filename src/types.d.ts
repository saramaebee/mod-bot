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

type DeleteMessagesLength = "1h" | "6h" | "12h" | "24h" | "3d" | "7d" | "none";

interface Ban extends Action {
	deleteMessagesFrom: DeleteMessagesLength;
}

interface Mute extends Action {
	muteLength: string;
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