import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addRule, modifyRule, featureNarrative } from "../actions/index";
import EditorRenderText from './EditorRenderText'
import _ from 'lodash';

class Editor extends Component{
  constructor(props){
    super(props);
    this.state = {
      idNumber:0,
      lastClickedSec:'',
      currentIfPartClicked: '',
      showRuleWindow:{status:false,type:'', ifElseId:'', condType:'simple'},
      currentCondition:'',
      conditionType:'simple',
      currentIfId:'',
      cursor:0,
      titleBars : [],
      editorData : [{id:'idSection0',
                     title:'Please enter something',
                     text:''}]
    };
  }

  componentWillReceiveProps(nextprops){
    this.setState({editorData:nextprops.narrative.jsonRule});

  }

/* functions */
/* Add a new section */
  addSection(event){
      /* Section:-last focused editable div */
      let receivedData = this.getTargetDetails()
      //let currentSection = this.state.lastClickedSec;
      let currentSection = receivedData.currentSection;
      // let currentIfPart =receivedData.currentIfPart;
      // let currentSection = this.state.lastClickedSec;
      let len = this.state.editorData.length;
      let newId  = "idSection"+len;
      let indexOfCurrentSection = _.findIndex(this.state.editorData, ['id', currentSection]);
      indexOfCurrentSection = indexOfCurrentSection + 1;
      this.setState({editorData: [...this.state.editorData.slice(0, indexOfCurrentSection), {"id":newId,'title':'', 'text':''}, ...this.state.editorData.slice(indexOfCurrentSection)]});
  }

  /* Remove a section */
  removeSection(id){
    if(this.state.editorData.length>1){
      _.remove(this.state.editorData, ['id', id]);
      this.setState({editorData:this.state.editorData});
    }

  }
  removeAttribute(attr, attrName){
    let elems = document.querySelectorAll(attr);
    [].forEach.call(elems, function(el) {
      el.removeAttribute(attrName);
    });
  }
  getTargetDetails(){
    let block = [];
    let currentIfPart = document.querySelectorAll('[data-activetextbox="activeTextBox"]');
    let currentSection = document.querySelectorAll('[data-activesec="activeSection"]');
    if(currentIfPart.length !== 0){
      block.currentIfPart = currentIfPart[0].getAttribute('id');
    }
    else{
      block.currentIfPart = '';
    }
    if((currentSection===null) || (typeof currentSection ==='undefined')){
      currentSection = currentIfPart.closest('.contSec').getAttribute('id');
    }
    block.currentSection = currentSection[0].getAttribute('id');
    return block;
  }
  getSectionId(event){
    if(document.getElementById("headerBar").classList.contains('disabled')){
       document.getElementById("headerBar").classList.remove('disabled');
    }
    //let currentId = event.target.getAttribute('id');
    //this.setState({lastClickedSec:event.target.closest('.contSec').getAttribute('id')});
    let currentIfPartClicked=event.target.closest('.contSec').getAttribute('id');
    let emptyDiv  =event.target.getAttribute('id');
    if((typeof emptyDiv=='undefined') || (emptyDiv==null)){
      let parent = event.target.closest('.commonDiv')
      let commonDiv =   parent.getAttribute('id');
      if(typeof commonDiv !== 'undefined'                                                     ){
        if(commonDiv !==null){
          this.removeAttribute('[data-activetextbox="activeTextBox"]', 'data-activetextbox');
          commonDiv = document.getElementById(commonDiv);
          commonDiv.setAttribute("data-activetextbox","activeTextBox")
        }
      }
    }
    //emptyDiv = document.getElementById(emptyDiv);
    let activeSection = document.getElementById(currentIfPartClicked);
    this.removeAttribute('[data-activesec="activeSection"]','data-activesec');
    activeSection.setAttribute("data-activesec","activeSection")
  }

  onIfSectionPartClick(selection){
    let currentIfPart = selection.event.target.getAttribute('id');
    if((typeof currentIfPart ==='undefined') || (currentIfPart===null)){
       let currentIfPartClicked=selection.event.target.closest('.textBox').getAttribute('id');
       let activeTextBox = document.getElementById(currentIfPartClicked);
       this.removeAttribute('[data-activetextbox="activeTextBox"]', 'data-activetextbox');
       activeTextBox.setAttribute("data-activetextbox","activeTextBox")
    }
    else{

      let activeTextBox = document.getElementById(currentIfPart);
      this.removeAttribute('[data-activetextbox="activeTextBox"]', 'data-activetextbox');
      activeTextBox.setAttribute("data-activetextbox","activeTextBox")
    }

  }
  // getBlockAttributes(event){
  //   let block = [];
  //   block.currentSection=event.target.closest('.contSec').getAttribute('id');
  //   let currentIfPart ='';
  //   let getCurrentIfPartId = event.target.getAttribute('id');
  //   if(getCurrentIfPartId==='undefined' || !getCurrentIfPartId){
  //     block.currentIfPart=event.target.closest('.textBox').getAttribute('id');
  //   }
  //   else{
  //     block.currentIfPart=getCurrentIfPartId;
  //   }
  //   return block;
  // }
  addText(event,cond_json){
    let receivedData = this.getTargetDetails()
    //let currentSection = this.state.lastClickedSec;
    let currentSection = receivedData.currentSection;
    let currentIfPart = receivedData.currentIfPart;
    let currentIfId = receivedData.currentIfPart;
    let textToModify = "text";

    let cursor  = this.updateCursor(event);
    this.state.cursor = cursor;
    if (currentIfPart.search("_ifElseBlockprev") >= 0){
      currentIfId = currentIfPart.replace("_ifElseBlockprev","");
      textToModify = "prevText";
    }else if(currentIfPart.search("_ifElseBlocknext") >= 0){
      currentIfId = currentIfPart.replace("_ifElseBlocknext","");
      textToModify = "nextText";
    }else if(currentIfPart.search("_elseBlockprev") >= 0){
      currentIfId = currentIfPart.replace("_elseBlockprev","");
      textToModify = "prevText";
    }else if(currentIfPart.search("_elseBlocknext") >= 0){
      currentIfId = currentIfPart.replace("_elseBlocknext","");
      textToModify = "nextText";
    }else if(currentIfPart.search("_if_text") >= 0){
      currentIfId = currentIfPart.replace("_if_text","");
      textToModify = "text";
    }else if(currentIfPart.search("_else_text") >= 0){
      currentIfId = currentIfPart.replace("_else_text","");
      textToModify = "elseText";
    }else if(currentIfPart.search("_elseif_text") >= 0){
      currentIfId = currentIfPart.replace("_elseif_text","");
      textToModify = "elseIfText";
    }else if(currentIfPart.search("_cond") >= 0){
      currentIfId = currentIfPart.replace("_cond","");
      textToModify = "conditionIf"
    }else if(currentIfPart.replace("_section_text") >= 0){
      currentIfId = currentIfPart.replace("_section_text","");
      textToModify = "text"
    }

    let editorData = this.state.editorData;
    let indexOfSection = _.findIndex(editorData, ['id', currentSection]);
    let currentIfElseBlock = editorData[indexOfSection]
    let currentIfIdArr = []
    if(currentIfElseBlock.hasOwnProperty('ifElseBlock')){
      currentIfIdArr = currentIfId.split("_");
    }else{
      currentIfIdArr = [currentSection]
    }
    let cumulative_id = currentIfIdArr[0];
    let loopLength = _.size(currentIfIdArr)
    for(let i=1; i < loopLength;  i++){
      cumulative_id = cumulative_id+"_"+currentIfIdArr[i];
      if(currentIfElseBlock.hasOwnProperty('ifElseBlock') && _.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id]) >= 0){
        currentIfElseBlock = currentIfElseBlock.ifElseBlock[_.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id])]
      }else if(currentIfElseBlock.hasOwnProperty('elseBlock') && _.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id]) >= 0){
        currentIfElseBlock = currentIfElseBlock.elseBlock[_.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id])]
      }else if(currentIfElseBlock.hasOwnProperty('elseIfBlock') && _.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id]) >= 0){
        currentIfElseBlock = currentIfElseBlock.elseIfBlock[_.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id])]
      }
    }
    if(currentIfId !== ""){
      console.log("Current IF ID ..", currentIfPart)
      let childList = document.getElementById(currentIfPart);
      console.log("Current Children", childList);
      //processing the if texts, removing div and br tags and adding new line \n
      let children = document.getElementById(currentIfPart).children;
      let finalText = "";
      for(let i=0; i < children.length; i++){
        let currentText = children[i].innerHTML


        currentText = currentText.replace(/<div class="">/g,'\\n');
        currentText = currentText.replace(/<div class="activeSpan">/g,'\\n');
        currentText = currentText.replace(/<div>/g,'\\n');
        currentText = currentText.replace(/<\/div>/g,'');
        currentText = currentText.replace(/<i class="para">/g,'');
        currentText = currentText.replace(/<i class="para activeSpan">/g,'');
        currentText = currentText.replace(/<\/i>/g,'');
        currentText = currentText.replace(/<\<br>/g,'\\n');

        currentText = currentText.replace(/<span class="clickedSpan activeSpan" contenteditable="PLAINTEXT-ONLY">/g,'[[');
        currentText = currentText.replace(/<span class="clickedSpan" contenteditable="PLAINTEXT-ONLY">/g,'[[');
        currentText = currentText.replace(/<span class="clickedSpan activeSpan" contenteditable="false">/g,'[[');
        currentText = currentText.replace(/<span class="clickedSpan" contenteditable="false">/g,'[[');
        currentText = currentText.replace(/<\/span>/g,']]');
        currentText = currentText.replace('&amp;nbsp;','');
        currentText = currentText.replace('&amp;','');
        currentText = currentText.replace('&nbsp;','');

        // if(event.keyCode === 13 && children[i].className === "activeDiv"){
        //    currentText = currentText.substring(0,this.state.cursor) + "\n" + currentText.substring(this.state.cursor);
        // }
        if(i == 0){
          finalText = currentText;
        }else{
          finalText = finalText + "\\n" + currentText;
        }
      }
      finalText = finalText.replace(/<br>/g,'\\n');
      console.log("FInal TEXT", finalText);
      if(textToModify === "conditionIf"){
          if(typeof cond_json !== 'undefined'){
              currentIfElseBlock[textToModify] = cond_json;
              this.setState({editorData:this.state.editorData})
          }
        }else{
        currentIfElseBlock[textToModify] = finalText;
      }

    }
  console.log("editorData", this.state.editorData);
  }


  editTitleTag(event){
    let currentId = event.target.getAttribute('id');
    this.setState({"lastClickedSec":event.target.closest('.contSec').getAttribute('id')});
    let lastClickedSec = event.target.closest('.contSec').getAttribute('id');
    let newArr = _.map(this.state.editorData, function(element) {
        if(element['id'] === lastClickedSec){
          return _.extend({}, element, {'title':event.target.innerHTML});
        }
        return element;
    });
    this.setState({editorData:newArr});
  }

  addElseIfBlock(){
    let receivedData = this.getTargetDetails();
    let currentSection = receivedData.currentSection;
    let currentIfPart =receivedData.currentIfPart;
    let currentIfId = this.state.currentIfId;
    let addOn = 1
    let loopLengthAlteration = 0;
    let blockToModify = "elseIfBlock";
    let block = "if"
    if(currentIfPart.search("_ifElseBlocknext") >= 0){
      let tempArr = currentIfPart.split("_");
      if(tempArr[tempArr.length - 3].substr(0,6) == "elseif"){
        currentIfPart = tempArr.slice(0,-2).join("_") + "_elseif_text"
      }else{
        currentIfPart = tempArr.slice(0,-2).join("_") + "_if_text"
      }
    }
    if(currentIfPart.search("_if_text") >= 0 || currentIfPart.search("_elseif_text") >= 0){
      if(currentIfPart.search("_elseif_text") >= 0){
        currentIfId = currentIfPart.replace("_elseif_text","");
        loopLengthAlteration = 1;
      }else{
        currentIfId = currentIfPart.replace("_if_text","");
        loopLengthAlteration = 0;
      }
      let editorData = this.state.editorData;

      //  getting the list in which the currentIfId is present for the nested if Operation

      let indexOfSection = _.findIndex(editorData, ['id', currentSection]);
      let currentIfElseBlock = editorData[indexOfSection]
      let currentIfIdArr = []
      if(currentIfElseBlock.hasOwnProperty('ifElseBlock')){
        currentIfIdArr = currentIfId.split("_");
      }else{
        currentIfIdArr = [currentSection]
      }
      let cumulative_id = currentIfIdArr[0];
      let loopLength = _.size(currentIfIdArr) - loopLengthAlteration;
      for(let i=1; i < loopLength;  i++){
        cumulative_id = cumulative_id+"_"+currentIfIdArr[i];
        if(currentIfElseBlock.hasOwnProperty('ifElseBlock') && _.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id]) >= 0){
          currentIfElseBlock = currentIfElseBlock.ifElseBlock[_.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id])]
        }else if(currentIfElseBlock.hasOwnProperty('elseBlock') && _.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id]) >= 0){
          currentIfElseBlock = currentIfElseBlock.elseBlock[_.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id])]
        }else if(currentIfElseBlock.hasOwnProperty('elseIfBlock') && _.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id]) >= 0){
          currentIfElseBlock = currentIfElseBlock.elseIfBlock[_.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id])]
        }
      }
      let element = currentIfElseBlock
      if(element.hasOwnProperty(blockToModify)){
        let len = element[blockToModify].length;
        let newId  = `${element.id}_elseif${len}`;
        let indexOfIfElse = _.findIndex(element[blockToModify], ['id', currentIfId]);
        indexOfIfElse = indexOfIfElse + addOn
        let newIfArr = [...element[blockToModify].slice(0, indexOfIfElse),
          {id:newId ,prevText:'',nextText:'',elseIfText:'',conditionIf:[{fun:'',parameter1:'',parameter2:'',operator:'', cond:''}],  conditionType:'simple',conditionText:''},
        ...element[blockToModify].slice(indexOfIfElse)];
        element[blockToModify] = newIfArr
        this.setState({editorData:[...this.state.editorData,element[blockToModify]:newIfArr]});
      }else{
        element[blockToModify] = [{id:`${element.id}_elseif0`, prevText:'', nextText:'',elseIfText:'',conditionIf:[{fun:'',parameter1:'',parameter2:'',operator:'', cond:''}], conditionType:'simple',conditionText:''}]
        //let newConditon = [{id:`${element.id}_elseif0`,prevText:'',nextText:'',elseIfText:'',conditionIf:[{fun:'',parameter1:'',parameter2:'',operator:'', cond:''}]}]
        //this.setState({editorData:[...this.state.editorData,element[blockToModify]:newConditon]});
      }
      //not required as state is already set in previous conditional statement
      this.setState({editorData:this.state.editorData});
    }
  }

  addIfElseBlock(){
    let receivedData = this.getTargetDetails();
    let currentSection = receivedData.currentSection;
    let currentIfPart =receivedData.currentIfPart;
     let currentIfId = this.state.currentIfId;
     let addOn = 0
     let loopLengthAlteration = 0;
     let blockToModify = "ifElseBlock";
     let block = "ifelse"
     if (currentIfPart.search("_ifElseBlockprev") >= 0){
       currentIfId = currentIfPart.replace("_ifElseBlockprev","");
       addOn  = 0;
       loopLengthAlteration = 1;
     }else if(currentIfPart.search("_ifElseBlocknext") >= 0){
       currentIfId = currentIfPart.replace("_ifElseBlocknext","");
       addOn = 1;
       loopLengthAlteration = 1;
     }else if(currentIfPart.search("_elseBlockprev") >= 0){
       currentIfId = currentIfPart.replace("_elseBlockprev","");
       addOn = 0;
       loopLengthAlteration = 1;
       blockToModify = "elseBlock";
       block = "else"
     }else if(currentIfPart.search("_elseBlocknext") >= 0){
       currentIfId = currentIfPart.replace("_elseBlocknext","");
       addOn = 1;
       loopLengthAlteration = 1;
       blockToModify = "elseBlock";
       block = "else"
     }else if(currentIfPart.search("_if_text") >= 0){
       currentIfId = currentIfPart.replace("_if_text","");
       addOn = 0;
       loopLengthAlteration = 0;
     }else if(currentIfPart.search("_else_text") >= 0){
       currentIfId = currentIfPart.replace("_else_text","");
       addOn = 0;
       loopLengthAlteration = 0;
       blockToModify = "elseBlock";
       block = "else"
     }else if(currentIfPart.search("_elseif_text") >= 0){
       currentIfId = currentIfPart.replace("_elseif_text","");
       addOn = 0;
       loopLengthAlteration = 0;
       blockToModify = "ifElseBlock";
     }
     let editorData = this.state.editorData;

     //  getting the list in which the currentIfId is present for the nested if Operation

     let indexOfSection = _.findIndex(editorData, ['id', currentSection]);
     let currentIfElseBlock = editorData[indexOfSection]
     let currentIfIdArr = []
     if(currentIfElseBlock.hasOwnProperty('ifElseBlock')){
       currentIfIdArr = currentIfId.split("_");
     }else{
       currentIfIdArr = [currentSection]
     }
     let cumulative_id = currentIfIdArr[0];
     let loopLength = _.size(currentIfIdArr) - loopLengthAlteration;
     for(let i=1; i < loopLength;  i++){
       cumulative_id = cumulative_id+"_"+currentIfIdArr[i];
       if(currentIfElseBlock.hasOwnProperty('ifElseBlock') && _.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id]) >= 0){
         currentIfElseBlock = currentIfElseBlock.ifElseBlock[_.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id])]
       }else if(currentIfElseBlock.hasOwnProperty('elseBlock') && _.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id]) >= 0){
         currentIfElseBlock = currentIfElseBlock.elseBlock[_.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id])]
       }else if(currentIfElseBlock.hasOwnProperty('elseIfBlock') && _.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id]) >= 0){
         currentIfElseBlock = currentIfElseBlock.elseIfBlock[_.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id])]
       }
     }
     let element = currentIfElseBlock
     console.log("currentIfElseBlock", currentIfElseBlock);
     if(element.hasOwnProperty(blockToModify)){
       let len = element[blockToModify].length;
       let newId  = `${element.id}_${block}${len}`;
       let indexOfIfElse = _.findIndex(element[blockToModify], ['id', currentIfId]);
       indexOfIfElse = indexOfIfElse + addOn
       let newIfArr = [...element[blockToModify].slice(0, indexOfIfElse),
         {id:newId ,prevText:'',nextText:'',text:'',elseText:'',conditionIf:[{fun:'',parameter1:'',parameter2:'',operator:'', cond:''}],  conditionType:'simple',conditionText:''},
       ...element[blockToModify].slice(indexOfIfElse)];
       element[blockToModify] = newIfArr
       this.setState({editorData:[...this.state.editorData,element[blockToModify]:newIfArr]});
     }else{
       element[blockToModify] = [{id:`${element.id}_${block}0`, prevText:element.text, nextText:'',text:'',elseText:'',conditionIf:[{fun:'',parameter1:'',parameter2:'',operator:'', cond:''}], conditionType:'simple',conditionText:''}]
       element['text'] = ""
       //let newConditon = [{id:`${element.id}_${block}0`,prevText:'',nextText:'',text:'',elseText:'',conditionIf:[{fun:'',parameter1:'',parameter2:'',operator:'', cond:''}]}]
       //this.setState({editorData:[...this.state.editorData,element[blockToModify]:newConditon]});
     }
     this.setState({editorData:this.state.editorData});

  }



  onIfConditionClick(event, current){

    this.onIfSectionPartClick(event);
    this.showRuleWindow(event, current);

  }

  // Toogle  condition type
  resetConditionView(type){
    if(this.state.conditionType!==type){
      this.setState({conditionType:type})
      if(type ==='simple'){
          document.getElementById('complexRuleGen').classList.remove('activated');
          document.getElementById('simpleRuleGen').classList.add('activated');

      }
      else{
          document.getElementById('complexRuleGen').classList.add('activated');
          document.getElementById('simpleRuleGen').classList.remove('activated');
      }
    }
  }

  /* Function  to get  the clicked  condition block's  Data from the Editor Object  */
  getCurrentBLock(){
    if(this.state.showRuleWindow.status===true){

        let receivedData = this.getTargetDetails();
        let currentSection = receivedData.currentSection;
        let currentIfPart =receivedData.currentIfPart;
        let currentIfId = this.state.currentIfId;
        let textToModify = "";
        if(currentIfPart.search("_cond") >= 0){
          currentIfId = currentIfPart.replace("_cond","");
          textToModify = "conditionIf"
        }
        if(currentIfPart.search("_elseIf") >= 0){
          currentIfId = currentIfPart.replace("_cond","");
          textToModify = "conditionIf"
        }

        let editorData = this.state.editorData;
        let indexOfSection = _.findIndex(editorData, ['id', currentSection]);
        let currentIfElseBlock = editorData[indexOfSection]
        let currentIfIdArr = []
        if(currentIfElseBlock.hasOwnProperty('ifElseBlock')){
          currentIfIdArr = currentIfId.split("_");
        }else{
          currentIfIdArr = [currentSection]
        }
        let cumulative_id = currentIfIdArr[0];
        let loopLength = _.size(currentIfIdArr)
        for(let i=1; i < loopLength;  i++){
          cumulative_id = cumulative_id+"_"+currentIfIdArr[i];
          if(currentIfElseBlock.hasOwnProperty('ifElseBlock') && _.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id]) >= 0){
            currentIfElseBlock = currentIfElseBlock.ifElseBlock[_.findIndex(currentIfElseBlock.ifElseBlock, ['id', cumulative_id])]
          }else if(currentIfElseBlock.hasOwnProperty('elseBlock') && _.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id]) >= 0){
            currentIfElseBlock = currentIfElseBlock.elseBlock[_.findIndex(currentIfElseBlock.elseBlock, ['id', cumulative_id])]
          }else if(currentIfElseBlock.hasOwnProperty('elseIfBlock') && _.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id]) >= 0){
            currentIfElseBlock = currentIfElseBlock.elseIfBlock[_.findIndex(currentIfElseBlock.elseIfBlock, ['id', cumulative_id])]
          }
       }
       return(currentIfElseBlock);
    }
  }

  /* Added by manoj  26-06-2018 ---- This functions open up the popup window for writing condition  */
  showRuleWindow(event, current){

      let type= event.event.target.getAttribute('data-condType');
      this.setState({showRuleWindow:{status:true,type:type}, conditionType:current.current},function(){
      let simpleRuleGen =  document.getElementById('simpleRuleGen')
      let complexRuleGen =  document.getElementById('complexRuleGen')
      if(current.current ==='simple'){
          document.getElementById('complexRuleGen').classList.remove('activated');
          document.getElementById('simpleRuleGen').classList.add('activated');

      }
      else{
          document.getElementById('complexRuleGen').classList.add('activated');
          document.getElementById('simpleRuleGen').classList.remove('activated');
      }
      if(this.state.showRuleWindow){

        document.getElementById('ruleEditorModel').style.display="block";
        if(!document.getElementById("ruleEditor").classList.contains('viewActive')){
           document.getElementById("ruleEditor").classList.add('viewActive');
        }
      }
    })

  }
  /* Function to add a new rule in popup Rule Box  */

  /* Added by manoj  26-06-2018 ---- This functions closes the  popup window  opened for writing condition  */
  closeRuleTab(){
    this.setState({showRuleWindow:{status:false}});
    let currentIfElseBlock = this.getCurrentBLock();
    currentIfElseBlock.conditionType=this.state.conditionType;
    console.log("Modal Closed, editor DATA", this.state.editorData);
    document.getElementById('ruleEditorModel').style.display="none";
    if(document.getElementById("ruleEditor").classList.contains('viewActive')){
       document.getElementById("ruleEditor").classList.remove('viewActive');
    }
  }
/*  Update the if else condition */
updateCondition(event){
    let currentIfElseBlock = this.getCurrentBLock();
    let type = event.target.getAttribute('data-type');
    let index = event.target.getAttribute('data-index');
    let value = event.target.value;


    if(type === "cond"){
      currentIfElseBlock.conditionType=this.state.conditionType;
      currentIfElseBlock.conditionIf[index][type]=value;
      /* disable the first option in dropdown */
      let defaultOpt = event.target.options[0];
      defaultOpt.disabled = true;
      index = parseInt(index, 10)+1;
      if(currentIfElseBlock.conditionIf.length===index)
      {
        currentIfElseBlock.conditionIf.push({fun:'',parameter1:'',parameter2:'',operator:'', cond:''});
      }
      this.addText(event,currentIfElseBlock.conditionIf);
    }
    else if(type ==='textArea'){

      currentIfElseBlock.conditionType=this.state.conditionType;
      currentIfElseBlock.conditionText=value;
      this.addText(event,currentIfElseBlock.conditionIf);

    }

    else{
      currentIfElseBlock.conditionType=this.state.conditionType;
      currentIfElseBlock.conditionIf[index][type]=value;
      this.addText(event,currentIfElseBlock.conditionIf);
    }

}

/* Add new condition on click of add new condition button */
addNewCondition(event){
    let currentIfElseBlock = this.getCurrentBLock();
    currentIfElseBlock.conditionIf.push({fun:'',parameter1:'',parameter2:'',operator:'', cond:''});
    this.addText(event,currentIfElseBlock.conditionIf);
    let addNewCondition = document.getElementById("addNewCondition");
    if(!addNewCondition.classList.contains('hidden')){
      addNewCondition.classList.add('hidden')
    }

}
/* Remove condition(s) or rule from the rule Popup  */
removeCondition(event,index){
    let currentIfElseBlock = this.getCurrentBLock();
    currentIfElseBlock.conditionIf.splice(index, 1);
    if(currentIfElseBlock.conditionIf.length===0){
      let addNewCondition = document.getElementById("addNewCondition");
      if(addNewCondition.classList.contains('hidden')){
        addNewCondition.classList.remove('hidden')
      }
    }
    this.addText(event,currentIfElseBlock.conditionIf);
  }

  saveTemplate(){
    this.props.modifyRule({rule:this.state.editorData});
    this.props.addRule(this.props.selections, () => {
    this.props.featureNarrative({user:this.props.selections.user,campaign:this.props.selections.campaign,
                                 language:this.props.selections.language,previewFeature:this.props.selections.exportFeature,
                                 previewPersona:[this.props.mapping.featurepersona[this.props.selections.exportFeature[0]][0]]});

    });
  }

/* Renders the rule in Rows(each condition row)  */
renderRule(){
    if(this.state.showRuleWindow.status===true){
        let currentIfElseBlock = this.getCurrentBLock();
        let current = "";
        current = currentIfElseBlock.conditionIf;
        let conditionType = currentIfElseBlock.conditionType;
        console.log("CONDITION TYPE ..............", conditionType);
        if(this.state.conditionType === 'simple')
        {
        return current.map((cond,index) => {
         return(
           <div id = "ruleSimpleHead" className={this.state.toggleCondClass}>
             <div className="col-xs-12 rule hidden"></div>
              <div className="col-xs-12 rule">

                        <span className="condDelete" onClick={(event)=>this.removeCondition(event,index)}>X</span>
                        <div className="ruleOuter">
                          <div className="form-group sel" data-condition="condBool">
                              <label>Function</label>
                              <select className="form-control select" id={`fn_sel_${index}`}  data-index={index} data-type="fun" name="fun" onChange={(event)=>this.updateCondition(event)}>
                                 <option disabled="" selected="">Select Function</option>
                                {this.renderFun(cond)}
                              </select>
                           </div>
                           <div className="form-group sel" data-condition="condColumn1">
                              <label>Parameter 1</label>
                              <select className="form-control select" id={`para_sel_${index}`} data-index={index} data-type="parameter1" name="parameter1" onChange={(event)=>this.updateCondition(event)}>
                                 <option disabled selected>Select Column</option>
                                  {/* {(() => {})} */}
                                 {this.renderDataList(cond)}
                              </select>
                           </div>
                           <div className="form-group sel" data-condition="condOperand">
                              <label>Operand</label>
                              <select className="form-control select operator" id={`operandt_sel_${index}`}  data-index={index} data-type="operator" name="operator" onChange={(event)=>this.updateCondition(event)}>
                                 <option disabled="" selected="">Select Operator</option>
                                 {this.renderOperator(cond)}
                              </select>
                           </div>
                           <div className="form-group sel" data-condition="condColumn2">
                              <label>Parameter 2</label>
                              <input type="text" key={`${cond.parameter2}_swel_${index}`}  data-index={index} placeholder={cond.parameter2} data-type="parameter2" name="parameter2" defaultValue = {cond.parameter2}   onBlur={(event)=>this.updateCondition(event)} />
                              {/*
                            <input list="browsers" data-index={index} data-value={cond.parameter2} data-type="parameter2" name="parameter2"  onBlur={(event)=>this.updateCondition(event)} />
                              <datalist className="select" id="browsers">
                                 {this.renderSuggestions(cond)}
                              </datalist>
                             */}
                           </div>
                           <div className="form-group sel" data-condition="condBool">
                               <label>Condition</label>
                               {(()=>{
                                 if((cond.parameter1==='')|| (cond.parameter2==='')||(cond.operator==='')){
                                     return (
                                         <select disabled className="form-control select"  id={`logical_sel_${index}`}  data-index={index} data-type="cond" name="cond" onChange={(event)=>this.updateCondition(event)}>
                                           <option >Select</option>
                                           {this.renderLogicalOperators(cond)}
                                        </select>
                                      )
                                 }
                                 else{
                                   return (
                                     <select className="form-control select" id={`logical_sel_${index}`}  data-index={index} data-type="cond" name="cond" onChange={(event)=>this.updateCondition(event)}>
                                       <option >Select</option>
                                       {this.renderLogicalOperators(cond)}
                                    </select>
                                     )
                                 }
                               })()
                             }


                            </div>
                        </div>
                     </div>
                    {/* rule rendering ends */}
                    <div className="col-xs-12  block" id={`input_sel_${index}`} >
                      <div className="ruleLabel dropdown-toggle hidden" id="addNewCondition" onClick = {(event)=> this.addNewCondition(event)}>
                        <i className="fa fa-long-arrow-right" aria-hidden="true"></i> Add New Condition
                      </div>
                      <ul className="dropdown-menu">
                        <li><a className="disabled">Select Condition Type</a></li>
                        {this.renderMathFunctions()}
                      </ul>
                    </div>
                </div>
           );
         })
      }
      else{
        return(
        <div className="col-xs-12 ruleTextArea" id = "ruleTextAreaHead">
          <div className="col-xs-12 ruleHeader">
            <ul className="item">
              <li className="list">
                <div className="link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Column  <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
                </div>
                <ul className="dropdown-menu">
                  <li><a className="disabled">Select</a></li>
                  {this.renderComplexDataList()}
                </ul>
              </li>

              <li className="list">
                <div className="link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  ColumnFunction  <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
                </div>
                <ul className="dropdown-menu">
                  <li><a className="disabled">Select</a></li>
                  {this.renderComplexDataFunctions()}
                </ul>
              </li>

              <li className="list">
                <div className="link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Operand  <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
                </div>
                <ul className="dropdown-menu">
                  <li><a className="disabled">Select</a></li>
                  {this.renderComplexOperator()}
                </ul>
              </li>

              <li className="list">
                <div className="link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Condition  <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
                </div>
                <ul className="dropdown-menu">
                  <li><a className="disabled">Select</a></li>
                  {this.renderComplexLogicalOperators()}
                </ul>
              </li>
            </ul>
          </div>
          <div className="form-group" id="complexTextArea">
            <textarea className="form-control rounded-0" id="formControlTextarea"  data-type="textArea" defaultValue={currentIfElseBlock.conditionText } rows="10" onBlur={(event)=>this.updateCondition(event)}></textarea>
          </div>
          <div className="col-xs-12 notice">
              <div>
                <span className="glyphicon glyphicon-pushpin icon" aria-hidden="true"></span>
                <span><i>Be Careful! your are using <span className="underLine">Free-Form Text</span>,  make sure your rule is valid.</i></span></div>

          </div>
        </div>
      )
      }

  }
  }
/* Renders the  All logical conditions(AND|OR) and Mathematical functions  */
  renderMathFunctions(){
      return this.props.mathFunctions.map(mathFunc => {
        return(
          <li><a key={mathFunc.function} className="" data-value={mathFunc.function}>{mathFunc.function}</a></li>
        );
      });
  }


  /* Renders the   Logical Conditions   */
  renderLogicalOperators(cond){
    let fun = [
      {"funVal":"and"},
      {"funVal":"or"},
      {"funVal":"not"}
    ];
    return fun.map((funVal,index) => {
      if(cond.cond===funVal.funVal) {
        return(
          <option selected  key={`${funVal.funVal}_sel_${index}`} value={funVal.funVal}>{funVal.funVal}</option>

        );
      }

      else {
        return(
          <option   key={`${funVal.funVal}_sel_${index}`} value={funVal.funVal}>{funVal.funVal}</option>
        );
      }

    });
  }
  /* Renders the   Mathematical functions  */
  renderFun(cond){

    return this.props.mathFunctions.map((funVal,index) => {
      if(cond.fun===funVal.funVal) {
        return(
          <option selected  key={`${funVal.funVal}_sel_${index}`} value={funVal.funVal}>{funVal.funVal}</option>

        );
      }

      else {
        return(
          <option   key={`${funVal.funVal}_sel_${index}`} value={funVal.funVal}>{funVal.funVal}</option>
        );
      }

    });
  }
/* Renders the  Data Columns in editor Navbar  */
  renderDataColumns(){
      return this.props.narrative.header.map((dataCols,index) => {
        return(
        <li><a key={dataCols} onClick={(event)=>this.addColumnValue(dataCols, "columnName")}>{dataCols}</a></li>
        )
      });
  }
  renderDataFunctions(){
    let fun = [
      {"funVal":"num_to_word"},
      {"funVal":"list_count"}
    ];
    return fun.map((fun,index) => {
      return(
      <li><a key={fun.funVal} onClick={(event)=>this.addColumnValue(fun.funVal, "functionName")}>{fun.funVal}</a></li>
      )
    });
  }
  /* Renders all column names in Rule Model Window   */
  renderDataList(cond){
      return this.props.narrative.header.map((dataCols,index) => {
        if(cond.parameter1===dataCols) {
          return(
            <option selected key={`${dataCols}_sel_${index}`} value={dataCols}>{dataCols}</option>
          );
        }

        else {
          return(
            <option key={`${dataCols}_sel_${index}`} value={dataCols}>{dataCols}</option>
          );
        }

      });
  }
  /* For TextAREA -- Complex Condition Writing */
  renderComplexDataFunctions(){
    let fun = [
      {"funVal":"num_to_word"},
      {"funVal":"list_count"}
    ];
    return fun.map((fun,index) => {
      return(
      <li><a onClick={(event) => this.addToTextArea(fun.funVal+"( )")}>{fun.funVal}</a></li>
    )
    });
  }
    renderComplexDataList(){
    return this.props.narrative.header.map((dataCols,index) => {
      return(
          <li><a onClick={(event) => this.addToTextArea(dataCols)}>{dataCols}</a></li>
      );
    });
  }

  renderComplexOperator(){
      return this.props.operators.map((operator,index) => {
         return(
            <li><a onClick={(event) => this.addToTextArea(operator.operator)}>{operator.operatorName}</a></li>
          );

      });
  }
  renderComplexLogicalOperators(){
    let fun = [
      {"funVal":"and"},
      {"funVal":"or"},
      {"funVal":"not"}
    ];
    return fun.map((funVal,index) => {

        return(
          <li><a onClick={(event) => this.addToTextArea(funVal.funVal)}>{funVal.funVal}</a></li>
      );


    });
  }
  /* Renders all column names in Rule Model Window  as suggestions  */
  renderSuggestions(cond){
      let status = 0;
      return this.props.dataColumns.map((dataCols,index) => {

        if(cond.parameter2===dataCols.column) {
          status = 1;
          return(

            <option selected key={`${dataCols.column}_sugg_${index}`} value={dataCols.column}>{dataCols.column}</option>
          );
        }

        else {
          return(
            <option key={`${dataCols.column}_sugg_${index}`} value={dataCols.column}>{dataCols.column}</option>
          );
        }



      });

  }

  /* Renders the  All Mathematical operator in Rule Model Window */
  renderOperator(cond){
      return this.props.operators.map((operator,index) => {
        if(cond.operator===operator.operator) {
        return(
          <option selected key={`${operator.operator}_oper_${index}`}  value={operator.operator}>{operator.operatorName}</option>
        );
      }
        else{
          return(
            <option key={`${operator.operator}_oper_${index}`}  value={operator.operator}>{operator.operatorName}</option>
            );
          }
      });
  }

  /* Renders the rule model  */
  renderRuleModel(){
    return(
      <div className="col-xs-12 ruleBox fixedBg" id="ruleEditorModel">
        <div className="row fixed" id="ruleEditor">
          <div className="col-xs-12 border title">
            <div className="hideSideBar" id="hideSideBar"  onClick={(event)=>this.closeRuleTab(event)}><span onClick={(event)=>this.closeRuleTab(event)}>X</span></div>
            <h4>Rule Editor</h4>
          </div>
          <div className="col-xs-12 clearAll scrollable">
            <div className=" row clearAll  ruleBlock" id="ruleBlock">
              <span className="selectedBlockType">{this.state.showRuleWindow.type}</span>
                  {this.renderRule()}

            </div>
          </div>
          {/*<!-- footer -->*/}
          <div className="col-xs-12 border title ruleFooter">
            <div className="cmpBlck cancel activated" id = "simpleRuleGen" onClick={(event) => this.resetConditionView('simple')}><span>Simple Rule <span className="glyphicon glyphicon-ok addR" aria-hidden="true"></span></span></div>
            <div className="cmpBlck complex" id = "complexRuleGen" onClick = {(event) => this.resetConditionView('complex')} ><span>Complex Rule<span className="glyphicon glyphicon-edit addR" aria-hidden="true"></span></span></div>
          </div>
          {/*<!-- footer --> */}
        </div>
      </div>
    );
  }

  getConditionSentence(currentIfElse){
    if(currentIfElse.conditionType==='simple'){
        let returnStr  = "";
        let current ="";
         let len = "";
         len = currentIfElse.conditionIf.length;
         current = currentIfElse.conditionIf;
         return current.map((cond,index) => {
          if(len>1){
            if(cond.fun===''){
              return(
                <span>
                  <div className="con">
         						{`(${cond.parameter1} ${cond.operator} ${cond.parameter2})`}
         					</div>
                  <div className="con">
         						{`${cond.cond}`}
         					</div>
              </span>
               );
            }
            else{
              return(
                <span>
                  <div className="con">
         						{`(${cond.fun}(${cond.parameter1}) ${cond.operator} ${cond.parameter2})`}
         					</div>
                  <div className="con">
         						{`${cond.cond}`}
         					</div>
                </span>
               );
            }
          }
          else{
            if(cond.fun===''){
              return(
                <span>
                  <div className="con">
         						{`${cond.parameter1} ${cond.operator} ${cond.parameter2}`}
         					</div>
                </span>
               );
            }
            else{
              return(
                <span>
                  <div className="con">
         						{`${cond.fun}(${cond.parameter1}) ${cond.operator} ${cond.parameter2}`}
         					</div>
                </span>
               );
            }
          }
        })
      }
      else{
        return(
          <span>
            <div className="con">
              {currentIfElse.conditionText}
            </div>
          </span>
        )
      }
  }

  // Editor  Full Screen
    toggleFullScreen(event){
       let sec  = document.getElementById('editorWrapper');
       if(sec){
         if(sec.classList.contains('fullWindow')){
           sec.classList.remove('fullWindow')
         }
         else{
             sec.classList.add('fullWindow')
         }
       }
    }
  removeAllClass(className){
    let cName ="."+className;
    let elems = document.querySelectorAll(cName);
    [].forEach.call(elems, function(el) {
      el.classList.remove(className);
    });
  }
  findCurrentNode(nodeData, limit){

    let node =nodeData.parentNode;

    this.removeAllClass('activeSpan')
    if(nodeData.nodeName==="DIV"){
      nodeData.classList.add("activeSpan");
    }
    else{
      if(node.nodeName=='SPAN')
      {

          this.removeAllClass('activeSpan')
          node.classList.add("activeSpan");


      //  this.findCurrentNode(node,limit);
      }
      else{
        node.classList.add("activeSpan");

      }
   }
  }

  addNewLine(event){
    if(event.keyCode===13){
      var elem = event.target;
      this.addText(event, () => {
      })
      event.preventDefault();
    }
  }
  /* add values to textarea */
  addToTextArea(value){
    let field  = document.getElementById('formControlTextarea');
    this.insertAtCursor(field, value);
  }
  /* Add Text at cursor position inside a text area */
  insertAtCursor(textArea, myValue) {
   //IE support
   if (document.selection) {
        textArea.focus();
       let sel = document.selection.createRange();
       sel.text = myValue;
   }
   //MOZILLA and others
   else if (textArea.selectionStart || textArea.selectionStart == '0') {
     var startPos = textArea.selectionStart;
       var endPos = textArea.selectionEnd;
       textArea.value = textArea.value.substring(0, startPos)
           + myValue
           + textArea.value.substring(endPos, textArea.value.length);
   } else {
       textArea.value += myValue;
   }
   textArea.focus();
}
  /* function to update the cursor position */
  updateCursor(event){
     this.removeAllClass('activeSpan');
     this.removeAllClass('activeDiv');
     let ofs =0;
     if (window.getSelection && window.getSelection().getRangeAt) {
       var range = window.getSelection().getRangeAt(0);
       //let parent = range.commonAncestorContainer.parentNode.classList.add("activeDiv");
       let limit = true;
       var currentNode = this.findCurrentNode(range.commonAncestorContainer, limit);
       var selectedObj = window.getSelection();
       var rangeCount = 0;
       var childNodes = selectedObj.anchorNode.parentNode.childNodes;
       for (var i = 0; i < childNodes.length; i++) {

         if (childNodes[i] == selectedObj.anchorNode) {
            ofs = range.startOffset;
            if ((childNodes[i].parentNode.nodeName==='SPAN')&& (childNodes[i].parentNode.childNodes.length<=1))
            {
                 this.removeAllClass('activeSpan');

                 let clsName  = childNodes[i].parentNode.className;
                 let cls = clsName.match(/clickedSpan/g);
                 let para = clsName.match(/para/g);
                 if(cls!==null)
                 {
                    if(para!==null){
                      childNodes[i].parentNode.setAttribute('class', 'para clickedSpan activeSpan');
                    }
                    else{
                      childNodes[i].parentNode.setAttribute('class', 'clickedSpan activeSpan');
                    }

                 }
                 else if((cls==null) && (para!==null)){
                   childNodes[i].parentNode.setAttribute('class', 'para activeSpan');
                 }
                 else{
                   childNodes[i].parentNode.setAttribute('class', 'activeSpan');
                 }
            }
            else if ((childNodes[i].parentNode.nodeName==='I')&& (childNodes[i].parentNode.childNodes.length<=1))
            {
              childNodes[i].parentNode.setAttribute('class', 'para activeSpan')
            }
            else{
              if(childNodes[i].nodeType===3){
              console.log(" childNodes[i].parentNode", childNodes[i].parentNode);
              console.log(" childNodes[i].child", childNodes[i].nodeType);
              let def = true;
              this.removeAllClass('activeSpan');
               var spanNode = document.createElement('i');
               spanNode.setAttribute('class', 'para activeSpan');
               var newTextNode = document.createTextNode(childNodes[i].textContent);
               let nextChilds  = childNodes[i].childNodes;
               if(nextChilds.length>0){
                 let nextChild = nextChilds[0]
                 let nextChildName = nextChild.nodeName;
                 if(nextChildName==="BR"){
                   def = false;
                 }
               }
               if(def){
                 console.log("BRBRBRBR", childNodes[i].childNodes)
                 spanNode.appendChild(newTextNode);
                childNodes[i].parentNode.replaceChild(spanNode, childNodes[i]);
               }
               else{
                 //
               }
             }
             }
           break;
         }


         else{
          if (childNodes[i].nodeType == 3) {
             rangeCount += childNodes[i].textContent.length;
           }
          else if (childNodes[i].outerHTML)
           {

             rangeCount += childNodes[i].outerHTML.length;
           }

           else if(childNodes[i].innerHTML){

            rangeCount += childNodes[i].innerHTML.length;
           }
           else{

             rangeCount += childNodes[i].textContent.length;

           }
        }
       }
       //this.setState({cursor:(range.startOffset + rangeCount)});
       console.log("OFFSET", ofs);
       return ofs;
     }
   }

   /* add the column value at the cursor position */
    addColumnValue(columnValue, type){

      let element = '';
       element  = document.getElementsByClassName('activeSpan');
       if(element.length>0){
        let originalContent  =element[0].innerHTML;
        if(originalContent==="<br>"){
          originalContent = "<span></span>";
        }
        let cur = this.state.cursor;
        var node = document.createElement("span");
        node.className = "clickedSpan";
        node.setAttribute("contenteditable","false")
        if(type==="functionName"){
          node.setAttribute("contenteditable","true")
          node.innerHTML = columnValue+"()";
        }
        else{
          node.innerHTML = columnValue;
        }
        //this.setState({cursor:cur+insertText.length});
        // if(document.getElementsByClassName('activeSpan').length>0){
        //   let ele = document.getElementsByClassName('activeSpan');
        //   // var node = document.createElement("span");
        //   // node.className = "clickedSpan";
        //   // node.setAttribute("contenteditable","false")
        //   // node.innerHTML = columnValue;
        //   ele = ele[0];
        //   ele.parentNode.insertBefore(node, ele.nextSibling);
        //     //ele.append(node);
        // }
       // else{
       let len = node.outerHTML.length;

          let front = originalContent.substring(0,cur);

          let back = originalContent.substring(cur);

          let content = front+" "+ node.outerHTML +" "+back;

          element[0].innerHTML = content;



      }
    }

    getTextInDivFormat(text){

    if(typeof text !== 'undefined'){
      if(text!=''){
       console.log("H---------", text);
       let textSplit = text.split("\\n");
       let content = '';
        textSplit.map((line,index) => {
         if(line === ""){
          // let div = "<div><br /></div>"
           //content += div;
          }else{

            line = line.replace(/\[\[/g,'<span class="clickedSpan activeSpan" contenteditable="PLAINTEXT-ONLY">')
            line = line.replace(/\]\]/g,'</span>')
            line = "<div>"+line+"</div>"
            content += line
          }
       })
       console.log("MY CONTENT--------------",content)
       return content;
     }

    }else{
      let div = "<div>mc</div>"
       return div;
     }
   }
preventDefault(event){
  event.preventDefault();
  return false;
}
  renderIfBlock(currentIfElse,block){
      let allowEdit = "PLAINTEXT-ONLY";
      let allowEditElse = "PLAINTEXT-ONLY";
      /* for if and else if */
      if(currentIfElse.hasOwnProperty('ifElseBlock')){
        allowEdit ="false"
      }
      /* for else */
      if(currentIfElse.hasOwnProperty('elseBlock')){
        allowEditElse = "false";
      }
      return(
        <div key={currentIfElse.id}>
          <div key={`${currentIfElse.id}_${block}prev`} id={`${currentIfElse.id}_${block}prev`} contentEditable="false" suppressContentEditableWarning="true" data-text="" className="commonDiv textBox edit emptyDiv empty" onClick={(event) => this.onIfSectionPartClick({event:event})} onBlur={(event) =>this.addText(event)}>
            <EditorRenderText text = {this.getTextInDivFormat(currentIfElse.prevText)} />
          </div>
          <div key={`${currentIfElse.id}_if`} id={`${currentIfElse.id}_if`} className="condtion if"  contentEditable="false" suppressContentEditableWarning="true" data-conditionType ="if" >
            <div key={`${currentIfElse.id}_cond`} id={`${currentIfElse.id}_cond`} className="conIF"contentEditable="false"  suppressContentEditableWarning="true" data-condType="if" onClick={(event)=> this.onIfConditionClick({event:event},{current:currentIfElse.conditionType} )}>If</div>
            <div key={`${currentIfElse.id}_condBlock`} id={`${currentIfElse.id}_condBlock`} className="conStatement" suppressContentEditableWarning="true" contentEditable="false">
              {this.getConditionSentence(currentIfElse)}
            </div>
            <span className="removeCond" contentEditable="false" suppressContentEditableWarning="true">X</span>
            <div key={`${currentIfElse.id}_if_text`} id={`${currentIfElse.id}_if_text`}  className="commonDiv  emptyDiv textBox"  suppressContentEditableWarning="true" contentEditable={allowEdit}   onClick={(event) => this.onIfSectionPartClick({event:event})} onBlur={(event) =>this.addText(event)}>
              {//this.getTextInDivFormat(currentIfElse.text)
              }
              {(() => {
                if(currentIfElse.hasOwnProperty('ifElseBlock')){

                }
                else{
                  return(  <EditorRenderText text = {this.getTextInDivFormat(currentIfElse.text)}  />)
                }

                if(currentIfElse.hasOwnProperty('ifElseBlock')) {
                  return currentIfElse.ifElseBlock.map((currentIfElse1, index) => {
                    return(<div   data-text="" className="commonDiv edit emptyDiv" onClick={(event) => this.getSectionId(event)}>
                              {this.renderIfBlock(currentIfElse1,"ifElseBlock")}
                          </div>
                    )
                  });
                }
              })()}
            </div>
          </div>
          {(() => {
            if(currentIfElse.hasOwnProperty('elseIfBlock')){
              return currentIfElse.elseIfBlock.map((elseIfBlock, index) => {
                return(
                    <div key={`${elseIfBlock.id}_elseif`} id={`${elseIfBlock.id}_elseif`} className="condtion else"  data-conditionType ="if" contentEditable="false" suppressContentEditableWarning="true">
                      <div key={`${elseIfBlock.id}_cond`} id={`${elseIfBlock.id}_cond`} contentEditable="false" suppressContentEditableWarning="true" className="conIF" data-condType="elIf" onClick={(event)=> this.onIfConditionClick({event:event}, {'current':elseIfBlock.conditionType})}>ElIf</div>
                      <div key={`${elseIfBlock.id}_condBlock`} id={`${elseIfBlock.id}_condBlock`} contentEditable="false" suppressContentEditableWarning="true" className="conStatement">
                        {this.getConditionSentence(elseIfBlock)}
                      </div>
                      <span className="removeCond" contentEditable="false" suppressContentEditableWarning="true">X</span>
                      <div key={`${elseIfBlock.id}_elseif_text`} id={`${elseIfBlock.id}_elseif_text`} className="commonDiv  emptyDiv textBox"  contentEditable='false' suppressContentEditableWarning="true"  onClick={(event) => this.onIfSectionPartClick({event:event})} onBlur={(event) =>this.addText(event)} data-text="Condtional text">
                        {(() => {
                          if(elseIfBlock.hasOwnProperty('ifElseBlock')){

                          }
                          else{
                            return(  <EditorRenderText text = {this.getTextInDivFormat(elseIfBlock.elseIfText)} />)
                          }

                          if(elseIfBlock.hasOwnProperty('ifElseBlock')) {
                            return elseIfBlock.ifElseBlock.map((elseIfBlock1, index) => {
                              return(<div  contentEditable={allowEdit} data-text="" className="commonDiv edit emptyDiv"   onClick={(event) => this.getSectionId(event)}>
                                        {this.renderIfBlock(elseIfBlock1,"ifElseBlock")}
                                    </div>
                              )
                            });
                          }
                        })()}
                      </div>
                    </div>
                );
              });
            }
          })()}
          <div key={`${currentIfElse.id}_else`} id={`${currentIfElse.id}_else`} className="condtion else"  data-conditionType ="else" contentEditable="false" suppressContentEditableWarning="true">
            <div className="conIF" contentEditable="false" suppressContentEditableWarning="true" onClick={(event)=>this.preventDefault(event)}>Else</div>
            <div className="conStatement" contentEditable="false" suppressContentEditableWarning="true">
            </div>
            <span className="removeCond" contentEditable="false" suppressContentEditableWarning="true">X</span>
            <div key={`${currentIfElse.id}_else_text`} id={`${currentIfElse.id}_else_text`} className="commonDiv edit  emptyDiv textBox" contentEditable='false'  suppressContentEditableWarning="true" onClick={(event) => this.onIfSectionPartClick({event:event})} onBlur={(event) =>this.addText(event)} data-text="Condtional text" >
              {//this.getTextInDivFormat(currentIfElse.elseText)
              }
              {(() => {
                if(currentIfElse.hasOwnProperty('elseBlock')){

                }
                else{
                  return(  <EditorRenderText text = {this.getTextInDivFormat(currentIfElse.elseText)} />)
                }

                if(currentIfElse.hasOwnProperty('elseBlock')) {
                  return currentIfElse.elseBlock.map((currentIfElse1, index) => {
                    return(<div  contentEditable={allowEditElse} suppressContentEditableWarning="true" data-text="" className="commonDiv edit emptyDiv"   onClick={(event) => this.getSectionId(event)}>
                              {this.renderIfBlock(currentIfElse1,"elseBlock")}
                          </div>
                    )
                  });
                }
              })()}
            </div>
          </div>
          <div key={`${currentIfElse.id}_${block}next`} id={`${currentIfElse.id}_${block}next`} onClick={(event) => this.onIfSectionPartClick({event:event})} onBlur={(event) =>this.addText(event)} contentEditable="PLAINTEXT-ONLY" suppressContentEditableWarning="true"  data-text="" className="commonDiv textBox edit emptyDiv empty">
            {//this.getTextInDivFormat(currentIfElse.nextText)
            }
              <EditorRenderText text = {this.getTextInDivFormat(currentIfElse.nextText)} />


          </div>
        </div>
        );
  }


  renderTitleBar(){
    return this.state.editorData.map((currentSection,index) => {
      let allowEdit = "true";
      if(currentSection.hasOwnProperty('ifElseBlock')){
        allowEdit ="false"
      }
      return(
        <div className="contSec contentTitle"  id={currentSection.id} data-text="Tab Title">
          <div className="col-xs-12 titleBg">
              <span className="titleArr"><i className="fa fa-angle-double-right"></i></span>
              <div id={`${currentSection.id}_title`} key={`${currentSection.id}_title`} data-text="Tab Title" contentEditable="PLAINTEXT-ONLY" suppressContentEditableWarning="true" className="edit titleText nj" onBlur ={(event) => this.editTitleTag(event)}>{currentSection.title}</div>
              <div className="deleteSec" onClick={(event)=>this.removeSection(currentSection.id)}><i className="fa fa-trash-o" aria-hidden="true"></i></div>
          </div>
          <div  contentEditable='false' suppressContentEditableWarning="true" data-text="" id={`${currentSection.id}_section_text`} key={`${currentSection.id}_section_text`} className="commonDiv edit emptyDiv" onBlur={(event) =>this.addText(event)} onClick={(event) => this.getSectionId(event)}>
            {(() => {
              if(currentSection.hasOwnProperty('ifElseBlock')){}
              else{
                return(  <EditorRenderText  text = {this.getTextInDivFormat(currentSection.text)} />)
              }

              if(currentSection.hasOwnProperty('ifElseBlock')){
              return currentSection.ifElseBlock.map((currentifElse, index) => {
                  return(
                    this.renderIfBlock(currentifElse,"ifElseBlock")
                  );
                });
              }
            })()}

          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div class="col-xs12">
      <div className="container-fluid clear wrapper" id="editor">
        <div className="row cPaddingBottom hidden">
          <div className="col-xs-12  col-sm-12 col-md-12 winSetup">
            <div className="row headingTop">
              <div className="col-xs-12">
                <span>Editor Module</span>
                <span className="desc">Makes life easier</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row wordEditor">
          { /* <!-- header section start --> */}
          <div className="col-xs-12 header disabled" id="headerBar">
            <ul className="item">
              <li className="list">
                <div className="link" id="addSection" onClick={(event)=>this.addSection(event)} >
                <i className="fa fa-plus-circle "></i>	Add new
                </div>
              </li>
              <li className="list">
                <div className="link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Column  <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
                </div>
                <ul className="dropdown-menu">
                  <li><a>Select</a></li>
                  {this.renderDataColumns()}
                </ul>
              </li>
              <li className="list">
                <div className="link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Function  <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span>
                </div>
                <ul className="dropdown-menu">
                  <li><a>Select</a></li>
                  {this.renderDataFunctions()}
                </ul>
              </li>
              <li className="list">
                <div className="link" onClick={() => this.addIfElseBlock()}>
                  <i className="fa fa-code"></i> If-Else
                </div>
              </li>
              <li className="list">
                <div className="link" onClick={() => this.addElseIfBlock()}>
                  <i className="fa fa-code"></i> Else If
                </div>
              </li>
              <li className="list">
                <div className="link fullScreen" onClick={(event)=>this.toggleFullScreen(event)}>
                <i className="fa fa-arrows-alt fullScreen hover"></i>
                </div>
              </li>
            </ul>
          </div>
          {/* <!-- Header section ends --> */}
           <div className="col-xs-12 editorArea">
             <div className="editorContent">
             {/*<!-- editable section start -->*/}
            { this.renderTitleBar()}
            {/*<!-- editable section ends -->*/}
             </div>
          </div>
          {/*  Rule Editor Model start */}
          {this.renderRuleModel()}
          {/*  Rule Editor Model start */}
        </div>
      </div>
      <div className="col-xs-12 clear paddTop" style={{"padding-left":"0px"}}>
        <button className="mbtn btnType-save alignLeft" id="save-preview2" style={{'float':'left'}} onClick={() => this.saveTemplate()}><span className="btnLabel"> Save </span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
      </div>
    </div>
  );
  }
}




function mapStateToProps(state) {
  return {
    selections: state.globalSelection,
    mathFunctions: state.mathFunctions,
    dataColumns: state.dataColumns,
    operators:state.operators,
    narrative: state.narrative,
    mapping:state.mapping
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({modifyRule:modifyRule, addRule:addRule, featureNarrative:featureNarrative }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Editor);
