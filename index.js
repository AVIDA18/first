const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
app.use(express.json());          //middleware for jason
app.use(express.urlencoded());    //middleware for form
mongoose.connect('mongodb://localhost:27017/sn',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(d => console.log('connected.'))
    .catch(e => console.log(e))

const loggedUser = require("./models/loggedUser");
const registerd = require("./models/registerd");

app.post("/register", ({ body }, res) => {
    const { username, password, name } = body;
    if (!username) res.status(406).json({ error: 'username not found' })
    else if (!password) res.status(406).json({ error: 'password not found' })
    // else if (registered.filter(x => x.username === username).length > 0) res.status(406).json({ error: 'username already registered' })
    else if (!name) res.status(406).json({ error: 'name not found' })
    else {
        const user = registerd.create({
            "username": username,
            "password": password,
            "name": name
        }).then(d => {
            res.json({ username, password, name });
        }).catch(e => res.status(406).json(e))
    }
});
app.post("/login", ({ body }, res) => {
    const { username, password } = body;
    if (!username) res.status(406).json({ error: 'username not found' })
    else if (!password) res.status(406).json({ error: 'password not found' })
    else {
        // var isRegistered = registered.filter(x => x.username === username && x.password === password);
        registerd.countDocuments({ username, password })
            .then(d => {
                if (d > 0) {
                    loggedUser.create({
                        username
                    }).then(d => {
                        res.json({
                            username,
                            token: d.token
                        })
                    }).catch(e => {
                        console.log(e)
                        res.status(406).json(e)
                    })
                }
                else {
                    res.status(401).json({ error: 'Username/password not matched' });
                }
            })
    }
});


const checkAuthorization = (req, res, next) => {
    const { authorization } = req.headers;
    loggedUser.findOne({
        token: authorization
    }).then(d => {
        console.log(d)
        if (d) {
            req.user = d;
            next();

        } else {
            // console.log(authorization, isLogged, loggedUsers);
            res.status(401).send({ error: "user not found" });
        }

    })


    //     var isLogged = loggedUsers.filter(x => x.token === authorization);
    //     if (isLogged.length > 0) {
    //         req.user = isLogged[0];
    //         next();
    //     } else {
    //         console.log(authorization, isLogged, loggedUsers);
    //         res.status(401).send({ error: "user not found" });
    //     }
}

app.get('/users', checkAuthorization, (req, res) => {
    res.json(registered);
})

app.use('/posts', checkAuthorization, require('./posts.js'));

app.listen(port, () => console.log(`server started at port ${port}`));
