import { GET_NARRATIVE, FEATURE_NARRATIVE } from '../constants';

export default function(state = {narrative:"",header:[],values:[], html:"",jsonRule:[{id:'idSection0',title:'Please enter something',text:''}]}, action) {

  switch (action.type) {
    case GET_NARRATIVE:

        return {narrative:action.payload.data.narrative,header:action.payload.data.header,values:action.payload.data.values,html:action.payload.data.html,
                rule:action.payload.data.rule,
                unknownTagsHtml:action.payload.data.unknown_tags_in_html,
                UnusedTagsNarr:action.payload.data.unused_tags_in_data,
                jsonRule:[{id:'idSection0',title:'Please enter something',text:''}]}
    case FEATURE_NARRATIVE:
          return {narrative:action.payload.data.narrative,header:action.payload.data.header,values:action.payload.data.values,html:action.payload.data.html,
                  rule:action.payload.data.rule,jsonRule:action.payload.data.jsonRule};
    default:
        return state;
    }
  return state;
}
