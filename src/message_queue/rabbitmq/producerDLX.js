const amqp = require('amqplib');
const messages = 'Hello World!'
const runProducer = async () => {
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'
        const notificationQueue = 'notificationQueue'
        const notificationRoutingKey = 'notificationRoutingKey'
        const noitificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
        const notificationExchangeDLX = 'notificationExDLX'

        //1. create exchange
        await channel.assertExchange(notificationExchange, 'direct', { durable: true });

        //2. create queue
        await channel.assertQueue(notificationQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: noitificationRoutingKeyDLX
        })

        //3. bind queue to exchange
        await channel.bindQueue(notificationQueue, notificationExchange, notificationRoutingKey);

        //4. send message
        const msg = "This is notification message"
        await channel.publish(notificationExchange, notificationRoutingKey, Buffer.from(msg),{
            expiration: '5000'
        })

        setTimeout (() => {
            connection.close()
            process.exit(0)
        },500)

    }catch(error){
        console.error(error);
    }
}
runProducer();