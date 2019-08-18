import React, { useState, useContext } from "react"
import axios from "axios"

import "./Auth.css"
import AuthContext from "../context/auth-context"

const AuthPage = props => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const Auth = useContext(AuthContext)

  const onSubmit = async e => {
    e.preventDefault()

    let requestBody = isLogin
      ? {
          query: `
            mutation {
              login(email: "${email}", password: "${password}" ){
                userId
                token
                tokenExpiration
              }
            }
          `
        }
      : {
          query: `
            mutation {
              createUser(userInput: { email: "${email}", password: "${password}" }){
                _id
                email
              }
            }
          `
        }

    try {
      const { data } = await axios.post(`http://localhost:8000/api`, requestBody)

      if (data.data.login.token) {
        const { token, userId, tokenExpiration } = data.data.login
        Auth.login(token, userId, tokenExpiration)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h1 className="form-header">{isLogin ? "Login" : "Sign Up"}</h1>
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" onChange={e => setEmail(e.target.value)} value={email} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button onClick={() => setIsLogin(!isLogin)} type="button">
            Switch to {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </>
  )
}

export default AuthPage
