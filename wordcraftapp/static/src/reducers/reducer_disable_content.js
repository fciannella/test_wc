import { DISABLE_CONTENT } from '../constants';

export default function(state = {editor:"disabled",submit:"enabled", visualEditor:"hidden", codeEditor:"disabled", editorBlock:"hidden"}, action) {
  switch (action.type) {
    case DISABLE_CONTENT:
        return action.payload;
    default:
        return state;
    }
}
