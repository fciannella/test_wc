import { EXPORTED_NARRATIVE } from '../constants';

export default function(state = [], action) {
    switch (action.type) {
      case EXPORTED_NARRATIVE:
           return action.payload.data.tables;
      default:
        return state;
    }
}
