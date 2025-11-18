const amqp = require('amqplib');
const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'ordered-queue';
        await channel.assertQueue(queueName, { durable: true });
        channel.prefetch(1); // Ensure one message at a time for ordering
        channel.consume(queueName, (msg) => {
            setTimeout(() => {
                console.log(" [x] Received '%s'", msg.content.toString());
                channel.ack(msg);
            }, Math.random() * 1000);
        });



    } catch (error) {
        console.error(error);
    }
}
runConsumer();