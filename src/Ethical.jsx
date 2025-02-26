import React, { useState } from 'react';
import axios from 'axios';
import './Ethical.css'; 

function Ethical({ 
  setAgree,
  setMainShow,
  setIsUserLogin 
}) {
  const [scrapingAllowed, setScrapingAllowed] = useState(false);
  const [dataTypes, setDataTypes] = useState({ ScrapeProfiles: false });
  const [region, setRegion] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

 
  const handleSavePreferences = async () => {
    if (!consentGiven) {
        alert('You must agree to the terms and conditions to save preferences.');
        return;
    }
    if (!scrapingAllowed) {
        alert('You must allow data scraping to save preferences.');
        return;
    }
    if (!dataTypes.ScrapeProfiles) {
        alert('You must select a data type to scrape.');
        return;
    }

    console.log('User Preferences:', { scrapingAllowed, dataTypes, region });

    const token = localStorage.getItem("authToken");  

    if (!token) {
        alert("You are not logged in. Please log in first.");
        return;
    }

    try {
        const response = await axios.post(
            'http://127.0.0.1:5000/api/ethical',
            { scrapingAllowed, dataTypes, region },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,  
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 200) {
            setAgree(false);
            setMainShow(true);
            alert('Your preferences have been saved successfully!');
        } else {
            alert('Your preferences were rejected.');
        }
    } catch (error) {
        console.error("Error:", error.response?.data?.message || error.message);
        alert(`An error occurred: ${error.response?.data?.message || error.message}`);
    }
};


  return (
    <div className="ethical-container">
      <h2 className="ethical-heading">Compliance & Ethical Guidelines</h2>
      <p className="ethical-paragraph">
        To comply with LinkedIn's policies and data privacy regulations (e.g., GDPR), please review and set your
        preferences below.
      </p>

      <label className="ethical-label">
        <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} />
        I agree to the terms and conditions and consent to data collection.
      </label>

      <div className="ethical-label">
        <label>
          <input type="checkbox" checked={scrapingAllowed} onChange={(e) => setScrapingAllowed(e.target.checked)} />
          Allow data scraping (e.g., LinkedIn profile scraping!)
        </label>
      </div>

      <div className="ethical-label">
        <h4>Data Types Allowed for Collection:</h4>
        <label>
          <input type="checkbox" checked={dataTypes.ScrapeProfiles} onChange={(e) => setDataTypes((prev) => ({ ...prev, ScrapeProfiles: e.target.checked }))} />
          Public LinkedIn Profiles
        </label>
      </div>

      <div>
        <h4>Region:</h4>
        <select className="ethical-select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Select your region</option>
          <option value="EU">European Union (GDPR)</option>
          <option value="US">United States</option>
          <option value="India">India</option>
          <option value="Other">Other</option>
        </select>
        {region === 'EU' && <p className="ethical-warning">Scraping is restricted in the European Union due to GDPR.</p>}
      </div>

      <button className="ethical-button ethical-save-button" onClick={handleSavePreferences}>
        Save Preferences
      </button>
     
    </div>
  );
}

export default Ethical;
