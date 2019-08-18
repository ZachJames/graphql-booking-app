import React from "react"
import { NavLink } from "react-router-dom"

import AuthContext from "../../context/auth-context"

import "./MainNavigation.css"

const MainNavigation = props => (
  <AuthContext.Consumer>
    {ctx => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Events with GraphQL</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!ctx.token && (
                <li>
                  <NavLink to="/auth">Sign Up / Login</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {ctx.token && (
                <>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={ctx.logout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
      )
    }}
  </AuthContext.Consumer>
)

export default MainNavigation
