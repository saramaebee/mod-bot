import { GuildMember } from "discord.js";
import { Action, CsMember } from "../types";

export class DbService {
	public static async submitToDb(action: Action): Promise<void> {
		return;
	}

	public static async retrieveUserFromDb(user: GuildMember): Promise<CsMember> {
		// TODO: implement
		return {user: user, infractions: [], logForum: undefined, aliases: [], userId: "", usernames: []};
	}
}