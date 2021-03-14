require('dotenv').config()

const app = require('./app')
const server = require('./server')
const port = process.env.PORT || 3000

server.applyMiddleware({ app })
app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`))
