import React from 'react'
import Navbar from './Components/navbar/Navbar'
import Footer from './Components/footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout