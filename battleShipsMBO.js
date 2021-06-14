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
        //const slotValue = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slotName');
        const speechText = 'This is PlaceShip intent handler';
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
        const speechText = 'This is Rotate intent handler';
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
        const speechText = 'This is NextShip intent handler';
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
        const speechText = 'This is Restart intent handler';
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
        const speechText = 'This is FinishPlacement intent handler';
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
        const speechText = 'Willkommen bei Schiffe Versenken in MBO';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(false)
            .getResponse();
    }
};