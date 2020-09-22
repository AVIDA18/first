const express = require('express');
const app = express();
const port = 1000;
app.use(express.json());          //middleware for jason
app.use(express.urlencoded());    //middleware for form

let loggedUsers = [];
var registered = [];

app.post("/register", ({ body }, res) => {
    const { username, password, name } = body;
    if (!username) res.status(406).json({ error: 'username not found' })
    else if (!password) res.status(406).json({ error: 'password not found' })
    else if (registered.filter(x => x.username === username).length > 0) res.status(406).json({ error: 'username already registered' })
    else if (!name) res.status(406).json({ error: 'name not found' })
    else {
        registered.push({ username, password, name });
        res.json({ username, password, name });
    }
});
app.post("/login", ({ body }, res) => {
    const { username, password } = body;
    if (!username) res.status(406).json({ error: 'username not found' })
    else if (!password) res.status(406).json({ error: 'password not found' })
    else {
        var isRegistered = registered.filter(x => x.username === username && x.password === password);
        if (isRegistered.length > 0) {
            const token = username + Math.round(Math.random() * 9999)
            loggedUsers.push({
                username,
                token
            })
            res.json({ username, token });
        }
        else {
            res.status(401).json({ error: 'Username/password not matched' });
        }
    }
});


const checkAuthorization = (req, res, next) => {
    const { authorization } = req.headers;
    var isLogged = loggedUsers.filter(x => x.token === authorization);
    if (isLogged.length > 0) {
        req.user = isLogged[0];
        next();
    } else {
        console.log(authorization, isLogged, loggedUsers);
        res.status(401).send({ error: "user not found" });
    }
}

app.get('/users', checkAuthorization, (req, res) => {
    res.json(registered);
})


var posts = [];

app.get('/posts', checkAuthorization, (req, res) => {
    var filterPosts = posts
        .filter(x => x.username === req.user.username)
        .map(x => {
            x.isLiked = likes.filter(y => y.username === req.user.username && y.postId === x.postId).length > 0
            return x;
        })
    res.json(filterPosts);
})

app.post('/posts/add', checkAuthorization, (req, res) => {
    const { caption } = req.body
    if (!caption) {
        res.status(406).send("add caption");
    } else {
        const postId = "l" + Math.round(Math.random() * 9999)
        posts.push({ caption, username: req.user.username, postId });
        res.json({ caption, postId });

    }
})

// app.get('/users',({headers},res)=>{
//     const{ authorization }=headers;
//     var isLogged=loggedUsers.filter(x=>x.token===authorization);
//     if (isLogged.length>0){
//         res.json(registered);
//     }else{
//         res.status(401).send({error:"user not found"});
//     }
// })

// var posts=[];

// app.get("/posts",({headers},res)=>{
//     const{ authorization }=headers;
//     var isLogged=loggedUsers.filter(x=>x.token===authorization);
//     if (isLogged.length>0){
//         res.json(posts);
//     }else{
//         res.status(401).send({error:"user not found"});
//     }
// })

var likes = []

app.get("/like/:postId", checkAuthorization, (req, res) => {
    const { postId } = req.params;
    if (posts.filter(x => x.postId === postId).length < 1) {
        res.status(406).json({ error: "not found" });
    }
    else {
        const isLiked = likes.filter(x => x.postId === postId && x.username === req.user.username);
        console.log(isLiked)
        if (isLiked.length > 0) {
            likes = likes.filter(x => x.postId !== postId && x.username !== req.user.username);
            res.json({ isLiked: false })
            //yesle chai like gareko xa vandai xa
        } else {
            likes.push({ username: req.user.username, postId })//if not yesle jabarjasti halxa
            res.json({ isLiked: true });
        }


    }


})





app.listen(port, () => console.log(`server started at port ${port}`));
