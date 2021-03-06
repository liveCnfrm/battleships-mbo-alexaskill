const Alexa = require('ask-sdk');
const http = require('http');

const needle = require('needle');

let skill;

var shipCount = 5;
var battleStarted = false;

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

        const rowID = parseInt(rowSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id);
        const columnID = parseInt(columnSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id);

        var speechText = '';


        if (shipCount <= 0) {
            speechText = 'Es ist kein Schiff mehr übrig, dass du setzen könntest. Sag einfach: fertig, um das Spiel zu starten';

        }
        else {

            if (battleStarted) {
                speechText = 'Du befindest dich im Spiel gegen deinen Gegner. Du kannst jetzt kein Schiff auf dem Spielfeld platzieren!';
            }
            else {
                httpAction('/alexa/place', columnID, rowID);
                speechText = 'Das aktuelle Schiff wurde auf ' + columnValue.toString() + ' ' + rowValue.toString() + ' gesetzt. ' + 'Wenn du mit der Position und der Rotation des Schiffs zufrieden bist, sag einfach: nächstes Schiff.';
            }
        }
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

        const rowID = parseInt(rowSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id);
        const columnID = parseInt(columnSLOT.resolutions.resolutionsPerAuthority[0].values[0].value.id);

        httpAction('/alexa/shoot', columnID, rowID);

        var speechText = '';

        if (!battleStarted) {
            speechText = 'Du befindest dich noch nicht im Spiel gegen deinen Gegner. Du musst erst alle deine Schiffe auf dem Spielfeld platzieren!';
        }
        else {
            speechText = 'Okay, du hast auf die gegnerische Position ' + columnValue.toString() + ' ' + rowValue.toString() + ' geschossen ';
        }
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

        httpAction('/alexa/rotate')

        var speechText = '';

        if (battleStarted) {
            speechText = 'Du befindest dich bereits im Spiel gegen deinen Gegner. Du kannst jetzt deine Schiffe nicht mehr rotieren'
        }
        else {

            speechText = 'Das aktuelle Schiff wurde um 90 Grad gedreht.';
        }

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

        httpAction('/alexa/next_ship');

        var speechText = '';

        if (shipCount <= 0) {
            speechText = 'Es ist kein Schiff mehr übrig, dass du setzen könntest. Sag einfach: fertig, um das Spiel zu starten';
            if (battleStarted) {
                speechText = 'Du befindest dich bereits im Spiel gegen deinen Gegner. Du kannst jetzt kein Schiff zum Setzen auswählen!';
            }

        }
        else {
            shipCount--;
            speechText = 'Das nächste Schiff wurde ausgewählt.' + 'Du hast noch ' + shipCount.toString() + ' Schiffe übrig.';
        }
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

        battleStarted = false;
        shipCount = 5;

        httpAction('/alexa/restart')

        var speechText = 'Okay, ich starte das Spiel Schiffe Versenken von vorn. Nun musst du erst wieder alle deine Schiffe platzieren.';


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

        var speechText = '';

        if (shipCount <= 0) {
            if (battleStarted) {
                speechText = 'Du befindest bereits im Spiel gegen deinen Gegner. Sage einfach: Neustart, wenn du von vorne beginnen möchtest';
            }
            else {

                speechText = 'Okay, alle Schiffe sind gesetzt. Jetzt kannst du auf eine Position des gegnerischen Spielfelds schießen. Sage einfach, Schieße auf Zeile Spalte.';
                battleStarted = true;

                httpAction('/alexa/finish_placement');
            }
        } else {
            speechText = 'Derzeit sind ' + shipCount.toString() + ' Schiffe noch nicht gesetzt. Damit das Spiel gestartet werden kann müssen zunächst alle deiner Schiffe auf dem Spielfeld gesetzt sein.'
        }

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

        var speechText = 'Ups. Entschuldigung, im Alexa Skill Schiffe Versenken ist ein Fehler aufgetreten.';
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

        var speechText = 'Willkommen bei Schiffe Versenken. Zunächst musst du deine Schiffe auf deinem Spielfeld platzieren. Du siehst auf der Spielanzeige dein aktuelles Schiff und dessen Rotation. Um ein Schiff um 90 Grad zu rotieren, sage einfach, Schiff drehen. Um das Schiff zu platzieren, sage einfach, platziere Schiff auf Zeile Spalte. Wenn dir die finale Position deines aktuellen Schiffes gefällt, sag einfach, nächstes Schiff. Wenn du alle Schiffe gesetzt hast, sag einfach, fertig.';

        httpAction('/alexa/register');

        return handlerInput.responseBuilder
                .speak(speechText)
                .withShouldEndSession(false)
                .getResponse();
    }
};



function httpAction(actionPath, x = -1, y = -1) {

    var pathURL = actionPath;

    // if shooting or placing
    if (x > -1 && y > -1) {
        pathURL = pathURL + "?x=" + x.toString() + "&y=" + y.toString();
    }


    const options = {
        hostname: 'mboex.ddns.net',
        port: 3000,
        method: 'GET',
        path: pathURL
    }

    const req = http.request(options, res => {
        console.log('statusCode: ${res.statusCode}')

        res.on('data', d => {

        })

        res.on('end', () => {
        });
    })
}

async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}