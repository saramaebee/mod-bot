export enum ModAction {
  Ban = "ban",
  Kick = "kick",
  Warn = "warn",
  Mute = "mute",
}

type Action = {
  type: ModAction
}

class ModService {
	handleAction(action: Action): void {
		if (Object.values(ModAction).includes(action.type)) {
			this.log(action);
			this.submitToDb(action);
		}
		switch (action.type) {
			case ModAction.Ban:
				break;
			default:
				console.log("testing");
				break;
		}
	}

	submitToDb(action: Action): void {
		return;
	}

	log(action: Action): void {
		return;
	}
}
