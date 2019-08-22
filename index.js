const { ApolloServer } = require('apollo-server');
const  schemaString      = require('./PhotoSharingSchema').typeDefs;
const { GraphQLDateTime } = require('graphql-custom-types'); 


let photos = [];

const resolvers = {

   Query: {
      totalPhotos: () => photos.length
   },
   Mutation: {


   },
   Subscription: {

   },

   DateTime: GraphQLDateTime     // resolver for custom type DateTime
}


const server  = new ApolloServer({ typeDefs: schemaString, resolvers : resolvers });

server.listen().then(({url}) => console.log(`🚀 Server ready at ${url}`));