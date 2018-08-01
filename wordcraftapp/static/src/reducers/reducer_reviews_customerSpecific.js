import { GET_SEARCH_RESULT, RESET_SEARCH_DATA} from '../constants';

export default function(state = {customerSpecific:[]}, action) {
    let customerSpecific = {customerSpecific:[]};
    switch (action.type) {

      case GET_SEARCH_RESULT:
            customerSpecific = action.payload.data;
            console.log("MAAAAAA", customerSpecific)
            return   customerSpecific;
      case RESET_SEARCH_DATA:
            customerSpecific={customerSpecific:[]};
            return   customerSpecific;
      default:
        return state;
      }
}
