const app = require("express")();

const mongoose = require('mongoose');

const users = require('./models/Users')


mongoose.connect('mongodb://localhost:27017/test',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(d => console.log('connected.'))
    .catch(e => console.log(e))


// users.findOne({ username: 'random' })

//     .then(d => {
//         console.log(d)
//     })



// users.create({
//     'username': 'random',
//     'password': 'random',
//     name: 'avishek adhikari'
// })

//     .then(d => console.log(d))
//     .catch(e => console.log('err:', e))


app.use(require("express").json());


app.post("/users/add", (req, res) => {

    users.create({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    })
        .then(d => {
            res.json(d)
        })

        .catch(e => res.status(406).json(e))
})



// users.updateOne({ username: 'random' }, {
//     name: "Ram Kumar"
// })

//     .then(d => console.log('data updated'))
//     .catch(e => console.log('err', e))

app.listen(3000, () => console.log('server startee.'));