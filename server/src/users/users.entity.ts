import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  mail: string;

  @Column()
  tel: string;

  @Column()
  avatar: string;

  @Column({default: false})
  online: boolean;

  @Column({default: false})
  ingame: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
