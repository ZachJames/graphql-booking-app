const express = require("express")
const graphQLHttp = require("express-graphql")
const mongoose = require("mongoose")
const app = express()

const schema = require("./graphql/schema")
const resolvers = require("./graphql/resolvers")
const isAuth = require("./middleware/is-auth")

app.use(express.json())
app.use(isAuth)
app.use(
  "/",
  graphQLHttp({
    schema,
    graphiql: true,
    rootValue: resolvers
  })
)

mongoose
  .connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true })
  .then(() => app.listen(3000, () => console.log("Live on 3000")))
  .catch(e => console.log(e))
