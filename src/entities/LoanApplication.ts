// Import necessary modules from TypeORM
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './User';
  
  @Entity()
  export class LoanApplication{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    desired_loan_amount!: number;
    
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    annual_income!: number;
  
    @Column('text', { nullable: true })
    loan_purpose!: string;

    @Column('text', { nullable: true })
    loan_type!: string;

    @Column({ length: 255, nullable: true })
    street_address!: string;
  
    @Column({ length: 20, nullable: true })
    postal_zip_code!: string;

    @Column({ length: 255, nullable: true })
    present_employer!: string;
  
    @Column({ length: 255, nullable: true })
    occupation!: string;
  
    @Column({ type: 'int', nullable: true })
    years_of_experience!: number;
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    down_payment_amount!: number;

    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => User, user => user.id)
    user!: User;
  }
  
  // User Entity
 
  