// module imports
const express = require('express');
const path = require('path');
const api = require('./routes/route');


// assigning express to a variable
const app = express();

// setting up express
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// router for api requests
app.use("/api",api);

// local host PORT
const PORT = process.env.PORT || 3001;

// GET reqeust that serves the home page
app.get('*',(req,res)=> {
    res.sendFile(path.join(__dirname,"public/index.html"))
});


// makes express listen at port
app.listen(PORT, ()=>{
    console.log(`server listening at http://localhost:${PORT}`);
});


