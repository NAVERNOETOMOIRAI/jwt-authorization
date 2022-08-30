const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const UserSchema = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    email:{type: DataTypes.STRING, unique:true, allowNull:false},
    password:{type:DataTypes.STRING, allowNull:false},
    isActivated:{type: DataTypes.BOOLEAN, defaultValue:false},
    activationLink:{type:DataTypes.STRING, allowNull:false}
})

const TokenSchema = sequelize.define('token',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    refreshToken:{type: DataTypes.STRING, required:true},
})

UserSchema.hasOne(TokenSchema,{
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
});
TokenSchema.belongsTo(UserSchema);

module.exports = {
    UserSchema,
    TokenSchema
}