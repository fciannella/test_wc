import React, { Component } from 'react';
import { connect } from "react-redux";


class test extends Component {




  render() {

    return (
    <div className="helperContent">


        <div className="col-xs-12 col-sm-3">
        <aside className="leftsidepane" id="index">
          <nav>
            {/*a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a*/}
            <a className="intralink" href="#Introduction">1.Introduction</a>
            <a className="intralink" href="#Creating an Account">2.Creating an Account</a>
            <a className="intralink" href="#Creating a Campaign">3.Creating a Campaign</a>
            <a className="intralink" href="#Selecting a Motion">4.Selecting a Motion</a>
            <a className="intralink" href="#Adding Data">5.Adding Data</a>
            <a className="intralink" href="#Creating a Persona">6.Creating a Persona</a>
            <a className="intralink" href="#Creating a Feature">7.Creating a Feature</a>
            <a className="intralink" href="#Generating a Narrative">8.Creating a Narrative</a>
            <a className="intralink" href="#Inserting Variables">9.Inserting Variables</a>
            <a className="intralink" href="#Previewing your content">10.Previewing your content</a>
            <a className="intralink" href="#Inserting Functions">11.Inserting Functions</a>
            <a className="intralink" href="#Inserting Conditionals">12.Inserting Conditionals</a>
            <a className="intralink" href="#Inserting Synonyms">13.Inserting Synonyms</a>
            <a className="intralink" href="#Creating Complex Narratives">14.Creating Complex Narratives</a>
            <a className="intralink" href="#Creating Content in Other Languages">15.Creating Narratives in Other Languages</a>
            <a className="intralink" href="#Exporting Narratives">16.Exporting Narratives</a>
          </nav>
        </aside>
        </div>
        <div className="col-xs-12 col-sm-9 marginTop">
        <header className="title">
          <h1 id="mainheading">Getting Started with WordCraft</h1>
        </header>
        <section className="contents">
          <h3 className="topic" id="Introduction">1. Introduction:</h3>
          <p>Welcome to Cisco's very own Dynamic Content Generation platform, Wordcraft, which helps generate insightful narratives from data. Wordcraft is a self-serve NLG platform. </p>
          <p>The data science component will segment customers based on their demographic and behavioural charectersitics into personas. These personas, which are data driven, will help the content writer customize the narratives based on the targeted segment.</p>
          <p style={{fontSize: 15, fontStyle: 'oblique'}}>Please note that advanced NLG features and the datascience components are under development. As of this update, the platform relies on the content writer to come up with the relevant personas and assign rules which define them.</p>
          <h3 className="topic" id="Creating an Account">2. Creating an Account:</h3>
          <h3 />
          <p />
          <h3 className="topic" id="Creating a Campaign">3. Creating a Campaign:</h3>
          <p>When you first logon to Wordcraft, you will see the Editor dashboard with some pre-existing campaigns like the "LCA Report Card". </p>
          <img src={require('../Help/HelpManual_Images/Creating_a_Campaign.JPG')} alt="Creating a Campaign" className="screenshot" />
          <p>You can create a new campaign from the left pane by typing in the desired campaign name and clicking on the plus sign next to it. You can now select this campaign from the left pane.</p>
          <img src={require('../Help/HelpManual_Images/Creating_a_Campaign.JPG')} alt="Creating a Campaign" className="screenshot" />
          <h3 className="topic" id="Selecting a Motion">4.Selecting a Motion:</h3>
          <p>Now that you have successfully created a campaign, you must have noticed the 4 tabs to the right. e.g. "Welcome", "Adopt". These are the lifecycle stages of a campaign. Let us call them "Motions" to be consistent with Cisco nomenclature. You can select the motion relevant to the narrative you wish to create by selecting the tab.</p>
          <p>Some of the lifecycle stages widely recognized:</p>
          <p />Welcome:<p />
          <p>Acknowledge the customer transaction by confirming purchase information, while explaining benefits and providing resources such as a getting started checklist and support user guide.</p>
          <p>Adopt</p>
          <p>Help customers see value in their recent investment by promoting usage and sharing information about benefits, best practices, and tips/tricks.</p>
          <p>Expand</p>
          <p>Demonstrate commitment to a customer’s business objectives by suggesting complementary solutions.</p>
          <p>Renew</p>
          <p>Start the renewal conversation prior to service and software expiration by providing renewal recommendations.</p>
          <h3 className="topic" id="Adding Data">5.Adding Data:</h3>
          <p />
          <h3 className="topic" id="Creating a Persona">6.Creating a Persona:</h3>
          <p>Persona is a segment of the target base with similar behavioural charecteristics. After selecting a campaign and a motion, you can create a persona by typing in the required persona name and clicking the "Add Persona" button.</p>
          <p>You can define the persona rules by editing the Persona.</p>
          <h3 className="topic" id="Creating a Feature">7.Creating a Feature:</h3>
          <p>Features are snippets of narrative created for the persona. After defining a persona, which is a segment of your data, you can then select the Persona and create a feature for it by typing in the desired feature name and clicking add feature.</p>
          <h3 className="topic" id="Generating a Narrative">8.Creating a Narrative:</h3>
          <p>Once you create the feature, you can select it and create content for it in the editor pane. When you hit "Save And Preview", you can see the narrative generated in the "Preview" window.</p>
          <h3 className="topic" id="Inserting Variables">9.Inserting Variables:</h3>
          <p>You can insert variables into the narrative by enclosing them in double square brackets. Variable refers to the column name of the input dataset.</p>
          <p>When the narrative is generated from the template, the variable gets resolved to the data.</p>
          <p>tip: Any logic you insert into the narrative is enclosed in double square brackets "[[]]"</p>
          <h3 className="topic" id="Previewing your content">10.Previewing your content:</h3>
          <p>You can preview the generated content in the "Preview" window when you click "Submit" or "Save And Preview".</p>
          <h3 className="topic" id="Inserting Functions">11.Inserting Functions:</h3>
          <p>You can insert a function by calling it and enclosing it in double square brackets. e.g. [[word_to_num()]]</p>
          <p>tip:Please see the list of available functions which might be useful while writing a narrative.</p>
          <h3 className="topic" id="Inserting Conditionals">12.Inserting Conditionals:</h3>
          <p>You can insert conditionals or branches by using the if-else logic. e.g. [[if(closure_rate &gt; 100){'{'}Your closure rate is impressive.{'}'}elseif(closure_rate &lt;= 100 and closure_rate &gt; 50){'{'}Good job closing more than 50% of your opportunities.{'}'}else(){'{'}Let's work on improving your closure rate{'}'}]]</p>
          <h3 className="topic" id="Inserting Synonyms">13.Inserting Synonyms:</h3>
          <p>Synonyms are words having the same or nearly the same meaning as another. Here we expand the meaning to phrases and not just words. The "synonym" function we use chooses one of the phrases or sentences provided to it at random. This helps create variation in the narrative. e.g. [[synonym(){'{'}Hi.{'}'}{'{'}Hello.{'}'}{'{'}Hey!{'}'}]]</p>
          <h3 className="topic" id="Creating Complex Narratives">14.Creating Complex Narratives:</h3>
          <p>Complex narratives can be created by inserting a combination of variables, functions, conditionals and synonyms. This can help create natural sounding content rich in variance.</p>
          <p>e.g. [[if(closure_rate &gt; 100){'{'}Your closure rate is [[synonym(){'{'}an impressive{'}'}{'{'}an astounding{'}'}{'{'}a formidable{'}'}]] [[closure_rate]]%.{'}'}elseif(closure_rate &lt;= 100 and closure_rate &gt; 50){'{'}[[synonym(){'{'}Good{'}'}{'{'}Nice{'}'}]] job closing more than 50% of your opportunities.{'}'}else(){'{'}Let's work on improving your closure rate{'}'}]]</p>
          <h3 className="topic" id="Creating Content in Other Languages">15.Creating Narratives in Other Languages:</h3>
          <p>Wordcraft supports many popular languages like English, German, Japanese and Chinese. However, the advanced NLG features relevant to English might not be available when creating content in other languages.</p>
          <p>tip: Please let us know if you face any issues when writing content in languages other than English.</p>
          <h3 className="topic" id="Exporting Narratives">16.Exporting Narratives:</h3>
          <p />
        </section>
        <section className="functionlist">
          <h3 className="topic" id="List of functions available">List of functions available:</h3>
          <p>if()</p>
          <p>elseif()</p>
          <p>else()</p>
          <p>synonym():     Selects a random phrase from the provided list.</p>
          <p>num_to_word():   Converts a number less than 10 to word. e.g. num_to_word(1) = one</p>
          <p>num_to_word_ordinal():     Converts a number to its ordinal. e.g. num_to_word_ordinal(3) = third</p>
        </section>
        </div>
      </div>

    )
  }
}


export default connect()(test);
