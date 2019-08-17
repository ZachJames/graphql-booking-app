import React from "react"
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"
import "./App.css"

import AuthPage from "./pages/Auth"
import EventsPage from "./pages/Events"
import BookingsPage from "./pages/Bookings"
import MainNavigation from "./components/navigation/MainNavigation"

function App() {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect path="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingsPage} />
          </Switch>
        </main>
      </>
    </BrowserRouter>
  )
}

export default App
