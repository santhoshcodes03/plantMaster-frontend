
import "./App.css";
import SideNav from "./Layout/SideNav";
import LocationHome from "./Location/LocationHome";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddInput from "./Input/AddInput";
import DisplayInputs from "./Input/DisplayInputs";
import ReportPage from "./Report/ReportPage";

function App() {


  return (
    <div className="app">
     <BrowserRouter>
     <SideNav />
      <div className="container">
      <Routes>
          <Route path="/" element={<LocationHome />} />
        <Route path="/input" element={<DisplayInputs />} />
        <Route path="/reports" element={<ReportPage/>} />
       
        </Routes>
        
        
        {/* <LocationHome/> 
         <AddInput/> 
         <DisplayInputs/>
        <ReportPage/>   */}
      </div>
     </BrowserRouter>
    </div>
  );
}

export default App;
