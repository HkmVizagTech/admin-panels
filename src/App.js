// src/App.js
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import Events from "./pages/Events";
import EventPage from "./pages/EventPage";
import EditEvent from "./pages/EditEvent";
import AllUsers from "./pages/AllUsers";
import AllPayments from "./pages/AllPayements";
import LoginPage from "./pages/LoginPage";
import AddBook from "./pages/AddBook";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetails";
import GitaEvent from "./pages/GitaEvent";
import PrivateRoute from "./components/PrivateRoute";
const App = () => {
  return (
    <ChakraProvider>
      
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path='/add-event' element={<PrivateRoute><AddEvent/></PrivateRoute>} />
          <Route path='event-list' element={<PrivateRoute><Events/></PrivateRoute>}/>
          <Route path='/event/:id' element={<PrivateRoute><EventPage/></PrivateRoute>} />
          <Route path='/event/edit/:id' element={<PrivateRoute><EditEvent/></PrivateRoute>} />
          <Route path='/users' element={<PrivateRoute><AllUsers/></PrivateRoute>}/>
          <Route path='/payments' element={<PrivateRoute><AllPayments/></PrivateRoute>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/addbook' element={<PrivateRoute><AddBook/></PrivateRoute>}/>
          <Route path='/getAllBooks' element={<PrivateRoute><AllBooks/></PrivateRoute>}/>
          <Route path='/book/:id' element={<PrivateRoute><BookDetails/></PrivateRoute>}/>
          <Route path='/GitaEvent' element={<PrivateRoute><GitaEvent/></PrivateRoute>}/>
        </Routes>
      {/* </Router> */}
    </ChakraProvider>
  );
};

export default App;
