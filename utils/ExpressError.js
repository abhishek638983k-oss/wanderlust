export default class ExpressError extends Error {
    constructor(statuscode, message) {
        super();
        this.status = statuscode;
        this.message = message;
    }
}
