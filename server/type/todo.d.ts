export interface FileEntity {
    id: string,
    user_id: string,
    endpoint: string,
}

export interface FileMetadataEntity {
    id: string,
    file_id: string,
    name: string,
    size: number,
    created_at: Date,
}

export interface CompleteFileEntityRequest {
    id: string,
    user_id: string,
    endpoint: string,
    file_id: string,
    name: string,
    size: number,
    created_at: Date,
}

export interface CompleteFileEntityResponse {
    id: string,
    user_id: string,
    endpoint: string,
}


export interface FileRepositoryI {
    getAll: () => Promise<CompleteFileEntity[]>
    getOne: (id: number) => Promise<CompleteFileEntity>
    insert: (todo: CompleteFileEntity) => Promise<>
    update: (todo: CompleteFileEntity) => Promise<TodoI>
    delete: (id: number) => Promise<void>
}
