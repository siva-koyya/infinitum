import { configureStore } from "@reduxjs/toolkit";
import editSlice from "./editSlice";


const store =configureStore({
    reducer:{
        edit:editSlice.reducer
    }
})

export default store