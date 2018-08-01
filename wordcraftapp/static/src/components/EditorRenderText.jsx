import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addRule, modifyRule, featureNarrative } from "../actions/index";
import _ from 'lodash';

class EditorRenderText extends Component{
  constructor(props){
    super(props);
    this.state = {
        content:''
    };
  }

  componentWillReceiveProps(nextprops){
    console.log("Y----------", nextprops)
    this.setState({content:nextprops.text});

  }

/* functions */
/* Add a new section */

  render() {
     return(<div className="emptyDiv" contentEditable='true'  dangerouslySetInnerHTML={{__html:this.props.text}}></div>)
  }
}




function mapStateToProps(state) {
  return {


  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(EditorRenderText);
