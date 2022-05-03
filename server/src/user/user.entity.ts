import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity()
export class User extends BaseEntity {
	@Expose()
	@PrimaryGeneratedColumn()
	id: number;

	@Index({ unique: true })
	@Column()
	id42: number;

	@Expose({
		groups: ['owner'],
	})
	@Type(() => Boolean)
	@Transform(({value}) => !!value)
	@Column({ nullable: true })
	totp?: string;

	@Expose()
	@Column({ length: 50 })
	name: string;

	@Expose()
	@Index({ unique: true })
	@Column({ length: 50 })
	login: string;

	@Expose()
	@Column({ length: 255 })
	avatar: string;

	@Expose({
		groups: ['owner'],
	})
	@Type(() => User)
	@ManyToMany(() => User, {
		lazy: true,
	})
    @JoinTable({
		name: 'followers',
		joinColumn: {
			name: 'followed',
		},
		inverseJoinColumn: {
			name: 'following',
		},
	})
	friends: Promise<Array<User>>;
}
