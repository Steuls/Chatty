import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { Message } from "./Message.entity";

@Index("PK__FileStor__5A5B77D5F594FDBE", ["pathLocator"], { unique: true })
@Index("UQ__FileStor__9DD95BAFC9711CD1", ["streamId"], { unique: true })
@Index("UQ__FileStor__A236CBB3D58D5001", ["parentPathLocator", "name"], {
  unique: true
})
@Entity("FileStore", { schema: "dbo" })
export class FileStore extends BaseEntity {
  @Column("uniqueidentifier", {
    name: "stream_id",
    unique: true,
    default: () => "newsequentialid()"
  })
  streamId: string;

  @Column("varbinary", { name: "file_stream", nullable: true })
  fileStream: Buffer | null;

  @Column("nvarchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("hierarchyid", {
    primary: true,
    name: "path_locator",
    default: () =>
      "convert(hierarchyid, '/' +     convert(varchar(20), convert(bigint, substring(convert(binary(16), newid()), 1, 6))) + '.' +     convert(varchar(20), convert(bigint, substring(convert(binary(16), newid()), 7, 6))) + '.' +     convert(varchar(20), convert(bigint, substring(convert(binary(16), newid()), 13, 4))) + '/')"
  })
  pathLocator: string;

  @Column("hierarchyid", {
    name: "parent_path_locator",
    nullable: true,
    unique: true
  })
  parentPathLocator: string | null;

  @Column("nvarchar", { name: "file_type", nullable: true, length: 255 })
  fileType: string | null;

  @Column("bigint", { name: "cached_file_size", nullable: true })
  cachedFileSize: string | null;

  @Column("datetimeoffset", {
    name: "creation_time",
    default: () => "sysdatetimeoffset()"
  })
  creationTime: Date;

  @Column("datetimeoffset", {
    name: "last_write_time",
    default: () => "sysdatetimeoffset()"
  })
  lastWriteTime: Date;

  @Column("datetimeoffset", {
    name: "last_access_time",
    nullable: true,
    default: () => "sysdatetimeoffset()"
  })
  lastAccessTime: Date | null;

  @Column("bit", { name: "is_directory", default: () => "(0)" })
  isDirectory: boolean;

  @Column("bit", { name: "is_offline", default: () => "(0)" })
  isOffline: boolean;

  @Column("bit", { name: "is_hidden", default: () => "(0)" })
  isHidden: boolean;

  @Column("bit", { name: "is_readonly", default: () => "(0)" })
  isReadonly: boolean;

  @Column("bit", { name: "is_archive", default: () => "(1)" })
  isArchive: boolean;

  @Column("bit", { name: "is_system", default: () => "(0)" })
  isSystem: boolean;

  @Column("bit", { name: "is_temporary", default: () => "(0)" })
  isTemporary: boolean;

  @ManyToOne(
    () => FileStore,
    fileStore => fileStore.fileStores
  )
  @JoinColumn([
    { name: "parent_path_locator", referencedColumnName: "pathLocator" }
  ])
  parentPathLocator2: FileStore;

  @OneToMany(
    () => FileStore,
    fileStore => fileStore.parentPathLocator2
  )
  fileStores: FileStore[];

  @OneToMany(
    () => Message,
    message => message.fkFile
  )
  messages: Message[];
}
