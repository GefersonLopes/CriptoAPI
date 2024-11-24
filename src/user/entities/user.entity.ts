import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  key_user: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telegram: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  middle_name?: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  citizenship: string;

  @Column({ nullable: true })
  country_residency: string;

  @Column({ nullable: true })
  country_government_identify: string;

  @Column('bytea', { nullable: true })
  blob_document: Buffer;

  @Column({ nullable: true, default: 'common' })
  user_type: string;
}
