const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
    
    const events = await Event.find().populate('user', 'name');
    
    res.status(200).json({
        ok: true,
        events
    })
};

const createEvent = async (req, res = response) => {

    const event = new Event( req.body );

    try {

        event.user = req.uid;
        const eventSaved = await event.save();
        
        res.status(201).json({
            ok: true,
            event: eventSaved
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact your provider'
        });
    }
};

const updateEvent = async (req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid
    try {
        
        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: `You don't have the permissions to edit this event`
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true });

        res.status(200).json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact with the admin'
        })
    }

};

const deleteEvent = async (req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid
    
    try {
        
        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: `You don't have the permissions to delete this event`
            });
        }

        await Event.findByIdAndDelete( eventId);

        res.status(200).json({ ok: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact with the admin'
        })
    }

};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};


