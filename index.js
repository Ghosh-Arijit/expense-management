const express= require("express")

const { mongoose }= require("./config/database")
const { routes }= require("./config/routes")

const app= express()
const port = 3000

app.use(express.json())
app.use("/",routes)
app.use("/uploads",express.static("uploads"))

app.listen(port,function(){
    console.log("Listening to port" + " : " +port)
})