import {Pool} from "mysql2/promise";
import {
    anyType,
    CompleteFileEntityRequest,
    CompleteFileEntityResponse,
    FileEntity,
    FileRepositoryI, UserEntityResponse, uuid
} from "../type/todo";
import {SuccessResponse} from "../middlewares/globalResponseHandler";
import { v4 as uuidv4 } from 'uuid';


export function getUserRepository(database: Pool): UserRepositoryI {
    return {
        getAll: async () => {
            const [results] = await database.query(`
                SELECT * FROM users;
            `);
            return results as UserEntityResponse[]
        },
        getOne: async (mail: string) => {
            const [results] = await database.execute(`
               SELECT * FROM users WHERE email = ?
            `, [mail]);
            return results[0] as UserEntityResponse
        },
        insert: async (fileEntity: CompleteFileEntityRequest, fileId: uuid): anyType => {
            const {file, metadata} = fileEntity;
            const fileMetaId = uuidv4()
            const [query]: any = await database.execute("INSERT INTO files (id, user_id, endpoint) VALUES (?, ?, ?)", [fileId, file.user_id, file.endpoint]);

            // Return success message
            return new SuccessResponse("File inserted successfully", 201)
        },
    }
}
