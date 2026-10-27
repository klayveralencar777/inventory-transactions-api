import { subscribe } from "./rabbitmq.js";

export async function startConsumers() {
    await subscribe("transactions.created.log", "transaction.created", async (event) => {
        console.log("[consumer] nova transação:", event);
    });
}