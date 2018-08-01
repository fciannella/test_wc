import { GET_PERSONA_RULE } from '../constants';

export default function(state = '', action) {
  let personaRule = '';
  switch (action.type) {
    case GET_PERSONA_RULE:
        personaRule = action.payload.data.personaRule;
        return personaRule;
    default:
      return state;
    }
}
