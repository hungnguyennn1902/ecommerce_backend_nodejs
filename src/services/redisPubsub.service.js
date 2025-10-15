const { createClient } = require('redis');

class RedisPubSubService {
    constructor() {
       this.publisher = createClient({
            socket: {
                host: 'redis-10946.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com',
                port: 10946
            },
            password: 'FRUZeIABPMnxhJX4jCGJdPAAi8A4wA3X' 
        });

        this.subscriber = createClient({
            socket: {
                host: 'redis-10946.crce185.ap-seast-1-1.ec2.redns.redis-cloud.com',
                port: 10946
            },
            password: 'FRUZeIABPMnxhJX4jCGJdPAAi8A4wA3X'
        });

        this.init();
    }

    async init() {
        this.publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
        this.subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

        await this.publisher.connect();
        await this.subscriber.connect();
    }

    async publish(channel, message) {
        try {
            const result = await this.publisher.publish(channel, message);
            console.log(`Published to ${channel}:`, message);
            return result;
        } catch (err) {
            console.error('Publish error:', err);
            throw err;
        }
    }

    async subscribe(channel, callback) {
        await this.subscriber.subscribe(channel, (message) => {
            callback(channel, message);
        });
    }
}

module.exports = new RedisPubSubService();
