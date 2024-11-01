import {Pool} from "mysql2/promise";
import {
    MailEntityRequest, MailRepositoryI, uuid
} from "../type/todo";
import {SuccessResponse} from "../middleware/globalResponseHandler";
import {v4 as uuidv4} from 'uuid';


export function getMailRepository(database: Pool): MailRepositoryI {
    return {
        insert: async (mailEntity: MailEntityRequest, userId: uuid, fileId : uuid): any => {

            const mailHistoryId = uuidv4()
            const [query]: any = await database.execute(
                "INSERT INTO mail_history (id, user_id, file_id, receiver, title, message) VALUES (?, ?, ?, ?, ?, ?)",
                [mailHistoryId, userId, fileId, mailEntity.email, mailEntity.title, mailEntity.message]
            );

            // Return success message
            return new SuccessResponse("Mail inserted successfully", 201)
        },
    }
}
