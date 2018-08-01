import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectMotion, modifyMotion, modifySegment ,selectSegment, selectPersona, modifyPersona,
         getDataset, addRule, getNarrative,  selectFeature } from "../actions/index";
import Modal from 'react-modal';

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


class TabSetPanel extends Component{

  constructor(props){
    super(props);
    this.state = {
      modalIsOpenMotion : false,
      messageModal: 'Please select a Campaign to continue'
    }
  }

  closeModal(){
    this.setState({modalIsOpenMotion:false});
  }

  onMotionSelect(motion) {

    if(this.props.selections.segment === ""){
      this.setState({modalIsOpenMotion:true});
    }else{
    this.props.modifyMotion(motion);
    this.props.selectMotion(this.props.selections);
    this.props.selectPersona(this.props.selections);
    this.props.getDataset(this.props.selections);
    this.props.selectFeature(this.props.selections);
    this.props.addRule(this.props.selections);
    this.props.getNarrative(this.props.selections);
    const tabLineItems = document.getElementsByName("tabLi");

    Array.prototype.map.call( tabLineItems, function(tabli){
        if(tabli.id === `${motion.motion}`){
          tabli.className = "active"
        }else{
          tabli.className = ""
        }
      });
    }
}

  renderList() {
    return this.props.motions.map(motion => {
      return (
        <li
          name="tabLi"
          id={motion.motion}
          key={`${this.props.selections.segment}${motion.motion}`}
          onClick={() => this.onMotionSelect(motion)}
        >
          <a data-toggle="tab">{motion.motion}</a>
        </li>
      );
    });
  }


  render() {

    return (
      <div>
      <ul id = "personaUl" className="nav nav-tabs cisco-tab ">
          {this.renderList()}
      </ul>
      <Modal
        isOpen={this.state.modalIsOpenMotion}
        contentLabel="Information"
        style={customStyles}
      >
        <div style={{'marginBottom':'10px'}}><text>{this.state.messageModal}</text></div>
        <center><button className="btn btn-secondary"
                style={{'marginLeft':'10px'}}
                onClick={() => this.closeModal()}>close</button></center>
      </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    initialState:state.getInitialState,
    motions: state.motions,
    selections: state.globalSelection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectMotion: selectMotion, modifyMotion: modifyMotion,
                              selectSegment: selectSegment, selectPersona: selectPersona,
                              modifySegment: modifySegment, modifyPersona: modifyPersona,
                              getDataset : getDataset, addRule : addRule, getNarrative: getNarrative,
                              selectFeature : selectFeature}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(TabSetPanel);
