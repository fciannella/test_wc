
import { GET_ALLFILTERS } from '../constants';

export default function(state = [], action) {
    let campaigns = [];
    switch (action.type) {
      case GET_ALLFILTERS:
          action.payload.data.selectedcampaign.map(campaign => {
              campaigns = [...campaigns, {"campaign":campaign}];
          });
          return campaigns;
      default:
        return state;
      }
}
