export interface FileEntity {
    user_id: string,
    endpoint: string,
}

export interface FileMetadataEntity {
    name: string,
    size: number,
    created_at?: Date,
}

export interface CompleteFileEntityResponse {
    user_id: string,
    endpoint: string,
    file_id: string,
    name: string,
    size: number,
    created_at: Date,
}

export interface CompleteFileEntityRequest {
    file: FileEntity,
    metadata: FileMetadataEntity
}

export type uuid = string
export type anyType = any


export interface FileRepositoryI {
    getAll: () => Promise<CompleteFileEntityResponse[]>
    getOne: (id: uuid) => Promise<CompleteFileEntityResponse>
    insert: (fileEntity: CompleteFileEntityRequest, fileId: uuid) => Promise<>
    update: (uuid: uuid,  fileEntity: CompleteFileEntityRequest) => anyType
    delete: (id: uuid) => anyType
}

export interface MailEntityRequest {
    userId: string,
    email: string,
    title: string,
    message: string
}


export interface UserEntityResponse {
    id: uuid,
    prenom: string,
    nom: string,
    password: string
    stockage: number,
    created_at: date
}

export interface UserEntityRequest {
    id: uuid,
    prenom: string,
    nom: string,
    password: string
    created_at: date
}


export interface MailRepositoryI {
    insert: (todo: CompleteFileEntityRequest, userId, fileId) => any
}




export interface UserRepositoryI {
    getAll: () => Promise<UserEntityResponse[]>
    getOne: (mail: string) => Promise<UserEntityResponse>
    insert: (userEntity: UserEntityRequest) => Promise<>
}
