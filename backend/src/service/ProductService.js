import { EntityNotFound } from "../exceptions/Exceptions.js";
import { ProductRepository } from "../repository/ProductRepository.js";

export class ProductService {
     constructor() { this.productRepository = new ProductRepository(); }

     async findProducts(userId) {
          return await this.productRepository.find(userId);
     }

     async findProductById(id, userId) {
          const product = await this.productRepository.findById(id, userId);
          if (!product) {
               throw new EntityNotFound(`Produto não encontrado com o Id ${id}`);
          }
          return product;
     }

     async createProduct(product, userId) {
          return await this.productRepository.create(product, userId);

     }

     async updateProduct(id, userId, product) {
          await this.findProductById(id, userId);
          return await this.productRepository.update(id, userId, product);
     }

     async deleteProduct(id, userId) {
          await this.findProductById(id, userId);
          return await this.productRepository.delete(id, userId);
     }


}
