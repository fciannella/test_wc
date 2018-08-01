**WordCraft API Guide**
----
  <_This guide contains information to interact with WordCraft programmatically using HTTP Restful API_>

* **URL**

  <_/api/v1/bycampaign?campaignid=[campaignid]_>

* **Method:**
  
  <_The request type_>

  `POST`
  
*  **URL Params**

   <_If URL params exist, specify them in accordance with name mentioned in URL section. Separate into optional and required. Document data constraints._> 

   **Required:**
 
   `campaignid=[integer]`
   
   ** Required Payload:**
   
   `data=[json]`
 

* **Data Params**

  <_If making a post request, the body payload should look like a json with data as the top root along with every data feature as a key value pair._>

    `data=[json]`
    
    ```perl
    {"data": 
        {"cobranding": "CiscoBranded",
         "contract": "95063357", 
         "contract_end_date": "30/09/2017", 
         "country": "UNITED KINGDOM", 
         "email_address": "stefan.kuschmann@kabeldeutschland.de", 
         "email_alias": "", 
         "gcs_sub_offer_type": "SNTC Basic - Renew (EMEAR)", 
         "journey_step": "Renew", 
         "message": "Renew_EXPIRED", 
         "model_contact": "Y", 
         "offer_name": "SNTC", 
         "party_id": "157075275", 
         "preferred_language": "EN-UK", 
         "region": "EMEAR", 
         "sales_level_6": "", 
         "sub_region": "EMEAR"
         }
    }
    ```
* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Conten-Type:** application/json <br />
    **Content:** <br /> 
    ```perl
    {
    "closing_salutation": "Thank you for your continued business.",
    "contractnumber": "95063357",
    "contractnumberlabel": "Contract Number",
    "copy_block_1": "Your product(s) no longer have technical support coverage and you will not be able to receive critical software updates and upgrades. But here’s the good news. You’re still eligible to reactivate your coverage. Contact us today.",
    "copy_block_2": "Need more information?Contact us or your Cisco partner for details, including discounts and multi-year opportunities. Remember to ask about special financing and incentives from Cisco Capital.",
    "email": "stefan.kuschmann@kabeldeutschland.de",
    "expirationdate": "30/09/2017",
    "expirationdatelabel": "Expiration Date",
    "header": "Your Service and Support Coverage ",
    "more_contracts": "You have 95063357 total contracts. Contact us to get the full list of renewals.",
    "pre_header": "",
    "service": "SNTC",
    "service_link": "",
    "servicelabel": "Service type",
    "sub_closing": "If you don’t handle Cisco Services for your organization, please forward this message to the appropriate party. If you have already renewed your contract or have received this notice in error, please disregard this message.",
    "subhead": "Your coverage has now expired.",
    "subject": "Your Cisco Services have expired. Now what?",
    "table_header": "Your contract details:"
    }
    ```
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ error : "Internal Error Message: msg" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Missing Field Contract" }`

* **Sample Call Linux:**

  ```bash
  curl -H "Content-Type: application/json" \
   -X POST https://wordcraft-dev.cloudapps.cisco.com/api/v1/bycampaign?campaignid=1 \ 
   -d '{"data": {"cobranding": "CiscoBranded", "contract": "95063357", "contract_end_date": "30/09/2017", "country": "UNITED KINGDOM", "email_address": "stefan.kuschmann@kabeldeutschland.de", "email_alias": "","gcs_sub_offer_type": "SNTC Basic - Renew (EMEAR)", "journey_step": "Renew", "message": "Renew_EXPIRED", "model_contact": "Y", "offer_name": "SNTC", "party_id": "157075275", "preferred_language": "EN-UK", "r egion": "EMEAR", "sales_level_6": "", "sub_region": "EMEAR","num_contracts":"1"}}'
  ```
* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamp and identifying oneself when leaving comments here._> 