const {UserSchema} = require('../model/models')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService{
    async registration(email, password){
        const condidate = await UserSchema.findOne({where:{email}});
        if(condidate){
             throw ApiError.BadRequest(`Пользователь с данным email:${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password,5);
        const activationLink = uuid.v4();
        const user = await UserSchema.create({email, password:hashPassword, activationLink});
        mailService.sendActivationMail(email, `${process.env.HOST}/api/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {...userDto}
        }
    }
    async activateUser(activationLink){
        const user = await UserSchema.findOne({where:{activationLink}});
        if(!user){
            throw  ApiError.BadRequest(`Пользователь не найден`)
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password){
        const user = await UserSchema.findOne({where:{email}});
        if(!user){
            throw  ApiError.BadRequest("emailNotFound");
        }
        const isEqualsPass = await bcrypt.compare(password,user.password);
        if(!isEqualsPass){
            throw   ApiError.BadRequest("incorrectPassword");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {...userDto}
        }
    }
    async logout(refreshtoken){
        const token = await tokenService.deleteTokens(refreshtoken);
        return token;
    }



}
module.exports = new UserService();