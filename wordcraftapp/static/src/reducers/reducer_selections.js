
import { MODIFY_MOTION, MODIFY_SEGMENT, MODIFY_PERSONA, MODIFY_FEATURE, MODIFY_NEW_PERSONA,
         MODIFY_NEW_FEATURE, MODIFY_RULE, MODIFY_DELETE_PERSONA, MODIFY_DELETE_FEATURE, MODIFY_NEW_SEGMENT,
         MODIFY_DELETE_SEGMENT,MODIFY_EDIT_PERSONA, SIGN_IN_STATUS, MODIFY_DATASET, MODIFY_LANGUAGE,
         MODIFY_SOLUTION, MODIFY_OFFER, MODIFY_CHANNEL, MODIFY_CAMPAIGN,MODIFY_DESCRIPTION, GET_ALLFILTERS,MODIFY_NEW_CAMPAIGN,
         SELECT_ALL_OFFERS, SELECT_ALL_MOTIONS, SELECT_ALL_CHANNELS, SELECT_ALL_SOLUTIONS, MODIFY_FILENAME,
         MODIFY_REMOVE_FP,MODIFY_EXPORT_FEATURES, MODIFY_EXPORT_PERSONAS, MODIFY_INDEX, MODIFY_DELETE_ROW, MODIFY_VC, NEW_VERSION_NAME, CURRENT_VIEW} from '../constants';

const selections = {personas:[],
                    features:[],
                    newSegment:"",
                    newPersona:"",
                    newFeature: "",
                    rule:"",
                    deleteSegment:"",
                    deletePersona : "",
                    deleteFeature : [],
                    updatePersona : "",
                    signInStatus : "",
                    user : "",
                    language : "EN-US",
                    project : "project1",
                    solutions : [],
                    offers : [],
                    channels : [],
                    motions: [],
                    campaign : [],
                    dataset : "customer",
                    newCampaign : "",
                    allcontent : [],
                    filename : "",
                    removePersona: "",
                    removeFeature: "",
                    exportPersonas : [],
                    exportFeature : [],
                    index:0,
                    table : "",
                    narrativeRowCount:0,
                    vcState:false,
                    versionName:"",
                    currentView:"profileBased",
                    description:""
                    };


export default function(state = selections, action) {
  switch(action.type) {

    case MODIFY_PERSONA:
    state.rule = "";
    if (state.personas.indexOf(action.payload.persona) !== -1){
        state.personas = state.personas.filter(persona => persona !== action.payload.persona);
        return state;
      }
    else{
        state.personas = [...state.personas, action.payload.persona];
        return state;
    }
    case MODIFY_EXPORT_PERSONAS:
      if (state.exportPersonas.indexOf(action.payload.exportPersona) !== -1){
          state.exportPersonas = state.exportPersonas.filter(exportPersona => exportPersona !== action.payload.exportPersona);
          return state;
        }
      else{
          state.exportPersonas = [...state.exportPersonas, action.payload.exportPersona];
          return state;
      }
    case MODIFY_EXPORT_FEATURES:
        state.exportFeature = [action.payload.exportFeature];
        return state;
    case MODIFY_FEATURE:
      state.rule = [];
      if (state.features.indexOf(action.payload.feature) !== -1){
          state.features = state.features.filter(feature => feature !== action.payload.feature);
          return state;
        }
      else{
          state.features = [...state.features, action.payload.feature];
          return state;
      }

    case MODIFY_RULE:
      console.log("rule reducer",action.payload.rule);
      state.rule = action.payload.rule;
      return state;
    case SIGN_IN_STATUS:
      state.signInStatus = action.payload.signInStatus;
      state.user = action.payload.user;
      return state;
    case MODIFY_DATASET:
      state.dataset = action.payload.dataset;
      return state;
    case MODIFY_LANGUAGE:
      state.language = action.payload.language;
      return state;
    case GET_ALLFILTERS:
        state.solutions = action.payload.data.selectedsolutions;
        state.offers = action.payload.data.selectedoffers;
        state.motions = action.payload.data.selectedmotions;
        state.channels = action.payload.data.selectedchannels;
        state.campaign = action.payload.data.selectedcampaign;
        state.personas = action.payload.data.selectedpersonas;
        state.features = action.payload.data.selectedfeatures;
        state.allcontent = action.payload.data;
        return state;
    case SELECT_ALL_OFFERS:
        state.offers = action.payload.offers;
        return state;
    case SELECT_ALL_CHANNELS:
        state.channels = action.payload.channels;
        return state;
    case SELECT_ALL_MOTIONS:
        state.motions = action.payload.motions;
        return state;
    case SELECT_ALL_SOLUTIONS:
        state.solutions = action.payload.solutions;
        return state;
    case MODIFY_SOLUTION:
      if (state.solutions.indexOf(action.payload.solution) !== -1){
          state.solutions = state.solutions.filter(solution => solution !== action.payload.solution);
          return state;
        }
      else{
          state.solutions = [...state.solutions, action.payload.solution];
          return state;
      }
    case MODIFY_OFFER:
      if (state.offers.indexOf(action.payload.offer) !== -1){
          state.offers = state.offers.filter(offer => offer !== action.payload.offer);
          return state;
        }
      else{
          state.offers = [...state.offers, action.payload.offer];
          return state;
      }
    case MODIFY_CHANNEL:
      if (state.channels.indexOf(action.payload.channel) !== -1){
          state.channels = state.channels.filter(channel => channel !== action.payload.channel);
          return state;
        }
      else{
          state.channels = [...state.channels, action.payload.channel];
          return state;
      }
    case MODIFY_MOTION:
      if (state.motions.indexOf(action.payload.motion) !== -1){
          state.motions = state.motions.filter(motion => motion !== action.payload.motion);
          return state;
        }
      else{
          state.motions = [...state.motions, action.payload.motion];
          return state;
      }
    case MODIFY_CAMPAIGN:
          state.exportPersonas = [];
          state.exportFeature = []
          state.campaign = [action.payload.campaign]
          return state;

    case MODIFY_DESCRIPTION:
          state.description = "";
          state.description = action.payload.description
          return state;

    case MODIFY_NEW_CAMPAIGN:
          state.newCampaign = action.payload.newCampaign;
          return state;
    case MODIFY_REMOVE_FP:
          state.removePersona = action.payload.persona;
          state.removeFeature = action.payload.feature;
          return state;
    case MODIFY_FILENAME:
          state.filename = action.payload.filename;
          return state;
    case MODIFY_NEW_FEATURE:
          state.newFeature = action.payload.newFeature;
          return state;
    case MODIFY_DELETE_FEATURE:
          state.deleteFeature = [action.payload.deleteFeature];
          return state;

    case MODIFY_INDEX:
          state.index = action.payload.index;
          return state;

    case MODIFY_VC:
          state.vcState = action.payload.vcState;
          return state;

    case NEW_VERSION_NAME:
          state.versionName = action.payload.versionName;
          return state;

    case CURRENT_VIEW:
          state.currentView = action.payload.currentView;
          return state;

    case MODIFY_DELETE_ROW:
          state.table = action.payload.table;
          return state;
    default:
      return state;
  }
}
