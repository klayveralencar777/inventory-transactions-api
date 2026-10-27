    import { prisma } from "../database/prisma.js";
    import { ProductMovementRepository } from "../repository/ProductMovementRepository.js";
    import { ProductService } from '../service/ProductService.js'

    export class ProductMovementService {
        constructor() { 
            this.productMovementRepo = new ProductMovementRepository(prisma);
            this.productService = new ProductService();
        }

        async findAllMovements(userId) {
            return await this.productMovementRepo.findAllMovements(userId);
        }

        async findMovementByProduct(productId, userId) {
            await this.productService.findProductById(productId,userId);
            return await this.productMovementRepo.findByProduct(productId, userId);  
        
        }
        
    }
