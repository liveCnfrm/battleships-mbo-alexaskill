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

        //httpAction("/alexa/place?x=0&y=0", 'PlaceShip from alexa', columnID, rowID);

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

        //httpAction("/alexa/shoot?x=0&y=0", 'Shoot from alexa', columnID, rowID);

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

        //httpAction('/alexa/rotate', 'Rotate from alexa')

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

        //httpAction('/alexa/next_ship', 'NextShip from alexa');

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

        //httpAction('/alexa/restart', 'restart game from alexa')

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

        //httpAction('/alexa/finish_placement', 'FinishPlacement from alexa');

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

       //httpAction('/alexa/register', 'hello from alexa')

        const speechText = "Willkommen bei Schiffe Versenken in M B O. Zunächst musst du deine Schiffe auf deinem Spielfeld platzieren. Du siehst auf der Spielanzeige dein aktuelles Schiff und dessen Rotation. Um ein Schiff um 90 Grad zu rotieren, sage einfach, Schiff drehen. Um das Schiff zu platzieren, sage einfach, platziere Schiff auf Zeile Spalte. Wenn dir die finale Position deines aktuellen Schiffes gefällt, sag einfach, nächstes Schiff. Wenn du alle Schiffe gesetzt hast, sag einfach, fertig.";
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};

function httpAction(actionPath, message, x = 0, y = 0) {

    if (x > 0 && y > 0) {
        var positionPath = new URL(actionpath);
        positionPath.searchParams.set('x', columnID);
        positionPath.searchParams.set('y', rowID);

        actionPath = positionPath.toString();
    }

    const https = require('http')

    const data = JSON.stringify({
        msg: message
    })

    const options = {
        hostname: 'mboex.freeddns.org',
        port: 443,
        path: actionPath,
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
}