import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { Song } from '../song/song.entity';
import { User } from '../user/user.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    length: 100,
  })
  name: string;

  @Column({
    nullable: true,
    length: 500,
  })
  description?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  coverImageUrl?: string;

  @Column({
    default: true,
  })
  isPublic: boolean;

  @Column({
    default: 0,
  })
  followers: number;

  @Column({
    default: 0,
  })
  totalDuration: number;

  @ManyToOne(() => User, (user) => user.playlists, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

@RelationId((playlist: Playlist) => playlist.user)
userId: string;

  // Playlist
  @ManyToMany(() => Song, (song) => song.playlists)
  @JoinTable({
    name: 'playlist_songs',
  })
  songs: Song[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
