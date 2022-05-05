import ImageFile from 'src/imageFile/imageFile.entity';
import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';


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
	intraPicture: string;

	@JoinColumn({ name: 'avatarId' })
	@OneToOne(
	  () => ImageFile,
	  {
		nullable: true
	  }
	)
	public avatar?: ImageFile;

	@Column({ nullable: true })
	public avatarId?: number;

	@ManyToMany(() => User, {
		lazy: true
	})
    @JoinTable({
		name: 'friends',
	})
	friends: Promise<User[]>;
}
