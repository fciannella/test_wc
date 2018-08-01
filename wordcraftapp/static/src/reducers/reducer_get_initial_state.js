
import { GET_INITIAL_STATE } from '../constants';

export default function(state = [], action) {
  switch (action.type) {
    case GET_INITIAL_STATE:
        return action.payload;
    default:
      return state;
    }
}
