export interface StatusResult {
  status: string;
}

export interface StatusMessageResult {
  status: string;
  message: string;
}

export interface StatusIdResult {
  status: string;
  id: number;
}

export interface LoginData {
  email: string;
  pass: string;
}

export interface RegisterData {
  email: string;
  conf: string;
  pass: string;
}

export interface LoginResult {
  status: string;
  id: number;
  email: string;
  token: string;
}

export interface LoadingStatusInterface {
  assets: boolean;
  unlockedWorlds: boolean;
  connections: boolean;
}
