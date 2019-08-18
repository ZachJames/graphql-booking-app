const Event = require("../../models/event")
const User = require("../../models/user")
const { transformEvent } = require("./merge")

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()

      return events.map(event => {
        return transformEvent(event)
      })
    } catch (err) {
      throw err
    }
  },
  createEvent: async (args, req) => {
    console.log("saodkfoasdkfo")
    if (!req.isAuth) {
      throw new Error("Unauthenticated")
    }

    try {
      const newEvent = new Event({
        title: args.eventInput.title,
        price: +args.eventInput.price,
        description: args.eventInput.description,
        date: new Date(args.eventInput.date),
        creator: req.userId
      })

      let createdEvent

      const result = await newEvent.save()

      createdEvent = transformEvent(result)

      const existingUser = await User.findById(req.userId)

      if (!existingUser) {
        throw new Error("User does not exist")
      }

      existingUser.createdEvents.push(newEvent)

      await existingUser.save()

      return createdEvent
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
