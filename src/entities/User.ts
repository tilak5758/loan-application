// Import necessary modules from TypeORM
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { LoanApplication } from './LoanApplication';
  // User Entity
  
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255, nullable: true })
    name!: string;
    
    @Column({ type: 'date', nullable: true })
    birth_date!: Date;
  
    @Column({ length: 255, nullable: true })
    email!: string;
  
    @Column({ length: 20, nullable: true })
    phone!: string;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    // Relationships
    @OneToMany(() => LoanApplication, loanApplication => loanApplication.user)
    loanApplications!: LoanApplication[];
  }
  
