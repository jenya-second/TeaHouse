import { Product } from 'src/product/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Image {
  constructor(){}

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  sabyUrl: string;

  @ManyToOne(type => Product, product => product.images)
  product: Product
}