import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToOne,
  Index,
  JoinColumn,
} from 'typeorm';

import { Song } from '../song/song.entity';
import { User } from 'src/user/user.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    length: 150,
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
    length: 200,
  })
  stageName?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  imageUrl?: string;

  @Column({
    nullable: true,
    length: 500,
  })
  coverImageUrl?: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  biography?: string;

  @Column({
    nullable: true,
    length: 100,
  })
  country?: string;

  @Column({
    nullable: true,
    length: 100,
  })
  city?: string;

  @Column({
    nullable: true,
    type: 'date',
  })
  birthDate?: Date;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    default: 0,
  })
  monthlyListeners: number;

  @Column({
    default: 0,
  })
  followers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //songs
  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];

  // Artist
  @OneToOne(() => User, (user) => user.artistProfile, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
