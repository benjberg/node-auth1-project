const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req,res) => {
    let user = req.body;
    const rounds = process.env.HASH_ROUNDS || 12;
    const hash = bcryptjs.hashSync(user.password, rounds);
    user.password = hash;

    Users.add(user).then(saved => {
        res.status(201).json(saved);

    }).catch(err =>{
        res.status(500).json({message: 'an error has occurred'})
    })

})

router.post('/login', (req,res) => {
    let {username, password} = req.body;
    Users.findBy({username}).then(([user]) => {
        if(user && bcryptjs.compareSync(password, user.password)){
            req.session.loggedIn = true;
            res.status(200).json({message: 'log in successful'})
        } else {
            res.status(401).json({message: 'access denied'})
        }
    }).catch(err =>{
        res.status(500).json({message: 'an error has occurred'})
    })
})
module.exports = router;