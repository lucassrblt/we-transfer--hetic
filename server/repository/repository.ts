import {Repository} from "../type/repository";
// import {getTodoRepository} from "./todo_repository";
import {Connection, Pool} from "mysql2/promise";
import {getFileRepository} from "./files.repository";
import {getMailRepository} from "./mail.repository";
import {getUserRepository} from "./user.respository";


export function getRepository(database: Pool): Repository {
    return {
        filesRepository: getFileRepository(database),
        mailRepository: getMailRepository(database),
        userRepository: getUserRepository(database)
    }
}
