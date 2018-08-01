import { CAMPAIGN_HOME } from '../constants';

export default function(state = "", action) {
    let campaignHome = "false";
    switch (action.type) {
      case CAMPAIGN_HOME:
          console.log("we are in reducer",action);
          campaignHome = action.payload.campaignHome;
          return campaignHome;
      default:
        return state;
      }
}
