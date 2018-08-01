import { GET_PERSONA_FEATURE_MAPPING } from '../constants';

export default function(state = {personafeature:[],featurepersona:[]}, action) {
    let mapping = {personafeature:[],featurepersona:[]};
    switch (action.type) {
      case GET_PERSONA_FEATURE_MAPPING:
          mapping = action.payload.data;
          return mapping;
      default:
        return state;
      }
}
