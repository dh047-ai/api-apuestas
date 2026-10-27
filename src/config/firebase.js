const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializamos Firebase con la sintaxis moderna
initializeApp({
  credential: cert(serviceAccount)
});

const firebaseDb = getFirestore();

console.log('🔥 Conectado a Firebase (Simulador de Pagos)');

module.exports = { firebaseDb };