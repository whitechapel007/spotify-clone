import {
  Entity,
  PrimaryGeneratedColumn,
  Column,

  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Playlist } from '../playlist/playlist.entity';
import { Artist } from '../artist/artist.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    length: 200,
  })
  title: string;

  @Column({
    nullable: true,
    length: 200,
    unique: true,
  })
  slug?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  album?: string;

  @Column({
    nullable: true,
    length: 100,
  })
  genre?: string;

  @Column({
    nullable: true,
  })
  trackNumber?: number;

  @Column({
    nullable: true,
  })
  discNumber?: number;

  @Column({
    nullable: true,
  })
  durationInSeconds?: number;

  @Column({
    nullable: true,
    length: 255,
  })
  coverImageUrl?: string;

  @Column({
    nullable: true,
    length: 500,
  })
  audioUrl?: string;

  @Column({
    nullable: true,
    length: 20,
  })
  isrc?: string;

  @Column({
    default: false,
  })
  explicit: boolean;

  @Column({
    default: 0,
  })
  playCount: number;

  @Column({
    default: 0,
  })
  likes: number;

  @Column({
    type: 'date',
  })
  releasedDate: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  lyrics?: string;

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlists: Playlist[];


  @ManyToMany(() => Artist, (artist) => artist.songs, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({
    name: 'song_artists',
  })
  artists: Artist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
