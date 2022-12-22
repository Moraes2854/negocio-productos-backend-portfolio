import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsNumber()
    @Min(0)
    buy_price:number;

    @IsNumber()
    @Min(1)
    sell_price:number;

    @IsString()
    @IsNotEmpty()
    barcode:string;

}
