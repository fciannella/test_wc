import React, {Component} from 'react'
import {connect} from 'react-redux'
import {checkuser, ssoStatus, modifySignInStatus, modifyCampaignHomeStatus, modifyVcState,
				deleteState, getVersionData, restoreFeatureVersion} from "../actions/index";
import { bindActionCreators } from "redux";

class SavedVersions extends Component{
	constructor(props){
			super(props)
			this.state = {
				modalClass:'modal fade'
			}
	}

canceled(){
	this.setState({modalClass:'modal fade'});
}
deleteRow(data){
	let currentState = this.state;
	 this.setState({modalClass:'modal fade'});
	 this.props.deleteState(this.state, () => {
	 this.props.getVersionData(this.props.selections);
	 });
}

deleteVcData(data){
 document.getElementById("proDeleteState").style.paddingTop = "160px";
 this.setState({modalClass:'modal fade in'});
 this.setState({campaign:this.props.selections.campaign,stateUser:data.user,language:data.language,time:data.time, feature:this.props.selections.exportFeature});


}

closeVC(event){
	 document.getElementById('savedVersions').classList.remove('activeModel');
	 this.props.modifyVcState({vcState:false});
}

restoreFeatureState(data){
	this.props.restoreFeatureVersion({campaign:this.props.selections.campaign,stateUser:data.user,user:this.props.selections.user,
				language:data.language,time:data.time, previewFeature:this.props.selections.exportFeature, previewPersona:[this.props.mapping.featurepersona[this.props.selections.exportFeature[0]][0]]});
	this.closeVC();
}

renderVCTables(){
	console.log("ALL SEEEEEE", this.props);
	if(this.props.versionControl.length>0){
		return(
			<div className="table-responsive  vcBlock">
				<div className="col-xs-12 ccm">
					<b>feature :</b> {this.props.selections.exportFeature[0]}
					 {/*
					<div className="ntRow pull-right">
						<span className="ntText">1 - 8 of 8 </span>
						<div className="btn-group">
							<a className="btn btn-default">
								<i className="fa fa-angle-left"></i>
							</a>
							<a className="btn btn-default">
								<i className="fa fa-angle-right"></i>
							</a>
						</div>
					</div>
				*/}
				</div>
				<table className="table">
					<tr className="header">
						 <th className="center">#</th>
						 <th><i className="fa fa-commenting"></i> User</th>
						 <th className="center"><i className="fa fa-git-square"></i>  Language</th>
						 <th className="center"><i className="fa fa-user" aria-hidden="true"></i> Date</th>
						 <th className="center"><i className="fa fa-calendar" style={{"font-weight": "bolder"}}></i> Comment</th>
						 <th className="center"><i className="fa fa-cog" aria-hidden="true"></i> Action</th>
					</tr>
					{this.props.status?this.renderVCRows():this.nothing()  }

				</table>
			</div>
		);
	}
	else{
		return(
			<div className="col-xs-12">
				<div> No records found</div>
			</div>
		);
	}
}
renderVCRows(){
	return this.props.versionControl.map((versionRow,index) => {
					return(
					 <tr key={index}>
							 <td className="center">{index+1}</td>
							 <td>{versionRow.user}</td>
							 <td className="center">{versionRow.language}</td>
							 <td className="center">{versionRow.time}</td>
							 <td className="center">{versionRow.comment}</td>
							 <td>
								 <div className="action">
										<div onClick={() => this.restoreFeatureState(versionRow)}><i className="fa fa-reply-all" data-toggle="tooltip" data-placement="top" title="Restore this version"></i> Restore</div>
										<div onClick={()=>this.deleteVcData(versionRow)}><i className="fa fa-trash  proEdit" data-toggle="tooltip" data-placement="top" title="Delete this version"></i> Delete</div>
								 </div>
							 </td>
					 </tr>
         );
		})
}
nothing(){
	return(
		<div className="col-xs-12">
			<div> No records found</div>
		</div>
	);
}

render(){
	return(
    <div id="savedVersions" className="">
      {/*  Model to show the version */}
      <div className="setupContainer">
        <div className="container-fluid padding-top ">
            <div className="row cPaddingBottom">
              <div className="col-xs-12  col-sm-12 col-md-12 winSetup">
                <div className="cisco-panel">
                  <div className="titleBar">
                    <span className="titleText"><i className="fa fa-github"></i> Version Control  </span>
                    <div className="btnClose" onClick={(event)=>this.closeVC(event)}><div className="iconClose"><span>Close <i className="fa fa-times-circle"></i></span></div></div>
                  </div>
                  {this.props.status?this.renderVCTables():this.nothing()  }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  Model to show the version */}


			{/* Model Error - Personas/Feature not selected */}
			<div className={this.state.modalClass} id="proDeleteState" tabindex="-1" role="dialog" style={{'paddTop':'160px'}}>
        <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="proModel modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick ={()=>this.canceled()}><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
          <h4 className="modal-title"><i className="fa fa-trash" aria-hidden="true"> </i> Delete Feature</h4>
          </div>
          <div className="modal-body">
          <form>
            <div className="form-group">
            <label className="control-label" style={{"paddingTop": "32px", "paddingBottom": "20px", "textAlign": "center", "display": "block"}}>Are you sure you want to delete saved version?</label>
            </div>
          </form>
          </div>
          <div className="proModel modal-footer clear">
          <button type="button" className="btn btn-default proBtnCancel" data-dismiss="modal" onClick ={()=>this.canceled()}><i className="fa fa-times proUpdate" aria-hidden="true"></i> Cancel</button>
          <button type="button" className="btn btn-primary proBtnSave" onClick={() => this.deleteRow()}>Delete <i className="fa fa-long-arrow-right proUpdate" aria-hidden="true"></i> </button>
          </div>
        </div>
        </div>
      </div>
		</div>

    )
  	}
}
const mapStateToProps = (state, ownProps = {}) => {
	return {
		signInStatus : state.signInStatus,
	  selections : state.globalSelection,
	  campaignHomeStatus : state.campaignHomeStatus,
		versionControl:state.versionControl,
		features: state.features,
		mapping:state.mapping
  }
}
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({checkuser:checkuser, ssoStatus:ssoStatus, restoreFeatureVersion:restoreFeatureVersion,
                             modifySignInStatus:modifySignInStatus, modifyCampaignHomeStatus:modifyCampaignHomeStatus, modifyVcState:modifyVcState, deleteState:deleteState, getVersionData:getVersionData}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedVersions);
