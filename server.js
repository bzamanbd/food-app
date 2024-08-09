import express from 'express' 
import 'dotenv'
import globalErrorHandler from './middlewares/globalErrorHandler.js'
import router from './routes/index.js'

const app = express() 
const port = process.env.PORT || 4011

app.use(express.json(),router,globalErrorHandler)


app.get('/',(req,res)=>{ 
    res.status(200).json({message:"Welcome to the multi-tenancy app. This is home route of the app"})
})

app.use('*',(req,res)=>{ 
    res.status(404).json({ 
        message:`${req.originalUrl} <== Route not found`
    })
})

app.listen(port,()=>console.log(`server is running at http://localhost:${port}`))