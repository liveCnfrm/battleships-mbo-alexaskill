const Alexa = require('ask-sdk');
let skill;

exports.handler = async function (event, context) {
    //console.log('REQUEST ' + JSON.stringify(event));
    if (!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addErrorHandlers(ErrorHandler)
            .addRequestHandlers(
                LaunchRequestHandler,
                PlaceShipHandler,
                RotateHandler,
                NextShipHandler,
                RestartHandler,
                FinishPlacementHandler,
                ShootHandler
            ).create();
    }

    const response = await skill.invoke(event, context);
    return response;
};

//---- Custom Handlers ----

const PlaceShipHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PlaceShip';
    },
    handle(handlerInput) {

        const rowValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'row');
        const columnValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'column');

        const rowSLOT = Alexa.getSlot(handlerInput.requestEnvelope, 'row');
        const columnSLOT = Alexa.getSlot(handlerInput.requestEnvelope, 'column');

        const rowID = rowSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const columnID = columnSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id;


        const https = require('http')

        const data = JSON.stringify({
            msg: 'PlaceShip from alexa'
        })

        var placementPath = new URL("/alexa/place?x=0&y=0");
        placementPath.searchParams.set('x', columnID);
        placementPath.searchParams.set('y', rowID);



        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: placementPath.toString(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()

        const speechText = "Das aktuelle Schiff wurde auf " + columnValue.toString() + " " + rowValue.toString() + " gesetzt.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};


const ShootHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Shoot';
    },
    handle(handlerInput) {


        const rowValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'row');
        const columnValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'column');

        const rowSLOT = Alexa.getSlot(handlerInput.requestEnvelope, 'row');
        const columnSLOT = Alexa.getSlot(handlerInput.requestEnvelope, 'column');

        const rowID = rowSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        const columnID = columnSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id;


        const https = require('http')

        const data = JSON.stringify({
            msg: 'Shoot from alexa'
        })

        var shootPath = new URL("/alexa/shoot?x=0&y=0");
        shootPath.searchParams.set('x', columnID);
        shootPath.searchParams.set('y', rowID);

        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: shootPath.toString(),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()

        const speechText = 'Okay, du hast auf die gegnerische Position ' + columnValue.toString() + ' ' + rowValue.toString() + ' geschossen ';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const RotateHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Rotate';
    },
    handle(handlerInput) {


        const https = require('http')

        const data = JSON.stringify({
            msg: 'Rotate from alexa'
        })

        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: '/alexa/rotate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()

        const speechText = 'Das aktuelle Schiff wurde um 90 Grad gedreht.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const NextShipHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NextShip';
    },
    handle(handlerInput) {


        const https = require('http')

        const data = JSON.stringify({
            msg: 'NextShip from alexa'
        })

        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: '/alexa/next_ship',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()


        const speechText = 'Das nächste Schiff wurde ausgewählt.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const RestartHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Restart';
    },
    handle(handlerInput) {


        const https = require('http')

        const data = JSON.stringify({
            msg: 'restart game from alexa'
        })

        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: '/alexa/restart',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()


        const speechText = 'Okay, ich starte das Spiel Schiffe Versenken von vorn. Nun musst du erst wieder alle deine Schiffe platzieren.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const FinishPlacementHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FinishPlacement';
    },
    handle(handlerInput) {


        const https = require('http')

        const data = JSON.stringify({
            msg: 'FinishPlacement from alexa'
        })

        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: '/alexa/finish_placement',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()

        const speechText = 'Okay, alle Schiffe sind gesetzt. Jetzt kannst du auf eine Position des gegnerischen Spielfelds schießen. Sage einfach, Schieße auf Zeile Spalte.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle(handlerInput) {
        return true;
    },
    handle(handlerInput, error) {
        console.log('Error handled: ' + JSON.stringify(error.message));
        // console.log('Original Request was:', JSON.stringify(handlerInput.requestEnvelope.request, null, 2));

        const speechText = 'Ups. Entschuldigung, im Alexa Skill Schiffe Versenken ist ein Fehler aufgetreten.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

        const https = require('http')

        const data = JSON.stringify({
            msg: 'hello from alexa'
        })

        const options = {
            hostname: 'mboex.freeddns.org',
            port: 443,
            path: '/alexa/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`${res}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()


        const speechText = "Willkommen bei Schiffe Versenken in M B O. Zunächst musst du deine Schiffe auf deinem Spielfeld platzieren. Du siehst auf der Spielanzeige dein aktuelles Schiff und dessen Rotation. Um ein Schiff um 90 Grad zu rotieren, sage einfach, Schiff drehen. Um das Schiff zu platzieren, sage einfach, platziere Schiff auf Zeile Spalte. Wenn dir die finale Position deines aktuellen Schiffes gefällt, sag einfach, nächstes Schiff. Wenn du alle Schiffe gesetzt hast, sag einfach, fertig.";
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};