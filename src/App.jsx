import React, { useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./App.css";
import UserAccess from './UserAccess.jsx';
import Ethical from './Ethical.jsx';
import Dashboard from './Dashboard.jsx';
import LinkedInScheduler from './LinkedInScheduler.jsx';

const App = () => {
  const [scrapeType, setScrapeType] = useState(" ");
  const [scrapedData, setScrapedData] = useState([]);
  const [isScraped, setIsScraped] = useState(false);
  const [mainScrape,setMainScrape] = useState(true);
  const [ScrapeDB, setScrapeDB] = useState(null);  
  const [dbExport, setDbExport] = useState(false);
  const [optionShow, setOptionShow] = useState(false);
  const [fetchBackEndData, setFetchBackEndData] = useState([])
  const [option ,setOption ] = useState(false);
  const [scrapeDataBase , setScrapeDataBase] = useState(null)
  const [type,setType] = useState(null) 
  const [searchKeyword, setSearchKeyword] = useState(null) ;
  const [showSearch, setShowSearch] = useState(false);
  const [searchLocation , setSearchLocation] = useState(null); 
  const [searchIndustry , setSearchIndustry] = useState(null); 
  const [searchExperience , setSearchExperience] = useState(null); 
  const [searchJobType , setSearchJobType] = useState(null); 
  const [isScrapeData,setIsScrapeData]=useState(true);
  const [isSearchFilter,setIsSearchFilter]=useState(true)
  const [isUserLogin,setIsUserLogin]=useState(true)
  const [scrapeTypeBtn,setScrapeTypeBtn] =useState(true)
  const [isScheduling,setIsScheduling]=useState(false);
  const [scheduling , setScheduling] = useState(false)
  const [dB,setDB]=useState(false)
  const [searchFilterBtn,setSearchFilterBtn]= useState(false)
  const [mainShow,setMainShow] = useState(false)
  const  [scheduler,setScheduler] = useState(false)
  const [scrapeNow,setScrapeNow]=useState(false)
  const [afterSchedule, setAfterSchedule]=useState(false)
  const [scrapeNowExport,setScrapeNowExport] = useState(false)
  const [nextScrapeSchedule,setNextScrapeSchedule] =useState(false)

    //filter
  const [filterExport,setFilterExport] = useState([])
  const [dashboard,setDashboard] =useState(false)
  const [isDashboard,setIsDashboard]=useState(true)
  //login 
 // const [step, setStep] = useState(1);
  const [credential , setCredential] = useState({username:" ", password: " ",email:" "})
  const [loginShow,setLoginShow] = useState(true);
  const [roleInput,setRoleInput]=useState(null);
  //ethical
  const [agree,setAgree] = useState(false)

 let scrapeCount = 0;
const coolTime = 60000; 
const maxScrapes = 3;

// Proxy Pool
const proxyPool1 = 
[
  { host: "proxy1.com", port: 8080, auth: { username: "user1", password: "pass1" } },
  { host: "proxy2.com", port: 8080, auth: { username: "user2", password: "pass2" } },
  { host: "proxy3.com", port: 8080, auth: { username: "user3", password: "pass3" } }
];

const getRandomProxy1 = () => {
  return proxyPool1[Math.floor(Math.random() * proxyPool1.length)];
};

  setInterval(() => {
  scrapeCount = 0; 
  console.log("Scrape limit reset. You can scrape again.");
}, coolTime);


  const verifyCaptcha1 = async () => 
{

  try {
        const rand = Math.floor(Math.random()*9 +1)

         const rand2 = Math.floor(Math.random()*9 +1)
 
         const add = rand + rand2

    const captchaResponse = prompt(`Please solve the captcha : ${rand} + ${rand2}`); // Example captcha
  
         

     if (parseInt(captchaResponse) !== add) {
      alert("Captcha verification failed. Please try again.");
      return false;
    }


    console.log("Captcha verified successfully.");
    return true;
  } catch (error) {
    console.error("Error verifying captcha:", error);
    alert("Captcha verification failed due to an error.");
    return false;
  }
};



const handleScrape = async () => {
  try {
    setIsScrapeData(false);
    setIsSearchFilter(false);
    setSearchFilterBtn(true);
    setIsDashboard(false);
    setMainScrape(false);

    if (scrapeCount >= maxScrapes) {
      console.warn("Rate limit reached. Please wait for the cooldown period.");
      alert("Rate limit reached! Please wait before scraping again.");
      return;
    }

    const isCaptchaVerified = await verifyCaptcha1();
    if (!isCaptchaVerified) return;

    scrapeCount++;
    console.log(`Scraping attempt ${scrapeCount} in this minute.`);

    const delayMs = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
    console.log(`Delay time of scrape is ${delayMs}ms`);
    await new Promise(resolve => setTimeout(resolve, delayMs));

    const proxy = getRandomProxy1();
    if (proxy) {
      console.log(`Using proxy: ${proxy.host}:${proxy.port}`);
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    const scrapedData = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tab.id, { action: "scrape", type: scrapeType }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error in message passing:", chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    if (!scrapedData || Object.keys(scrapedData).length === 0) {
      alert(`Failed to scrape ${scrapeType} data! No data found.`);
      return;
    }

    console.log("Scraped Data:", scrapedData);
    setScrapedData(scrapedData);
    setIsScraped(true);
    alert(`${scrapeType} data scraped successfully!`);

    await new Promise(resolve => setTimeout(resolve, 500)); 

    const response = await axios.post(
      `http://127.0.0.1:5000/api/scrape/${scrapeType}`,
      scrapedData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 201) {
      alert("Successfully stored the data in the backend.");
      setIsScrapeData(true);
      setIsSearchFilter(true);
      setSearchFilterBtn(true);
      setIsDashboard(true);
      setMainScrape(true);
    } else {
      alert("Error: Data could not be stored.");
    }
  } catch (error) {
    console.error("Error in scraping:", error);
    alert("An error occurred while scraping data.");
  }
};


//
  const exportToExcel = () => {
    if (!scrapedData) {
      alert("No data available for export!");
      return;
    }

    console.log("Data before Excel export:", scrapedData);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`${scrapeType} Data`);

      const isDataArray = Array.isArray(scrapedData);
      const sampleData = isDataArray ? scrapedData[0] : scrapedData;
      const columns = Object.keys(sampleData).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 20,
      }));
      worksheet.columns = columns;

      if (isDataArray) {
        scrapedData.forEach((data) => worksheet.addRow(data));
      } else {
        worksheet.addRow(scrapedData);
      }

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${scrapeType}-data.xlsx`;
        link.click();

        URL.revokeObjectURL(link.href);
      });
    } catch (error) {
      console.error("Error while exporting to Excel:", error);
      alert("An error occurred while exporting to Excel.");
    }
  };

 

const exportToPDF = () => {
    if (!scrapedData) return alert("No data available for export!");

    const doc = new jsPDF();
    let startY = 10;
    const pageHeight = doc.internal.pageSize.height - 10; 

    const wrapText = (text, x, y, maxWidth) => {
        const splitText = doc.splitTextToSize(text, maxWidth);
        if (y + splitText.length * 6 > pageHeight) {
            doc.addPage();
            y = 10; 
        }
        doc.text(splitText, x, y);
        return y + splitText.length * 6; 
    };

    const formatDataForPDF = (key, value) => {
        if (typeof value === 'object' && value !== null) {
            doc.setFontSize(14);
            startY = wrapText(key, 10, startY, 180);
            Object.entries(value).forEach(([subKey, subValue]) => {
                formatDataForPDF(subKey, subValue);
            });
        } else {
            doc.setFontSize(12);
            startY = wrapText(`${key}: ${value}`, 15, startY, 180);
        }
    };

    Object.entries(scrapedData).forEach(([key, value]) => {
        formatDataForPDF(key, value);
        startY += 4;
    });

    doc.save(`${scrapeType}-data.pdf`);
};




  const exportToCSV = () => {
    if (!scrapedData || scrapedData.length === 0) {
      alert("No data available for export!");
      return;
    }

    console.log("Data before CSV export:", scrapedData);

    const dataToExport = Array.isArray(scrapedData) ? scrapedData : [scrapedData];
    const csvData = Papa.unparse(dataToExport);

    console.log("CSV Data:", csvData);

    const blob = new Blob([csvData], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${scrapeType}-data.csv`;
    link.click();
  };


  const handleDb = async (types) => {
  setIsScraped(false);

  if (["profiles", "companies", "job_posts", "posts"].includes(types)) {
    console.log(`${types} is successfully`);
  }

  setScrapeDataBase(types);
  setType(types);

  try {
    const delay1 = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
    console.log(`Delay time backend is ${delay1}ms`);

    await new Promise((resolve) => setTimeout(resolve, delay1));

    console.log("Scraping:", types);

    const response = await axios.get(`http://127.0.0.1:5000/api/export?data_type=${types}`);

    if (response.status === 200 && response.data) {
      console.log("Received Data:", response.data);

      setFetchBackEndData(Array.isArray(response.data) ? response.data : [response.data]);
    
      alert(`${types} Scrape Data is done!`);
      setOption(true);
    } else {
      alert(`${types} Data still has problems!`);
    }
  } catch (err) {
    setDB(true);
    console.error(`${types} is unable to fetch data. Reason:`, err);
    alert(`Error fetching data for ${types}.`);
  }
};


const handleOption = () => {
    setOptionShow(true);
    setScrapedData();
    setIsScraped(false)
    setIsScrapeData(false);  
  };


const handleRadioChange =(type)=>{
    setScrapeType(type);
    setScrapeDataBase(type);
    
  }

const handleBack =()=>{
        setOption(false)
        setDbExport(false)
         setMainScrape(true)
         setIsSearchFilter(true)
          setScrapeTypeBtn(true)
          setIsScrapeData(true)
          setIsDashboard(true)
          setOptionShow(false)
  }

const handleSearch= ()=>{
   setShowSearch(true);
   setIsSearchFilter(false);
   setMainScrape(false);
   setIsScrapeData(false);
   setScrapeTypeBtn(false);
   setSearchFilterBtn(true)
   setIsDashboard(false)

  }


const dataBaseExportToExcel = async () => {
  if (!fetchBackEndData || fetchBackEndData.length === 0) {
    alert("No data available for export!");
    return;
  }

  console.log("Data before Excel export:", fetchBackEndData);

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Exported Data");

    const sampleData = fetchBackEndData[0];
    const columns = Object.keys(sampleData).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 30, 
    }));

    worksheet.columns = columns;

    fetchBackEndData.forEach((data) => {
      const row = {};
      Object.keys(data).forEach((key) => {
        let value = data[key];

        if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
          try {
            const parsedValue = JSON.parse(value);
            value = Array.isArray(parsedValue)
              ? parsedValue.map((item) => JSON.stringify(item)).join("\n") 
              : JSON.stringify(parsedValue);
          } catch (error) {
            console.warn(`Failed to parse JSON for key "${key}":`, value);
          }
        }
        row[key] = value;
      });
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${type}-data-base.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Excel file exported successfully!");
  } catch (error) {
    console.error("Error while exporting to Excel:", error);
    alert("An error occurred while exporting to Excel.");
  }
};



const dataBaseExportToPDF = () => {
  if (!fetchBackEndData || fetchBackEndData.length === 0) {
    alert("No data available for export!");
    return;
  }

  const doc = new jsPDF();
  const tableColumn = Object.keys(fetchBackEndData[0]);

  const tableRows = fetchBackEndData.map((data) => {
    return tableColumn.map((col) => {
      let value = data[col];

      if (typeof value === "object" && value !== null) {
        return JSON.stringify(value, null, 2);
      }
      return value;
    });
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 10,
  });

  doc.save(`exported-data.pdf`);
};



const dataBaseExportToCSV = () => {
  if (!fetchBackEndData || fetchBackEndData.length === 0) {
    alert("No data available for export!");
    return;
  }

  console.log("Data before CSV export:", fetchBackEndData);

  let dataToExport = Array.isArray(fetchBackEndData) ? fetchBackEndData : [fetchBackEndData];

  const processedData = dataToExport.map((data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
       
        if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value);
        }
        return [key, value];
      })
    );
  });

  const csvData = Papa.unparse(processedData);

  console.log("CSV Data:", csvData);

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `exported-data.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

 let count =0;
   const maxCount = 3;
   const cooling = 60000

   setInterval(()=>{
   count=0;
   console.log("searchFilter limit reset. You can scrape again.");
   setSearchFilterBtn(true);

   },cooling)


const sendSearchFilter = async ()=>{
    
   count +=1;
   console.log(count);

   if(count>=maxCount){
       alert("your maximum limit is over")
       setSearchFilterBtn(false)
       return
   }
   try{
    const searchData = {
      keyword: searchKeyword,
      location: searchLocation,
      industry: searchIndustry,
      experience : searchExperience,
      jobType: searchJobType,
    }
    console.log(searchData);
    const searchBackend = await axios.post("http://127.0.0.1:5000/api/filters",searchData) 
    if(searchBackend.status === 201){
    console.log("Filtered Data Received:");
    //setSearchExport(true);
      setIsSearchFilter(false)
  setShowSearch(false)
  setAfterSchedule(true)
  setScrapeNow(true)

    alert("Data sent and response received successfully!");
  }else{
    alert("search filters is error!")
  }
    }
   catch(error){
    console.error("Error sending search filters:", error.message);
    alert("Failed to send search filters.");

   }
}



const ScrapeNow = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/get_filtered_data");

    if (response.status === 200) {
      console.log("Filtered Data Received:", response.data); 

      setFilterExport(response.data); 
      setScrapeNowExport(true);
      setAfterSchedule(false);
      setIsSearchFilter(false);

      alert("Data sent and response received successfully!");
    } else {
      alert("Search filters error! Unexpected response status.");
    }
  } catch (error) {
    console.error("Error fetching filtered data:", error);

    if (error.response) {
      console.error("Response Data:", error.response.data);
      alert(`Failed to fetch data: ${error.response.data.message || "Unknown error"}`);
    } else {
      alert("Failed to fetch search filters. Please check the backend connection.");
    }
  }
};


const exportSearchResultsToExcel = async () => {
  if (!filterExport || filterExport.length === 0) {
    alert("No data available for export!");
    return;
  }

  console.log("Data before Excel export:", filterExport);

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Search Filter Results");

    const sampleData = Array.isArray(filterExport) ? filterExport[0] : filterExport;
    const columns = Object.keys(sampleData).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1), 
      key: key,
      width: 30,
    }));
    worksheet.columns = columns;

    const processData = (data) => {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return [key, JSON.stringify(value)]; 
          }
          return [key, value];
        })
      );
    };

    if (Array.isArray(filterExport)) {
      filterExport.forEach((data) => worksheet.addRow(processData(data)));
    } else {
      worksheet.addRow(processData(filterExport));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "search-filter-results.xlsx";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error while exporting to Excel:", error);
    alert("An error occurred while exporting to Excel.");
  }
};


const exportSearchResultsToCSV = () => {
  if (!filterExport || filterExport.length === 0) {
    alert("No data available for export!");
    return;
  }

  console.log("Data before CSV export:", filterExport);

  const processedData = filterExport.map((item) => {
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return [key, JSON.stringify(value)]; 
        }
        return [key, value];
      })
    );
  });


  const csvData = Papa.unparse(processedData);

  console.log("CSV Data:", csvData);


  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "search-filter-results.csv";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
};


const exportSearchResultsToPDF = () => {
  if (!filterExport || filterExport.length === 0) {
    alert("No data available for export!");
    return;
  }

  const doc = new jsPDF();

  if (Array.isArray(filterExport) && filterExport.length > 0) {
    
    const tableColumn = Object.keys(filterExport[0]);

    const tableRows = filterExport.map((data) =>
      tableColumn.map((key) => {
        let value = data[key];

        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }
        return value;
      })
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });
  } else if (typeof filterExport === "object" && filterExport !== null) {
 
    const tableColumn = Object.keys(filterExport);
    const tableRows = [
      tableColumn.map((key) => {
        let value = filterExport[key];
        return typeof value === "object" && value !== null ? JSON.stringify(value) : value;
      }),
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });
  }

  doc.save("search-filter-results.pdf");
};


// login credentials 
  const handleLogin = ()=>{
    setIsUserLogin(false)
    setLoginShow(true);
    setScrapeTypeBtn(false);
    setShowSearch(false);
   setMainScrape(false)
   setIsScrapeData(false)
   setScrapeTypeBtn(false)
   setIsSearchFilter(false)
   setIsDashboard(false)
 }

return (
  <>
{loginShow ? (
            <UserAccess 
               setAgree={setAgree}              
               credential = {credential}
               setCredential = {setCredential}
               loginShow={loginShow}
               setLoginShow={setLoginShow}
               roleInput={roleInput}
               setRoleInput={setRoleInput}
                setIsScraped={setIsScraped}
               setIsUserLogin={setIsUserLogin}
              setScrapeTypeBtn={ setScrapeTypeBtn}
              setShowSearch={setShowSearch}
             setMainScrape={setMainScrape}
             setIsScrapeData={setIsScrapeData}
             setIsSearchFilter={setIsSearchFilter}
             setDashboard={setDashboard}
             setIsDashboard={setIsDashboard}

                         

           />

        ):null}

   {agree ? (
       <Ethical 
       agree={agree}
       setAgree={setAgree}
       setMainShow={setMainShow}
       setIsUserLogin={setIsUserLogin}/>

    ): mainShow ?(
  <div className="app-container">
    
      
      <h1>LinkedIn Scraper</h1>

      <div className="scrape-type-toggle">
      {mainScrape ? (
      <>
        <label>
          <input
            type="radio"
            value="profile"
            checked={scrapeType === "profile"}
            onChange={() => 
             handleRadioChange("profile") 
            
          }
         />
          Profile
        </label>
      
        <label>
          <input
            type="radio"
            value="company"
            checked={scrapeType === "company"}
            onChange={() => handleRadioChange("company")}
            
          />
          Company
        </label>

        <label>
          <input
            type="radio"
            value="job"
            checked={scrapeType === "job"}
            onChange={() => handleRadioChange("job")}
            
         
          />
          Job Post
        </label>

        <label>
          <input
            type="radio"
            value="post"
            checked={scrapeType === "post"}
            onChange={() =>  handleRadioChange("post")}   
        />
          Post
        </label>

      </>
        ):null}

        {isScrapeData ? (
        <label onClick={()=> 
        {setDbExport(true),
         setMainScrape(false),
         setIsUserLogin(false)
         setIsSearchFilter(false),
         setIsScraped(false)
         setScrapeTypeBtn(false)
         setIsDashboard(false) }}>ScrapeData</label>
        ):null}
        {dbExport && (
  <>
    <button onClick={handleOption}>DB Export</button>
    {optionShow && (
      <>
        <button
          onClick={() => {
          
            //setOption(true);
            handleDb("profiles")
          }}
          
        >
          Profile
        </button>
      

        <button
          onClick={() => {
            handleDb("companies")
          }}
         
        >
          Company
        </button>

         

        <button
          onClick={() => 
            {handleDb("job_posts")
           }}
          
        >
          Job-post
        </button>

          
        <button
          onClick={() => {
            handleDb("posts")

          }}
          
        >
          Post
        </button>


        {dB ? (
             <button onClick={()=> {
              setIsScrapeData(true)
              setMainScrape(true)
              setDbExport(false)
              setIsSearchFilter(true)
              setIsDashboard(true)
              setScrapeTypeBtn(true)
              setOption(false)
             }}>Back to Main</button>
          ):null}

        {option && (
          <>
            <button onClick={dataBaseExportToCSV}>{`Export to ${type} CSV`}</button>
            <button onClick={dataBaseExportToPDF}>{`Export to ${type} PDF`}</button>
            <button onClick={dataBaseExportToExcel}>{`Export to ${type} Excel`}</button>
            <button onClick={handleBack}>Back</button>
          </>
        )}
      </>
    )}
  </>   
 
)}
       {isSearchFilter ? (
        <label onClick={handleSearch}>Search Filter </label>
        ):null}
        {showSearch ? (
         <>
        <input type='text' 
        placeholder='Enter the Keyword' 
        value={searchKeyword}
        onChange={(e)=> setSearchKeyword(e.target.value)}/>

        <input type='text' 
        placeholder='Location'
        value={searchLocation}
        onChange={(e)=> setSearchLocation(e.target.value)}/>
      
        

        <input type='text' 
        placeholder='Industry'
        value={searchIndustry}
        onChange={(e)=> setSearchIndustry(e.target.value)}/>

        <input type='text' 
        placeholder='Experience Level'
        value={searchExperience}
        onChange={(e)=> setSearchExperience(e.target.value)}/>

        <input type='text' 
        placeholder='Job-Type'
        value={searchJobType}
        onChange={(e)=> setSearchJobType(e.target.value)}/>
         
           {searchFilterBtn ? (
       <button onClick={sendSearchFilter}>Search</button>
       ):null}
     
       <button onClick={()=> 
       {
   setShowSearch(false)
   setIsSearchFilter(true)
   setMainScrape(true)
   setIsScrapeData(true)
   setScrapeTypeBtn(true)
   setIsDashboard(true)
   setSearchExport(false)
   setScheduling(false)
   setScrapeNow(false)
   setAfterScrape(false)
     }}>Back</button>
             
        </>
             
         ):null}




     {scrapeNow ? (
      <>
        <button onClick={ScrapeNow}>scrapeNow</button>
        </>
      ):null}

     {scrapeNowExport ? (
                     <>
                         <button onClick={exportSearchResultsToCSV}>CSV</button>
                         <button onClick={exportSearchResultsToPDF}>PDF</button>
                         <button onClick={exportSearchResultsToExcel}>Excel</button>

                         <button onClick={()=>{
                          setAfterSchedule(true)
                           setScrapeNowExport(false)



                         }}>
                          Back to Search</button>
                      </>   
      
      ):null}

     {afterSchedule ? (
      <>
         <button onClick={()=> 
         {setScheduling(true)
           setScheduler(true)
           setAfterSchedule(false)
           setScrapeNow(false)}}>After Schedule Scrape</button>

           <button onClick={()=>{
            setAfterSchedule(false)
            setScrapeNow(false)
            setIsSearchFilter(true)
            setMainScrape(true)
            setIsDashboard(true)
            setScrapeTypeBtn(true)
            setIsScrapeData(true)

           }}>Back</button>
           </>
       ):null}       

        {scheduling ? (
        <LinkedInScheduler 
        isScheduling ={isScheduling}
        setIsScheduling={setIsScheduling}
        setDashboard={setDashboard}
        setScrapeTypeBtn={setScrapeTypeBtn}
        setMainScrape={setMainScrape}
        setIsScraped={setIsScraped}
        setIsSearchFilter={setIsSearchFilter}
        setIsScrapeData={setIsScrapeData}
        setIsDashboard={setIsDashboard}
        setScheduling={setScheduling}
        scheduling={scheduling}
        filterExport={filterExport}
        setScheduler={setScheduler}
        scheduler={scheduler}
        setAfterSchedule={setAfterSchedule}
        setScrapeNow={setScrapeNow}
        setSearchKeyword={setSearchKeyword}
        setSearchIndustry={setSearchIndustry}
        setSearchExperience={setSearchExperience}
        setSearchJobType={setSearchJobType}
        setSearchLocation={setSearchLocation}


        />
        ):null}


       {isDashboard ? (
       <button onClick={()=> 
       {setDashboard(true)
       setIsDashboard(false)
        setIsSearchFilter(false)
         setIsScraped(false)
          setScrapeTypeBtn(false)
         setMainScrape(false)
         setIsScrapeData(false)
        }}>Dashboard</button>
       ):null}


       {dashboard ? (
        <Dashboard 
        setDashboard = {setDashboard}
        dashboard={dashboard}
        setIsDashboard={setIsDashboard}
        setIsSearchFilter={setIsSearchFilter}
          setScrapeTypeBtn={setScrapeTypeBtn}
          setAgree={setAgree}
          setMainScrape={setMainScrape}
          setIsScrapeData={setIsScrapeData}
          />
       ):null}
         
      </div>
        {scrapeTypeBtn ? (
        
      <button onClick={handleScrape} className="scrape-button">
        Scrape {scrapeType.charAt(0).toUpperCase() + scrapeType.slice(1)}
      </button>
      

      ):null}

      {isScraped && 
      (
      
        <div className="export-section-front">
          <h3>Scraped Data:</h3>
          <div className="scraped-data-container">
          <p>{JSON.stringify(scrapedData, null, 2)}</p>
           </div>
          <div className="export-buttons">
            <button onClick={exportToPDF}>Export to PDF</button>
            <button onClick={exportToCSV}>Export to CSV</button>
            <button onClick={exportToExcel}>Export to Excel</button>
          </div>

          

          <button onClick={()=> 
          {setIsScrapeData(true)
           setMainScrape(true)
          setIsSearchFilter(true)
           setIsScraped(false)
           setScrapedData()
           setScrapeTypeBtn(true)
           setIsDashboard(true)}}>Back to Main</button>
        </div>

      )}
    </div>
    ): null}
    </>
  )
}

export default App; 



