import { SELECT_SEGMENT } from '../constants';

export default function(state = [], action) {
    switch (action.type) {
      case SELECT_SEGMENT:
          return action.payload;
      default:
        return state;
      }
}
