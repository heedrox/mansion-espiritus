require('@babel/register');

// Configurar emulador de Firestore para tests
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const { buildScureFor } = require('scure').scure;
const testData = require('./data/data-test').data;
global.chai = require('chai');
global.sinon = require('sinon');

global.chai.should();
global.expect = global.chai.expect;
global.buildTestScure = () => buildScureFor(testData);
