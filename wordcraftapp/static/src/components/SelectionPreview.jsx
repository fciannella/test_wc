import React, { Component } from 'react';
import { getMapping, createMapping, modifyRemoveFP, removeMapping,getNarrative,
         modifyNewFeature, addFeature, getAllFilters, disableContentViewComponents,
         modifyExportPersonas, modifyExportFeatures,selectFeature, modifyViewName} from '../actions/index';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from 'react-router-dom';



class selectionPreview extends Component{

  constructor(props){
    super(props);
    this.state = {
      newFeature:"",
      addFeatureError:"modal fade",
      messageAlert:""
    }
  }

  componentDidMount(){
    document.getElementById("profileBasedView").style.display = "block";
    document.getElementById("featureBasedView").style.display = "none";
    document.getElementById("save-preview").setAttribute("disabled","disabled");

  }

  toggleSelections(){
    let viewName = "";
    if(this.props.selections.currentView==="fatureBased"){
      this.props.modifyViewName({currentView:"profileBased"});
    }
    else{
      this.props.modifyViewName({currentView:"fatureBased"});
    }

    document.getElementById("toggleVisibility").style.display ='none';
    this.props.getNarrative({user:this.props.selections.user,campaign:this.props.selections.campaign,
                             exportPersonas:[],language:this.props.selections.language});
    if(document.getElementById("profileBasedView").style.display === "block"){
      document.getElementById("profileBasedView").style.display = "none";
      document.getElementById("featureBasedView").style.display = "block";
      document.getElementById("export-narrative").setAttribute("disabled","disabled");
      document.getElementById("save-preview").removeAttribute("disabled");
      this.props.disableContentViewComponents({editor:"enabled",submit:"enabled"});
    }
    else{
      document.getElementById("profileBasedView").style.display = "block";
      document.getElementById("featureBasedView").style.display = "none";
      this.props.selectFeature({user:this.props.selections.user,campaign:this.props.selections.campaign,
                               exportFeature:[],language:this.props.selections.language});
      this.props.disableContentViewComponents({editor:"disabled",submit:"enabled"});
      document.getElementById("export-narrative").removeAttribute("disabled");
      document.getElementById("save-preview").setAttribute("disabled","disabled");
    }
  }

  saveSelections(){
    this.props.createMapping(this.props.selections, () => {
      this.props.getMapping(this.props.selections);
    });
  }

  removeMappingPersonaFeature(mapping){
    this.props.modifyRemoveFP(mapping);
    this.props.removeMapping(this.props.selections, () => {
      this.props.getMapping(this.props.selections);
    });
  }

  onPersonaSelect(persona){
    this.props.modifyExportPersonas({exportPersona:persona});
  }




  renderFeatureRowValues(features){
    return features.features.map(feature => {
      return(
      <div  className="col-xs-4 col-sm-3  proFeatureRow">
        <span className="proDeleteRow"><i className="fa fa-window-close  proDel" onClick={() => this.removeMappingPersonaFeature({persona:features.persona,feature:feature})}></i> {feature}</span>
      </div>
    );
    });
  }

  renderPersonaFeatureData(){
    let mapPersonaNames = Object.keys(this.props.mapping.personafeature);
    return mapPersonaNames.map((data,index) =>  {
      return(
        <tr>
          <td><input type="checkbox"  onClick={() => this.onPersonaSelect(data)}/> {data}</td>
          <td className="bg1">
            <div className="proHidden"></div>
            {this.renderFeatureRowValues({persona:data,features:this.props.mapping.personafeature[data]})}
          </td>
        </tr>
      );
    });
  }

  removeMappingFeaturePersona(mapping){
    this.props.modifyRemoveFP(mapping);
    this.props.removeMapping(this.props.selections, () => {
      this.props.getMapping(this.props.selections);
    });
  }

  onFeatureSelect(feature){
    this.props.modifyExportFeatures({exportFeature:feature});
  }


  renderPersonaRowValues(personas){
    return personas.personas.map(persona => {
      return(
      <div  className="col-xs-4 col-sm-3  proFeatureRow">
        <span className="proDeleteRow"><i className="fa fa-window-close  proDel" onClick={() => this.removeMappingFeaturePersona({feature:personas.feature,persona:persona})}></i> {persona}</span>
      </div>
    );
    });
  }

  renderFeaturePersonaData(){
    let mapFeatureNames = Object.keys(this.props.mapping.featurepersona);
    return mapFeatureNames.map((data,index) =>  {
      return(
        <tr>
          <td><input type="radio" name="radiofeature" onClick={() => this.onFeatureSelect(data)}/> {data}</td>
          <td className="bg1">
            <div className="proHidden"></div>
            {this.renderPersonaRowValues({feature:data,personas:this.props.mapping.featurepersona[data]})}
          </td>
        </tr>
    );
  });
  }

  closeModal() {
    this.setState({addFeatureError:"modal fade"});
    document.getElementById("addFeatureError").style.display = "none";

  }

  addNewFeature(){
    this.props.modifyNewFeature({newFeature:this.state.newFeature});
    if(this.props.selections.allcontent.features.indexOf(this.state.newFeature.trim()) !== -1){
      this.setState({addFeatureError:"modal fade in",messageAlert:"Entered name already exists. Please enter a new name"});
      document.getElementById("addFeatureError").style.display = "block";
      document.getElementById("addFeatureError").style.paddingTop = "160px";
      this.setState({newFeature:""});
    }else if (this.state.newFeature === "") {
      this.setState({addFeatureError:"modal fade in",messageAlert:"Please enter a valid name"});
      document.getElementById("addFeatureError").style.display = "block";
      document.getElementById("addFeatureError").style.paddingTop = "160px";
      this.setState({newFeature:""});
    }else{
      this.props.addFeature(this.props.selections, () => {
        this.props.getAllFilters(this.props.selections);
        this.setState({newFeature:""});
      });
    }
  }

  render() {
    return (

      <div>

        <div className="row clearAll">
        <div className='col-xs-12 col-sm-6' style={{'padding':'0px'}}>
            <button id="btn-savePF" className="mbtn btnType-save alignLeft" data-target="#infoBox"
                onClick={() => this.saveSelections()}>
                <span className="btnLabel">Save Selections</span>
                <i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i>
            </button>
        </div>
        <div className='col-xs-12 col-sm-6' style={{'padding':'0px'}}>
          <div className="col-xs-8 form-group" style={{'padding-right':'0px', 'width':'70%'}}>
            <input type="text" className="form-control" id="newFeature" placeholder="New feature name" style={{'border': '1px solid #515864','height':'37px'}}
              value = {this.state.newFeature}
              onChange={event => this.setState({newFeature: event.target.value})}/>
          </div>
          <div className="col-xs-4" style={{'width':'30%','padding-right':'0px'}}>
            <button id="btn-savePF" className="mbtn btnType-save alignLeft" style={{'min-width': '100px','width':'100%', 'float':'right'}} data-target="#infoBox"
                onClick={() => this.addNewFeature()}>
                <span className="btnLabel">Add Feature</span>
                <i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i>
            </button>
          </div>
        </div>
      	<div className="col-xs-12 pad0">
      		<div className="col-xs-12 prevew" style={{'padding-top': '5px', 'padding-bottom': '5px'}}>
      			<div className="col-xs-8 col-md-9" style={{'padding-top': '4px','padding-left':'0px'}}>Preview Selections </div>
      			<div className="col-xs-4 col-md-3">
      				<label className="switch-light switch-ios">
      					<input type="checkbox" />
      					<span id="clickedHere" onClick={() => this.toggleSelections()}>
      					  <span>Profile View</span>
      					  <span>Feature View</span>
      					  <a></a>
      					</span>
      				 </label>
      			</div>

      		</div>
      		{/*Profile Based */}
      		<div className="col-xs-12 clearAll" id="profileBasedView">
      			<div className="table-responsive">
      				<table className="table proTable  table-bordered">
      					<thead>
      						<tr>
      							<th className="col-sm-3">Selected Profile</th>
      							<th className="col-sm-9 center">Associated Fetatures</th>
      						</tr>
      					</thead>
      					<tbody id="blockA">
                    {this.renderPersonaFeatureData()}
      					</tbody>
      				</table>
      			</div>
      			{/*Table */}
      		</div>
      		{/*Feature Based View */}
          <div className="col-xs-12 clearAll" id="featureBasedView">
      			<div className="table-responsive">
      				<table className="table proTable  table-bordered">
      					<thead>
      						<tr>
      							<th className="col-sm-3">Selected Fetatures</th>
      							<th className="col-sm-9 center">Associated Profile</th>
      						</tr>
      					</thead>
      					<tbody id="blockB">
                  {this.renderFeaturePersonaData()}
      					</tbody>
      				</table>
      			</div>
      		</div>
		</div>
      </div>
      <div className={this.state.addFeatureError} onClick={() => this.closeModal()} id="addFeatureError" tabindex="-1" role="dialog" data-dismiss="modal">
        <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="proModel modal-header">
          <button type="button" className="close" data-dismiss="modal" onClick={() => this.closeModal()} aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
          <h4 className="modal-title"><i className="fa fa-info-circle" aria-hidden="true"> </i> Information</h4>
          </div>
          <div className="modal-body errModel">
               <p className="errorMsg"><i className="fa fa-info-circle errIcon" aria-hidden="true"></i>{this.state.messageAlert}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
    );
  }
}

function mapStateToProps(state){
  return{
    mapping:state.mapping,
    selections:state.globalSelection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMapping:getMapping,
    createMapping:createMapping,
    modifyRemoveFP:modifyRemoveFP,
    removeMapping:removeMapping,
    modifyNewFeature:modifyNewFeature,
    addFeature:addFeature,
    getAllFilters:getAllFilters,
    disableContentViewComponents:disableContentViewComponents,
    modifyExportPersonas:modifyExportPersonas,
    modifyExportFeatures:modifyExportFeatures,
    selectFeature:selectFeature,
    getNarrative:getNarrative,
    modifyViewName:modifyViewName
  },dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(selectionPreview);
