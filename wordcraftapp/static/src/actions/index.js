import axios from "axios";
import { SELECT_MOTION, SELECT_SEGMENT, SELECT_PERSONA, SELECT_FEATURE,MODIFY_EXPORT_FEATURES,
         MODIFY_MOTION, MODIFY_SEGMENT, MODIFY_PERSONA, MODIFY_FEATURE, GET_RULE,MODIFY_EXPORT_PERSONAS,
         MODIFY_NEW_PERSONA, ADD_PERSONA, MODIFY_NEW_FEATURE, ADD_FEATURE, MODIFY_RULE,FEATURE_NARRATIVE,
         GET_NARRATIVE, ADD_RULE, DELETE_PERSONA, MODIFY_DELETE_PERSONA, MODIFY_DELETE_FEATURE,
         DELETE_FEATURE, MODIFY_NEW_SEGMENT,ADD_SEGMENT, DELETE_SEGMENT, MODIFY_DELETE_SEGMENT,APPROVE_PROFILE,
         GET_INITIAL_STATE,GET_SEGMENT,MODIFY_EDIT_PERSONA, UPDATE_PERSONA, GET_PERSONA_RULE,UPDATE_CAMPAIGN,
         SUBMIT_REVIEW,UPDATE_PERSONA_RULE,SIGN_IN, SIGN_UP,EXPORT_NARRATIVE, SIGN_IN_STATUS,GET_CUSTOMER_DATA,
         GET_TABLE_DATA, MODIFY_DATASET, UPDATE_DATASET, GET_DATASET, MODIFY_LANGUAGE, GET_ALLFILTERS,
         MODIFY_SOLUTION, MODIFY_CHANNEL, MODIFY_OFFER, MODIFY_CAMPAIGN,MODIFY_NEW_CAMPAIGN, CREATE_CAMPAIGN,
         MODIFY_FILENAME, SELECT_ALL_OFFERS, SELECT_ALL_MOTIONS, SELECT_ALL_CHANNELS, SELECT_ALL_SOLUTIONS,
         MODIFY_REMOVE_FP , CAMPAIGN_HOME, LOG_OUT, REMOVE_MAPPING, CREATE_PERSONA_FEATURE_MAPPING, DISABLE_CONTENT,
         GET_PERSONA_FEATURE_MAPPING,EXPORTED_NARRATIVE,MODIFY_INDEX, MODIFY_DELETE_ROW,MODIFY_DELETED,SSO_STATUS,
         GET_NOTIFICATION_DATA,SUBMIT_COMMENT,GET_REVIEW_CONTENT, CHECK_USER, GET_CAMPAIGN_LIST, USER_SETTINGS,
         ADD_USER_LIST,ADD_USER,DELETE_USER_PERMISSION, UPDATE_ROLE, MODIFY_VC, GET_VERSION_DATA, NEW_VERSION_NAME,
         RESET_REVIEW_DATA,SAVE_VERSION_DATA, CURRENT_VIEW, DELETE_VERSION_DATA, REVIEW_HOME, MODIFY_DESCRIPTION,
         GET_SEARCH_RESULT, RESET_SEARCH_DATA, UPLOAD_HTML_TEMP, RESET_HTML_TEMP, UPLOAD_DATA, RESET_DATA, UPLOAD_DATA_PROGRESS} from '../constants';

const ROOT_URL = "";

//const ROOT_URL = "http://127.0.0.1:5001";
//const ROOT_URL = "http://127.0.0.1:80";

export function modifyReviewData(){
  return{
    type:RESET_REVIEW_DATA
  }
}
export function modifySearchData(){
  return{
    type:RESET_SEARCH_DATA
  }
}


export function restoreFeatureVersion(selections){
  let request = axios.post(`${ROOT_URL}/revertState`,selections);
  return{
    type:FEATURE_NARRATIVE,
    payload:request
  }
}

export function resetHtmlTemplate(){
  return{
    type:RESET_HTML_TEMP,

  }
}

export function uploadHtmlTemplate(selections, callback){
    let request = axios.post(`${ROOT_URL}/uploadHtmlTemplate`,selections).then((res) => callback(res));

  return{
    type:UPLOAD_HTML_TEMP,
    payload:request
  }
}

export function getNotificationData(selections){
  let request = axios.post(`${ROOT_URL}/getnotification`,selections);
  return{
    type:GET_NOTIFICATION_DATA,
    payload:request
  }
}

export function approveProfile(selections){
  let request = axios.post(`${ROOT_URL}/approveprofile`,selections);
  return{
    type:APPROVE_PROFILE
  }
}

export function submitComment(selections, callback){
  let request = axios.post(`${ROOT_URL}/addcomment`,selections).then(() => callback());
  return{
    type:SUBMIT_COMMENT,
    payload:request
  }
}

export function getReviewContent(selections){
  let request = axios.post(`${ROOT_URL}/getreviewinfo`,selections);
  return{
    type:GET_REVIEW_CONTENT,
    payload:request
  }
}

export function getSearch(selections){
  let request = axios.post(`${ROOT_URL}/filterNarrative`,selections);
  return{
    type:GET_SEARCH_RESULT,
    payload:request
  }
}

export function submitReview(selections, callback){
  let request = axios.post(`${ROOT_URL}/submitreview`,selections).then((res) => callback(res));
  return{
    type:SUBMIT_REVIEW,
    payload:request
  }
}

export function changeUserPermission(selections, callback){
  let request = axios.post(`${ROOT_URL}/adduser`,selections).then(() => callback());
  return{
    type:UPDATE_ROLE
  }
}

export function addNewUserPermission(selections, callback){
  let request = axios.post(`${ROOT_URL}/adduser`,selections).then((res) => callback(res));
  return{
    type:ADD_USER,
    payload:request
  }
}

export function deleteUserPermission(selections, callback){
  let request = axios.delete(`${ROOT_URL}/deleterole`,{data:selections}).then(() => callback());
  return{
    type:DELETE_USER_PERMISSION,
    payload:request
  }
}

export function addUserList(selections){
  let request = axios.post(`${ROOT_URL}/userinfo`,selections);
  return{
    type:ADD_USER_LIST,
    payload:request
  }
}

export function getUserSettings(selections){
  let request = axios.post(`${ROOT_URL}/settinginfo`,selections);
  return{
    type:USER_SETTINGS,
    payload:request
  }
}


export function getCampaignList(selections){
  let request = axios.post(`${ROOT_URL}/campaigninfo`,selections);
  return{
    type:GET_CAMPAIGN_LIST,
    payload:request
  }
}


export function checkuser(user){
  let request = axios.post(`${ROOT_URL}/checkuser`,user);
  return{
    type:CHECK_USER,
    payload:request
  }
}

export function ssoStatus(callback){
  let request = axios.get(`${ROOT_URL}/sso`).then(res => callback(res));
  console.log("SSO STATUS IN ACTION JS", request);
  return{
      type:SSO_STATUS,
      payload:request
  }
}
export function signIn(email,password){
  let request = axios.post(`${ROOT_URL}/checksignin`, {email: email, password: password});
  return{
    type: SIGN_IN,
    payload: request
  }
}

export function modifyRemoveFP(selections){
  return{
    type: MODIFY_REMOVE_FP,
    payload: selections
  }
}

export function removeMapping(selections, callback){
  let request = axios.post(`${ROOT_URL}/removemapping`, selections).then(() => callback());
  return{
    type:REMOVE_MAPPING,
    payload:request
  }
}

export function createMapping(selections, callback){
  let request = axios.post(`${ROOT_URL}/createmapping`, selections).then(() => callback());
  return{
    type:CREATE_PERSONA_FEATURE_MAPPING,
    payload:request
  }
}

export function getMapping(selections){
  let request = axios.post(`${ROOT_URL}/getmapping`, selections);
  return{
    type:GET_PERSONA_FEATURE_MAPPING,
    payload:request
  }
}


export function logout(){
  return{
    type: LOG_OUT
  }
}
export function modifyExportPersonas(data){
  return{
    type:MODIFY_EXPORT_PERSONAS,
    payload:data
  }
}

export function modifyExportFeatures(data){
  return{
    type:MODIFY_EXPORT_FEATURES,
    payload:data
  }
}

export function featureNarrative(selections){
  let request = axios.post(`${ROOT_URL}/featurenarrative`,selections);
  return{
    type:FEATURE_NARRATIVE,
    payload:request
  }
}


export function modifySignInStatus(singInStatus){
  return{
    type: SIGN_IN_STATUS,
    payload: singInStatus
  }
}

export function updataCampaign(selections){
  let request = axios.post(`${ROOT_URL}/updatecampaign`,selections);
  return{
    type:UPDATE_CAMPAIGN,
    payload:selections
  }
}


export function modifyCampaignHomeStatus(campaignHome){
  return{
    type: CAMPAIGN_HOME,
    payload: campaignHome
  }
}

export function modifyReviewHomeStatus(reviewHome){
  return{
    type: REVIEW_HOME,
    payload: reviewHome
  }
}

export function getDataset(selections){
  let request = axios.post(`${ROOT_URL}/getdataset`,selections);
  return{
    type: GET_DATASET,
    payload: request
  }
}

export function updateDataset(selections){
  let request = axios.put(`${ROOT_URL}/updatedataset`,selections);
  return{
    type: UPDATE_DATASET,
    payload: request
  }
}

export function modifyLanguage(language){
  return{
    type : MODIFY_LANGUAGE,
    payload : language
  }
}

export function modifyDataset(dataset){
  return{
    type: MODIFY_DATASET,
    payload:dataset
  }
}

export function signUp(email,password){
  let request = axios.post(`${ROOT_URL}/checksignup`, {email: email, password: password});
  return{
    type: SIGN_UP,
    payload: request
  }
}


export function getInitialState(){
  let request = axios.get(`${ROOT_URL}/allcontent`);
  return{
    type: GET_INITIAL_STATE,
    payload: request
  }
}

export function getSegment(selections){
  let request = axios.post(`${ROOT_URL}/getsegment`,selections);
    return {
      type: GET_SEGMENT,
      payload: request
  };
}


export function disableContentViewComponents(data){
  console.log("HHHHHHHhh")
  return{
    type: DISABLE_CONTENT,
    payload: data
  }
}


export function selectMotion(motion) {
let request = axios.post(`${ROOT_URL}/getpersona`, motion);
  return {
    type: SELECT_MOTION,
    payload: request
  };
}

export function selectSegment() {
  let request = [
    { motion: "Welcome"},
    { motion: "Adopt"},
    { motion: "Expand"},
    { motion: "Renew"}];
  return {
    type: SELECT_SEGMENT,
    payload: request
  };
}

export function selectPersona(persona) {
  let request = axios.post(`${ROOT_URL}/getfeature`, persona);

  return {
    type: SELECT_PERSONA,
    payload: request
  };
}

export function addSegment(newSegment, callback) {
  let request = axios.post(`${ROOT_URL}/addsegment`, newSegment)(() => callback());
  return {
    type: ADD_SEGMENT,
    payload: request
  };
}

export function addPersona(newPersona, callback) {
  let request = axios.post(`${ROOT_URL}/addpersona`, newPersona)(() => callback());
  return {
    type: ADD_PERSONA,
    payload: request
  };
}

export function deleteSegment(deleteSegment, callback) {
  let request = axios.delete(`${ROOT_URL}/deletesegment`,{data: deleteSegment})(() => callback());
  return {
    type: DELETE_SEGMENT,
    payload: request
  };
}

export function deletePersona(deletePersona, callback) {
  let request = axios.delete(`${ROOT_URL}/deletepersona`,{data: deletePersona})(() => callback());
  return {
    type: DELETE_PERSONA,
    payload: request
  };
}

export function updatePersona(updatePersona, callback) {
  let request = axios.put(`${ROOT_URL}/updatepersona`,updatePersona)(() => callback());
  return {
    type: UPDATE_PERSONA,
    payload: request
  };
}

export function updatePersonaRule(updatePersonaRule, callback) {
  let request = axios.post(`${ROOT_URL}/addpersonarule`,updatePersonaRule);
  return {
    type: UPDATE_PERSONA_RULE,
    payload: request
  };
}


export function getPersonaRule(selections){
  let request = axios.post(`${ROOT_URL}/getpersonarule`, selections);
  return {
    type: GET_PERSONA_RULE,
    payload: request
  }
}

export function deleteFeature(deleteFeature, callback) {
  let request = axios.delete(`${ROOT_URL}/deletefeature`,{data: deleteFeature}).then(() => callback());
  return {
    type: DELETE_FEATURE,
    payload: request
  };
}

export function addFeature(newFeature,callback) {
  let request = axios.post(`${ROOT_URL}/addfeature`, newFeature).then(() => callback());
  return {
    type: ADD_FEATURE,
    payload: request
  };
}

export function selectFeature(feature) {
  let request = axios.post(`${ROOT_URL}/getrule`, feature);
  return {
    type : SELECT_FEATURE,
    payload :request
  }
}

export function getNarrative(narrative) {
  let request = axios.post(`${ROOT_URL}/getnarrative`, narrative)
  return {
    type: GET_NARRATIVE,
    payload: request

  }
}

export function modifySegment(selections){
  return{
    type: MODIFY_SEGMENT,
    payload: selections
  }
}

export function modifyPersona(selections){
  return{
    type: MODIFY_PERSONA,
    payload: selections
  }
}

export function modifyEditPersona(selections){
  return{
    type: MODIFY_EDIT_PERSONA,
    payload: selections
  }
}

export function modifyRule(selections) {
  return{
    type: MODIFY_RULE,
    payload: selections
  }
}

export function modifyFeature(selections){
  return{
    type: MODIFY_FEATURE,
    payload: selections
  }
}


export function getRule(selections){
  return {
    type: GET_RULE,
    payload: selections
  };
}


export function addRule(selections, callback){
  let request = axios.post(`${ROOT_URL}/addrule`, selections).then(() => callback());
  return {
    type: ADD_RULE,
    payload: request
  }
}

export function modifyNewSegment(newSegment){
  return{
    type: MODIFY_NEW_SEGMENT,
    payload: newSegment
  }
}

export function modifyNewPersona(newPersona){
  return{
    type: MODIFY_NEW_PERSONA,
    payload: newPersona
  }
}

export function modifyDeleteSegment(deleteSegment){
  return{
    type: MODIFY_DELETE_SEGMENT,
    payload: deleteSegment
  }
}

export function modifyDeletePersona(deletePersona){
  return{
    type: MODIFY_DELETE_PERSONA,
    payload: deletePersona
  }
}

export function modifyDeleteFeature(deleteFeature){
  return{
    type: MODIFY_DELETE_FEATURE,
    payload: deleteFeature
  }
}

export function modifyNewFeature(newFeature){
  return{
    type: MODIFY_NEW_FEATURE,
    payload: newFeature
  }
}

export function modifyTableName(filename){
  return{
    type: MODIFY_FILENAME,
    payload: filename
  }
}


export function exportNarrative(selections){
  let request = axios.post(`${ROOT_URL}/exportallnarrative`,selections);
  return{
    type: EXPORT_NARRATIVE,
    payload: request
  }
}

export function getCustomerData(selections, tableName, start_index, limit){

  let request = axios.post(`${ROOT_URL}/getCustomerData`, {selections,tableName,starting_row: start_index, limit: limit});
  return{
    type: GET_CUSTOMER_DATA,
    payload: request
  }
}
export function gettables(){
  let request = axios.get(`${ROOT_URL}/gettables`);
  return{
    type: GET_TABLE_DATA,
    payload: request
  }
}
export function getAllFilters(selections){
  let request = axios.post(`${ROOT_URL}/allcontent`,selections);
  return {
      type: GET_ALLFILTERS,
      payload: request
  };
}
export function modifySolution(solution){
  return {
    type: MODIFY_SOLUTION,
    payload : solution
  }
}
export function modifyOffer(offer){
  return {
    type: MODIFY_OFFER,
    payload : offer
  }
}

export function modifyChannel(channel){
  return {
    type: MODIFY_CHANNEL,
    payload : channel
  }
}
export function modifyMotion(motion){
  return{
    type: MODIFY_MOTION,
    payload: motion
  }
}
export function modifyCampaign(campaign){
  return{
    type: MODIFY_CAMPAIGN,
    payload: campaign
  }
}
export function modifyCampaignDescription(description){
  return{

    type: MODIFY_DESCRIPTION,
    payload: description
  }
}

export function selectCampaign(selections){
  let request = axios.post(`${ROOT_URL}/selectcampaign`,selections);
  return {
      type: GET_ALLFILTERS,
      payload: request
  };
}
export function modifyNewCampaign(newCampaign){
  return{
    type : MODIFY_NEW_CAMPAIGN,
    payload : newCampaign
  }
}


export function saveSelections(selections){
  let request = axios.post(`${ROOT_URL}/addcampaign`,selections);
  return{
    type: CREATE_CAMPAIGN,
    payload: selections
  };
 }


export function selectAllSolutions(solutions){
  return{
      type:SELECT_ALL_SOLUTIONS,
      payload: solutions
  }

}

export function selectAllMotions(motions){
  return{
      type:SELECT_ALL_MOTIONS,
      payload: motions
  }
}

export function selectAllOffers(offers){
  return{
      type:SELECT_ALL_OFFERS,
      payload: offers
  }
}
export function selectAllChannels(channels){
  return{
      type:SELECT_ALL_CHANNELS,
      payload: channels
  }
}
export function modifyIndex(index){
  return{
    type:MODIFY_INDEX,
    payload:index
  }
}
export function exportedInfo(selections){
  let request = axios.post(`${ROOT_URL}/exportedInfo`,selections);
  return{
      type:EXPORTED_NARRATIVE,
      payload:request
  }
}
export function modifyDeleteRow(table){
  return{
    type:MODIFY_DELETE_ROW,
    payload:table
  }
}
export function deleteInfo(selections, callback) {
  let request = axios.delete(`${ROOT_URL}/deleteInfo`,{data: selections}).then(() => callback());
  return {
    type: MODIFY_DELETED,
    payload: request
  };
}
export function modifyVcState(vcState){
  return{
    type:MODIFY_VC,
    payload:vcState
  }
}


export function getVersionData(selections){
  let request = axios.post(`${ROOT_URL}/getVersionData`,selections);
  return{
    type:GET_VERSION_DATA,
    payload:request
  }
}
export function saveVersion(selections){
  let request = axios.post(`${ROOT_URL}/saveInfo`,selections);
  return{
    type:SAVE_VERSION_DATA,
    payload:request
  }
}

export function modifyVersionName(versionName){
  return{
    type:NEW_VERSION_NAME,
    payload:versionName
  }
}

export function modifyViewName(currentView){
  return{
    type:CURRENT_VIEW,
    payload:currentView
  }
}

export function deleteState(versiondata, callback){
  let request = axios.delete(`${ROOT_URL}/deleteState`,{data:versiondata}).then(() => callback());
  return{
    type:DELETE_VERSION_DATA,
    payload:request
  }
}

export function uploadData(selectedFile, callback){
  //var output = document.getElementById('uploadLiveStat');
  // let request = axios.post(`${ROOT_URL}/uploadData`,selectedFile.file, {
  //     onUploadProgress: progressEvent => {
  //     let progress =   (progressEvent.loaded/progressEvent.total)*100;
  //     console.log(progressEvent.loaded +"/"+ progressEvent.total)
  //      output.innerHTML = progress
  //
  //   }
  // })
  console.log("Selected FIle", selectedFile.file,)
  let request = axios.post(`${ROOT_URL}/uploadData`,selectedFile)


  // console.log("reached to uploaddata index");
    return{
      type:FEATURE_NARRATIVE,
      payload:request
    }
  }
