const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const ratingDefinition = protoLoader.loadSync(
  path.join(__dirname, '../../proto/rating.proto'),
  {}
);
const ratingProto = grpc.loadPackageDefinition(ratingDefinition);

const client = new ratingProto.RatingService(
  '127.0.0.1:3003',
  grpc.credentials.createInsecure()
);
module.exports = client;
