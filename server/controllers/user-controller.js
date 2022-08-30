const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');
const {validationResult} = require('express-validator');
class UserController{
    async registration(req, res, next){
        try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(ApiError.BadRequest('validationError', errors.array()));
        }
        const {email, password} = req.body;
        const userData = await userService.registration(email, password);
        res.cookie('refreshtoken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly:true});
        return res.json({
            ...userData
            })
        }catch (e){
            next(e);
        }
    }
    async login(req, res, next){
        try{
            const {email, password} = req.body;
            console.log(req)
            const userData = await userService.login(email, password);
            res.cookie('refreshtoken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly:true});
            return res.json({
                ...userData
            })
        }catch (e){
            next(e);
        }
    }
    async logout(req, res, next){
        try{
            const {refreshtoken} = req.cookies;
            const token = userService.logout(refreshtoken);
            res.clearCookie('refreshtoken');
            return res.json({
                ...token
            })
        }catch (e){
            next(e);
        }
    }
    async activate(req, res, next){
        try{
        const activationLink = req.params.link;
        await userService.activateUser(activationLink);
        res.redirect(process.env.CLIENT_HOST);
        }catch (e){
            next(e);
        }
    }
    async refresh(req, res, next){
        try{

        }catch (e){
            next(e);
        }
    }
    async getUsers(req, res, next){
        try{
            res.json(['123','345'])
        }catch (e){
            next(e);
        }
    }
}
module.exports = new UserController();
