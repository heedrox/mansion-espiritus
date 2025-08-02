class Message {
    constructor(message, user, timestamp, photoUrls = []) {
        this.message = message;
        this.user = user;
        this.timestamp = timestamp;
        this.photoUrls = photoUrls;
    }

    static create({ message, user, timestamp, photoUrls = [] }) {
        if (!message) {
            throw new Error('Message is required');
        }
        if (!user) {
            throw new Error('User is required');
        }
        if (!timestamp) {
            throw new Error('Timestamp is required');
        }
        
        return new Message(message, user, timestamp, photoUrls);
    }

    static createAsPlayer({ message, timestamp }) {
        if (!message) {
            throw new Error('Message is required');
        }
        if (!timestamp) {
            throw new Error('Timestamp is required');
        }
        
        return new Message(message, "player", timestamp);
    }

    toJSON() {
        return {
            message: this.message,
            user: this.user,
            timestamp: this.timestamp,
            photoUrls: this.photoUrls
        };
    }
}

module.exports = Message; 