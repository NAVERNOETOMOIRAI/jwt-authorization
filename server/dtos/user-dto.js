module.exports = class UserDto{
    /** @type {string} */
    email;
    /** @type {number} */
    id;
    /** @type {boolean} */
    isActivated;
    constructor(model) {
        const {email,id, isActivated} = model;
        this.email = email;
        this.id = id;
        this.isActivated = isActivated;
    }
}
