import React from 'react'
import { MdDomainAdd } from "react-icons/md";
import { MdCloudUpload } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { Link } from 'react-router-dom';




function SideNav() {
  return (
    <>
    <div className='sideNav'>
        <div style={{fontSize:"1.3em", borderBottom:"1px solid black", textAlign:"center",fontWeight:"bold", padding:"3px"}}>Plant Master</div>
        <div className='sideNav-items' style={{marginTop:"50px",border:"0px solid black",height:"200px", display:"flex", flexDirection:"column", justifyContent:"space-around", alignItems:"center", fontSize:"1.1em", }}>
            <Link to="/" style={{cursor:"pointer"}}>
            <MdDomainAdd style={{marginRight:"5px",}}/>
                Location 
            </Link>
            <Link to="/input" style={{cursor:"pointer"}}>
            <MdCloudUpload style={{marginRight:"5px"}} />
                Input
            </Link>
            <Link to="/reports" style={{cursor:"pointer"}}>
            <TbReportSearch style={{marginRight:"5px"}}/>
                Reports
            </Link>
        </div>
    </div>
    </>
  )
}

export default SideNav