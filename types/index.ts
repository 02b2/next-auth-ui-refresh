export interface WindowSize {
    width: number;
    height: number;
}

export interface IUser {
    __id: string;
    email: string;
    fullName: string;
    password: string;
}

export interface LoginUserParams {
    email: string;
    password: string;
}