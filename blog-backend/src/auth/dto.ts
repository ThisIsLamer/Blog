export type ValidateUser = {
  login: string;
  isActive: boolean;
  id: number;
  createAt: Date;
  updateAt: Date;
};

export type UserJWTTocken = {
  login: string;
  id: number;
  iat: number;
  exp: number;
};
