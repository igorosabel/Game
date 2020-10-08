export interface StatusResult {
	status: string;
}

export interface LoginData {
	name: string;
	pass: string;
}

export interface LoginResult {
	status: string;
	id: number;
	name: string;
	token: string;
}

export interface WorldInterface {
	id: number;
	name: string;
	description: string;
	wordOne: string;
	wordTwo: string;
	wordThree: string;
	friendly: boolean;
}

export interface WorldResult {
	status: string;
	list: WorldInterface[];
}

export interface ScenarioInterface {
	id: number;
	idWorld: number;
	name: string;
	friendly: boolean;
}

export interface ScenarioResult {
	status: string;
	list: ScenarioInterface[];
}