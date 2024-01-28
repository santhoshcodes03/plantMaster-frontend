import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function LocationHome() {
  const plantName = useRef(null);
  const address = useRef(null);
  const contactNo = useRef(null);
  const [track, setTrack] = useState(false);
  const [updatedLocations, setUpdatedLocations] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [locationInput, setLocationInput] = useState({
    plant_name: "",
    address: "",
    contact_no: "",
  });
  

  //this will update the state value if any changes are made in the location display table
  function handleUpdate(e, id) {
 
    let x = locationData[id - 1];
    let y = { ...x, [e.target.name]: e.target.value };

    let copy = [...locationData];
    copy.splice(id - 1, 1, y);
 
    setLocationData(copy);

    if (!updatedLocations.includes(id)) {
      setUpdatedLocations((prevLocations) => {
        return [...prevLocations, id];
      });
    }
  }

  
  function handleSave(e) {
    const updateRequests = updatedLocations.map(async (id) => {
      const updatedLocation = locationData.find((item) => item.id === id);

      await axios.put(`http://localhost:8080/updateplant/${id}`, updatedLocation);
    });

    setUpdatedLocations([]);
  }

  async function getLocationData() {
    let fetchRequest = await axios.get("http://localhost:8080/plants");
    let fetchResult = fetchRequest.data;

    setLocationData(fetchResult);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("http://localhost:8080/addplant", locationInput);
    plantName.current.value = "";
    address.current.value = "";
    contactNo.current.value = "";
    getLocationData();
    setTrack(false);
  }

  function handleInput(e) {
    let value = { ...locationInput, [e.target.name]: e.target.value };
    setLocationInput(value);
  }

  useEffect(() => {
    getLocationData();
  }, []);
  return (
    <>
      <div  className="locationHomeComponent" style={{ boxShadow: "1px 1px 3px black" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <div
            style={{ fontSize: "1.2em", fontWeight: "bold", marginLeft: "5px" }}
          >
            Details
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "300px",
              padding: "10px",
            }}
          >
            <div
              style={{
                border: "1px solid blue",
                padding: "3px",
                borderRadius: "5px",
                color: "white",
                backgroundColor: "blue",
                cursor: "pointer",
              }}
              onClick={() => {
                setTrack(!track);
              }}
            >
              Add Location
            </div>
            <div
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
            </div>
          </div>
        </div>
        <div
          className="modal-form"
          style={{
            width: "30%",
            height: "500px",
            borderRadius: "5px",
            padding: "10px",
            overflow: "auto",
            position: "fixed",
            backgroundColor: "white",
            left: "40%",
            display: track ? "block" : "none",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <p
              style={{ fontSize: "1.2em", fontWeight: "bold", padding: "7px" }}
            >
              Add location
            </p>
            <div
              style={{
                fontSize: "1.1em",
                padding: "5px",
                marginBottom: "20px",
              }}
            >
              Please fill all the fields below
            </div>

            <div
              className="plant_name"
              style={{
                position: "relative",
                height: "50px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  position: "absolute",
                  padding: "7px",
                  border: "1px solid #a1a1a1",
                  outline: "none",
                }}
                name="plant_name"
                required
                value={setLocationInput.plant_name}
                onChange={handleInput}
                ref={plantName}
              />
              <label
                style={{
                  position: "absolute",
                  top: "7px",
                  left: "10px",
                  zIndex: "1",
                  backgroundColor: "none",
                }}
              >
                Plant Name
              </label>
            </div>
            <div
              className="address"
              style={{
                position: "relative",
                height: "50px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  position: "absolute",
                  padding: "7px",
                  border: "1px solid #a1a1a1",
                  outline: "none",
                }}
                name="address"
                required
                value={setLocationInput.address}
                onChange={handleInput}
                ref={address}
              />
              <label
                style={{
                  position: "absolute",
                  top: "7px",
                  left: "10px",
                  zIndex: "1",
                  backgroundColor: "none",
                }}
              >
                Address
              </label>
            </div>
            <div
              className="contact_no"
              style={{
                position: "relative",
                height: "50px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  position: "absolute",
                  padding: "7px",
                  border: "1px solid #a1a1a1",
                  outline: "none",
                }}
                name="contact_no"
                required
                value={setLocationInput.contact_no}
                onInput={handleInput}
                ref={contactNo}
              />
              <label
                style={{
                  position: "absolute",
                  top: "7px",
                  left: "10px",
                  zIndex: "1",
                  backgroundColor: "none",
                }}
              >
                Contact No
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button
                type="button"
                style={{
                  borderRadius: "10px",
                  width: "150px",
                  backgroundColor: "black",
                  color: "white",
                }}
                onClick={() => {
                  setTrack(false);
                  plantName.current.value = "";
                  address.current.value = "";
                  contactNo.current.value = "";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  borderRadius: "10px",
                  width: "150px",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="table">
          <table
            style={{
              border: "1px solid black",
              width: "90%",
              margin: "0 auto",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#d3d3d3" }}>
                <th style={{ border: "1px solid black", textAlign: "center" }}>
                  #
                </th>
                <th style={{ border: "1px solid black", textAlign: "center" }}>
                  Plant Name
                </th>
                <th style={{ border: "1px solid black", textAlign: "center" }}>
                  Address
                </th>
                <th style={{ border: "1px solid black", textAlign: "center" }}>
                  Contact No
                </th>
              </tr>
            </thead>
            <tbody>
              {locationData.map((data, i) => {
                return (
                  <tr key={data.id}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="number"
                        name="#"
                        value={data.id}
                        style={{ width: "100%", textAlign: "center" }}
                        onChange={(e) => {
                          handleUpdate(e, data.id);
                        }}
                        disabled
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="text"
                        name="plant_name"
                        value={data.plant_name}
                        style={{ width: "100%", textAlign: "center" }}
                        onChange={(e) => {
                          handleUpdate(e, data.id);
                        }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="text"
                        name="address"
                        value={data.address}
                        style={{ width: "100%", textAlign: "center" }}
                        onChange={(e) => {
                          handleUpdate(e, data.id);
                        }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="text"
                        name="contact_no"
                        value={data.contact_no}
                        style={{ width: "100%", textAlign: "center" }}
                        onChange={(e) => {
                          handleUpdate(e, data.id);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default LocationHome;
