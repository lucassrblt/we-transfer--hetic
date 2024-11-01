import {Pool} from "mysql2/promise";
import {
    anyType,
    CompleteFileEntityRequest,
    CompleteFileEntityResponse,
    FileEntity,
    FileRepositoryI, uuid
} from "../type/todo";
import {SuccessResponse} from "../middleware/globalResponseHandler";
import { v4 as uuidv4 } from 'uuid';


export function getFileRepository(database: Pool): FileRepositoryI {
    return {
        getAll: async () => {
            const [results] = await database.query(`
                SELECT f.*, fm.*
                FROM files f
                         LEFT JOIN files_metadata fm ON f.id = fm.file_id
            `);
            return results as CompleteFileEntityResponse[]
        },
        delete: async (id: uuid) => {
            await database.query("DELETE FROM files_metadata where file_id = ?", [id])
            await database.execute("DELETE FROM files where id = ?", [id]);

            return new SuccessResponse("File deleted successfully", 200)
        },
        getOne: async (id: uuid) => {
            const [results] = await database.execute(`
                SELECT f.*, fm.*
                FROM files f
                         LEFT JOIN files_metadata fm ON f.id = fm.file_id
                WHERE f.id = ?
            `, [id]);            //@ts-ignore
            return results[0] as CompleteFileEntityResponse
        },
        insert: async (fileEntity: CompleteFileEntityRequest, fileId: uuid): anyType => {
            const {file, metadata} = fileEntity;
            const fileMetaId = uuidv4()
            const [query]: any = await database.execute("INSERT INTO files (id, user_id, endpoint) VALUES (?, ?, ?)", [fileId, file.user_id, file.endpoint]);

            if (query.affectedRows === 0) {
                throw new Error("Error while inserting file");
            }

            const [queryMetadata]: any = await database.execute("INSERT INTO files_metadata (id, file_id, name, size, created_at) VALUES (?, ?, ?, ?, ?)", [fileMetaId, fileId, metadata.name, metadata.size, metadata.created_at]);

            if (queryMetadata.affectedRows === 0) {
                throw new Error("Error while inserting file metadata");
            }

            // Return success message
            return new SuccessResponse("File inserted successfully", 201)
        },
        update: async (uuid: uuid, fileEntity: CompleteFileEntityRequest): anyType => {
            const {file, metadata} = fileEntity;

            const [query]: any = await database.execute("UPDATE files SET endpoint = ? WHERE id = ?", [file.endpoint, uuid]);


            if (query.affectedRows === 0) {
                throw new Error("Error while inserting file");
            }

            const [queryMetadata]: any = await database.execute("UPDATE files_metadata SET name = ?, size = ? WHERE file_id = ?", [metadata.name, metadata.size, uuid]);

            if (queryMetadata.affectedRows === 0) {
                throw new Error("Error while inserting file metadata");
            }

            return new SuccessResponse("File updated successfully", 201)


        },
    }
}
