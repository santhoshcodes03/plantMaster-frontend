import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportPage() {
  const [plantname, setPlantName] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reportInput, setReportInput] = useState({
    location: "",
    start_date: "",
    end_date: "",
  });

  //obj to be added as a inline css style value. this is for table's header
  let headerDesign = {
    textAlign: "center",
    border: "1px solid black",
    backgroundColor: "#f8f8f8",
    fontWeight: "bold",
    fontSize: "1em",
  };

  //obj to be added as a inline css style value. this is for table's body
  let bodyDesign = {
    textAlign: "center",
    border: "1px solid black",
    fontSize: "1em",
  };

  //function to fetch and setup data for "select plant" input dropdown from plant location table
  async function fetchPlantName() {
    let fetchRequest = await axios.get("http://localhost:8080/plants");
    let fetchResult = fetchRequest.data;

    setPlantName(fetchResult);
  }

  //function to generate Array of dates based on user input
  function dates(start_date, end_date) {
    let dateArr = [];
    let dateTrack = new Date(start_date);
    let date1 = new Date(start_date);
    let date2 = new Date(end_date);
    const diffTime = Math.abs(date2 - date1);
    let difference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    for (let i = 0; i <= difference; i++) {
      const currentDate = new Date(date1);
      currentDate.setDate(date1.getDate() + i);
      dateArr.push(currentDate.toISOString().split("T")[0]);
    }
    return dateArr;
  }

  function finalFilter(response) {
    // date and location filter based on user input
    let start_date = reportInput.start_date;
    let end_date = reportInput.end_date;
    let location = reportInput.location;

    let dateAndPlantFilter = response.filter((data) => {
      let splitDate = data.date.split("T")[0];

      return (
        splitDate >= start_date &&
        splitDate <= end_date &&
        data.plantName == location
      );
    });

    let dataFormatSplitedArray = dateAndPlantFilter.map((x) => {
      return { ...x, date: x.date.split("T")[0] };
    });

    //grouping date and creating final object

    //calling to generate dateArray
    let generatedArray = dates(start_date, end_date);

    let finalResult = [];

    generatedArray.forEach((date) => {
      let groupedFilter = dataFormatSplitedArray
        .filter((data) => {
          return data.date == date ? data : null;
        })
        .reduce(
          (obj, acc) => {
            if (acc.type == "Rock") {
              obj.noOfSetHoles = obj.noOfSetHoles;
              obj.setHoletotalFeet = obj.setHoletotalFeet;
              obj.noOfRockHoles = obj.noOfRockHoles + acc.noOfHoles;
              obj.rockHoletotalFeet = obj.rockHoletotalFeet + acc.totalFeet;
              obj.overAllTotalHoles = obj.noOfSetHoles + obj.noOfRockHoles;
              obj.overAllTotalFeet =
                obj.setHoletotalFeet + obj.rockHoletotalFeet;
            } else {
              obj.noOfSetHoles = obj.noOfSetHoles + acc.noOfHoles;
              obj.setHoletotalFeet = obj.setHoletotalFeet + acc.totalFeet;
              obj.noOfRockHoles = obj.noOfRockHoles;
              obj.rockHoletotalFeet = obj.rockHoletotalFeet;
              obj.overAllTotalHoles = obj.noOfSetHoles + obj.noOfRockHoles;
              obj.overAllTotalFeet =
                obj.setHoletotalFeet + obj.rockHoletotalFeet;
            }
            return obj;
          },
          {
            date: date,
            noOfSetHoles: 0,
            setHoletotalFeet: 0,
            noOfRockHoles: 0,
            rockHoletotalFeet: 0,
            overAllTotalHoles: 0,
            overAllTotalFeet: 0,
          }
        );

      finalResult.push(groupedFilter);
    });

    //setting final output after all operations done
    setFilteredData(finalResult);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.get("http://localhost:8080/inputs");

    finalFilter(response.data);
  }

  function handleChange(e) {
    setReportInput({ ...reportInput, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    fetchPlantName();
  }, []);
  return (
    <div
      className="report-page"
      style={{
        padding: "30px",
        boxShadow: "1px 1px 3px black",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          fontSize: "1.4em",
          fontWeight: "bold",
          marginRight: "700px",
        }}
      >
        Reports
      </div>
      <form
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "30px",
        }}
        className="inputs"
        onSubmit={handleSubmit}
      >
        <select
          style={{
            width: "112px",
            height: "30px",
            appearance: "none",
            borderRadius: "1.5px",
            textAlign: "center",
          }}
          value={reportInput.location}
          name="location"
          onChange={handleChange}
          required
        >
          <option value="" selected disabled>
            Please select
          </option>
          {plantname.map((data, i) => {
            return <option value={data.plant_name}>{data.plant_name}</option>;
          })}
        </select>

        <input
          type="date"
          name="start_date"
          value={reportInput.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={reportInput.end_date}
          onChange={handleChange}
          required
        />
        <button type="submit">Search</button>
      </form>

      <div className="sticky_nav table_header">
        <table
          style={{
            border: "1px solid black",
            width: "90%",
            margin: "0 auto",
            marginTop: "30px",
            borderCollapse: "collapse",
          }}
        >
          <thead style={{ position: "sticky", top: "0px", zIndex: "100" }}>
            <tr style={headerDesign}>
              <td style={headerDesign} rowSpan={3}>
                Date
              </td>
              <td style={headerDesign} colSpan={2}>
                Set Holes
              </td>
              <td style={headerDesign} colSpan={2}>
                Rock Holes
              </td>
              <td style={headerDesign} colSpan={2}>
                Total Holes
              </td>
            </tr>
            <tr style={headerDesign}>
              <td style={headerDesign} colSpan={2}>
                {" "}
                Total
              </td>
              <td style={headerDesign} colSpan={2}>
                Total
              </td>
              <td style={headerDesign} colSpan={2}>
                Total
              </td>
            </tr>
            <tr style={headerDesign}>
              <td style={headerDesign}>No of Holes</td>
              <td style={headerDesign}>Total Feet</td>
              <td style={headerDesign}>No of Holes</td>
              <td style={headerDesign}>Total Feet</td>
              <td style={headerDesign}>No of Holes</td>
              <td style={headerDesign}>Total Feet</td>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, i) => {
              return (
                <tr>
                  <td style={bodyDesign}>{data.date}</td>
                  <td style={bodyDesign}>{data.noOfSetHoles}</td>
                  <td style={bodyDesign}>{data.setHoletotalFeet}</td>
                  <td style={bodyDesign}>{data.noOfRockHoles}</td>
                  <td style={bodyDesign}>{data.rockHoletotalFeet}</td>
                  <td style={bodyDesign}>{data.overAllTotalHoles}</td>
                  <td style={bodyDesign}>{data.overAllTotalFeet}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;
