/* 
    Events Routes
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/jwt-validator');
const { validateFields } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

router.use(validateJWT);

router.get('/', getEvents);

router.post(
    '/',
    [
        check('title', 'The title is required').not().isEmpty(),
        check('start', 'The start date is required').custom( isDate ),
        check('end', 'The end date is required').custom( isDate ),
        validateFields
    ],
    createEvent
);

router.put(
    '/:id',
    [
        check('title', 'The title is required').not().isEmpty(),
        check('start', 'The start date is required').custom( isDate ),
        check('end', 'The end date is required').custom( isDate ),
        validateFields
    ], 
updateEvent);

router.delete('/:id', deleteEvent);


module.exports = router;
