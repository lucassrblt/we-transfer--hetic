import {FileRepositoryI, MailRepositoryI} from "./todo";

export interface Repository {
    filesRepository: FileRepositoryI
    mailRepository : MailRepositoryI
}
