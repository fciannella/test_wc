import { combineReducers } from "redux";
import segmentReducer from "./reducer_segment";
import personas from "./reducer_personas";
import features from "./reducer_telemetry";
import globalSelection from "./reducer_selections";
import rule from "./reducer_get_content";
import getInitialState from "./reducer_get_initial_state";
import narrative from "./reducer_narrative";
import personaRule from "./reducer_persona_rule";
import customerData from "./reducer_customer_data";
import signInStatus from "./reducer_signin_status";
import datasets from "./reducer_dataset";
import language from "./reducer_language";
import channels from "./reducer_channel";
import solutions from "./reducer_solutions";
import offers from "./reducer_offers";
import motions from "./reducer_motions";
import campaigns from "./reducer_campaigns";
import campaignHomeStatus from "./reducer_campaign_home_status";
import exportMessage from "./reducer_export";
import mapping from "./reducer_mapping";
import disableContent from "./reducer_disable_content";
import exportedNarrative  from "./reducer_exported_narrative";
import exportModelRowCount  from "./reducer_export_rowcount";
import exportedTables  from "./reducer_export_tables";
import campaignList from "./reducer_get_campaign_list";
import settinginfo from "./reducer_user_settings";
import addUserNames from "./reducer_add_user_list";
import notifications from "./reducer_notifications";
import versionControl from "./reducer_version_control";
import reviews from "./reducer_reviews";
import reviewHomeStatus from "./reducer_review_home_status";
import { LOG_OUT } from '../constants';
import customerSpecificReview  from "./reducer_reviews_customerSpecific";
import dataColumns from "./reducer_data_columns";
import mathFunctions from "./reducer_math_functions";
import operators from "./reducer_operators";
import uploadData from "./reducer_upload_data";


const appReducer = combineReducers({
  operators:operators,
  segments: segmentReducer,
  personas: personas,
  features :features,
  globalSelection: globalSelection,
  rule: rule,
  getInitialState: getInitialState,
  narrative : narrative,
  personaRule : personaRule,
  signInStatus : signInStatus,
  customerData : customerData,
  datasets : datasets,
  language : language,
  channels:channels,
  solutions:solutions,
  offers:offers,
  motions:motions,
  campaigns:campaigns,
  campaignHomeStatus:campaignHomeStatus,
  exportMessage:exportMessage,
  mapping:mapping,
  disableContent:disableContent,
  exportedNarrative:exportedNarrative,
  exportModelRowCount:exportModelRowCount,
  exportedTables:exportedTables,
  campaignList:campaignList,
  settinginfo:settinginfo,
  addUserNames:addUserNames,
  notifications:notifications,
  versionControl:versionControl,
  reviews:reviews,
  reviewHomeStatus:reviewHomeStatus,
  customerSpecificReview:customerSpecificReview,
  dataColumns:dataColumns,
  mathFunctions:mathFunctions,
  uploadData:uploadData
});

const initialState = appReducer({}, {});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = initialState
  }

  return appReducer(state, action);
}

export default rootReducer;
