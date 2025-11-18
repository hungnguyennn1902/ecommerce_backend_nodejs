const amqp = require('amqplib');
const messages = 'Hello World!'
const runProducer = async () => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'ordered-queue';
        await channel.assertQueue(queueName, { durable: true });
        for(let i =1; i <=10; i++){
            const msg = `Ordered Message ${i}`;
            channel.sendToQueue(queueName, Buffer.from(msg))
            console.log(" [x] Sent '%s'", msg);
        }

        setTimeout (() => {
            connection.close();
            process.exit(0);
        }, 500);
    }catch(error){
        console.error(error);
    }
}
runProducer();