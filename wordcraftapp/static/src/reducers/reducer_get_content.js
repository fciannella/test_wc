import { SELECT_FEATURE, FEATURE_NARRATIVE } from '../constants';

export default function(state = {rule:""}, action) {
  switch (action.type) {
    case SELECT_FEATURE:
        return {rule:action.payload.data.rule};
    case FEATURE_NARRATIVE:
        return {rule:action.payload.data.rule};
    default:
        return state;
    }
}
