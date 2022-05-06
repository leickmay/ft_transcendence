import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Image {
	@PrimaryGeneratedColumn()
	public id: number;
 
	@Column()
	filename: string;
 
	@Column({
		type: 'bytea',
	})
	data: Uint8Array;
}
 
export default Image;
