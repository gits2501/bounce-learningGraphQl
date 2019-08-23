const { ApolloServer } = require('apollo-server');
const  schemaString      = require('./PhotoSharingSchema').typeDefs;
const { GraphQLDateTime } = require('graphql-custom-types'); 

let photoId_ = 0;

let users = [                                                       // sample users 
 { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
 { "githubLogin": "gPlake", "name": "Glen Plake" },
 { "githubLogin": "sSchmidt", "name": "Scot Schmidt" }             
]

var photos = [                                                      // sample photos

   {
     "id": "1",
     "name": "Two Towers",
     "description": "Union Ortank and Barad Dur towers",
     "category": "ACTION",
     "githubUser": "gPlake"                                         // In a RDS table this attribute would be FOREIGN key 
                                                                    // that references githublogin attr. as prim.key in User table (I think)
   },
   {
     "id": "2",
     "name": "Enjoying the sunshine",
     "category": "SELFIE",
     "githubUser": "sSchmidt"
   },
   {
     "id": "3",
     "name": "Gunbarrel 25",
     "description": "25 laps on gunbarrel today",
     "category": "LANDSCAPE",
     "githubUser": "sSchmidt"
   }
]

const resolvers = {

   Query: {

      totalPhotos: () => photos.length,
      allPhotos: () => photos
   },

   Mutation: {
      
    postPhoto: (root, args) => {      // root is the reference to the return value of the parent resolver function (null if no parent)

         var newPhoto = {
             id: ++photoId_,          // simulate database id creation
             ...args.input            // pass other args sent by client , know in new property called input (see schema for this mutation)
         }
         
         photos.push(newPhoto)       
         return newPhoto               // return value must mach type defined in the schema
    },
    
   },

   Subscription: {

   },
  
   Photo : {                          // Added the so called Trivial Resolver function that gets each photo object as parent argument

      url: (parent) => {
          return `http://yoursite.com/img/${parent.id}.jpg`
      },
      postedBy: (parent) => {
         return users.find( (u) => { 
            return parent.githubUser === u.githubLogin
         }) //  returns single user with githublogin as photo.githubUser
      }
   },
   User: {
      postedPhotos: (parent) => {

           return photos.filter((p) => { 
               return p.githubUser === parent.githubLogin           // returns array of photos where githubUser = githublogin 
            });
      }

   },

   DateTime: GraphQLDateTime         // resolver for custom type DateTime
}


const server  = new ApolloServer({ typeDefs: schemaString, resolvers : resolvers });

server.listen().then(({url}) => console.log(`🚀 Server ready at ${url}`));