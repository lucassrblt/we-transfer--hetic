import {Pool} from "mysql2/promise";
import {CompleteFileEntity, CompleteFileEntityResponse, FileEntity, FileRepositoryI} from "../type/todo";
import {SuccessResponse} from "../middlewares/globalResponseHandler";


export function getFileRepository(database: Pool): FileRepositoryI {
    return {
        getAll: async () => {
            const [results] = await database.query(`
                SELECT f.*, fm.*
                FROM files f
                         LEFT JOIN files_metadata fm ON f.id = fm.file_id
            `);
            console.log("results", results)
            return results as CompleteFileEntityResponse[]
        },
        delete: async (id: number) => {
            await database.execute("DELETE FROM files where id = ?", [id]);
        },
        getOne: async (id: number) => {
            const [results] = await database.execute(`
                SELECT f.*, fm.*
                FROM files f
                         LEFT JOIN files_metadata fm ON f.id = fm.file_id
                WHERE f.id = ?
            `, [id]);            //@ts-ignore
            return results[0] as CompleteFileEntityResponse
        },
        insert: async (fileEntity: CompleteFileEntity): any => {
            const {file, metadata} = fileEntity;
            const [query]: any = await database.execute("INSERT INTO files (id, user_id, endpoint) VALUES (?, ?, ?)", [file.id, file.user_id, file.endpoint]);

            if (query.affectedRows === 0) {
                throw new Error("Error while inserting file");
            }

            const [queryMetadata]: any = await database.execute("INSERT INTO files_metadata (id, file_id, name, size, created_at) VALUES (?, ?, ?, ?, ?)", [metadata.id, metadata.file_id, metadata.name, metadata.size, metadata.created_at]);

            if (queryMetadata.affectedRows === 0) {
                throw new Error("Error while inserting file metadata");
            }

            // Return success message
            return new SuccessResponse("File inserted successfully", 201)
            return Promise.resolve({id: 1, title: "test", completed: true});
        },
        update: (fileEntity: CompleteFileEntity): Promise<any> => {
            return Promise.resolve({id: 1, title: "test", completed: true});
        },
    }
}
