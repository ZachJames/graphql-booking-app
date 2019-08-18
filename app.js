const express = require("express")
const graphQLHttp = require("express-graphql")
const mongoose = require("mongoose")
const app = express()

const schema = require("./graphql/schema")
const resolvers = require("./graphql/resolvers")
const isAuth = require("./middleware/is-auth")

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

app.use(
  "/api",
  graphQLHttp({
    schema,
    graphiql: true,
    rootValue: resolvers
  })
)

const PORT = 8000 || process.env.PORT

mongoose
  .connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true })
  .then(() => app.listen(PORT, () => console.log(`Live on port ${PORT}!`)))
  .catch(e => console.log(e))
