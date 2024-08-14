import React from 'react'
import CreateEvent from './CreateEvent'
import { useSelector } from 'react-redux'
function Edit() {
  const itemData= useSelector(state=>state.edit.items)
  // console.log(itemData,"====>")
  
  return (
    <div>
      {itemData && itemData.map((value,index)=>(
        <CreateEvent key={index} eventData={value} edit={true} />
      ))
      }
    </div>
  )
}

export default Edit