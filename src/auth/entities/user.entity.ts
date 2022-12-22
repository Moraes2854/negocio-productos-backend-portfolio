import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ViewColumn } from "typeorm";
import  * as bcrypt from 'bcrypt';
import { ValidRoles } from "../interfaces";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('varchar',{
        unique:true,
        length:100
    })
    email:string;

    @Column('varchar',{
        select:false,
        length:150
    })
    password:string;

    @Column('varchar',{
        length:100,
    })
    fullName:string;

    @Column('boolean',{
        default:true,
    })
    isActive:boolean;

    @Column("json", { nullable:true })
    roles:ValidRoles[];

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase();
        this.password = bcrypt.hashSync(this.password, 10);
        if (!this.roles) this.roles = ['user', 'super-user'];
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLowerCase();
    }
    
}