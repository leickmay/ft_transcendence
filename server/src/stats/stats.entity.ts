import { Exclude, Expose } from "class-transformer";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Exclude()
@Entity()
export class Stats extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Expose()
	@CreateDateColumn()
	createdDate: Date;

	@Column()
	p1Id: number;
	
	@Column()
	p2Id: number;
	
	@Expose()
	@ManyToOne(() => User, user => user)
	p1: User;
	
	@Expose()
	@ManyToOne(() => User, user => user)
	p2: User;

	@Expose()
	@Column()
	winnerId: number;
}
