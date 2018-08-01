from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql

from wordcraftapp.api.mylogging import configure_logger  

logger = configure_logger('default')


# class getfeature (Resource):
#     def post(self):
#         content = request.get_json ()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname = content['persona']

#         cur = mysql.connect ().cursor ()

#         cur.execute (
#             "SELECT g.feature_name from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on b.motion_motion_id=c.motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on d.persona_persona_id=e.persona_id join persona_feature_xref f on e.persona_id=f.persona_persona_id join feature g on f.feature_feature_id=g.feature_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "' AND c.motion_name='" + motionname + "' AND e.persona_name='" + personaname + "'")

#         rv = cur.fetchall ()
#         data = {"features": [x[0] for x in rv]}
#         return data


# class updatefeature (Resource):
#     def put(self):
#         content = request.get_json ()
#         username = content['user']
#         segmentname = content['segment']
#         motionname = content['motion']
#         personaname = content['persona']
#         featurename_old = content['feature']
#         featurename_new = content['updateFeature']
#         cur = mysql.connect ().cursor ()
#         cur.execute (
#             "select feature_id from user u join user_segment_xref us on u.user_id=us.user_user_id join segment a on us.segment_segment_id=a.segment_id join segment_motion_xref b on a.segment_id=b.segment_segment_id join motion c on c.motion_id=b.motion_motion_id join motion_persona_xref d on c.motion_id=d.motion_motion_id join persona e on e.persona_id=d.persona_persona_id join persona_feature_xref f on e.persona_id=f.persona_persona_id join feature g on g.feature_id=f.feature_feature_id where u.email='" + username + "' AND a.segment_name='" + segmentname + "' and c.motion_name='" + motionname + "' and e.persona_name='" + personaname + "'and g.feature_name='" + featurename_old + "'")
#         rv = cur.fetchall ()
#         featureid = rv[0]

#         cur.execute ("UPDATE feature SET feature_name=%s WHERE feature_id=%s", (featurename_new, featureid))
#         mysql.connect ().commit ()

# Adding new feature
# Input parameter are username,campaign,feature name

class addfeature (Resource):
    def post(self):
        logger.info("Adding a new feature")

        content = request.get_json ()
        # print (content)
        username = content['user']
        campaignname = content['campaign'][0]
        featurename = content['newFeature']
        # language = content['language']
        conn = mysql.connect ()

        cur = conn.cursor ()

        # Inserting new feature in feature table
        cur.execute ("INSERT INTO feature(feature_name,feature_createdate) VALUES(%s,CURDATE())",
                     (featurename))
        conn.commit ()

        # Updateing campaign_feature_xref table

        # selecting campaign id 
        cur.execute (
            "SELECT c.campaign_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id  where u.email='" + username + "' AND c.campaign_name='" + campaignname + "' ")

        campaignid = cur.fetchall ()

        # selecting feature id for last added feature
        cur.execute ("SELECT feature_id FROM feature ORDER BY feature_id DESC LIMIT 1")
        featureid = cur.fetchall ()

        cur.execute ("INSERT INTO campaign_feature_xref(campaign_campaign_id,feature_feature_id) VALUES (%s,%s)",
                     (campaignid[0], featureid[0]))
        conn.commit ()

        logger.info("Feature %s is added",featurename)


        # cur.execute ("INSERT INTO language(language,rule) VALUES(%s,%s)", (language, rule))
        # conn.commit ()

        # cur.execute ("SELECT language_id FROM language ORDER BY language_id DESC LIMIT 1")
        # lid = cur.fetchall ()

        # cur.execute ("INSERT INTO feature_language_xref VALUES(%s,%s)", (featureid[0], lid[0]))
        # conn.commit ()


# Deleting a feature
class deletefeature (Resource):
    def delete(self):
        logger.info("Deleting feature process started")

        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]
        featurename = content['deleteFeature'][0]
        # print("featurename",featurename)

        conn = mysql.connect ()
        cur = conn.cursor ()

        # Getting feature id 
        cur.execute (
            "SELECT f.feature_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_feature_xref cf on c.campaign_id=cf.campaign_campaign_id join feature f on cf.feature_feature_id=f.feature_id  where u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND f.feature_name='" + featurename + "'")
        rv = cur.fetchall ()
        featureids = str (sum (rv, ()))
        featureids_1 = featureids.replace ("L,)", ")").replace ("L)", ")")
        featureids = featureids_1.replace (",)", ")")
        # print("a2",featureids)

        # Chekcing if there is any language and rule associated with that feature
        cur.execute (
            "SELECT count(*) FROM feature_language_xref WHERE feature_feature_id IN " + str (featureids))
        ret = cur.fetchall ()
        ret = ret[0][0]
        # print(ret)

        # Deleting campaign and persona mapping with feature
        cur.execute ("DELETE FROM campaign_feature_xref WHERE feature_feature_id IN " + str (featureids))
        conn.commit ()
        cur.execute ("DELETE FROM persona_feature_xref WHERE feature_feature_id IN " + str (featureids))
        conn.commit ()
        # deleting feature
        cur.execute ("DELETE FROM feature WHERE feature_id IN " + str (featureids))
        conn.commit ()

        # if there are language and rule associated with feature deleting them
        if ret != 0 :
            cur.execute (
                "SELECT language_language_id FROM feature_language_xref WHERE feature_feature_id IN " + str (featureids))
            rv = cur.fetchall ()
            # print("comiing language",rv)
            languageids = str (sum (rv, ()))
            # print("bl",languageids)
            languageids = languageids.replace (",)", ")")
            # print("a",languageids)
            cur.execute ("DELETE FROM feature_language_xref WHERE feature_feature_id IN " + str (featureids))
            conn.commit ()
            cur.execute ("DELETE FROM language WHERE language_id IN " + str (languageids))
            conn.commit ()

        logger.info("Feature %s is deleted",featurename)
        



       
        
