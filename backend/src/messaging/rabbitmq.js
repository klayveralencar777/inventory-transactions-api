import amqp from "amqplib";

const EXCHANGE = "app.events";

let channel;

export async function connectRabbit(retries = 5) {
    const url = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

    for (let i = 1; i <= retries; i++) {
        try {
            const connection = await amqp.connect(url);
            connection.on("error", (err) => console.error("[rabbit] erro:", err.message));
            connection.on("close", () => {
                console.warn("[rabbit] conexão fechada");
                channel = null;
            });

            channel = await connection.createChannel();
            await channel.assertExchange(EXCHANGE, "topic", { durable: true });
            console.log("[rabbit] conectado");
            return;
        } catch (err) {
            console.warn(`[rabbit] tentativa ${i}/${retries} falhou: ${err.message}`);
            await new Promise((r) => setTimeout(r, 3000));
        }
    }
    throw new Error("Não foi possível conectar ao RabbitMQ");
}

export function publish(routingKey, payload) {
    if (!channel) {
        console.warn(`[rabbit] sem canal, evento ${routingKey} não publicado`);
        return false;
    }
    return channel.publish(
        EXCHANGE,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true, contentType: "application/json" }
    );
}

export async function subscribe(queue, routingKey, handler) {
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, EXCHANGE, routingKey);
    await channel.prefetch(10);

    channel.consume(queue, async (msg) => {
        if (!msg) return;
        try {
            await handler(JSON.parse(msg.content.toString()));
            channel.ack(msg);
        } catch (err) {
            console.error(`[rabbit] falha em ${queue}:`, err.message);
            channel.nack(msg, false, false);
        }
    });
}