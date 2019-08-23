const { gql } = require('apollo-server');

const typeDefs = gql`

scalar DateTime

enum PhotoCategory { 
  SELFIE
  PORTRAIT
  ACTION
  LANDSCAPE
  GRAPHIC
}

type User {                      # CUSTOM type         
  """
  The user's unique GitHub login
  """    
  githubLogin: ID!
  name: String

  """
  A url for the user's GitHub profile photo
  """
  avatar: String
  
  """
  All of the photos posted by this user
  """
  postedPhotos: [Photo!]!        # one-to-many connection to the Photo type object

  """
  All of the photos in which this user appears
  """
  inPhotos: [Photo!]!            # one-to-many. Makes one side of the many-to-many connection(relationship). See 'taggedUsers' in Photo type

  # friends: [User!]!            # one-to-many. Connection that models both sides of the many-to-many friends concept.
  friendship: [Friendship!]!     # Alternative connection that models frenship with additional data about connection    
}

type Friendship {                
  friend: User!
  howLong: Int!
  whereWeMet: Location
}

type Location {
    name: String!
}

union AgendaItem = DevGroup | AdminGroup   # Define UNION type so list can have objects of more then one type
  
type DevGroup {
      name: String!
      department: String!
      assigned: [User!]!
}

type AdminGroup {
   name: String!
   tasks: String!
}

interface AgendaItem2{          # Interface for fields that types need to implement

    name: String!
    start: DateTime!
    end: DateTime!
    members:[User!]!
}

type QAGroup implements AgendaItem2{
    name: String!
    start: DateTime!
    end: DateTime!

    members: [User!]!
}

type DesignGroup implements AgendaItem2{
    name: String!
    start: DateTime!
    end: DateTime!
    members:[User!]!

    topic: String!

}

type Photo {               
   id: ID!
   name: String!
   url: String!
   description: String
   created: DateTime!
   category: PhotoCategory!
   postedBy: User!               # one-to-one connection to the User type object
   taggedUsers: [User!]!         # one-to-many. Makes other side of the many-to-many connnection. See 'inPhotos' in User type
}

type Query {                     # ROOT type. Common place for one-to-many connections to the CUSTOM types. In query we define out GraphQL API's
   totalPhotos: Int!             # bring number of Photos 
   allPhotos: [Photo!]!          # bring all Photos
   totalUsers: Int!         
   allUsers(category: PhotoCategory): [User!]!  # Optional non-nullable argument. Used to filter data. When no argument assume non filtered list 

   User(githubLogin: ID!): User! # Define arguments so we can query single User by githubLogin ID
   Photo(id: ID!): Photo!        # Same with photos
  
   agenda: [AgendaItem!]!
   aggenda2: [AgendaItem2!]      # Add api that returns list where objects are of different types (Implemented with Interface)
}

"""
The inputs sent with the postPhoto Mutation
"""
input PostPhotoInput {
   name: String!
   description: String
   category: PhotoCategory=PORTRAIT
}

type  AuthPayload {              # Define return type that besides User object return also metadata like "token"
    user: User!
    token: String!
}

type Mutation {
  postPhoto(input: PostPhotoInput!): Photo!   # Mutation that will create a photo with provided arguments
  #postPhoto(name: String! description: String): Photo!
  """
  Authorizes a GitHub User
  """
  githubAuth(
     "The unique code from GitHub that is sent to authorize the user"
     code: String!
  ): AuthPayload!     # Will sign in user with provided github code and return payload(user) and metadata (token)
} 



type Subscription {
   newPhoto(category: PhotoCategory): Photo!  # listen for new photo creation, optionaly subscribe for Photos on given category
   newUser: User!
}


schema {
   query: Query                  # Adding the query type to Schema - which makes it avalable as GraphQL API
   mutation: Mutation
   subscription: Subscription
}
`
exports.typeDefs = typeDefs;