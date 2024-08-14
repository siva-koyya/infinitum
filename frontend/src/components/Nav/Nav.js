import React from 'react'
import { Link } from 'react-router'
import { NavLink } from 'react-router-dom'
function Nav() {
  return (
    <div className=''>
        <nav className="static top-10  shadow-slate-300 shadow-md m-3 text-nowrap flex ite h-10 items-center justify-around bg-slate-700 ">
           <NavLink to={"/"} className={` bg-green-400 w-auto p-1 h-8  text-center align-middle rounded-sm`}>Events</NavLink>
           <NavLink to={"/cretateEvent"} className={` bg-green-400 w-auto h-8  p-1  text-center align-middle rounded-sm`}>Create events</NavLink>
        </nav>
    </div>
  )
}

export default Nav