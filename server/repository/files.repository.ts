import {Pool} from "mysql2/promise";
import {
    anyType,
    CompleteFileEntityRequest,
    CompleteFileEntityResponse,
    FileEntity,
    FileRepositoryI, uuid
} from "../type/todo";
import {SuccessResponse} from "../middleware/globalResponseHandler";
import {v4 as uuidv4} from 'uuid';


export function getFileRepository(database: Pool): FileRepositoryI {
    return {
        getAll: async (userId: uuid) => {
            //recuperer tous les fichiers d'un utilisateur
            const [results] = await database.execute(`SELECT f.*, fm.* FROM files f LEFT JOIN files_metadata fm ON f.id = fm.file_id WHERE f.user_id = ?`, [userId]);
            return results as CompleteFileEntityResponse[]
        },
        delete: async (id: uuid) => {
           try{ 
            let [results]:any = await database.execute("DELETE FROM files_metadata where file_id = ?", [id]);
            let [mailHistory]:any = await database.execute("DELETE FROM mail_history where file_id = ?", [id]);
            let [resultsFiles]:any = await database.execute("DELETE FROM files where id = ?", [id]);

            console.log(resultsFiles)
            console.log(results)
            console.log(mailHistory)
            return new SuccessResponse("File deleted successfully", 200)}
              catch (e){
                console.log(e)
                return new SuccessResponse("Error while deleting file", 500)
            }
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
        insert: async (fileEntity: CompleteFileEntityRequest, fileId: uuid) => {
            const {file, metadata} = fileEntity;

            const fileMetaId = uuidv4()

            const [query]: any = await database.execute("INSERT INTO files (id, user_id, endpoint) VALUES (?, ?, ?)", [fileId, file.user_id, file.endpoint]);

            if (query.affectedRows === 0) {
                throw new Error("Error while inserting file");
            }

            const [queryMetadata]: any = await database.execute("INSERT INTO files_metadata (id, file_id, name, size) VALUES (?, ?, ?, ?)", [fileMetaId, fileId, metadata.name, metadata.size]);

            if (queryMetadata.affectedRows === 0) {
                throw new Error("Error while inserting file metadata");
            }

            // Return success message
            return new SuccessResponse("File inserted successfully", 201)
        },
        update: async (uuid: uuid, fileEntity: CompleteFileEntityRequest) => {
            const { metadata} = fileEntity;

            // const [query]: any = await database.execute("UPDATE files SET size = ? WHERE id = ?", [metadata.size, uuid]);


            // if (query.affectedRows === 0) {
            //     throw new Error("Error while inserting file");
            // }
            console.log(uuid)
            const [queryMetadata]: any = await database.execute("UPDATE files_metadata SET name = ? WHERE id = ?", [metadata.name, uuid]);
            console.log(queryMetadata)

            if (queryMetadata.affectedRows === 0) {
                throw new Error("Error while inserting file metadata");
            }

            return new SuccessResponse("File updated successfully", 201)


        },
    }
}
