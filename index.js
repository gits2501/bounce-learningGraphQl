const { ApolloServer } = require('apollo-server');
const  schemaString      = require('./PhotoSharingSchema').typeDefs;
const { GraphQLDateTime } = require('graphql-custom-types'); 

let photoId_ = 0;
let photos = [];

const resolvers = {

   Query: {

      totalPhotos: () => photos.length
   },

   Mutation: {
      
    postPhoto: (root, args) => {      // root is the reference to the return value of the parent resolver function (null if no parent)

         var newPhoto = {
             id: ++photoId_,          // simulate database id creation
             ...args                  // pass other args sent by client
         }
         
         photos.push(newPhoto)       
         return newPhoto               // return value must mach type defined in the schema
    }

   },

   Subscription: {

   },

   DateTime: GraphQLDateTime     // resolver for custom type DateTime
}


const server  = new ApolloServer({ typeDefs: schemaString, resolvers : resolvers });

server.listen().then(({url}) => console.log(`🚀 Server ready at ${url}`));