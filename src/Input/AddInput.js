import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function AddInput() {
  const [userInput, setUserInput] = useState([]);
  let [checkInput, setcheckInput] = useState(true);
  const [plantName, setPlantName] = useState([]);
  const rowsTrack = useRef(null);
  const dropdown = ["", "Nagesh", "Elumalai", "govindasamy", "Radhakrishnan"];
  const [dropdownTrack, setDropdownTrack] = useState({
    selectPlant: "",
    drillingTypeSelect: "",
  });

  //function to add rows when clicking on add button
  function handleAddRows() {
    let rows = rowsTrack.current.value;
    rowsTrack.current.value = "";
    let createObj = [];
    for (let i = 0; i < rows; i++) {
      createObj.push({
        id: i + 1,
        date: "",
        vendorName: "",
        noOfHoles: "",
        feetPerHole: "",
        rate: "",
        totalFeet: "",
        type: "",
        total: "",
        advance: "",
        plantName: "",
        drillingType: "",
      });
    }
    setUserInput(createObj);
  }

  //function to fetch and setup data for "select plant" input dropdown from plant location table
  async function fetchPlantName() {
    let fetchRequest = await axios.get("http://localhost:8080/plants");
    let fetchResult = fetchRequest.data;
    setPlantName(fetchResult);
  }

  //focus event trigger function
  //when the input box loses its focus this will trigger and calculate totalFeet and assign the result
  function handleAutoCalculateTotalFeet(e, id) {
    if (
      userInput[id - 1].noOfHoles !== "" &&
      userInput[id - 1].feetPerHole !== ""
    ) {
      let arr;
      let val = userInput[id - 1].noOfHoles * userInput[id - 1].feetPerHole;

      arr = userInput.map((data, i) => {
        return data.id === id ? { ...data, totalFeet: val } : data;
      });
      setUserInput(arr);
    } else {
      return;
    }
  }

  //focus event trigger function
  //when the input box loses its focus this will trigger and calculate totalRate and assign the result
  function handleAutoCalculateRate(e, id) {
    if (userInput[id - 1].totalFeet !== "" && userInput[id - 1].rate !== "") {
      let arr;
      let val = userInput[id - 1].totalFeet * userInput[id - 1].rate;

      arr = userInput.map((data, i) => {
        return data.id === id ? { ...data, total: val } : data;
      });
      setUserInput(arr);
    } else {
      return;
    }
  }

  //submit event trigger function
  //this function is responsible for posting data to db
  async function handleSubmit(e) {
    e.preventDefault();
    let getId = await axios.get(`http://localhost:8080/inputs`);
    let getIdResponse = getId.data.length;
    let dbIdMapped = userInput.map((data, i) => {
      return { ...data, id: getIdResponse + i + 1 };
    });

    const postDb = dbIdMapped.map(async (data, i) => {
      if (data.plantName && data.drillingType) {
        await axios.post(`http://localhost:8080/addinput`, data);
        return data;
      } else {
        setcheckInput(false);
        return null;
      }
    });
    setUserInput([]);
  }

  //input change event trigger function
  //when there is a change in the input this will trigger and get the value from input box and sets it to the userInput variable
  function handleInputChange(e, id) {
    let modifiedInput = userInput.map((x, y) => {
      return x.id === id
        ? {
            ...x,
            [e.target.name]: e.target.value,
            plantName: dropdownTrack.selectPlant,
            drillingType: dropdownTrack.drillingTypeSelect,
          }
        : {
            ...x,
            plantName: dropdownTrack.selectPlant,
            drillingType: dropdownTrack.drillingTypeSelect,
          };
    });
    setUserInput(modifiedInput);
  }

  useEffect(() => {
    fetchPlantName();
  }, []);
  return (
    <div
      className="inputAddComponent"
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
        }}
      >
        <div
          style={{
            fontSize: "1.3em",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Add Input
        </div>

        <p
          className="text-danger"
          style={
            checkInput
              ? {
                  display: "none",
                  border: "1.5px solid red",
                  fontWeight: "pink",
                }
              : {
                  display: "block",
                  border: "2px solid red",
                  fontWeight: "pink",
                  borderRadius: "5px",
                  padding: "3px",
                }
          }
        >
          Please fill all fields
        </p>
      </div>

      <div className="row-add">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <select
                name="plantName"
                style={{ padding: "3px" }}
                className="plantName_dropdown"
                required
                onChange={(e) => {
                  setDropdownTrack({
                    ...dropdownTrack,
                    selectPlant: e.target.value,
                  });
                }}
              >
                <option value=" " selected disabled>
                  select Plant
                </option>
                {plantName.map((data, i) => {
                  return (
                    <option value={data.plant_name}>{data.plant_name}</option>
                  );
                })}
              </select>
            </div>
            <div>
              <select
                name="drillingType"
                style={{ padding: "3px" }}
                className="drillingType_dropdown"
                required
                onChange={(e) => {
                  setDropdownTrack({
                    ...dropdownTrack,
                    drillingTypeSelect: e.target.value,
                  });
                }}
              >
                <option value=" " selected disabled>
                  Drilling Type
                </option>
                <option value="normal">Normal</option>
                <option value="bore">Bore</option>
              </select>
            </div>
            <div>
              <input
                className="rows"
                ref={rowsTrack}
                style={{ margin: "0.3px" }}
                type="input"
                placeholder="Rows to be added"
              />
            </div>
            <div>
              <button
                style={{ color: "skyblue", borderRadius: "5px" }}
                type="button"
                onClick={handleAddRows}
              >
                Add
              </button>
            </div>
            <button
              style={{
                marginLeft: "550px",
                borderRadius: "5px",
                color: "white",
                padding: "5px",
                width: "100px",
                backgroundColor: "green",
              }}
              type="submit"
            >
              Save
            </button>
          </div>
          <div className="table">
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
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    #
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Date
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Vendor Name
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    No of Holes
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Feet/Hole
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Rate
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Total Feet
                  </th>

                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Type
                  </th>

                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Total
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Advance
                  </th>
                </tr>
              </thead>
              <tbody>
                {userInput.map((data) => {
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
                          onChange={(e) => {
                            handleInputChange(e, data.id);
                          }}
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
                          }}
                          onChange={(e) => {
                            handleInputChange(e, data.id);
                          }}
                          required
                        >
                          {dropdown.map((data, i) => {
                            return (
                              <option style={{ textAlign: "center" }}>
                                {data}
                              </option>
                            );
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

                      <td>
                        <select
                          key={data.id}
                          value={data.feetPerHole}
                          name="feetPerHole"
                          style={{
                            textAlign: "center",
                            width: "112px",
                            height: "30px",
                            appearance: "none",
                            borderRadius: "1.5px",
                          }}
                          onChange={(e) => {
                            handleInputChange(e, data.id);
                          }}
                          onBlur={(e) => {
                            handleAutoCalculateTotalFeet(e, data.id);
                          }}
                          required
                        >
                          <option value="" selected disabled></option>
                          <option value="6">6</option>
                          <option value="8">8</option>
                        </select>
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
                          onChange={(e) => {
                            handleInputChange(e, data.id);
                          }}
                          required
                        />
                      </td>

                      <td>
                        <select
                          key={data.id}
                          name="type"
                          style={{
                            textAlign: "center",
                            width: "112px",
                            height: "30px",
                            appearance: "none",
                            borderRadius: "1.5px",
                          }}
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

                      <td key={data.id}>
                        <input
                          type="text"
                          name="total"
                          value={data.total}
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
        </form>
      </div>
    </div>
  );
}

export default AddInput;
