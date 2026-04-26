export interface WorldInterface {
  id: number | null;
  name: string | null;
  description: string | null;
  wordOne: string | null;
  wordTwo: string | null;
  wordThree: string | null;
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
