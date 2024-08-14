import React from 'react'
import Nav from "../Nav/Nav"
import { Outlet } from 'react-router'
function RootLayout() {
  return (
    <>
        <Nav/>
        <Outlet/>
    </>
  )
}

export default RootLayout