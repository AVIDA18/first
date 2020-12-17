const express = require('express');
const router = express.Router();

const posts = require("./models/post");

router.get('/', (req, res, next) => {
    posts.find({

    }).then(d => {
        res.json(d.map(x => {
            var w = x.toObject()
            w.isLiked = w.likes.includes(req.user.username)
            return w;
        }))
    }).catch(e => next(e))




    // var filterPosts = posts
    //     .filter(x => x.username === req.user.username)
    //     .map(x => {
    //         x.isLiked = likes.filter(y => y.username === req.user.username && y.postId === x.postId).length > 0
    //         x.comments = comments.filter(y => y.postId === x.postId)
    //         return x;
    //     })
    // res.json(filterPosts);
})


router.post('/add', (req, res, next) => {


    const { caption } = req.body
    if (caption) {
        res.status(406).send("add caption");
    } else {
        posts.create({
            caption,
            username: req.user.username,

        }).then(d => {
            res.json({ caption, username: req.user.username, id: d._id });
        }).catch(e => next(e))
        // const postId = "l" + Math.round(Math.random() * 9999)
        // posts.push({ caption, username: req.user.username, postId });
        // res.json({ caption, postId });

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


router.get("/like/:postId", (req, res) => {
    const { postId } = req.params;
    if (!postId) res.status(406).json({ error: "no post id entered" })
    posts.findOne({
        _id: postId
    }).then(d => {
        if (d) {
            let isLiked = d.likes.includes(req.user.username)
            if (isLiked) {
                d.likes.pull(req.user.username)
            } else {
                d.likes.push(req.user.username)
            }
            d.save().then(d => res.json({ isLiked: !isLiked }))
                .catch(e => res.status(406).json(e))
        } else {
            res.status(406).json({ error: "post not found" })
        }
    })

    //  if //(posts.filter(x => x.postId === postId).length < 1) {
    //     res.status(406).json({ error: "not found" });
    // }
    // else {
    //     const isLiked = likes.filter(x => x.postId === postId && x.username === req.user.username);
    //     console.log(isLiked)
    //     if (isLiked.length > 0) {
    //         likes = likes.filter(x => x.postId !== postId && x.username !== req.user.username);
    //         res.json({ isLiked: false })
    //         //yesle chai like gareko xa vandai xa
    //     } else {
    //         likes.push({ username: req.user.username, postId })//if not yesle jabarjasti halxa
    //         res.json({ isLiked: true });
    //     }


    // }


})



router.post("/add/comments/:postId", async (req, res) => {

    try {
        const { postId } = req.params;
        const { caption } = req.body;

        const post = await posts.findOne({ _id: postId }).exec();
        if (post) {
            post.comments.push({ caption, by: req.user.username });
            await post.save();
            res.json({ status: 'comment added.' })
        }
        else {
            res.status(406).json({ error: 'Post not found.' })
        }
    }
    catch (e) {
        res.status(406).json({ error: e })
    }

})
router.post('/add/comments/:postId', (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;

    posts.findOne({ _id: postId })
        .then(d => {
            if (d) {
                d.comment.push({ comment, username: req.user.username });
                d.save()
                    .then(w => {
                        res.json({ status: 'comment added.' })
                    }).catch(e => res.status(406).json(e))

            }
            else {
                res.status(406).json({ error: 'Post not found.' })
            }
        }).catch(e => res.status(406).json(e))

    // if (posts.filter(x => x.postId === postId).length < 1) {
    //     res.status(406).json({ error: "post not found" });
    // } else {
    //     comments.push({ comment, postId, username: req.user.username })
    //     res.json({ comment, postId, username: req.user.username })
    // }

})


//   if(!comment)res.status(406).json({error:"no comments added"});
//   else if (posts.filter(x => x.postId === postId).length < 1) {
//     res.status(406).json({ error: 'post not found' });
//   } else {
//     comments.push({comment, postId});
//     res.json(comments);
//   }

module.exports = router;