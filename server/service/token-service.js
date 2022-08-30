const jwt = require('jsonwebtoken');
const {TokenSchema} = require('../model/models')
class TokenService {
     generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_TOKEN, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_TOKEN, {expiresIn: '30d'});
        return{
            accessToken,
            refreshToken
        }
     }
     async deleteTokens(refreshToken){
         const token = await TokenSchema.destroy({where:{refreshToken}});
         return token;
     }

     async saveToken(userId, refreshToken){
         const tokenData = await TokenSchema.findOne({where:{userId}});
         if(tokenData){
             tokenData.refreshToken = refreshToken;
             return tokenData.save();
         }
         const token = await TokenSchema.create({userId, refreshToken});
         return token;
     }

}
module.exports = new TokenService();