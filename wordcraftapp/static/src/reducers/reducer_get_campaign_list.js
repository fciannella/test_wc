import { GET_CAMPAIGN_LIST } from '../constants';

export default function(state = {campaign:[],role:[]}, action) {
    let campaigns = {campaign:[],role:[]};
    switch (action.type) {
      case GET_CAMPAIGN_LIST:
          campaigns =  action.payload.data;
          return campaigns;
      default:
        return state;
      }
}
