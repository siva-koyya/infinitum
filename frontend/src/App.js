import './App.css';
import RootLayout from './components/Nav/RootLayout';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Event from './components/events/Event';
import CreateEvent from "./components/createevnt/CreateEvent"
import Edit from "./components/createevnt/Edit"

function App() {
const router =createBrowserRouter([
  {path:'/',element:<RootLayout/>,
    children:[
      {index:"/event",element:<Event/>,children:[]},
      {path:"/cretateEvent",element:<CreateEvent/>},
      {path:"/edit",element:<Edit/>},
    ]
  }
])

  return (
    <div className=' font-display font-medium'>

      <RouterProvider router={router}/>
    </div>
      //  <RootLayout/>
  );
}

export default App;
