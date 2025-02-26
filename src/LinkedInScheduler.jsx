import React, { useState,useEffect } from "react";
import axios from "axios";
import './Scheduler.css'


const LinkedInScheduler = ({
    setScheduling,
    setScrapeTypeBtn,
    setMainScrape,
    setIsScraped,
    setIsSearchFilter,
    setIsScrapeData,
    scheduling,
    setIsDashboard,
    filterExport,
    setScheduler,
    scheduler,
    setAfterSchedule,
    setScrapeNow,
     setSearchKeyword,
        setSearchIndustry,
        setSearchExperience,
        setSearchJobType,
        setSearchLocation,
        setFilterExport
}) => {
    const [form, setForm] = useState({
        frequency: "daily",

    });

    const [searchExport,setSearchExport]= useState(false)
    const [nextSchedule,setNextSchedule] = useState(false)
     const [intervalId, setIntervalId] = useState(null);


        // Function to execute based on frequency
    const frequency1 = async () => {
        if (form.frequency === "daily" || form.frequency === "weekly") {
            try {
                const searchData1 = {
                    keyword: searchKeyword,
                    location: searchLocation,
                    industry: searchIndustry,
                    experience: searchExperience,
                    jobType: searchJobType,
                };
                console.log("Sending Search Data:", searchData1);

                const searchBackend1 = await axios.post("http://127.0.0.1:5000/api/schedule", searchData1);
                if (searchBackend1.status === 200) {

                    console.log("Filtered Data Received:", searchBackend1.data);
                    setFilterExport(searchBackend1.data);

                    alert("Data sent and response received successfully!");
                } else {
                    alert("Search filters error!");
                }
            } catch (error) {
                console.error("Error sending search filters:", error.message);
                alert("Failed to send search filters.");
            }
        } else {
            console.log("Invalid Frequency Selection");
        }
    };

   useEffect(() => {
        if (intervalId) clearInterval(intervalId);

        frequency1();

        const intervalTime = form.frequency === "daily" ? 86400000 : 604800000;
        const newIntervalId = setInterval(frequency1, intervalTime);

        setIntervalId(newIntervalId);

        return () => clearInterval(newIntervalId);
    }, [form.frequency]);


    const [form1,setForm1] = useState({
        frequency:"daily",

    })





    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleNextChange = (e)=>{
        setForm1({...form1,[e.target.name]: e.target.value});
    }




const handleNextSchedule = async()=>{
     try {
           const response =  await axios.post("http://127.0.0.1:5000/api/schedule/next", form1);
            setForm1({
                frequency: "daily",

            });
          if(response.status === 200){


            alert("successfully schedule the task")
        }else{
            console.log("schedule error!")
        }
        } catch (error) {
            console.error("Error scheduling task:", error);
            alert("Error scheduling task")
        }
}



    return (
        <>
            {scheduler ? (

                <div className="scheduler-container">

                    <h1 className="scheduler-header">LinkedIn Scraper Scheduler</h1>
                    <form  className="scheduler-form">

                        <label htmlFor="frequency" className="scheduler-form-label">
                            Frequency:
                        </label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={form.frequency}
                            onChange={handleInputChange}
                            required
                            className="scheduler-form-input"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>

                        <button onClick={()=>{
                            setNextSchedule(true)
                            setScheduler(false)
                        }} className="scheduler-button">NextSchedule</button>

                        <button onClick={
                            ()=>{
                        setIsScrapeData(true)
                         setIsSearchFilter(true)
                         setIsDashboard(true)
                         setScrapeTypeBtn(true)
                         setMainScrape(true)
                         setAfterSchedule(false)
                         setScrapeNow(false)
                         setScheduler(false)
                            }} className="scheduler-button">Back</button>

                    </form>


                </div>

            ):null}

            {nextSchedule ? (
                      
              <>
                    <h1 className="scheduler-header">Next Schedule Task</h1>

                        <label htmlFor="frequency" className="scheduler-form-label">
                            Frequency:
                        </label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={form1.frequency}
                            onChange={handleNextChange}
                            required
                            className="scheduler-form-input"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>

                        <button 
                        onClick={handleNextSchedule}
                         className="scheduler-button">Next Schedule Task </button>

                        <button onClick={
                            ()=>{
                                setScheduler(true)
                             setNextSchedule(false)
                            }} className="scheduler-button">Back</button>

                   


                </>
                ):null}


         </>
    );
};

export default LinkedInScheduler;







