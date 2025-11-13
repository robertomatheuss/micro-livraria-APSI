const grpc = require('@grpc/grpc-js');      
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, '../../proto/rating.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  }
);
const ratingProto = grpc.loadPackageDefinition(packageDefinition);

const ratings = [
  { productId: 1, average: 4.8, count: 27 },
  { productId: 2, average: 4.5, count: 15 },
  { productId: 3, average: 4.9, count: 32 }
];

const server = new grpc.Server();

server.addService(ratingProto.RatingService.service, {
  GetRating: (call, callback) => {
    const id = call.request.productId;
    const rating = ratings.find(r => r.productId === id);

    if (!rating) {
      return callback(null, {
        productId: id,
        average: 0,
        count: 0
      });
    }

    callback(null, rating);
  }
});

// Sobe o servidor gRPC (porta 3002, por exemplo)
const PORT = '0.0.0.0:3003';

server.bindAsync(
  PORT,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Rating Service running on ${PORT}`);
    server.start();
  }
);
