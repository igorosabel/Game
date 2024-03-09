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

export interface WorldStartInterface {
  idScenario: number;
  x: number;
  y: number;
  check: boolean;
}
