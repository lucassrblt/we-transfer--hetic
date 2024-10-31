import {Repository} from "../type/repository";
// import {getTodoRepository} from "./todo_repository";
import {Connection, Pool} from "mysql2/promise";
import {getFileRepository} from "./files.repository";


export function getRepository(database: Pool): Repository {
    return {
        // todoRepository: getTodoRepository(database),
        filesRepository: getFileRepository(database)
    }
}
