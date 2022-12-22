import { Type } from 'class-transformer';
import { IsString, IsOptional, Min, IsPositive } from 'class-validator';


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    limit?:number = 5;

    @IsOptional()
    @Min(0)
    @Type(()=>Number)
    offset?:number = 0;

    @IsString()
    @IsOptional()
    search?: string;

}

