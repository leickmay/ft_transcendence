import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stats extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdDate: Date;

	@Column()
	p1Id: number;

	@Column()
	p2Id: number;

	@ManyToOne(() => User, user => user)
	p1: User;

	@ManyToOne(() => User, user => user)
	p2: User;

	@Column()
	winnerId: number;
}
