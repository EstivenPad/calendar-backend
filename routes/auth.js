/* 
    Users Routes 
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post(
    '/new',
    [ //Middlewares
        check('name', 'The name is required').not().isEmpty(),
        check('email','The email ir required').isEmail(),
        check('password', 'The password should have at least 6 character').isLength({ min: 6 }),
        validateFields
    ],
    createUser
);

router.post(
    '/',
    [ //Middlewares
        check('email', 'The email is required').isEmail(),
        check('password', 'The password should have at least 6 character').isLength({ min: 6 }),
        validateFields
    ],
    loginUser
);

router.get(
    '/renew',
    validateJWT, //Middleware 
    revalidateToken
);

module.exports = router;