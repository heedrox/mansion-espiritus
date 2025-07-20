class Message {
    constructor(message, user, timestamp) {
        this.message = message;
        this.user = user;
        this.timestamp = timestamp;
    }

    static create({ message, user, timestamp }) {
        if (!message) {
            throw new Error('Message is required');
        }
        if (!user) {
            throw new Error('User is required');
        }
        if (!timestamp) {
            throw new Error('Timestamp is required');
        }
        
        return new Message(message, user, timestamp);
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
            timestamp: this.timestamp
        };
    }
}

module.exports = Message; 