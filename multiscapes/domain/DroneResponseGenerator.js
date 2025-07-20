class DroneResponseGenerator {
    static generateResponse(messages) {
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Messages debe ser un array');
        }

        const numberOfMessages = messages.length;
        return `me has mandado mensajes: ${numberOfMessages}`;
    }
}

module.exports = DroneResponseGenerator; 