import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
    addPersona, addRule, deletePersona, getNarrative, getPersonaRule, modifyDeletePersona, modifyEditPersona,
    modifyFeature, modifyNewPersona, modifyPersona, selectFeature, selectMotion, selectPersona, updatePersona,
    updatePersonaRule
} from "../actions/index";
import '../style.css';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderColor           : '#6e93fb'
  }
};

class PersonasRadioCheck extends Component{

  constructor(props){
    super(props);
    this.state = {
    };
  }

  onPersonaSelect(persona){
    this.props.modifyPersona(persona);
    console.log("persona",this.props.selections);
  }

  renderList() {
    return this.props.personas.map(persona => {
        return (
            <div key={`${this.props.selections.segment}${persona.persona}${Math.random()}`}
                 className="checkbox cisco-checkbox ">
              <label><input type="checkbox" name="checkPersona" onClick={() => this.onPersonaSelect(persona)}/>{persona.persona}</label>
          </div>
          );

    });
  }


  render() {
    return (
    <div>
      <div className="panel panel-primary ">
          <div className="panel-heading">
              <h3 className="panel-title">Profiles</h3>
          </div>
          <div className="scroll-bar-panel">
              <div className="panel-body nopadding-t-b">
                {this.renderList()}
              </div>
          </div>
      </div>
    </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    personas: state.personas,
    selections: state.globalSelection,
    personaRule : state.personaRule
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectPersona: selectPersona, modifyPersona: modifyPersona,
                              modifyNewPersona: modifyNewPersona, selectMotion: selectMotion,
                              addPersona: addPersona, modifyFeature: modifyFeature, deletePersona: deletePersona,
                              modifyDeletePersona : modifyDeletePersona, modifyEditPersona: modifyEditPersona,
                              updatePersona : updatePersona, getPersonaRule : getPersonaRule, updatePersonaRule: updatePersonaRule,
                              addRule : addRule, getNarrative: getNarrative,
                              selectFeature : selectFeature},
                              dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(PersonasRadioCheck);
