import {Pool} from "mysql2/promise";
import {
    MailEntityRequest, MailRepositoryI, uuid
} from "../type/todo";
import {SuccessResponse} from "../middlewares/globalResponseHandler";
import {v4 as uuidv4} from 'uuid';


export function getMailRepository(database: Pool): MailRepositoryI {
    return {
        insert: async (mailEntity: MailEntityRequest, userId: uuid): any => {
            const mailHistoryId = uuidv4()
            const [query]: any = await database.execute("INSERT INTO mail_history (id, user_id, receiver, title, message) VALUES (?, ?, ?, ?, ?)", [mailHistoryId, userId, mailEntity.email, mailEntity.title, mailEntity.message]);
            if (query.affectedRows === 0) {
                throw new Error("Error while inserting file");
            }

            // Return success message
            return new SuccessResponse("Mail inserted successfully", 201)
        },
    }
}
