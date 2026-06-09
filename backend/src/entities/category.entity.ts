import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Unique,
} from 'typeorm';
import { Expense } from './expense.entity';
import { User } from './user.entity';

@Entity('categories')
@Unique(['userId', 'name'])
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.categories, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Column()
    userId: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    icon: string;

    @OneToMany(() => Expense, (expense) => expense.category)
    expenses: Expense[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
