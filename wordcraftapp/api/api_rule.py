from flask import request
from flask_restful import Resource
import re

from wordcraftapp.extentions import mysql

from wordcraftapp.api.mylogging import configure_logger
from wordcraftapp.api.api_rule_parser import jsonToRule  


logger = configure_logger('default')


# class getpersonarule(Resource):
#     def post(self):
#         content = request.get_json()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname = content['persona']
#         #print(content)

#         cur = mysql.connect().cursor()

#         cur.execute(
#             "SELECT e.persona_rule from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on b.motion_motion_id=c.motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on d.persona_persona_id=e.persona_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "' AND c.motion_name='" + motionname + "' AND e.persona_name='" + personaname + "'")

#         rv = cur.fetchall()
#         data = {"personaRule": x[0] for x in rv}
#         return data

# Returns the rule for selected features
def query_rule(username, campaignname, features, language):
    cur = mysql.connect ().cursor ()
    feature_str = "'" + "','".join (ite for item in features for ite in item) + "'"
    
    cur.execute (
        "SELECT l.rule from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id join feature g on cf.feature_feature_id=g.feature_id join feature_language_xref fl on g.feature_id=fl.feature_feature_id join language l on fl.language_language_id=l.language_id where u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND g.feature_name IN (" + feature_str + ") AND l.language='" + language + "'")
    rv = cur.fetchall ()
    
    rv = feature_reference(rv, username, campaignname, language)
    
    return rv

# Returns the rule for selected feature given username, campaignname, personaname, featurename and language
# Feature referencing not implemented as it shouldn't show up in template/rule
def query_rule_p_f_no_fr(username, campaignname, personaname, featurename, language):
    cur = mysql.connect ().cursor ()
    cur.execute (
        "SELECT l.rule FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id JOIN feature_language_xref fl ON f.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND p.persona_name='" + personaname + "' AND f.feature_name='" + featurename + "' AND l.language='" + language + "'")
    rv = cur.fetchall ()

    return rv
    
# Returns the rule for selected feature given username, campaignname, personaname, featurename and language
def query_rule_p_f(username, campaignname, personaname, featurename, language):
    cur = mysql.connect ().cursor ()
    cur.execute (
        "SELECT l.rule FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id JOIN feature_language_xref fl ON f.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND p.persona_name='" + personaname + "' AND f.feature_name='" + featurename + "' AND l.language='" + language + "'")
    rv = cur.fetchall ()
    
    rv = feature_reference(rv, username, campaignname, language)
    
    return rv

# Returns the rule for the profile/persona (combination of all feature rules associated with the profile).
# SQL query needs to be reviewed.
def query_rule_p(username, campaignname, personaname, language):
    cur = mysql.connect ().cursor ()
    cur.execute (
        "SELECT l.rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature g ON pf.feature_feature_id=g.feature_id JOIN feature_language_xref fl ON g.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND p.persona_name='" + personaname + "' AND l.language='" + language + "'")
    rv = cur.fetchall ()
        
    rv = feature_reference(rv, username, campaignname, language)
    
    return rv
    
# Returns the persona rule and template for all the profiles/personas and languages (combination of all feature rules associated with the profile).
def query_persona_and_rule(username, campaignname = None, campaignid = None):
    cur = mysql.connect ().cursor ()
    if campaignname == None and campaignid == None:
        logger.error("Neither campaignname nor campaignid provided to query_persona_rule_all")
        return ""
    elif campaignid == None:
        cur.execute (
            "SELECT p.persona_rule, l.language, l.rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature g ON pf.feature_feature_id=g.feature_id JOIN feature_language_xref fl ON g.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND s.campaign_name='" + campaignname + "'")
    else:
        cur.execute (
            "SELECT p.persona_rule, l.language, l.rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature g ON pf.feature_feature_id=g.feature_id JOIN feature_language_xref fl ON g.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND s.campaign_id='" + campaignid + "'")

    rv = cur.fetchall ()
    
    rv = list(rv)
    for index, item in enumerate(rv):
        rv[index] = list(item)
    
    for index1, item in enumerate(rv):
        # feature_reference accepts tuple of tuples as the default argument.
        content_list = [[]]
        content_list[0].append(item[2])
        #print(content_list[0][0])
        rv[index1][2] = feature_reference(content_list, username, campaignname, item[1], campaignid)[0][0]
    
    #print("rv is:", rv)
    return rv

# Returns (Persona Rule, template) tuples for a campaign 
def query_pr_and_rule(username, language, campaignname=None, campaignid=None):
    cur = mysql.connect ().cursor ()
    if campaignname is None and campaignid is None:
        logger.error("Neither campaignname nor campaignid provided to query_persona_rule_all")
        return ""
    elif campaignid is None:
        cur.execute (
            "SELECT p.persona_rule, l.rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature g ON pf.feature_feature_id=g.feature_id JOIN feature_language_xref fl ON g.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND l.language='" + language + "'")
    else:
        cur.execute (
            "SELECT p.persona_rule, l.rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature g ON pf.feature_feature_id=g.feature_id JOIN feature_language_xref fl ON g.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND s.campaign_id='" + campaignid + "' AND l.language='" + language + "'")

    rv = cur.fetchall ()
    
    rv = list(rv)
    for index, item in enumerate(rv):
        rv[index] = list(item)
    
    for index1, item in enumerate(rv):
        # feature_reference accepts tuple of tuples as the default argument.
        content_list = [[]]
        content_list[0].append(item[1])
        #print(content_list[0][0])
        rv[index1][1] = feature_reference(content_list, username, campaignname, language, campaignid)[0][0]
    
    #print("rv is:", rv)
    return rv
    
# Returns the rule for all the features combined.
def query_rule_all(username, campaignname, language):
    cur = mysql.connect ().cursor ()
    cur.execute (
        "SELECT l.rule from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id join feature g on cf.feature_feature_id=g.feature_id join feature_language_xref fl on g.feature_id=fl.feature_feature_id join language l on fl.language_language_id=l.language_id where u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND l.language='" + language + "'")
    rv = cur.fetchall ()
    return rv


# Get the persona rule for specified persona
def query_persona_rule(username, campaignname, personaname):
    cur = mysql.connect ().cursor ()
    cur.execute (
        "SELECT p.persona_rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id  WHERE u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND p.persona_name='" + personaname + "'")
    rv = cur.fetchall ()
    return rv


# Get the list of all persona rules
def query_persona_rule_all(username, campaignname = None, campaignid = None):
    
    cur = mysql.connect ().cursor ()
    
    if campaignname == None and campaignid == None:
        logger.error("Neither campaignname nor campaignid provided to query_persona_rule_all")
        return ""
    elif campaignid == None:
        cur.execute (
        "SELECT p.persona_rule from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_persona_xref cp on s.campaign_id=cp.campaign_campaign_id join persona p on cp.persona_persona_id=p.persona_id  where u.email='" + username + "' AND s.campaign_name='" + campaignname + "'")
    elif campaignname == None:
        cur.execute (
        "SELECT p.persona_rule from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_persona_xref cp on s.campaign_id=cp.campaign_campaign_id join persona p on cp.persona_persona_id=p.persona_id  where u.email='" + username + "' AND s.campaign_id='" + campaignid + "'")
    
    rv = cur.fetchall ()
    return (rv)


# Get the persona name for specified persona rule
def query_persona_name(username, campaignname, personarule):
    cur = mysql.connect ().cursor ()
    cur.execute (
        "SELECT p.persona_name FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_persona_xref cp ON s.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id  WHERE u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND p.persona_rule='" + personarule + "'")
    rv = cur.fetchall ()
    return rv

# WIP
def feature_reference(cur_val, username, campaignname, language, campaignid = None):
    feature_list = []
    feature_str = ''
    for index1, item in enumerate(cur_val):
        for index2, ite in enumerate(item):
            #print("ite", ite)
            #Find all feature references
            feature_list_found = re.findall('\[\[\s?feature\(\s?(.*?)\s?\)\s?\]\]', ite, flags=re.IGNORECASE)
            #insert items in feature_list_found list into feature_list
            feature_list.extend(feature_list_found)
    #print(feature_list)
    if len(feature_list) > 0:
        feature_str += '('
        for feature in feature_list:
            feature_str += "'" + str(feature) + "'"
            feature_str += ','
        feature_str = feature_str[:-1]
        feature_str += ')'
    
        cur = mysql.connect ().cursor ()
        #print("SELECT f.feature_name, l.rule FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_feature_xref cf ON c.campaign_id=cf.campaign_campaign_id JOIN feature f ON cf.feature_feature_id=f.feature_id JOIN feature_language_xref fl ON f.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND f.feature_name IN " + feature_str + " AND l.language='" + language + "'")
        # Get the rule from username, campaignname, featurename. If campaignname not available, use campaignid
        if campaignname == None or not str(campaignname):
            cur.execute (
            "SELECT f.feature_name, l.rule FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_feature_xref cf ON c.campaign_id=cf.campaign_campaign_id JOIN feature f ON cf.feature_feature_id=f.feature_id JOIN feature_language_xref fl ON f.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND c.campaign_id='" + campaignid + "' AND f.feature_name IN " + feature_str + " AND l.language='" + language + "'")
        else:
            cur.execute (
            "SELECT f.feature_name, l.rule FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_feature_xref cf ON c.campaign_id=cf.campaign_campaign_id JOIN feature f ON cf.feature_feature_id=f.feature_id JOIN feature_language_xref fl ON f.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND f.feature_name IN " + feature_str + " AND l.language='" + language + "'")
        rv = cur.fetchall ()
        
        feature_dict = {}
        for item in rv:
            feature_dict[item[0]] = item[1]
            
        #print(feature_dict)
        
        cur_val_list = list(cur_val)
        for index, item in enumerate(cur_val_list):
            cur_val_list[index] = list(item)
        
        for index1, item in enumerate(cur_val_list):
            #print("\n-------------------------------------item[0] = ", item[0], "-------------------------------------\n")
            for key, value in feature_dict.items():
                #Assuming no more than 100 features are referenced in another feature
                cur_val_list[index1][index2] = re.sub('\[\[\s?feature\(\s?(' + key + ')\s?\)\s?\]\]', value, str(item[0]), count = 100, flags=re.IGNORECASE)
            
        # Is this necessary?
        cur_val = tuple(cur_val_list)
        
    return cur_val

# To get rule for a selected feature
class getrule (Resource):
    def post(self):
        logger.info("Getting Rule process is started")

        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]
        features = content['exportFeature']
        language = content['language']


        # Return empty rule if feature list is empty 
        if features == []:
            data={"rule": ""}

        else:
            logger.info("Selecting Rule for Campaign '%s' , Feature %s and Language '%s'",campaignname,features,language)

            cur = mysql.connect ().cursor ()
            feature_str = "'" + "','".join ([a for a in features]) + "'"

            # select rule for features
            cur.execute (
           	 "SELECT l.rule from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id join feature g on cf.feature_feature_id=g.feature_id join feature_language_xref fl on g.feature_id=fl.feature_feature_id join language l on fl.language_language_id=l.language_id where u.email='" + username + "' AND s.campaign_name='" + campaignname + "' AND g.feature_name IN (" + feature_str + ") AND l.language='" + language + "'")

            rv = cur.fetchall()

            # Combining all rules 
            return_str = "\n".join (ite for item in rv for ite in item)
            data = {"rule": return_str}
        logger.info("Getting rule is successfull")

        return data


# class addpersonarule(Resource):
#     def post(self):
#         content = request.get_json()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname = content['persona']
#         personarule = content['personaRule']
#         cur = mysql.connect().cursor()

#         cur.execute(
#             "SELECT e.persona_id from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on b.motion_motion_id=c.motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on d.persona_persona_id=e.persona_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "' AND c.motion_name='" + motionname + "' AND e.persona_name='" + personaname + "'")

#         rv = cur.fetchall()
#         personaid = rv[0]

#         cur.execute("UPDATE persona SET persona_rule=%s where persona_id=%s", (personarule, personaid))
#         mysql.connect().commit()

# Add/Update a rule to a feature
class addrule (Resource):
    def post(self):
        logger.info("Adding rule process started")

        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]
        featurename = content['exportFeature'][0]
        # print(featurename)
        language = content['language']
        rule = content['rule']
        print(content)
        logger.info("Adding rule for Campaign '%s' , Feature '%s' and Language '%s'",campaignname,featurename,language)

        conn = mysql.connect ()

        cur = conn.cursor ()
        print("check",isinstance(rule,list))

        if (isinstance(rule,list)):

            rule = jsonToRule(rule)

        # Getting feature id
        cur.execute (
            "SELECT g.feature_id from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id join feature g on cf.feature_feature_id=g.feature_id where u.email='" + username + "' AND s.campaign_name='" + campaignname + "' and g.feature_name='" + featurename + "'")
        fid = cur.fetchall ()

        # Getting language id
        cur.execute (
            "SELECT l.language_id from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id  join feature g on cf.feature_feature_id=g.feature_id join feature_language_xref fl on g.feature_id=fl.feature_feature_id join language l on fl.language_language_id=l.language_id where u.email='" + username + "' AND s.campaign_name='" + campaignname + "' and g.feature_name='" + featurename + "' AND l.language='" + language + "'")
        rv = cur.fetchall ()
        lids = str (sum (rv, ()))
        # print(rule)

        # If no language and rule present for selected feature inserting rule and language
        if lids == '()':
            cur.execute ("INSERT INTO language(language,rule) VALUES (%s,%s)", (language, rule))
            conn.commit ()
            cur.execute ("SELECT language_id FROM language ORDER BY language_id DESC LIMIT 1")
            lid = cur.fetchall ()
            cur.execute ("INSERT INTO feature_language_xref VALUES(%s,%s)", (fid[0], lid[0]))
            conn.commit ()

        # if language already present then updating the rule
        else:
            print("Updating rule",rule)
            cur.execute ("UPDATE language SET rule=%s where language_id=%s", (rule, rv[0]))
            conn.commit ()
        logger.info("Rule is added")
        return rule

