import React, { Component } from 'react';
import Header from './header';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getAllFilters, modifySolution, modifyMotion, modifyChannel, modifyOffer, modifyCampaign,getNarrative,
         modifyDataset, selectCampaign, modifyNewCampaign, saveSelections,getMapping,updataCampaign,
         selectAllSolutions, selectAllMotions, selectAllOffers, selectAllChannels, modifyCampaignHomeStatus,selectFeature} from "../actions/index";

class CampaignHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newCampaign : "",
      message : "",
      infoBoxModal : "modal fade",
      messageModal : 'Please select the campaign before continuing'
    }
  }

  componentWillReceiveProps(nextprops){
    if(nextprops.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }
    if(nextprops.campaignHomeStatus === "goToCampaignList"){
      this.props.history.push("/campaignlist");
    }
    if(nextprops.campaignHomeStatus === "goToNotificationsPage"){
      this.props.history.push("/notifications");
    }
    if(nextprops.selections.solutions.length > 0){
      this.setState({disabledOffers:"hidden",disabledSolutions:"col-xs-12"});
    }else{
      this.setState({disabledOffers:"col-xs-12"});
    }
    if(nextprops.selections.offers.length > 0){
      this.setState({disabledOffers:"col-xs-12",disabledSolutions:"hidden"});
    }else{
      this.setState({disabledSolutions:"col-xs-12"});
    }
  }

  componentWillMount() {
    this.props.modifyCampaignHomeStatus({campaignHome:"inCampaignHome"});
    if(this.props.signInStatus !== "loggedin"){
       this.props.history.push('/signin');
    }
  }

  handleClick(e) {
    let dataAttribute = e.target.getAttribute('data-targetinput');
    let id = e.target.getAttribute("id");
    let source = document.getElementById(id);
	  let checkboxes = document.getElementsByName(dataAttribute);
   	for(let i=0, n=checkboxes.length;i<n;i++) {
   		checkboxes[i].checked = source.checked;
   }
   if(id === "selAllSolutions"){
      if(source.checked === true){
        this.props.selectAllSolutions({solutions:this.props.selections.allcontent.solutions});
      }else{
        this.props.selectAllSolutions({solutions:[]});
      }
    }
   if(id === "selAllMotions"){
     if(source.checked === true){
        this.props.selectAllMotions({motions:this.props.selections.allcontent.motions});
     }else{
       this.props.selectAllMotions({motions:[]});
     }
   }
   if(id === "selAllOffers"){
      if(source.checked === true){
        this.props.selectAllOffers({offers:this.props.selections.allcontent.offers});
      }else{
        this.props.selectAllOffers({offers:[]});
      }
    }
   if(id === "selAllChannels"){
      if(source.checked === true){
        this.props.selectAllChannels({channels:this.props.selections.allcontent.channels});
      }else{
        this.props.selectAllChannels({channels:[]});
      }
    }
    this.checkDisability();
  }

checkDisability(){
  if(this.props.selections.solutions.length > 0){
    this.setState({disabledOffers:"col-xs-12 hidden",disabledSolutions:"col-xs-12"});
  }else{
    this.setState({disabledOffers:"col-xs-12"});
  }
  if(this.props.selections.offers.length > 0){
    this.setState({disabledOffers:"col-xs-12 ",disabledSolutions:"col-xs-12 hidden"});
  }else{
    this.setState({disabledSolutions:"col-xs-12"});
  }
}


modifySolution(solution){
  this.props.modifySolution(solution);
  this.checkDisability();
}

modifyOffer(offer){
  this.props.modifyOffer(offer);
  this.checkDisability();
}

modifyChannel(channel){
  this.props.modifyChannel(channel);
  this.checkDisability();
}

modifyMotion(motion){
  this.props.modifyMotion(motion);
  this.checkDisability();
}

modifyCampaign(campaign){
  this.props.modifyCampaign(campaign);
  this.props.selectCampaign(this.props.selections);
}

modifyDataset(dataset){
  this.props.modifyDataset({dataset:dataset});
}

continueToNarrative(campaign){
    if(this.props.selections.campaign[0] !== campaign.campaign){
      this.setState({infoBoxModal:"modal fade in",messageAlert:"Please select the campaign before continuing"});
      document.getElementById("infoBoxCH").style.display = "block";
      document.getElementById("infoBoxCH").style.paddingTop = "160px";
    }else{
      this.props.modifyCampaign(campaign);
      this.props.updataCampaign(this.props.selections);
      this.props.modifyCampaignHomeStatus({campaignHome:"inCampaignHome"});
      this.props.getMapping(this.props.selections);
      this.props.selectFeature(this.props.selections);
      this.props.getNarrative(this.props.selections);
      this.props.history.push('/applicationHome');
    }
}

closeModal() {
  this.setState({modalIsOpen: false, exportModalIsOpen: false});
  this.setState({infoBoxModal:"modal fade"});
  document.getElementById("infoBoxCH").style.display = "none";

}


saveSelections(){
  if(this.state.newCampaign === ''){
      this.setState({message:"Please enter a Campaign name"})
  }else if (this.props.selections.allcontent.campaigns.indexOf(this.state.newCampaign.trim()) !== -1) {
      this.setState({message:"Campaign name already exist"});
  }
  else{
    this.props.modifyNewCampaign({newCampaign:this.state.newCampaign});
    this.props.saveSelections(this.props.selections);
    this.buttonElement.click();
    this.props.getAllFilters(this.props.selections);
  }
}

renderChannelCheck(channel){
    if (this.props.selections.channels.indexOf(channel.channel) !== -1){
      return(
        <input type="checkbox" name="channel" checked onClick={() => this.modifyChannel(channel)}/>
      )
    }else{
      return(
        <input type="checkbox" name="channel" onClick={() => this.modifyChannel(channel)}/>
      );
    }
  }

renderChannel() {
  return this.props.channels.map(channel => {
      return (
        <div key= {`${this.props.selections.campaign[0]}${channel.channel}`} className="row dispRow color3 borderB">
            <div className="col-xs-2 col-sm-1 dispCol color4 colSize-Checkbox vmiddle cPadding borderR">
            {/* <!-- checkBOx --> */}
            <div className="checkbox-container custom">

                {this.renderChannelCheck(channel)}

            </div>
            {/* <!-- checkBOx --> */}
            </div>
           <div className="col-xs-10 col-sm-12 dispCol colSize-label vmiddle cPadding">
              <span>{channel.channel}</span>
          </div>
        </div>
        );

  });
}

renderSolutions() {
  if(this.props.solutions.length>0)
  {
  return this.props.solutions.map(solution => {
    let checkBox = "";
    let display ="hidden";
    if (this.props.selections.solutions.indexOf(solution.solution) !== -1){
        checkBox = "checked";
        display = "";
    }
      return (
        <div className="optList"  key= {`${this.props.selections.campaign[0]}${solution.solution}`}>
          <div className="Vbtn colorLB Vslide_x">
            <div className={'Vslide '+display}> <div className="Vtopslide"> <span>{solution.solution}</span></div> </div>
            <div className="viavi_bg">
              <div className="Vicon">
                <input type="checkbox" name="solutions" checked = {checkBox}  value="" onClick={() => this.modifySolution(solution)}/>
                <label htmlFor="solutions" className="circ"></label>
              </div>
              <div className="viavi_bg_button">
                <div>{solution.solution}</div>
              </div>
            </div>
          </div>
        </div>


        )
});
}
else{
  return (
    <div style={{"font-size":"12px","padding-bottom":"6px"}}>
      <span>No Solutions found</span>
    </div>
  )
}
}

renderOffers() {
  console.log("my OFFERS", this.props.offers);
  console.log("my OFFERS SELE",this.props.selections.offers);
  return this.props.offers.map(offer => {
      let checkBox = "";
      let display ="hidden";
      if (this.props.selections.offers.indexOf(offer.offer) !== -1){
          checkBox = "checked";
          display = "";
      }
      return (
        <div className="optList"  key= {`${this.props.selections.campaign[0]}${offer.offer}`}>
          <div className="Vbtn Vslide_x">
            <div className={'Vslide '+display}>
              <div className="Vtopslide"> <span>{offer.offer}</span></div>
            </div>
            <div className="viavi_bg">
              <div className="Vicon">
                <input type="checkbox" name="offers"  checked = {checkBox} value="" onClick={() => this.modifyOffer(offer)}/>
                <label htmlFor="offers" className="circ"></label>
              </div>
              <div className="viavi_bg_button">
                <div>{offer.offer}</div>
              </div>
            </div>
          </div>
        </div>
      );
});
}

renderMotions() {
  return this.props.motions.map(motion => {
      let checkBox = "";
      let display ="hidden";
      if (this.props.selections.motions.indexOf(motion.motion) !== -1){
          checkBox = "checked";
          display = "";
      }
      return (
        <div className="optList"  key= {`${this.props.selections.campaign[0]}${motion.motion}`}>
          <div className="Vbtn colorDB Vslide_x">
            <div className={'Vslide '+ display}> <div className="Vtopslide"> <span>{motion.motion}</span></div> </div>
            <div className="viavi_bg">
              <div className="Vicon">
                <input type="checkbox" name="motions" checked = {checkBox}  value="" onClick={() => this.modifyMotion(motion)}/>
                <label htmlFor="offers" className="circ"></label>
              </div>
              <div className="viavi_bg_button">
                <div>{motion.motion}</div>
              </div>
            </div>
          </div>
        </div>
      );
});
}
//Campaigns

renderCampaignCheck(campaign){
    if (this.props.selections.campaign.indexOf(campaign.campaign) !== -1){
      return(
          <input type="radio" checked name="color" onClick={() => this.modifyCampaign(campaign)}/>
      );
    }else{
      return(
      <input type="radio" name="color" onClick={() => this.modifyCampaign(campaign)}/>
      );
    };
  }

renderCampaigns(displayArea) {
  if(displayArea==="footerBtn")
  {
      return this.props.campaigns.map(campaign => {
          return (
          <div key={campaign.campaign} className="row dispRow color3" style={{"background": "transparent"}}>
            <div className="col-xs-2 col-sm-1 dispCol color4 colSize-Checkbox vmiddle cPadding borderR hidden">
            {/* <!-- checkBOx --> */}
            <div className="pretty p-default p-round custom">
              {this.renderCampaignCheck(campaign)}
              <div className="state p-success-o">
                <label></label>
              </div>
            </div>
            {/* <!-- checkBOx --> */}
            </div>
           <div className="col-xs-4 col-sm-4 dispCol colSize-label vmiddle cPadding hidden">
              <span>{campaign.campaign}</span>
           </div>
           {/* <div className="col-xs-3 col-sm-4 dispCol colSize-label vmiddle cPadding">
              <select className="form-control selectDataSet" onChange={(event) => this.modifyDataset(event.target.value)}>
              <option selected disabled>Select Dataset</option>
              {this.renderDatasetOptions()}
            </select>
           </div> */}
           <div className="col-xs-12 col-sm-12 dispCol colSize-label vmiddle cPadding">
              <button className="mbtn btnType-save alignButton" onClick={() => this.continueToNarrative(campaign)}><span className="btnLabel">Continue</span><i className="fa fa-share btnPaddLeft"  aria-hidden="true"> </i></button>
           </div>
        </div>
            );
    });
  }
  else if(displayArea==="headerBtn"){
      return this.props.campaigns.map(campaign => {
              return (
                <div className="cmpBlck" onClick={() => this.continueToNarrative(campaign)}>
                  <span>
                    Email
                  </span>
                </div>
              );
        });
}
  else{
    // Do nothing
  }
}
currentCampaignName(){
  return this.props.campaigns.map(campaign => {
      return (
        <span style={{"fontWeight": "bold", "color": "#0098dc", "textTransform": "uppercase"}}>{campaign.campaign}</span>
      )});
}

renderDatasetOptions() {
  return this.props.datasets.map(dataset => {
      return (
          <option>{dataset.dataset}</option>
        );
});
}
toggleVisibility(spanID, divId){

  let container  = document.getElementById(divId);
  let span = document.getElementById(spanID);
  if(container.classList.contains("hidden"))
  {
      container.classList.remove("hidden");
      span.classList.remove("arrowDown");
      span.classList.add("arrowUp");
  }
  else{
      container.classList.add("hidden");
      span.classList.add("arrowDown");
      span.classList.remove("arrowUp");
  }
}
  render() {
    return (
    <div>
      <Header />
        <div className="setupContainer" style={{"background":"#fff"}}>
          <div className="container-fluid padding-top ">
            <div className="row cPaddingBottom">
               <div className="col-xs-12  col-sm-12 col-md-12 winSetup">
                  <div className="row headingTop">
                    <div className="col-xs-12">
                      <span>{this.currentCampaignName()}</span>
                      <span className="desc">{this.props.selections.description}</span>
                    </div>
                  </div>
                  <div className="row timeLine">
                    {/* New Content */}
                     {/* Buttons start*/}
            					<div className="col-xs-12 vLine" style={{"padding-bottom": "10px"}}>

            							{this.renderCampaigns("headerBtn")}

            						<div className="cmpBlck">
            							Cisco.com
            						</div>
            					</div>
                    {/* Button  ends */}

                    {/* Option section start  --Solutions-- */}
                    <div className={this.state.disabledSolutions}>
            						<div  id="solutionsBlock" className="row timeLinePoint">
            							<div className="col-xs-12 timeLineContent">
            								<div className="optBlck">
            									<div className="optTitle">
            										Solutions
            									</div>
                              <div className="optMainBlock">
            										  {this.renderSolutions()}
                              </div>
            								</div>
            							</div>
            						</div>
                      </div>
                    {/* Option section ends */}
                    {/* Option section start  --Offers-- */}
                    <div className={this.state.disabledOffers}>
            						<div  id="offersBlock" className="row timeLinePoint">
            							<div className="col-xs-12 timeLineContent">
            								<div className="optBlck">
            									<div className="optTitle">
            										Offers
            									</div>
                              <div className="optMainBlock">
            										  {this.renderOffers()}
                              </div>
            								</div>
            							</div>
            						</div>
                      </div>
                    {/* Option section ends */}
                    {/* Option section start  --Offers-- */}
                    <div className="col-xs-12">
            						<div  id="motionsBlock" className="row timeLinePoint">
            							<div className="col-xs-12 timeLineContent">
            								<div className="optBlck">
            									<div className="optTitle">
            										Motions
            									</div>
                              <div className="optMainBlock">
            										  {this.renderMotions()}
                              </div>
            								</div>
            							</div>
            						</div>
                      </div>
                    {/* Option section ends */}
                    {/* New Content */}
                  </div>
                </div>
            </div>
          </div>
        </div>


    {/* <!-- ------------------------------------------------- -->
  	<!-- -Model For New Campaign Name ----Start- -->
  	<!-- ------------------------------------------------- -->  */}
  	<div className="modal fade" id="proEditCurrentBlock" tabIndex="-1" role="dialog">
  	  <div className="modal-dialog" role="document">
  		<div className="modal-content">
  		  <div className="proModel modal-header">
  			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
  			<h4 className="modal-title"><i className="fa fa-pencil-square-o" aria-hidden="true"> </i> New Campaign</h4>
  		  </div>
  		  <div className="modal-body">
  			<form>
  			  <div className="form-group">
  				<label className="control-label">Campaign Name </label>
  				<input type="text" className="form-control" id="" value={this.state.newCampaign} onChange={(event) => this.setState({"newCampaign":event.target.value,"message":""})}/>
          <div className='errorMsgCol'><span>{this.state.message}</span></div>
  			  </div>
  			</form>
  		  </div>
  		  <div className="proModel modal-footer clear">
  			<button type="button" className="btn btn-default modelBtn proBtnCancel" data-dismiss="modal" ref={buttonexit => this.buttonElement = buttonexit}><i className="fa fa-times proUpdate" aria-hidden="true"></i> Cancel</button>
  			<button type="button" className="btn btn-primary modelBtn proBtnSave" onClick={() => this.saveSelections()}>Create <i className="fa fa-long-arrow-right proUpdate" aria-hidden="true"></i> </button>
  		  </div>
  		</div>
  	  </div>
  	</div>

    <div className={this.state.infoBoxModal} onClick={() => this.closeModal()} id="infoBoxCH" tabIndex="-1" role="dialog" data-dismiss="modal">
      <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="proModel modal-header">
        <button type="button" className="close" data-dismiss="modal" onClick={() => this.closeModal()} aria-label="Close"><span aria-hidden="true"><i className="fa fa-times" aria-hidden="true"></i></span></button>
        <h4 className="modal-title"><i className="fa fa-info-circle " aria-hidden="true"> </i> Information</h4>
        </div>
        <div className="modal-body errModel">
             <p className="errorMsg"><i className="fa fa-info-circle errIcon" aria-hidden="true"></i>{this.state.messageAlert}</p>

        </div>
      </div>
      </div>
    </div>


    </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    channels: state.channels,
    solutions: state.solutions,
    offers: state.offers,
    motions: state.motions,
    campaigns: state.campaigns,
    datasets: state.datasets,
    signInStatus : state.signInStatus,
    selections : state.globalSelection,
    campaignHomeStatus:state.campaignHomeStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllFilters:getAllFilters,
      modifySolution: modifySolution,
      modifyMotion: modifyMotion,
      modifyChannel: modifyChannel,
      modifyOffer: modifyOffer,
      modifyCampaign : modifyCampaign,
      selectCampaign : selectCampaign,
      modifyDataset : modifyDataset,
      modifyNewCampaign : modifyNewCampaign,
      saveSelections : saveSelections,
      selectAllSolutions : selectAllSolutions,
      selectAllMotions : selectAllMotions,
      selectAllOffers : selectAllOffers,
      selectAllChannels : selectAllChannels,
      modifyCampaignHomeStatus: modifyCampaignHomeStatus,
      getMapping:getMapping,
      updataCampaign:updataCampaign,
      selectFeature:selectFeature,
      getNarrative:getNarrative
    },
    dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(CampaignHome);
