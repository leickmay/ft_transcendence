import { Exclude, Expose } from "class-transformer";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Exclude()
@Entity({
	orderBy: {
		createdDate: "DESC",
	}
})
export class Stats extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Expose()
	@CreateDateColumn()
	createdDate: Date;

	@Expose()
	@ManyToOne(() => User)
	player1: User;

	@Expose()
	@ManyToOne(() => User)
	player2: User;

	@Expose()
	@Column()
	winner: number;
}
