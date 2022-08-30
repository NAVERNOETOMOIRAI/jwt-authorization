module.exports = class ApiError extends Error{
    errors;
    status;
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnauthorizedError(){
        return new ApiError(401, 'Unauthorized')
    }
    static BadRequest(message, errors = []){
        return new ApiError(400, 'Bad Request', errors)
    }
}