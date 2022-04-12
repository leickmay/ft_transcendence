import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Friendship extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	asked: number;

	@Column()
	askedBy: number;

	@Column({default: false})
	isValid: boolean;
}
