const bcrypt = require("bcryptjs")
const User = require("../../models/user")
const jwt = require("jsonwebtoken")

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email })

      if (existingUser) {
        throw new Error("User already exists.")
      }

      if (!args.userInput.password) {
        throw new Error("Invalid password")
      }

      const hash = await bcrypt.hash(args.userInput.password, 12)

      const newUser = new User({
        email: args.userInput.email,
        password: hash
      })

      const savedUser = await newUser.save()

      return { ...savedUser._doc, password: null, _id: savedUser.id }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email })

      if (!user) {
        throw new Error("User does not exist.")
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        throw new Error("Password is incorrect.")
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

      return {
        userId: user.id,
        token,
        tokenExpiration: 1
      }
    } catch (e) {
      throw e
    }
  }
}
