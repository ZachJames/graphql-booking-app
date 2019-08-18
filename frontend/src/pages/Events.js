import React, { useState, useContext, useEffect } from "react"
import axios from "axios"

import AuthContext from "../context/auth-context"
import "./Events.css"
import Modal from "../components/Modal/Modal"
import Backdrop from "../components/Backdrop/Backdrop"

const EventsPage = props => {
  const Auth = useContext(AuthContext)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(1.0)
  const [date, setDate] = useState("")
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const requestBody = {
      query: `
       query {
         events {
           _id 
           title
           description
           date
           price
           creator {
             _id
             email
           }
         }
       }
      `
    }

    try {
      const { data } = await axios.post("http://localhost:8000/api", requestBody)

      setEvents(data.data.events)
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = async () => {
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: { title: "${title}", description: "${description}" price: ${Number(
        price
      )}, date: "${date}"}){
            _id
            title
            date
            description
            price
            creator {
              _id
              email
            }
          }
        }
      `
    }

    const { token } = Auth

    try {
      const { data } = await axios.post("http://localhost:8000/api", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCreating(false)
      fetchEvents()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      {creating && <Backdrop />}
      {creating && (
        <Modal title="Add Event" canCancel canConfirm onConfirm={onSubmit} onCancel={() => setCreating(false)}>
          <form onSubmit={onSubmit}>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price ($)</label>
              <input type="text" id="price" onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea rows="4" id="description" onChange={e => setDescription(e.target.value)} />
            </div>
          </form>
        </Modal>
      )}
      {Auth.token ? (
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      ) : (
        <p>Login to add your own events!</p>
      )}
      <ul className="events__list">
        {events.map(event => (
          <li className="events__list-item" key={event._id}>
            {event.title}
          </li>
        ))}
      </ul>
    </>
  )
}

export default EventsPage
