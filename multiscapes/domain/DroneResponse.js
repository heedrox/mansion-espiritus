class DroneResponse {
    constructor(message, photoUrls = []) {
        this.message = message;
        this.photoUrls = photoUrls;
    }

    static create(message, photoUrls = []) {
        return new DroneResponse(message, photoUrls);
    }

    toJSON() {
        return {
            message: this.message,
            photoUrls: this.photoUrls
        };
    }
}

module.exports = DroneResponse; 