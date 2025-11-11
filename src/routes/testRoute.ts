import { Router } from "express";

const router = Router();

router.post('/', (req, res) => {

    const body = req.body;

    function curry(fn) {
        return function curried(...args) {
            if (args.length >= fn.length) {
                // if we have enough args, call the original function
                return fn.apply(this, args);
            } else {
                // otherwise, return a function waiting for the rest
                return (...nextArgs) => curried.apply(this, args.concat(nextArgs));
            }
        };
    }

    function sendMessage(api, user, message) {
        return `Sending "${message}" to ${user} via ${api}`
    }

    const curriedSend = curry(sendMessage);

    const sendViaSlack = curriedSend('Slack');
    const sendViaEmail = curriedSend('Email');

    if (body.api === 'slack') {
        return res.status(200).json({message: sendViaSlack(body.user, body.message)})
    }


    res.status(200).json({message: sendViaEmail(body.user, body.message)})

})

export default router;