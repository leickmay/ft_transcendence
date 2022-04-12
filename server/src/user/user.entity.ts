import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'text',
	})
	id42: number;

	@Column({
		type: 'text'
	})
	name: string;

	@Column({
		type: "text",
		unique: true
	})
	login: string;

	@Column({
		type: 'text'
	})
	avatar: string;

	@Column({default: false})
	online: boolean;

	@Column({default: false})
	ingame: boolean;

	/*@OneToOne(() => User, (user) => user.following)
	@JoinTable()
	followers: User[];

	@ManyToMany(() => User, (user) => user.followers)
	following: User[];*/
}
