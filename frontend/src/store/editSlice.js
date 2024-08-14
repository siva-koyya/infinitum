// import {createSlice} from ''
import { createSlice } from '@reduxjs/toolkit'

const editSlice =createSlice({
    name:"editEvent",
    initialState:{
        items:[]
    },
    reducers:{
        dataToEdit(state,action){
                let item =action.payload
               state.items=[item] 
        }
    }
})

export const editAction = editSlice.actions
export default editSlice 

