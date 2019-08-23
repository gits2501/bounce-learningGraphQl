const { ApolloServer } = require('apollo-server');
const  schemaString      = require('./PhotoSharingSchema').typeDefs;
const { GraphQLDateTime } = require('graphql-custom-types'); 

let photoId_ = 0;
let photos = [];

const resolvers = {

   Query: {

      totalPhotos: () => photos.length,
      allPhotos: () => photos
   },

   Mutation: {
      
    postPhoto: (root, args) => {      // root is the reference to the return value of the parent resolver function (null if no parent)

         var newPhoto = {
             id: ++photoId_,          // simulate database id creation
             ...args                  // pass other args sent by client
         }
         
         photos.push(newPhoto)       
         return newPhoto               // return value must mach type defined in the schema
    },
    
   },

   Subscription: {

   },
  
   Photo : {                          // Added the so colled Trivial Resolver function that gets each photo object as parent argument

         url: (parent) => {
            return `http://yoursite.com/img/${parent.id}.jpg`
         } 
   },

   DateTime: GraphQLDateTime         // resolver for custom type DateTime
}


const server  = new ApolloServer({ typeDefs: schemaString, resolvers : resolvers });

server.listen().then(({url}) => console.log(`🚀 Server ready at ${url}`));