import * as moment from 'moment';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('varchar', {
        length:150
    })
    name:string;

    @Column('double',{
        default:0
    })
    buy_price:number;

    @Column('double',{
        default:0
    })
    sell_price:number;

    @Column('datetime', {
        default:moment().format('YYYY-MM-DD hh:mm:ss'),
    })
    last_update:Date;

    @Column('varchar', {
        unique:true,
        length:150
    })
    barcode:string;

    @Column('boolean', {
        default:1
    })
    enabled:boolean;
    
    @BeforeInsert()
    beforeInsert(){
        this.name = this.name.toUpperCase();
    }

    @BeforeUpdate()
    beforeUpdate(){
        this.name = this.name.toUpperCase();
    }
}
