const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
    
    const { email, password } = req.body;
   
    try {
        let user = await User.findOne({ email });
        
        if( user ){
            return res.status(400).json({
                ok: false,
                msg: 'There is a user with that email'
            });
        }
        
        user = new User(req.body);

        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Please contact your provider"
        });
    }
};

const loginUser = async (req, res = response) => {
    
    const { email, password } = req.body;    
    
    try {
        
        const user = await User.findOne({ email });

        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'There isn\'t a user with that email'
            });
        }

        //Validate passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: "Password incorrect"
            })
        }

        //Generate JWT
        const token = await generateJWT(user.id, user.name);
        
        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Please contact your provider"
        });
    }
}

const revalidateToken = async (req, res = response) => {
    
    const { uid, name } = req;
    
    //Generate a new JWT
    const token = await generateJWT( uid, name );

    res.status(200).json({
        ok: true,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
};