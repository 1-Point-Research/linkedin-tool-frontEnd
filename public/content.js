function scrapeProfile() {
  try {
    const profileData = {

    };


    profileData.full_name = document.querySelector("h1")?.innerText.trim() || "N/A";

    profileData.job_title = document.querySelector(".text-body-medium.break-words")?.innerText.trim() || "N/A";

    
  const companyElement = document.querySelector(
    'button[aria-label^="Current company:"] div'
  );
  const educationElement = document.querySelector(
    'button[aria-label^="Education:"] div'
  );

   profileData.company_name = companyElement ? companyElement.innerText.trim() : "";
   profileData. education = educationElement ? educationElement.innerText.trim() : "";

  


   let experienceCompanyName = companyElement?  companyElement.innerText.trim() : "";


    profileData.location = document.querySelector(".text-body-small.inline.t-black--light")?.innerText.trim() || "N/A";

    // 5. Skills
    let skillsElements = document.querySelectorAll("div.hoverable-link-text strong");
    profileData.skills = skillsElements.length > 0 
        ? Array.from(skillsElements).map(skill => skill.innerText.trim()).join(", ") 
        : "Not Found";


     const companyLink = document.querySelector(
      'a[data-field="experience_company_logo"]'
    );
    

         const jobTitleExpElement = document.querySelector(".display-flex.align-items-center.mr1.t-bold span");
     experienceJobTitle = jobTitleExpElement && isNaN(jobTitleExpElement.textContent.trim()) 
        ? jobTitleExpElement.textContent.trim() 
        : "N/A";

    const durationElement = document.querySelector(
      ".pvs-entity__caption-wrapper"
    );
   years = durationElement
      ? durationElement.textContent.trim()
      : "N/A";

    const skills = [];
    document
      .querySelectorAll(
        "a[data-field='position_contextual_skills_see_details'] strong"
      )
      .forEach((skill) => {
        skills.push(skill.textContent.trim());
      });

    experienceSkills = skills.length > 0 ? skills : ["N/A"];

    profileData.experience = {
        company:experienceCompanyName,
      role: experienceJobTitle,
      years,
    };


async function contact (){

    let contactLink = document.querySelector("#top-card-text-details-contact-info");
    
    if (contactLink) {
        contactLink.click();  
        await new Promise(resolve => setTimeout(resolve, 1000)); 


        console.log(profileData.contactInfo); 
    } else {
        console.log("Contact link not found");
    }

} 

contact()


    let contactSections = document.querySelectorAll('.pv-contact-info__contact-type');

    let phoneNumber = "Not Found";
    
    let email = "Not Found";

    contactSections.forEach(section => {
        let header = section.querySelector("h3")?.innerText.trim();
        
        if (header === "Phone") {
            let phoneElement = section.querySelector('span.t-14.t-black.t-normal');
            phoneNumber = phoneElement?.innerText.trim() || "Not Found";
        }

        

        if (header === "Email") {
            let emailElement = section.querySelector('a[href^="mailto:"]');
            email = emailElement?.innerText.trim() || "Not Found";
        }
    });

    profileData.contact_info = {
        phoneNumber,
        email
    };



const skillSections = document.querySelectorAll('[data-field="skill_card_skill_topic"]');

    profileData.endorsements = [];

    
    skillSections.forEach(skill => {
        const skillName = skill.querySelector('span[aria-hidden="true"]')?.innerText.trim();
        

        const endorsementElement = skill.closest('.UteZENMqpVbMXlydRbykUuZSjUpvpOtviCE')
            ?.querySelector('.RikwcmXUEQUndatabICbLemEkbxrNSeHau span[aria-hidden="true"]');

        const endorsementText = endorsementElement ? endorsementElement.innerText.trim() : "No endorsements";

       
      

        if (skillName) {
            profileData.endorsements.push( {endorsement: skillName});
        }
    });

 console.log("Scraped Profile Data:", profileData);
    return profileData;

  } catch (error) {
    console.error("Error scraping LinkedIn profile:", error);
    return { error: "Failed to scrape profile data." };
  }
}


function scrapeCompany() {
  try {
   async function update() {
    
    const aboutTab = document.querySelector("a[href*='about/']");
    if (aboutTab) {
      aboutTab.click();
      console.log("Navigating to About page...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for content to load
    }
}

update()
    // Selectors for company details
    const companyNameElement = document.querySelector(".org-top-card-summary__title");
    const industryElement = document.querySelector(".org-top-card-summary-info-list__info-item");
    const headquartersElement = document.querySelectorAll(".org-top-card-summary-info-list__info-item")[1];
    const totalEmployeesElement = document.querySelector(".org-top-card-summary-info-list__info-item span");
    const recentPostElement = document.querySelector(".feed-shared-update-v2__description");

    // Wait for the About section to load
    const aboutSectionLoaded = document.querySelector(".org-page-details-module__card-spacing");
    const websiteElement = aboutSectionLoaded ? aboutSectionLoaded.querySelector("dl a[href^='https://']") : null;
    const specialtiesElement = aboutSectionLoaded ? aboutSectionLoaded.querySelector("dl dd[dir='ltr']") : null;

    console.log('Website Element:', websiteElement); // Debugging log
    console.log('Specialty Element:', specialtiesElement); // Debugging log

    // Extract company details
    const company_name = companyNameElement ? companyNameElement.innerText.trim() : "N/A";
    const industry = industryElement ? industryElement.innerText.trim() : "N/A";
    const headquarter = headquartersElement ? headquartersElement.innerText.trim() : "Not available";
    const num_employees = totalEmployeesElement ? totalEmployeesElement.innerText.trim() : "Not listed";
    const recent_posts = recentPostElement ? recentPostElement.innerText.trim() : "N/A";
    const website_url = websiteElement ? websiteElement.href : "Not found";
    const specialties = specialtiesElement ? specialtiesElement.textContent.trim() : "Not found";

    return {
      company_name, industry, num_employees, specialties,recent_posts, website_url, headquarter
    };

  } catch (error) {
    console.error("Error scraping LinkedIn company data:", error);
    return { error: `Failed to scrape company details. ${error.message}` };
  }
}


function scrapeJobPost() {
  try {
   
    function getTextFromElement(selector, fallback = 'Not found') {
      const element = document.querySelector(selector);
      return element ? element.innerText.trim() : fallback;
    }

    const job_title = document.querySelector("h1")?.innerText.trim() || "N/A";
  
             let companyElement = document.querySelector('.job-details-jobs-unified-top-card__company-name a');

        let company_name = "Not Found";

       
        if (companyElement) {
            company_name = companyElement.innerText.trim();
        }
             
   
    const location = getTextFromElement('.t-black--light.mt2 span.tvm__text--low-emphasis:nth-child(1)', 'Not found');

    const employmentTypeElements = document.querySelectorAll('.job-details-preferences-and-skills__pill span.ui-label--accent-3');

    const employment_type = [...employmentTypeElements]
  .map(element => element.innerText.trim())
  .filter(text => 
    text.toLowerCase().includes("full-time") || 
    text.toLowerCase().includes("part-time") || 
    text.toLowerCase().includes("internship")
  );

    const posted_date = getTextFromElement('time', 'Not found');

    const job_description = getTextFromElement('.description__text, .jobs-description-content');

    const skills_required = getTextFromElement('.description__text, .jobs-description-content');

    return {
      job_title,
      company_name,
      location,
      job_description,
      skills_required,
      employment_type,
      posted_date

    };

  } catch (error) {
    console.error("Error scraping job post data:", error);
    return { error: `Failed to scrape job post data. ${error.message}` };
  }
}





function scrapeLinkedInPost() {
  try {
    
    const post_content = document.querySelector(".update-components-text .break-words")?.innerText.trim() || "N/A";

    const nameElement1 = document.querySelector('div[role="article"] span[aria-hidden="true"]');
    const authorName1 = nameElement1?.textContent.trim() || "N/A";

      
 
    let nameElement = document.querySelector('span[aria-hidden="true"]');

        let authorURL = "Not Found";

        let authorName ="N/A"

        if (nameElement) {
            author_name = nameElement.innerText.trim();
        }


   let authorLink = document.querySelector('a.update-components-actor__meta-link');
     if (authorLink) {

     author_profile = authorLink.getAttribute('href');
}

    const likes = document.querySelector(".social-details-social-counts__reactions")?.innerText.trim() || "N/A";

    const comments = document.querySelector(".social-details-social-counts__comments")?.innerText.trim() || "N/A";

    const shares = document.querySelector(".social-details-social-counts__shares")?.innerText.trim() || "0";

    const hashtags = Array.from(document.querySelectorAll(".update-components-text .break-words span"))
      .filter((el) => el.innerText.startsWith("#"))
      .map((el) => el.innerText.trim())
      .join(", ") || "N/A";

    return {
      post_content,       
      author_name,       
      author_profile, 
      likes,        
      comments,         
      shares,           
      hashtags,         
    };
  } catch (error) {
    console.error("Error scraping LinkedIn post data:", error);
    return { error: `Failed to scrape post data. ${error.message}` };
  }
}





const postData = scrapeLinkedInPost();
console.log("Scraped Post Data:", postData);

const jobPostData = scrapeJobPost();
console.log("Scraped Job Post Data:", jobPostData);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let data;
  try {
    if (message.action === "scrape") {
      if (message.type === "profile") {
        data = scrapeProfile();
      } else if (message.type === "company") {
        data = scrapeCompany();
      } else if (message.type === "job-post") {
        data = scrapeJobPost();
      } else if (message.type === "post") {
        data = scrapeLinkedInPost();
      }
      sendResponse(data); 
    }
  } catch (error) {
    console.error("Error processing message:", error);
    sendResponse({ error: "Failed to process the request." });
  }
});








