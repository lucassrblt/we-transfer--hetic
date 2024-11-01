import {FileRepositoryI, MailRepositoryI, UserRepositoryI} from "./todo";

export interface Repository {
    filesRepository: FileRepositoryI
    mailRepository : MailRepositoryI
    userRepository : UserRepositoryI
}
