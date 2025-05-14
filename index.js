import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import assetRoutes from './Routers/AssetRouter.js'
import connectionDB from './Database/db.config.js'
dotenv.config()
const app=express()
const port = process.env.PORT
connectionDB()
app.use(cors())
app.use(express.json())


app.use('/api', assetRoutes);
app.listen(port,()=>{
    console.log("App is running this", `${port}`);
    
})  