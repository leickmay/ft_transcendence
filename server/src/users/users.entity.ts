import { type } from 'os';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'text'
	})
	password: string;

	@Column({
		type: 'text',
		unique: true,
		default: null
	})
	pkey: string;

	@Column({
		type: 'text'
	})
	name: string;

	@Column({
		type: 'text',
		unique: true
	})
	mail: string;

	@Column({
		type: 'text',
		unique: true
	})
	tel: string;

	@Column({
		type: 'text'
	})
	avatar: string;

	@Column({default: false})
	online: boolean;

	@Column({default: false})
	ingame: boolean;

	@ManyToMany(() => User)
	@JoinTable()
	friends: User[];
}
