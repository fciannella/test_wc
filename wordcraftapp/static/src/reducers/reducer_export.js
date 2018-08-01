import { EXPORT_NARRATIVE } from '../constants';

export default function(state = {exportMessage:""}, action) {
  switch (action.type) {
    case EXPORT_NARRATIVE:
        return {exportMessage:""};
    default:
        return state;
    }
}
