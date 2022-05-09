import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Image } from 'src/images/image.entity';
import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

	@Expose({
		name: 'avatar',
	})
	@Column({ length: 255 })
	intra_picture: string;

	@JoinColumn({ name: 'avatar' })
	@OneToOne(() => Image)
	avatar?: Image;

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

	@Expose({ name: 'avatar' })
	get getAvatarUrl() {
		return this.avatar ? '/users/avatar/' + this.login : this.intra_picture;
	}
}
