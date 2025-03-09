"use strict";

import db from "../config/db"
import { ResultSetHeader } from "mysql2/promise"
import { UserDetail, Authentication } from "../interfaces/UserInterface";
import { hashPassword } from "../utils/PasswordUtil";

const User = {
    // Creates a new user with hashed password and specified skin type
    createUser: async (
        username: string,
        email: string,
        password: string,        
    ): Promise<ResultSetHeader> => {
        const query = `
    INSERT INTO users (username, email, password) VALUES (?, ?, ?)
    `;
        const hashedPassword = await hashPassword(password);
        const [results] = await db.query<ResultSetHeader>(query, [username, email, hashedPassword]);
        return results;
    },

    // Updates an existing user's password
    updateOldPassword: async (
        user_id: number,
        password: string
    ): Promise<ResultSetHeader> => {
        const query = `
      UPDATE users SET password = ? WHERE id = ?
    `;
        const newPasswordHash = await hashPassword(password);
        const [results] = await db.query<ResultSetHeader>(query, [newPasswordHash, user_id]);
        return results
    },

    // Finds a user by their email address
    findUserByEmail: async (
        email: string
    ): Promise<UserDetail | null> => {
        const query = `
        SELECT * FROM users WHERE email = ?
      `;
        const [results] = await db.query<UserDetail[]>(query, [email]);
        return results.length > 0 ? results[0] : null;
    },

    // Finds a user by their unique ID
    findUserById: async (
        user_id: number
    ): Promise<UserDetail | null> => {
        const query = `
        SELECT * FROM users WHERE id = ?
      `;
        const [results] = await db.query<UserDetail[]>(query, [user_id])
        return results.length > 0 ? results[0] : null
    },

    // Creates or updates authentication tokens for a user
    createOrUpdateAuthToken: async (
        user_id: number,
        activeToken: string,
        refreshToken: string
    ): Promise<ResultSetHeader> => {
        const checkQuery = `SELECT * FROM auth WHERE user_id = ?`;
        const [existingAuth] = await db.query<Authentication[]>(checkQuery, [user_id]);

        if (existingAuth.length > 0) {
            const updateQuery = `
            UPDATE auth SET active_token = ?, refresh_token = ? WHERE user_id = ?
            `;
            const [updateResults] = await db.query<ResultSetHeader>(updateQuery, [activeToken, refreshToken, user_id]);
            return updateResults;
        } else {
            const insertQuery = `
            INSERT INTO auth (user_id, active_token, refresh_token) VALUES (?,?,?)
            `;
            const [insertResults] = await db.query<ResultSetHeader>(insertQuery, [user_id, activeToken, refreshToken])
            return insertResults;
        }
    },

    // Finds authentication tokens for a given user ID
    findAuthByUserId: async (
        user_id: number
    ): Promise<Authentication | null> => {
        const query = `SELECT * FROM auth WHERE user_id`;
        const [results] = await db.query<Authentication[]>(query, [user_id]);
        return results.length > 0 ? results[0] : null;
    },
};

export default User;
