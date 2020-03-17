import { EntityRepository, Repository } from "typeorm";
import { FileStore } from "../entities/FileStore.entity";

@EntityRepository(FileStore)
export class FileStoreRepository extends Repository<FileStore> {

}
