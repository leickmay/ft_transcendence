import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Index({ unique: true })
	@Column()
	id42: number;

	@Column({ length: 50 })
	name: string;

	@Index({ unique: true })
	@Column({ length: 50 })
	login: string;

	@Column({ length: 255 })
	avatar: string;

	@ManyToMany(() => User)
    @JoinTable({
		name: 'friends',
	})
	friends: User[];
}
