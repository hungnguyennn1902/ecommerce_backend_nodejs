const amqp = require('amqplib');
const messages = 'Hello World!'
const runProducer = async () => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'test-queue';
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(messages))
        console.log(" [x] Sent '%s'", messages);
    }catch(error){
        console.error(error);
    }
}
runProducer();