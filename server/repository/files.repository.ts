import {Pool, ResultSetHeader} from "mysql2/promise";
import {FileRepositoryI, FileEntity, CompleteFileEntity} from "../type/todo";
import {SuccessResponse} from "../middlewares/globalResponseHandler";


export function getFileRepository(database: Pool): FileRepositoryI {
    return {
        getAll: async () => {
            const [results] = await database.query("SELECT * FROM files");
            return results as FileEntity[]
        },
        delete: async (id: number) => {
            await database.execute("DELETE FROM files where id = ?", [id]);
        },
        getOne: async (id: number) => {
            const [results] = await database.execute("SELECT * FROM files WHERE id = ?", [id]);
            //@ts-ignore
            return results[0]
        },
        insert: async (fileEntity: CompleteFileEntity): any => {
            const {file, metadata} = fileEntity;
            const [query] : any = await database.execute("INSERT INTO files (id, user_id, endpoint) VALUES (?, ?, ?)", [file.id, file.user_id, file.endpoint]);

            if(query.affectedRows === 0) {
             throw new Error("Error while inserting file");
            }

            const [queryMetadata] : any = await database.execute("INSERT INTO files_metadata (id, file_id, name, size, created_at) VALUES (?, ?, ?, ?, ?)", [metadata.id, metadata.file_id, metadata.name, metadata.size, metadata.created_at]);

            if(queryMetadata.affectedRows === 0) {
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
