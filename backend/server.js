const express =require("express")
const cors =require("cors")
const mongoose=require("mongoose")
let event =require("./controlers/event")
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
const dotenv =require("dotenv")
const env=dotenv.config()

const URL =process.env.MONGO_URL

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
const uploadDir = path.join(__dirname, 'uploads');

// Middleware to serve static files from the 'uploads' directory under '/uploads' path
app.use('/uploads', express.static(uploadDir));

async function connectDb(){
  await  mongoose.connect(`${URL}`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
    console.log("sucussfully")
}
try {
   connectDb() 
} catch (error) {
    console.log(error,"<---->erro")
}

app.listen(5555,()=>{
    console.log("lesning port 5555")
})

app.use(event)



