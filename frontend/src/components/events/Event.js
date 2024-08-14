import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router'
import { editAction } from '../../store/editSlice'


function Event() {

    const [data, setData] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getEventData = async () => {
        const response = await axios.get("http://localhost:5555/event")
        if (response.data.length > 0) {
            setData(response.data)
        }

    }

    const DeleteEvent = async (id) => {
        console.log("deleted", id)
        const response = await axios.delete(`http://localhost:5555/event/${id}`)
        // console.log(response)
        if (response.status === 200) {
            alert("succussfully deleted")
            navigate("/", { replace: true })
            window.location.reload();
        } else {
            alert("event not found")
        }
    }

    useEffect(() => {
        try {
            getEventData()
        } catch (error) {
            alert(error, "error ")
        }
    }, [])

    return (
        <div className='flex bg-slate-100 h-full  shadow-sm justify-center  '>
            <div className=' shadow-gray-400   h-full shadow-sm w-10/12 border-gray-300 m-5 '>
                <header className='m-1 bg-slate-600 rounded-lg'>
                    <h1 className='border-2 font-medium text-2xl p-5'>Events</h1>
                </header>
                <main className=''>
                    <ul style={{height:600}} className='h-4/6 overflow-y-scroll'>
                        {data === null ? <li className=' bg-gray-500 flex m-3 p-3  rounded-md flex-wrap justify-around  border-2 h-auto items-center' >there is no Events</li>
                            : data.map((item, index) => (
                                <li key={index} className=' bg-gray-500 flex m-3 p-3 w-full rounded-md flex-wrap justify-around border-2 h-auto items-center'>
                                    <h3 className=" font-medium w-40 h-auto break-words">{item.eventname}</h3>
                                    <h3 className='font-medium w-48 h-auto break-words'> {item.user}</h3>
                                    <div className=' w-60'>
                                        {item.images.length >0 ?(
                                            <>
                                             <img src={`http://localhost:5555/${item.images[0].path}`} className=' object-contain saturate-50 rounded-xl w-60 h-28 border-2 '></img>
                                             <p className='relative bottom-10 text-2xl text-slate-300 '>+{item.images.length} images</p>
                                             </>
                                        ):(
                                            <p className='border-2 rounded-xl h-28 w-60 text-center pt-11 text-slate-300'>No images available</p>
                                        )}
                                       
                                    </div>
                                    <div className=' w-60'>
                                        {item.videos.length > 0 ? (
                                            <>
                                            <video
                                                src={`http://localhost:5555/${item.videos[0].path}`}
                                                className='border-2 rounded-xl h-28 w-60'
                                                
                                            />
                                            <p className='relative bottom-10 text-2xl  text-slate-300'>
                                            +{item.videos.length} Videos
                                        </p>
                                        </>
                                        ) : (
                                            <p className='border-2 rounded-xl h-28 w-60 text-center pt-11 text-slate-300'>No video available</p>
                                        )}
                                       
                                    </div>
                                    <div className='flex  flex-col gap-2'>
                                        <button onClick={() => {
                                            dispatch(editAction.dataToEdit(item))
                                            navigate("/edit")
                                        }} type="button" className='w-52 h-12 border-2 bg-green-600 rounded-xl hover:opacity-50'>Edit</button>
                                        <button onClick={() => { DeleteEvent(item._id) }} type="button" className='w-52 h-12 border-2 bg-red-800 rounded-xl hover:opacity-70'>Delete</button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </main>
            </div>
        </div>
    )
}

export default Event