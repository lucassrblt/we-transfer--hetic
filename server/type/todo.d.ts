export interface FileEntity {
    user_id: string,
    endpoint: string,
}

export interface FileMetadataEntity {
    name: string,
    size: number,
    created_at: Date,
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
    insert: (todo: CompleteFileEntityRequest) => Promise<>
    update: (uuid: uuid,  fileEntity: CompleteFileEntityRequest) => anyType
    delete: (id: uuid) => anyType
}

export interface MailEntityRequest {
    userId: string,
    email: string,
    title: string,
    message: string
}

export interface MailRepositoryI {
    insert: (todo: CompleteFileEntityRequest, userId) => any
}
