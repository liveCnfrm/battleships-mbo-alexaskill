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
    //console.log('RESPONSE :' + JSON.stringify(response));
    return response;
};

//---- Custom Handlers ----

const PlaceShipHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PlaceShip';
    },
    handle(handlerInput) {
        // invoke custom logic of the handler
        const row = Number(Alexa.getSlotValue(handlerInput.requestEnvelope, 'row'));
        const column = Char(Alexa.getSlotValue(handlerInput.requestEnvelope, 'column'));

        const speechText = "Das aktuelle Schiff wurde auf " + column + " " + row + " gesetzt.";
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
        // invoke custom logic of the handler
        //const slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slotName');
        const speechText = 'Das aktuelle zu platzierende Schiff wurde um 90 Grad gedreht.';
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
        // invoke custom logic of the handler
        //const slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slotName');
        const speechText = 'Das nächste Schiff ist ausgewählt';
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
        // invoke custom logic of the handler
        //const slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slotName');
        const speechText = 'Okay, ich starte das Spiel "Schiffe Versenken" von vorn.';
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
        // invoke custom logic of the handler
        //const slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slotName');
        const speechText = 'Okay, alle Schiffe sind gesetzt. Jetzt kannst du auf eine Position des gegnerischen Spielfelds schießen. Sage einfach, Schieße auf Zeile Spalte.';
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
        // invoke custom logic of the handler
        //const slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slotName');
        const speechText = 'This is the Shoot Intent Handler';
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

        const speechText = 'Entschuldigung, im Alexa Skill "Schiffe Versenken" ist ein Fehler aufgetreten.';
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
        const speechText = "Willkommen bei Schiffe Versenken in MBO. Zunächst musst du deine Schiffe auf deinem Spielfeld platzieren. Du siehst auf der Spielanzeige dein aktuelles Schiff und dessen Rotation. Um dieses um 90 Grad zu rotieren, sage einfach, Schiff drehen. Um das Schiff zu platzieren, sage einfach, platziere Schiff auf Zeile Spalte. Wenn dir die finale Position deines aktuellen Schiffes gefällt, sag einfach, nächstes Schiff. Wenn du alle Schiffe gesetzt hast, sag einfach, fertig.";
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};