import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Socket } from 'socket.io';
import { Image } from 'src/images/image.entity';
import { Packet, PacketOut } from 'src/socket/packets';
import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

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

	@Column({ length: 255 })
	intra_picture: string;

	@OneToOne(() => Image, {
		lazy: true,
	})
	@JoinColumn()
	avatar?: Promise<Image>;

	@RelationId('avatar')
	avatarId?: number;

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

	socket?: Socket;

	@Expose({ name: 'avatar' })
	getAvatarUrl() {
		return this.avatarId ? '/api/users/avatar/' + this.login : this.intra_picture;
	}

	send(event: string, packet: PacketOut) {
		this.socket?.emit(event, packet);
	}
}
