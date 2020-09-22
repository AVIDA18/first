const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());          //middleware for jason
app.use(express.urlencoded());    //middleware for form


// app.use('/login', require('./practice1.js'));

//app.get('/avida', (req, res) => res.send("Avshek Dahal"))

//app.get('/avida',function1);
app.get('/', (req, res) => res.sendFile(__dirname + "/hamro.html"));
app.get('/submit', (req, res) => {

    const username = req.query['username'];
    const password = req.query['password'];

    if (username === 'aaa') {
        res.send('welcome');
    } else {
        res.send('try again');
    }
});
app.post("/submit",(req,res)=>{

    const username = req.body['username'];
    const password = req.body['password'];

    if (username === 'aaa') {
        res.send('welcome');
    } else {
        res.send('try again');
    }

});
app.listen(port, () => console.log(`server started at port ${port}`));
