import getpass
import os
import platform
import pprint
import json

from flask import Blueprint, request, jsonify, Response

from wordcraftapp.api.narrative import GenerateNarrative, GenerateTemplate
from wordcraftapp.extentions import mysql

api = Blueprint ('api', __name__)


# Validate the campaignid from API request. Not being utilized right now.
def valid_campaign(cid):
    cur = mysql.connection.cursor ()
    cur.execute ("SELECT segment_id FROM segment")
    cidlist = list (sum (cur.fetchall (), ()))
    if cid in cidlist:
        return True
    else:
        return False

# Input data check. Returns 0 if all necessary data has been provided.
def InputDataCheck(data):
    try:
        if not(isinstance(data, dict)):
            return 21
        
        # Check if input data contains all columns needed for narrative resolution
        # CheckCompleteness(data)
        # For now, the check just ensures that the length of dict is > 2
        if len(data) <= 2:
            # If the input data is incomplete but an identifier like party_id or email_id, data sourcing needs to happen instead.
            return 1
        
        return 0
        
    except Exception as e:
        err_msg = e.__str__ ()
        return 20

# Function to format output in the desired style
def format_output(chid, ofid, content):
    
    if ofid == 25:
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Cisco Channel/output_format/amp.json'
        else:
            file = './data/Cisco Channel/output_format/amp.json'
    else:
        return jsonify(content)
    
    with open(file) as data_file:
        amp_data = json.load(data_file)

    # Mapping WC output to cisco.com AMP format
    # Future optimization: lable determines the content irrespective of the phase. See "AMP for Endpoints Console"
    #   If the label is the same as WC tags, association becomes easy.
    for ph in amp_data["customerProductInfo"]["carousal"]:
        for ph_dict in ph:
            if ph_dict["phase"] == 1 and ph_dict["label"] == "Get Started":
                ph_dict["description"] = content["phase1_get_started"]
            elif ph_dict["phase"] == 1 and ph_dict["label"] == "Get your Deployment Strategy Guide":
                ph_dict["description"] = content["phase1_get_your_deployment_strategy_guide"]
            elif ph_dict["phase"] == 1 and ph_dict["label"] == "AMP for Endpoints Console":
                ph_dict["description"] = content["phase1_amp_for_endpoints_console"]
            elif ph_dict["phase"] == 2 and ph_dict["label"] == "Get your Deployment Strategy Guide":
                ph_dict["description"] = content["phase2_get_your_deployment_strategy_guide"]
            elif ph_dict["phase"] == 2 and ph_dict["label"] == "AMP for Endpoints Console":
                ph_dict["description"] = content["phase2_amp_for_endpoints_console"]
            elif ph_dict["phase"] == 3 and ph_dict["label"] == "Enroll in AMP training":
                ph_dict["description"] = content["phase3_enroll_in_amp_training"]
            elif ph_dict["phase"] == 3 and ph_dict["label"] == "AMP for Endpoints Console":
                ph_dict["description"] = content["phase3_amp_for_endpoints_console"]
            elif ph_dict["phase"] == 4 and ph_dict["label"] == "Enable Cognitive Threat Analytics":
                ph_dict["description"] = content["phase4_enable_cognitive_threat_analytics"]
            elif ph_dict["phase"] == 4 and ph_dict["label"] == "AMP for Endpoints Console":
                ph_dict["description"] = content["phase4_amp_for_endpoints_console"]
            elif ph_dict["phase"] == 5 and ph_dict["label"] == "Watch feature demos":
                ph_dict["description"] = content["phase5_watch_feature_demos"]
            elif ph_dict["phase"] == 5 and ph_dict["label"] == "AMP for Endpoints Console":
                ph_dict["description"] = content["phase5_amp_for_endpoints_console"]

    if content["phase"] is not None and 1 <= int(content["phase"]) <= 5:
        amp_data["customerProductInfo"]["navigationLinks"] = amp_data["customerProductInfo"]["carousal"][int(content["phase"]) - 1]
    else:
        amp_data["navigationLinks"] = []
    
    #print(carousal_data)
    return amp_data #jsonify(carousal_data)
        
# Test handle. Returns OK
@api.route ('/', methods=['GET', 'POST'])
def test():
    return 'OK'


# "who am I" handle returns the user credentials from sso.
# This needs to be integrated with user management and authorization.
@api.route ('/whoami', methods=['GET', 'POST'])
def whoami():
    sso = 0
    if "HTTP_AUTH_USER" in request.environ:
        res = request.environ['HTTP_AUTH_USER']
        email = res + '@cisco.com'
        sso = 1
    else:
        res = getpass.getuser ()
        email = res + '@' + platform.node ()

    return jsonify ({'username': res, 'email': email, 'sso': sso})


# Returns the LAE environment variable details including the SQL container credentials.
# Lack of a debugger means we need methods like these.
@api.route ('/env', methods=['GET', 'POST'])
def env():
    str = pprint.pformat (request.environ, depth=5)
    return Response (str, mimetype="text/text")


# Handle to provide content using API calls. Needs further validations put in.
@api.route ('/bycampaign', methods=['GET', 'POST'])
def bycampaign():
    msg = ''
    err = False
    try:
        if 'campaignid' in request.args:
            cid = request.args['campaignid']
        else:
            msg = msg + 'Campaign ID not found in request'
            err = True

        d = request.get_json (force=True)
        data = d['data']
        data = {k.lower (): v for k, v in data.items ()}
    except Exception as e:
        err = True
        msg = msg + e.__str__ ()

    if (err):
        return jsonify ({'error': msg})
    else:
        s = GenerateNarrative (None, None, varList = list(data.keys()))
        res = s.GenNarrTag (CampaignID=int (cid), data=data)
        return jsonify (res)


# Returns the current working directory from which the process is running.
@api.route ('/cwd', methods=['GET', 'POST'])
def cwd():
    return jsonify ({'cwd': os.getcwd ()})


# Handle to provide content using API calls. Needs further validations put in.
@api.route ('/template', methods=['GET', 'POST'])
def template():
    msg = ''
    err = False
    try:
        if 'campaignid' in request.args:
            cid = request.args['campaignid']
        else:
            msg = msg + 'Campaign ID not found in request'
            err = True

    except Exception as e:
        err = True
        msg = msg + e.__str__ ()

    if (err):
        return jsonify ({'error': msg})
    else:
        s = GenerateTemplate()
        res = s.GenTemplate (CampaignID=int (cid))
        #print(res)
        return jsonify (res)
        
@api.route ('/bytemplate', methods=['GET', 'POST'])
def bytemplate():
    msg = ''
    err = False
    try:
        if 'campaignid' in request.args:
            cid = request.args['campaignid']
        else:
            msg = msg + 'Campaign ID not found in request'
            err = True

        d = request.get_json (force=True)
        data = d['data']
        for record in range(0, len(data)):
            data[record] = {k.lower (): v for k, v in data[record].items ()}
        #data = {k.lower (): v for k, v in data.items ()}
        content = d['content']
    except Exception as e:
        err = True
        msg = msg + e.__str__ ()

    if (err):
        return jsonify ({'error': msg})
    else:
        s = GenerateNarrative (None, None, varList = list(data[0].keys()))
        res = s.ResolveTagDict (data, content)
        #print(res)
        # jsonify can only handle dictionaries and not lists
        return jsonify (res)
        
@api.route ('/bytemplatenew', methods=['GET', 'POST'])
def bytemplatenew():
    msg = ''
    err = False
    try:
        cid = -1
        if 'campaignid' in request.args:
            cid = request.args['campaignid']
        else:
            msg = msg + 'Campaign ID not found in request'
            err = True

        d = request.get_json (force=True)
        data = d['data']
        for record in range(0, len(data)):
            data[record] = {k.lower (): v for k, v in data[record].items ()}
        #data = {k.lower (): v for k, v in data.items ()}
        #content = d['content']
    except Exception as e:
        err = True
        msg = msg + e.__str__ ()

    if (err):
        return jsonify ({'error': msg})
    else:
        s = GenerateNarrative (None, None, varList = list(data[0].keys()))
        s.GetTemplate(CampaignID=int (cid))
        res = s.ResolveTagDictNew (data)
        #print(res)
        # jsonify can only handle dictionaries and not lists
        return jsonify (res)
        
# Handle to provide content for any channel using API calls. 
# Needs further validations put in.
# Check if input data is complete. If not, use a function to source the data.
# Check if a specific output format is desired. If so, use a function to provide the right output format.
# Sample API call: http://wordcraftx-devs.cloudapps.cisco.com/api/content?channelid=1&offerid=2

@api.route ('/content', methods=['GET', 'POST'])
def content():
    msg = ''
    err = False
    try:
        # channelid refers to the channel. email = 1, cisco.com = 2
        if 'channelid' in request.args:
            chid = int(request.args['channelid'])
        else:
            msg = msg + 'Channel ID not found in request'
            err = True
        
        # offerid refers to the campaignid for emails and an equivalent for cisco.com
        if 'offerid' in request.args:
            ofid = int(request.args['offerid'])
        else:
            msg = msg + 'Offer ID not found in request'
            err = True
        
        # Check if html email required. Temporary placeholder html
        if 'html' in request.args:
            htmlid = int(request.args['html'])
            if htmlid == 1:
                if "OPENSHIFT_APP_UUID" in os.environ:
                    file = './app-root/repo/data/Digital Revolution - Ransomware/template/Cisco_Ransomware_with_Tags.html'
                    html_file = open(file, 'r', encoding='utf-8')
                    html_code = html_file.read() 
                    return html_code
                else:
                    file = './data/Digital Revolution - Ransomware/template/Cisco_Ransomware_with_Tags.html'
                    html_file = open(file, 'r', encoding='utf-8')
                    html_code = html_file.read() 
                    return html_code

        d = request.get_json (force=True)
        data = d['data']
        data = {k.lower (): v for k, v in data.items ()}
    except Exception as e:
        err = True
        msg = msg + e.__str__ ()
        return jsonify ({'error': msg})

    # Input data check and output format check required before responding.
    
    # Input data check
    data_sourcing_needed = InputDataCheck(data)
    if data_sourcing_needed != 0:
        # sourceData(data)
        return jsonify ({'error': 'Discrepancies found in input data'})
        
    s = GenerateNarrative (None, None, varList = list(data.keys()))
    res = s.GenNarrTag (CampaignID=int (ofid), data=data)
    
    # Output format check
    # As of now, check if the channel is different from email. If so, format the output.
    if chid == 2:    
        res = format_output(chid, ofid, res)
        return json.dumps(res)

    return jsonify (res)
