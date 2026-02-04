import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ default: false })
  acceptedTerms: boolean;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
