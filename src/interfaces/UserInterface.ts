import { RowDataPacket } from "mysql2/promise"

export interface UserDetail extends RowDataPacket {
    id?: string
    username: string;
    email: string;
    password: string;
    skin_type: string;
}

export interface Authentication extends RowDataPacket {
    id?: number;
    user_id: number;
    active_token: string;
    refresh_token: string;
}