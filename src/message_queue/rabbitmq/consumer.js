const amqp = require('amqplib');
const runConsumer = async () => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'test-queue';
        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, (msg) => {
            console.log(" [x] Received '%s'", msg.content.toString());
        }, { noAck: true });
    }catch(error){
        console.error(error);
    }
}
runConsumer();
