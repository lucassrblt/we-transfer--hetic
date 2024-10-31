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

export interface CompleteFileEntity {
    file: FileEntity,
    metadata: FileMetadataEntity
}


export interface FileRepositoryI {
    getAll: () => Promise<FileEntity[]>
    getOne: (id: number) => Promise<FileEntity>
    insert: (todo: CompleteFileEntity) => Promise<>
    update: (todo: CompleteFileEntity) => Promise<TodoI>
    delete: (id: number) => Promise<void>
}
