'use strict';
const aws = require('aws-sdk')

module.exports.hello = async (event, context) => {

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        secretValue: process.env.SECRET_VALUE,
        plainSecretValue: process.env.PLAIN_SECRET_VALUE,
        plainValue: process.env.PLAIN_VALUE
      },
      null,
      2
    ),
  };
};
