import "dotenv/config";
import express from 'express'
import UserRouter from './src/routes/UserRoutes.js'
import AuthRouter from './src/routes/AuthRouter.js'
import ProductRouter from './src/routes/ProductRoutes.js'
import CustomerRouter from './src/routes/CustomerRoutes.js'
import TransactionRouter from './src/routes/TransactionRoutes.js'
import MovementRouter from './src/routes/ProductMovementRoutes.js'
import MetricsRouter  from './src/routes/MetricsRoutes.js'
import { swaggerUi, swaggerDocument } from "./config/swagger.js";
import { connectRabbit } from "./src/messaging/rabbitmq.js";
import { startConsumers } from "./src/messaging/consumers.js";
import cors from 'cors'
const app = express()
const port = 3333
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,

}));
app.use(express.json())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', UserRouter);
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/customers', CustomerRouter);
app.use('/transactions', TransactionRouter);
app.use('/movements', MovementRouter);
app.use('/metrics', MetricsRouter);

async function bootstrap() {
    await connectRabbit();
    await startConsumers();

    app.listen(port, () => {
        console.log(`Server running`)
    })
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});