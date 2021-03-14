const fetch = require('node-fetch')
const { ApolloServer, gql } = require('apollo-server-express')

const typeDefs = gql`
    interface IBasicData {
        id: ID!
        name: String
        email: String!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        user: User
    }

    type User implements IBasicData {
        id: ID!
        name: String
        username: String!
        email: String!
        address: Address
        phone: String
        website: String
        company: Company
    }

    type Comment implements IBasicData {
        id: ID!
        name: String
        email: String!
        body: String!
    }

    type Address {
        street: String
        suite: String
        city: String!
        zipcode: String
        geo: Geo
    }

    type Company {
        name: String
        catchPhrase: String
        bs: String
    }

    type Geo {
        lat: String
        lng: String
    }

    type Query {
        posts: [Post]
        post(id: ID!): Post
        users: [User]
        user(id: ID!): User
        comments(postId: ID!): [Comment]
    }
`

const resolvers = {
    IBasicData: {
        __resolveType(obj, context, info) {
            if (obj.username)
                return 'User'
            if (obj.body)
                return 'Comment'

            return null
        }
    },
    Query: {
        posts: async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts')
            return await res.json()
        },
        post: async (parent, { id }) => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
            const data = await res.json()

            const resUser = await fetch(`https://jsonplaceholder.typicode.com/users/${data.userId}`)
            const user = await resUser.json()

            return { ...data, user }
        },
        users: async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/users')
            return await res.json()
        },
        user: async (parent, { id }) => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
            return await res.json()
        },
        comments: async (parent, { postId }) => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
            return await res.json()
        }
    }
}

module.exports = new ApolloServer({ typeDefs, resolvers })
