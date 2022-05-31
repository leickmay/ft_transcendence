import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;
 
	@Column()
	filename: string;
 
	@Column({
		type: 'bytea',
	})
	content: Uint8Array;
}
