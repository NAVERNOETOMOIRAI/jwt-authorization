const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router')
const sequelize = require('./db');
const models = require('./model/models');
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT ||  5000;
const app  = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_HOST
}));
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync()
        app.listen(PORT, () => console.log(`SERVER START ON PORT:${PORT}`))
    }catch (e){
        console.log(e);
        await  sequelize.close()
    }
}
start()