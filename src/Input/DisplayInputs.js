import React, { useEffect, useState } from "react";
import axios from "axios";
import AddInput from "./AddInput";

function DisplayInputs() {
  const [toggle,setToggle]=useState(false);
  const [givenInput, setGivenInput] = useState([]);
  const [plantName, setPlantName] = useState([]);
  const [updatedInputs, setUpdatedInputs] = useState([]);
  const dropdown= ["","Nagesh","Elumalai","govindasamy","Radhakrishnan"];

  
//function to fetch the input from db and to display it on the component
  async function getGivenInput() {
    let fetchRequest = await axios.get("http://localhost:8080/inputs");
    let fetchResult = fetchRequest.data;

    setGivenInput(fetchResult);
  }

  //function to fetch the plant name from plant location db and to display it on the dropdown
  async function fetchPlantName() {
    let fetchRequest = await axios.get("http://localhost:8080/plants");
    let fetchResult = fetchRequest.data;

    setPlantName(fetchResult);
  }

//when clicking save button this will be triggered and it will post the modified state variable values to db
  function handleSave(e) {
    const updateRequests = updatedInputs.map(async (id) => {
      const updatedLocation = givenInput.find((item) => item.id === id);

      await axios.put(
        `http://localhost:8080/updateinput/${id}`,
        updatedLocation
      );
    });

    setUpdatedInputs([]);
  }
  //input change event trigger function
  //when there is a change in the input this will trigger and get the value from input box and sets it to the givenInput variable
  function handleInputChange(e, id) {
    let modified_array = givenInput.map((data, y) => {
      return data.id === id
        ? {
            ...data,
            [e.target.name]: e.target.value,
          }
        : data;
    });
    setGivenInput(modified_array);

    if (!updatedInputs.includes(id)) {
      setUpdatedInputs((prevInputs) => {
        return [...prevInputs, id];
      });
    }
  }

  //focus event trigger function
  //when the input box loses its focus this will trigger and calculate totalFeet and assign the result(for PUT method)
  function handleAutoCalculateTotalFeet(e, id) {
    if (
      givenInput[id - 1].givenInput !== "" &&
      givenInput[id - 1].givenInput !== ""
    ) {
      let arr;
      let val = givenInput[id - 1].noOfHoles * givenInput[id - 1].feetPerHole;

      arr = givenInput.map((data, i) => {
        return data.id === id ? { ...data, totalFeet: val } : data;
      });
      setGivenInput(arr);
    } else {
      return;
    }
  }

   //focus event trigger function
  //when the input box loses its focus this will trigger and calculate totalRate and assign the result(for PUT method)
  function handleAutoCalculateRate(e, id) {
    if (givenInput[id - 1].totalFeet !== "" && givenInput[id - 1].rate !== "") {
      let arr;
      let val = givenInput[id - 1].totalFeet * givenInput[id - 1].rate;

      arr = givenInput.map((data, i) => {
        return data.id === id ? { ...data, total: val } : data;
      });
      setGivenInput(arr);
    } else {
      return;
    }
  }

  useEffect(() => {
    getGivenInput();
    fetchPlantName();
  }, []);

  return <>
  <button   style={{
                border: "1px solid blue",
                padding: "3px",
                borderRadius: "5px",
                color: "white",
                backgroundColor: "blue",
                cursor: "pointer",
                width:"110px",
                
              }} onClick={()=>{setToggle(true)}}>Add Input</button>
  
   {toggle?(<AddInput/>):(
    <div
      className="displayInputs"
      style={{
        padding: "30px",
        boxShadow: "1px 1px 3px black",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",

          marginBottom: "30px",
        }}
      >
        <div
          style={{
            fontSize: "1.4em",
            fontWeight: "bold",
            marginRight: "700px",
          }}
        >
          Inputs
        </div>

        <button
          type="button"
          style={{
            border: "1px solid blue",
            padding: "3px",
            borderRadius: "5px",
            color: "white",
            backgroundColor: "green",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
      <table
        style={{
          border: "1px solid black",
          width: "90%",
          margin: "0 auto",
          marginTop: "30px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#d3d3d3" }}>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              #
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Date
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Vendor Name
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Plant Name
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              No of Holes
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Feet/Hole
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Rate
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Total Feet
            </th>

            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Type
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Drilling Type
            </th>

            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Total
            </th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>
              Advance
            </th>
          </tr>
        </thead>

        <tbody>
          {givenInput.map((data, i) => {
            return (
              <tr key={data.id}>
                <td key={data.id} style={{ textAlign: "center" }}>
                  <input
                    required
                    disabled
                    type="number"
                    name="id"
                    value={data.id}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                  />
                </td>
                <td key={data.id} style={{ textAlign: "center" }}>
                  <input
                    type="date"
                    name="date"
                    value={data.date.substr(0, 10)}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    required
                  />
                </td>
                <td>
                  <select
                    key={data.id}
                    name="vendorName"
                    style={{
                      width: "112px",
                      height: "30px",
                      appearance: "none",
                      borderRadius: "1.5px",
                      textAlign: "center",
                    }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    value={data.vendorName}
                    required
                  >
                    {dropdown.map((data, i) => {
                      return <option value={data}>{data}</option>;
                    })}
                  </select>
                </td>
                <td>
                  <select
                    key={data.id}
                    name="plantName"
                    style={{
                      padding: "0px",
                      width: "112px",
                      height: "30px",
                      appearance: "none",
                      borderRadius: "1.5px",
                      textAlign: "center",
                    }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    value={data.plantName}
                    required
                  >
                    <option value="" disabled selected></option>
                    {plantName.map((data, i) => {
                      return <option>{data.plant_name}</option>;
                    })}
                  </select>
                </td>
                <td key={data.id}>
                  <input
                    type="text"
                    name="noOfHoles"
                    value={data.noOfHoles}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    required
                  />
                </td>
                <td key={data.id}>
                  <input
                    type="text"
                    name="feetPerHole"
                    value={data.feetPerHole}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    onBlur={(e) => {
                      handleAutoCalculateTotalFeet(e, data.id);
                    }}
                  />
                </td>

                <td key={data.id}>
                  <input
                    type="text"
                    name="rate"
                    value={data.rate}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    onBlur={(e) => {
                      handleAutoCalculateRate(e, data.id);
                    }}
                    required
                  />
                </td>
                <td key={data.id}>
                  <input
                    type="text"
                    name="totalFeet"
                    value={data.totalFeet}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                  />
                </td>

                <td>
                  <select
                    key={data.id}
                    name="type"
                    style={{
                      width: "112px",
                      height: "30px",
                      appearance: "none",
                      borderRadius: "1.5px",

                      textAlign: "center",
                    }}
                    value={data.type}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    required
                  >
                    <option value=" " selected disabled></option>
                    <option value="Rock">Rock</option>
                    <option value="Set">Set</option>
                  </select>
                </td>

                <td>
                  <select
                    key={data.id}
                    name="drillingType"
                    style={{
                      width: "112px",
                      height: "30px",
                      appearance: "none",
                      borderRadius: "1.5px",
                      textAlign: "center",
                    }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    value={data.drillingType}
                    required
                  >
                    <option value=" " selected disabled></option>
                    <option value="Rock">Normal</option>
                    <option value="Set">Bore</option>
                  </select>
                </td>

                <td key={data.id}>
                  <input
                    type="text"
                    name="total"
                    value={data.total}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                    required
                  />
                </td>
                <td key={data.id}>
                  <input
                    type="text"
                    name="advance"
                    value={data.advance}
                    key={data.id}
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={(e) => {
                      handleInputChange(e, data.id);
                    }}
                    required
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
        }</>
  }


export default DisplayInputs;
