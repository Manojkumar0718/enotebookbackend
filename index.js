import connectToMongo from "./database/db.js";
import cors from 'cors'
import express from "express"
import auth from './routes/auth.js'
import notes from './routes/notes.js'

connectToMongo();

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

//Routes
app.use('/api/auth' , auth)
app.use('/api/notes' , notes)

app.listen(port , () =>{
    console.log(`Example app listening at http://localhost:${port}`)
})

