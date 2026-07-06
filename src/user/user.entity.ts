import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';
import { Artist } from 'src/artist/artist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
  })
  firstName: string;

  @Column({
    length: 100,
  })
  lastName: string;

  @Column({
    select: false,
  })
  password: string;

  @Index()
  @Column({
    unique: true,
    length: 255,
  })
  email: string;

  @Column({
    nullable: true,
    length: 255,
  })
  avatarUrl?: string;

  @Column({
    nullable: true,
    length: 100,
  })
  username?: string;

  @Column({
    nullable: true,
    length: 100,
  })
  country?: string;

  @Column({
    nullable: true,
    select: false,
    type: 'text',
  })
  hashedRefreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //playlist
  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  // User
  @OneToOne(() => Artist, (artist) => artist.user)
  artistProfile?: Artist;
}
