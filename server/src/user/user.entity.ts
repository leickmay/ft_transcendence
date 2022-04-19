import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 255 })
	id42: number;

	@Column('varchar', { length: 50 })
	name: string;

	@Column('varchar', { length: 50 })
	login: string;

	@Column('varchar', { length: 255 })
	avatar: string;

	@ManyToMany(() => User)
    @JoinTable({
		name: 'friends',
	})
	friends: User[];
}
