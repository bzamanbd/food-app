import express from 'express' 
import 'dotenv/config'
import colors from 'colors'
import globalErrorHandler from './middlewares/globalErrorHandler.js'
import router from './routes/index.js'
import appRes from './utils/appRes.js';
import { connectDb} from './db_config/config.js'

connectDb()

const app = express() 
const port = process.env.PORT || 4011

app.use(express.json(),router,globalErrorHandler)


app.get('/',(req,res)=>{ appRes(res,200,'','Welcome to the food-app. This is home route.',{})})

app.use('*',(req,res)=>{appRes(res,404,'False',`${req.originalUrl} <== Route not found`,{})})

app.listen(port,()=>console.log(`server is running at http://localhost:${port}`.bgMagenta.white))