import React, { useState } from "react"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"
import "./App.css"

import AuthPage from "./pages/Auth"
import EventsPage from "./pages/Events"
import BookingsPage from "./pages/Bookings"
import MainNavigation from "./components/navigation/MainNavigation"

import AuthContext from "./context/auth-context"

function App() {
  const [ctx, setCtx] = useState({
    token: null,
    userId: null
  })

  const login = (token, userId, tokenExpiration) => {
    setCtx({ token, userId })
  }

  const logout = () => {
    setCtx({ token: null, userId: null })
  }

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider value={{ token: ctx.token, userId: ctx.userId, login, logout }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {ctx.token && <Redirect path="/" to="/events" exact />}
              {ctx.token && <Redirect from="/auth" to="/events" exact />}
              {!ctx.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {ctx.token && <Route path="/bookings" component={BookingsPage} />}
              {!ctx.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  )
}

export default App
