import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';


@Injectable()
export class ProductService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository:Repository<Product>,

  ){}


  async create(createProductDto: CreateProductDto):Promise<Product> {
    try {
      
      const product = this.productsRepository.create({
        ...createProductDto,
        enabled:true,
        last_update:new Date(),
      });
  
      return await this.productsRepository.save(product);

    } catch (error) {
      this.handleDBError(error);
    }

  }

  async findAll( {limit, offset, search}:PaginationDto):Promise<Product[]> {

    const queryBuilder = this.productsRepository.createQueryBuilder('product')
    .offset(offset)
    .orderBy({
      "product.name": "ASC",
    })
    
    if (search){
      queryBuilder.andWhere('UPPER(name) LIKE :name', { name: `%${ search.toUpperCase() }%` });
    }
    else {
      queryBuilder
      .take(limit)
    }

    const products = await queryBuilder.getMany();

    if (products.length === 0) throw new BadRequestException('No existen productos para la busqueda solicitada');

    return products;

  }

  async findOne(id:string):Promise<Product> {
    const product = await this.productsRepository.findOne({
      where : { id },
    });

    if ( !product ) throw new NotFoundException(`Product with id: ${id} was not found`);

    return product;
  }

  async findOneByBarcode(barcode: string):Promise<Product> {
    const product = await this.productsRepository.findOne({
      where : { barcode },
    });

    if ( !product ) throw new NotFoundException(`Product with barcode: ${barcode} was not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto):Promise<Product> {
    
    await this.findOne(id);
    try {

      const product = await this.productsRepository.preload({...updateProductDto, id, last_update:new Date()});
      
      return await this.productsRepository.save(product);


    } catch (error) {
      this.handleDBError(error);
    }

  }

  async remove(id: string):Promise<boolean> {

    await this.findOne(id);

    try {

      await this.productsRepository.delete(id);

      return true;
      
    } catch (error) {
      this.handleDBError(error);
    }

    
  }

  private handleDBError(error:any){
    
    this.logger.error(error);

    if (error.errno === 1062) throw new BadRequestException(`Ya existe un producto con el codigo de barras ingresado`)
    
    if (error.sqlMessage) throw new BadRequestException(`${error.sqlMessage}`);

    throw new InternalServerErrorException(`Internal server error`)
  }
}
