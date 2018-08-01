import { GET_ALLFILTERS } from '../constants';

export default function(state = [], action) {
  let personas = [];
  switch (action.type) {
    case GET_ALLFILTERS:
        action.payload.data.personas.map(persona => {
          personas = [...personas, {"persona":persona}];
        });
        return personas;
    default:
      return state;
    }
}
