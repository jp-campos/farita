const mdbconn = require('../lib/utils/mongo.js');

function insertReunion(codigo) {

  return mdbconn.conn().then((client) => {
    return client.db('isis3710').collection('reuniones').insertOne(
      {
        _id: codigo,
        shots: []}
      
    ); // Si no se provee un ID, este será generado automáticamente
  });
}

function addUser(codigo, usuario) {

  return mdbconn.conn().then((client) => {
    return client.db('isis3710').collection('reuniones').updateOne(
      {_id: codigo},
      {$push: { usuario: 0}
      }      
    ); // Si no se provee un ID, este será generado automáticamente
  });
}

function updateUser(codigo, usuario, shots) {

  return mdbconn.conn().then((client) => {
    client.db('isis3710').collection('reuniones').updateOne(
      {_id: codigo},
      {$unset: {
          shots: 
            {
              name: usuario,
              shots: shots
            }
          }
      }      
    );
    return client.db('isis3710').collection('reuniones').updateOne(
      {_id: codigo},
      {$push: {
          shots: 
            {
              name: usuario,
              shots: shots
            }
          }
      }      
    );// Si no se provee un ID, este será generado automáticamente
  });
}

module.exports = [insertReunion, addUser, updateUser];