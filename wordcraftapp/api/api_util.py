from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql

from wordcraftapp.api.mylogging import configure_logger
from wordcraftapp.api.api_rule import query_rule
from wordcraftapp.api.api_narrative import narrative_generation,feature_narrative,getData
import math
logger = configure_logger('default')


# Selecting content to show when home page load
# Return content for a campaign if a selection was made in previous session else return content for first campaign

class allcontent(Resource):
    def post(self):
        logger.info("Getting content for a campaign")
        content=request.get_json()
        username=content['user']

        cur = mysql.connect ().cursor ()

        # checking if user exists in database
        cur.execute ("SELECT COUNT(*) FROM user WHERE email = '" + username + "'")
        ret = cur.fetchall ()
        # print (ret)
        ret = ret[0][0]
        if ret == 0:
            data = {"message": "false"}

        else:

            # Checking for active campaign
            cur.execute(
                "SELECT DISTINCT COUNT(*) from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.is_active=1 and u.email='"+username+"'")
            flag=cur.fetchall()
            flag=flag[0][0]

            # If a campaign was selected in previous session
            if flag == 1:
                cur.execute("SELECT c.campaign_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.is_active=1 and u.email='"+username+"'")
                selectedcampaign=cur.fetchall()
                campaignname=str(selectedcampaign[0][0])

            # If there is No active campaign then select first
            else:
                cur.execute("SELECT c.campaign_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"' ")
                selectedcampaign=cur.fetchone()
                campaignname=str(selectedcampaign[0])
                print(campaignname)

            cur.execute(
                "SELECT DISTINCT c.dataset from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"'")
            dataset=cur.fetchall()

            cur.execute(
                "SELECT DISTINCT c.campaign_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"' and c.campaign_name!='GlobalCampaign'")
            campaign=cur.fetchall()

            cur.execute(
                "SELECT s.channel_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_channel_xref cs on c.campaign_id=cs.campaign_campaign_id join channel s on cs.channel_channel_id=s.channel_id where c.campaign_name='"+campaignname+"' and u.email='"+username+"'")
            channel=cur.fetchall()

            cur.execute(
                "SELECT s.solution_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_solution_xref cs on c.campaign_id=cs.campaign_campaign_id join solution s on cs.solution_solution_id=s.solution_id where c.campaign_name='"+campaignname+"' and u.email='"+username+"'")
            solution=cur.fetchall()

            cur.execute(
                "SELECT o.offer_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_offer_xref co on c.campaign_id=co.campaign_campaign_id join offer o on co.offer_offer_id=o.offer_id where c.campaign_name='"+campaignname+"' and u.email='"+username+"'")
            offer=cur.fetchall()

            cur.execute(
                "SELECT m.motion_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_motion_xref cm on c.campaign_id=cm.campaign_campaign_id join motion m on cm.motion_motion_id=m.motion_id where c.campaign_name='"+campaignname+"' and u.email='"+username+"'")
            motion=cur.fetchall()

            cur.execute(
                "SELECT DISTINCT p.persona_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_persona_xref cp on c.campaign_id=cp.campaign_campaign_id join persona p on cp.persona_persona_id=p.persona_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
            persona=cur.fetchall()

            cur.execute(
                "SELECT DISTINCT f.feature_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_feature_xref cf on c.campaign_id=cf.campaign_campaign_id join feature f on cf.feature_feature_id=f.feature_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
            feature=cur.fetchall()

            cur.execute(
                "SELECT c.dataset from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
            selecteddataset=cur.fetchall()

            cur.execute(
                "SELECT s.channel_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_channel_xref cs on c.campaign_id=cs.campaign_campaign_id join channel s on cs.channel_channel_id=s.channel_id where s.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
            selectedchannel=cur.fetchall()

            cur.execute(
                "SELECT s.solution_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_solution_xref cs on c.campaign_id=cs.campaign_campaign_id join solution s on cs.solution_solution_id=s.solution_id where s.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
            selectedsolution=cur.fetchall()

            cur.execute(
                "SELECT o.offer_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_offer_xref co on c.campaign_id=co.campaign_campaign_id join offer o on co.offer_offer_id=o.offer_id where o.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
            selectedoffer=cur.fetchall()

            cur.execute(
                "SELECT m.motion_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_motion_xref cm on c.campaign_id=cm.campaign_campaign_id join motion m on cm.motion_motion_id=m.motion_id where m.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
            selectedmotion=cur.fetchall()

            cur.execute(
                "SELECT p.persona_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_persona_xref cp on c.campaign_id=cp.campaign_campaign_id join persona p on cp.persona_persona_id=p.persona_id where p.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
            selectedpersona=cur.fetchall()

            cur.execute(
                "SELECT f.feature_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_feature_xref cf on c.campaign_id=cf.campaign_campaign_id join feature f on cf.feature_feature_id=f.feature_id where f.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
            selectedfeature=cur.fetchall()

            data = {"campaigns": [x[0] for x in campaign], "selectedcampaign": [campaignname],
                    "datasets": [x[0] for x in dataset], "selecteddataset": [x[0] for x in selecteddataset],
                    "channels": [x[0] for x in channel], "selectedchannels": [x[0] for x in selectedchannel],
                    "solutions": [x[0] for x in solution], "selectedsolutions": [x[0] for x in selectedsolution],
                    "offers": [x[0] for x in offer], "selectedoffers": [x[0] for x in selectedoffer],
                    "motions": [x[0] for x in motion], "selectedmotions": [x[0] for x in selectedmotion],
                    "personas": [x[0] for x in persona], "selectedpersonas": [x[0] for x in selectedpersona],
                    "features": [x[0] for x in feature], "selectedfeatures": [x[0] for x in selectedfeature],
                    "message": "true"}

            logger.info("Data is selected for campaign %s",campaignname)

        return data


# def process_result(result):
#     typ = type (result)
#     if (typ == decimal.Decimal):
#         result = float (result)

#     return (result)


# class gettables (Resource):
#     def get(self):
#         cur = mysql.connect ().cursor ()
#         cur.execute ("SELECT database()")
#         database = cur.fetchall ()
#         database = str (database[0][0])

#         cur.execute (
#             "SELECT table_name FROM information_schema.tables WHERE TABLE_SCHEMA ='" + database + "' AND table_name NOT IN('motion','campaign','solution','offer','channel','feature','persona','campaign_solution_xref','user_campaign_xref','campaign_motion_xref','campaign_solution_xref','campaign_offer_xref','campaign_channel_xref','campaign_persona_xref','campaign_feature_xref','user','feature_language_xref','language')")
#         rv = cur.fetchall ()
#         data = {"tables": [x[0] for x in rv]}
#         return data

class exportedInfo (Resource):
    def post(self):
        try:

            logger.info ("Getting exporting table information")
            content = request.get_json ()
            username = content['user']
            index = content['index']

            logger.info ("Collecting Data for user %s",username)

            if index == 0:
                offset = 0
            else:
                offset = (index-1)*5

            conn = mysql. connect ()
            cur = conn.cursor ()

            cur.execute (
                "SELECT campaign,table_name,status,CAST(create_date as char) FROM exportinfo WHERE user = '"+username+"' ORDER BY table_id DESC LIMIT 5 OFFSET %s",offset)
            rv =cur.fetchall()

            cur.execute(" SELECT count(*) from exportinfo WHERE user = '"+username+"'")
            ct = cur.fetchall()

            cur.execute("SHOW TABLES")
            tables = cur.fetchall()

            total_rows = ct[0][0]

            data = {"total_rows":total_rows,"data": [x for x in rv],"tables":[x[0] for x in tables]}

            logger.info ("Data successfuly collected for export table information")

        except Exception as e:
            logger.error (e.__str__ ())
            data = {"total_rows": 0 , "data": []}

        return data

class deleteInfo (Resource):
    def delete(self):
        try:
            logger.info ("start Deleting table process")
            content = request.get_json ()
            username = content['user']
            data = content['table'][0]

            campaignname = data['campaign']
            table = data['table']
            status = data['status']


            logger.info("Deleting table info for table %s",table)

            conn = mysql. connect ()
            cur = conn.cursor ()

            # Deleting Table info from exportinfo table
            cur.execute("DELETE FROM exportinfo WHERE user='"+username+"' and table_name='"+table+"' and campaign = '"+campaignname+"' and status = '"+status+"'")
            conn.commit()

            # Deleting Table if delete entry status is not as duplicate entry
            if status != 'Failed(Table already exists)':

                st = "DROP TABLE " +table
                cur.execute(st)
                conn.commit()

            logger.info("Deleted table info for  %s",table)

        except Exception as e:
            logger.error (e.__str__ ())

class sso (Resource):
    def get(self):
        user = 'admin'
        email = 'admin@admin.com'
        sso = 1

        data = {'username':user,'email':email,'sso':sso}

        return data

class checkuser (Resource):
    def post(self):
        content=request.get_json()
        username=content['user']

        cur = mysql.connect ().cursor ()

        # checking if user exists in database
        cur.execute ("SELECT COUNT(*) FROM user WHERE email = '" + username + "'")
        ret = cur.fetchall ()
        # print (ret)
        ret = ret[0][0]
        if ret == 0:
            data = {"message": "false"}
        else:
            data = {"message":"true"}
        return data


class submitreview (Resource):
    def post(self):
        try:

            logger.info ("Submitting for review")
            content = request.get_json()
            username = content['user']
            campaign = content['campaign'][0]
            profiles = content['exportPersonas']
            language = content['language']

            logger.info ("Review request from user %s submitting for campaign %s and profiles %s ",username,campaign, profiles)

            conn = mysql.connect ()
            cur = conn.cursor ()

            cur.execute (
                "SELECT u.email from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name = '"+campaign+"' AND c.role='Reviewer'")
            users = cur.fetchall ()

            if users ==():
                final = {"message": "Unsuccessful"}
            else:

                for reviewer in users:
                    for profile in profiles:
                        cur.execute(
                            "SELECT count(*) from reviewinfo where review_campaign = '"+campaign+"' and review_profile='"+profile+"' and reviewer = '"+reviewer[0]+"' and language = '"+language+"'")
                        ret = cur.fetchall ()

                        # Get all features mapped with selected Persona
                        cur.execute (
                            "SELECT f.feature_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaign + "' AND p.persona_name='" + profile + "'")
                        features = cur.fetchall ()
                        # Get the rule for all features associated with a persona
                        rv = query_rule (username, campaign, features, language)
                        # joining all feature rule with new line parameter
                        template = "\n".join (ite for item in rv for ite in item)

                        if ret[0][0] == 0:
                            cur.execute(
                                "INSERT INTO reviewinfo(editor,reviewer,review_campaign,review_profile,language,create_date,rule,status,notification) VALUES (%s,%s,%s,%s,%s,NOW(),%s,'Pending','Review')",(username,reviewer,campaign,profile,language,str(template)))
                            conn.commit ()
                        else:
                            cur.execute(
                                "UPDATE reviewinfo SET create_date= NOW(),rule = %s ,status = 'Pending', notification='Review' WHERE review_campaign = '"+campaign+"' and review_profile='"+profile+"' and language = '"+language+"'",(str(template)))
                            conn.commit ()

                final = {"message":"Success"}

            logger.info ("Review data is successfuly collected")
        except Exception as e:
            logger.error(e.__str__ ())
            final = {"message":'error', "error" :e.__str__()}
        return final


class approveProfile (Resource):
    def post(self):
        try:
            content = request.get_json()
            print(content)

            campaignname = content['campaign'][0]
            profile = content['profile'][0]
            language = content['language']
            logger.info ("Approving Profile %s",profile)

            conn = mysql.connect ()
            cur = conn.cursor ()

            cur.execute (
                "UPDATE reviewinfo SET status='Approved', notification = 'Approved' WHERE review_campaign = '"+campaignname+"' AND review_profile = '"+profile+"' AND language = '"+language+"'")
            conn.commit ()

            cur.execute (
            	"SELECT rule FROM reviewinfo WHERE review_campaign = '"+campaignname+"' AND review_profile = '"+profile+"' AND language = '"+language+"'")
            rule = cur.fetchall ()
            # print("dakdskds",rule[0])

            cur.execute (
            	"SELECT approved_id FROM approvedrule WHERE campaign = '"+campaignname+"' AND profile = '"+profile+"' AND language = '"+language+"'")
            rule_id = cur.fetchall ()

            if (rule_id == ()):
            	cur.execute (
            		"INSERT INTO approvedrule(campaign,profile,language,approved_date,rule) VALUES (%s,%s,%s,NOW(),%s)",(campaignname,profile,language,rule[0][0]))
            	conn.commit ()
            else:
            	cur.execute (
            		"UPDATE approvedrule SET rule = '"+rule[0][0]+"' WHERE campaign = '"+campaignname+"' AND profile = '"+profile+"' AND language = '"+language+"'")
            	conn.commit ()
        except Exception as e :
            logger.error(e)


class getreviewinfo (Resource):
    def post(self):

        logger.info ("Getting Review data")
        content = request.get_json()
        username = content['user']
        campaignname = content['campaign'][0]
        selected_profile = content['profile']
        # print(content)

        logger.info ("Collecting data for user %s and campaign %s", username, campaignname)

        conn = mysql.connect ()
        cur = conn.cursor ()

        cur.execute (
            "SELECT c.role from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name = '"+campaignname+"' AND u.email = '"+username+"'")
        role = cur.fetchall ()

        cur.execute (
            "SELECT COUNT(*) FROM reviewinfo WHERE review_campaign = '"+campaignname+"'")
        ret = cur.fetchall ()


        if (ret[0][0] == 0):

        	final = {"profiles":[],"languages":[],"narrative":[],"roles":[],"comments":[],"status":[],"message": "false"}

        else:

            if selected_profile == []:

                cur.execute(
                    "SELECT DISTINCT editor,review_profile,language,status,rule FROM reviewinfo WHERE review_campaign = '"+campaignname+"'")
                pnames = cur.fetchall ()

            else:
                cur.execute(
                    "SELECT DISTINCT editor,review_profile,language,status,rule FROM reviewinfo WHERE review_campaign = '"+campaignname+"' AND review_profile = '"+selected_profile[0]+"'")
                pnames = cur.fetchall ()

            profiles = []
            languages = []
            narratives = []
            html = []
            comments = []
            roles = []
            status = []
            for a in pnames:
                user = a[0]
                profile = [a[1]]
                language = a[2]
                st = a[3]
                rule = a[4]


                data = narrative_generation(user,campaignname,profile,language,rule)

                profiles.append(a[1])
                languages.append(language)
                narratives.append(data['narrative'][0])
                html.append(data['html'])
                roles.append(role[0][0])
                status.append(st)

                cur.execute (
                    "SELECT DISTINCT c.comment_user,c.comment,CAST(c.create_date as char) as cdate FROM reviewinfo r JOIN review_comment_xref rc ON r.review_id=rc.review_review_id JOIN commentinfo c ON rc.comment_comment_id = c.comment_id  WHERE r.review_profile ='"+a[1]+"' AND r.review_campaign = '"+campaignname+"' AND r.language = '"+language+"' ORDER BY cdate DESC")
                rv = cur.fetchall ()

                comments.append({'user':[a[0] for a in rv],'comment':[a[1] for a in rv],'time':[a[2] for a in rv]})

                final = {"profiles":profiles,"languages":languages,"narrative":narratives,"roles":roles,"comments":comments,"status":status,"html":html,"message":"true"}
            # print("here is dict",final['html'])

        df = getData(campaignname)
        final["columnNames"] = list(df.columns.values)
        print("these are columns",final["columnNames"])
        return final


class addcomment (Resource):
    def post(self):
        try:
            logger.info ("adding comment")
            content = request.get_json()
            print(content)
            username = content['user']
            campaignname = content['campaign'][0]
            profile = content['profile'][0]
            comment = content["comment"]
            conn = mysql.connect ()
            cur = conn.cursor ()

            cur.execute (
                "INSERT INTO commentinfo(comment_user,comment,create_date,notification) VALUES(%s,%s,NOW(),'Comment')",(username,comment))
            conn.commit ()

            cur.execute (
                "SELECT comment_id from commentinfo ORDER BY comment_id DESC LIMIT 1")
            cid = cur.fetchall ()
            cid = cid[0][0]
            print("this is cid",cid)

            cur.execute("SELECT review_id from reviewinfo WHERE review_campaign = '"+campaignname+"' and review_profile = '"+profile+"'")
            rv = cur.fetchall()
            for rid in rv:
                print("this is reviewvid",rid)
                cur.execute ("INSERT INTO review_comment_xref VALUES(%s,%s)",(rid[0],cid))
                conn.commit ()
            logger.info ("Comment is successfuly added")

        except Exception as e:
            logger.error (e)
            return e



class getnotification (Resource):
    def post(self):
        logger.info ("Getting notification")

        content = request.get_json()
        username = content['user']
        index = content['index']

        logger.info ("Collecting data for user %s ", username)

        conn = mysql.connect ()
        cur = conn.cursor ()

        final = []

        cur.execute(
            "SELECT reviewer,review_campaign,review_profile,CAST(create_date as char),notification FROM reviewinfo WHERE (editor = '"+username+"' OR reviewer = '"+username+"') AND notification = 'Approved' ORDER BY create_date DESC")
        data1 = cur.fetchall ()

        for b in data1:
            final.append({"user":b[0], "campaign":b[1] , "profile":b[2], "time":b[3], "type":b[4]})

        cur.execute(
            "SELECT editor,review_campaign,review_profile,CAST(create_date as char),notification FROM reviewinfo WHERE reviewer = '"+username+"' AND notification != 'Approved' ORDER BY create_date DESC")
        data2 = cur.fetchall ()
        # print("data2",data2)

        for b in data2:
            final.append({"user":b[0], "campaign":b[1] , "profile":b[2], "time":b[3], "type":b[4]})
        # print("dic2",final)


        cur.execute (
            "SELECT c.comment_user,r.review_campaign,r.review_profile,CAST(c.create_date as char),c.notification FROM reviewinfo r JOIN review_comment_xref rc ON r.review_id=rc.review_review_id JOIN commentinfo c ON rc.comment_comment_id = c.comment_id  WHERE c.comment_user != '"+username+"' AND (r.editor='"+username+"' OR r.reviewer = '"+username+"') ORDER BY c.create_date DESC")
        data3 = cur.fetchall ()
        # print("data3",data3)

        for b in data3:
            final.append({"user":b[0], "campaign":b[1] , "profile":b[2], "time":b[3], "type":b[4]})

        # print("dic3",final)

        nrow = len(final)

        ct = math.ceil(nrow/20)

        if index == 0:
            final = final[:5]
        else:
            st = (index-1)*20
            end = index*20 - 1
            final = final[st:end]

        logger.info ("notification data collected")

        st = (ct-1)*20+1
        end = ct*20

        if (nrow == 0):
            st = nrow
        if(end >= nrow):
            end = nrow

        final = sorted(final, key=lambda k: k['time'] , reverse=True)

        data = {"data":final, "nrow":nrow, "count":ct, "start":st, "end":end}

        return data

class saveState (Resource):
    def post(self):
        try:
            logger.info ("Started saving data for given state")
            content=request.get_json()
            username = content['user']
            campaign = content['campaign'][0]
            feature = content['exportFeature'][0]
            language = content['language']
            commit_msg = content['versionName']
            print(content)

            logger.info ("Saving state for campaign %s and feature %s ",campaign, feature)

            conn = mysql.connect ()
            cur = conn.cursor ()

            cur.execute (
                "SELECT l.rule from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id join feature g on cf.feature_feature_id=g.feature_id join feature_language_xref fl on g.feature_id=fl.feature_feature_id join language l on fl.language_language_id=l.language_id where u.email='" + username + "' AND s.campaign_name='" + campaign + "' AND g.feature_name = '"+feature+"' AND l.language='" + language + "'")
            rv = cur.fetchall ()
            print("here is rule \n %s",rv)

            cur.execute(
                "INSERT INTO versioninfo(user,campaign,feature,language ,comment,create_date,rule) VALUES (%s,%s,%s,%s,%s,NOW(),%s)",(username,campaign,feature,language,commit_msg,rv))

            conn.commit ()
            logger.info ("State is saved successfuly")
            message = {"message":"true"}

        except Exception as e:
            logger.error (e)
            message = {"message":"false"}
        return message

class getVersionData(Resource):
    def post(self):
        logger.info ("Collecting data for given state")
        content=request.get_json()
        print("this is content \n",content)
        campaign = content['campaign'][0]
        feature = content['exportFeature'][0]

        logger.info ("Getting saved version data for campaign %s and feature %s ",campaign, feature)

        conn = mysql.connect ()
        cur = conn.cursor ()

        cur.execute (
            "SELECT user,language,CAST(create_date as char),comment FROM versioninfo WHERE campaign = '"+campaign+"' AND feature = '"+feature+"' ORDER BY create_date DESC ")
        rv = cur.fetchall ()

        data = []
        for a in rv:
            data.append ({"user":a[0],"language":a[1],"time":a[2],"comment":a[3]})

        return data

class revertState(Resource):
    def post(self):
        try:

            logger.info ("Started saving data for given state")
            content=request.get_json()
            username = content['user']
            state_user = content['stateUser']
            campaign = content['campaign'][0]
            personaname = content['previewPersona'][0]
            featurename = content['previewFeature'][0]
            language = content['language']
            time = content['time']

            conn = mysql.connect ()
            cur = conn.cursor ()


            cur.execute(
                "SELECT l.language_id from user u join user_campaign_xref us on u.user_id=us.user_user_id join campaign s on us.campaign_campaign_id=s.campaign_id join campaign_feature_xref cf on s.campaign_id=cf.campaign_campaign_id join feature g on cf.feature_feature_id=g.feature_id join feature_language_xref fl on g.feature_id=fl.feature_feature_id join language l on fl.language_language_id=l.language_id where u.email='" + username + "' AND s.campaign_name='" + campaign + "' AND g.feature_name = '"+featurename+"' AND l.language='" + language + "'")
            lid = cur.fetchall ()
            print("current language_id",lid)

            cur.execute(
                "SELECT rule FROM versioninfo WHERE user = '"+ state_user +"' AND campaign = '"+ campaign +"' AND feature = '"+ featurename +"' AND language = '"+ language +"' AND create_date = '"+ time +"' ")
            rule = cur.fetchall ()

            cur.execute(
                "UPDATE language SET  rule = %s WHERE language_id = %s", (rule,lid))
            conn.commit ()

            logger.info ("State is successfuly revert back for feature %s ,language %s, and time %s",featurename,language,time)

            data = feature_narrative(username,campaign,personaname,featurename,language)

        except Exception as e :
            logger.error (e)
            data = ({'error': e.__str__ ()})

        return data

class deleteState(Resource):
    def delete(self):

        content=request.get_json()
        state_user = content['stateUser']
        campaign = content['campaign'][0]
        feature = content['feature'][0]
        language = content['language']
        time = content['time']

        logger.info ("Deleting saved data for feature %s ,language %s, and time %s",feature,language,time)

        conn = mysql.connect ()
        cur = conn.cursor ()

        cur.execute(
            "DELETE FROM versioninfo WHERE user = '"+ state_user +"' AND campaign = '"+ campaign +"' AND feature = '"+ feature +"' AND language = '"+ language +"' AND create_date = '"+ time +"' ")
        conn.commit ()

        logger.info ("Data deleted successfuly")

        message = {"message":"true"}

        return message

class uploadHtmlTemplate (Resource):
    def post(self):

        try:
            logger.info("Uploading Html in database")
            content = request.get_json ()
            # print("content \n\n\n\n\n",content)

            campaignname = content['campaign'][0]
            username = content['user']
            template_name = content['fileName']
            given_name = content['fileCustomName']

            template = content['fileText']

            conn = mysql.connect ()
            cur = conn.cursor ()

            cur.execute("SELECT COUNT(*) FROM htmltemplate WHERE campaign_name= '"+campaignname+"'")
            rv = cur.fetchall ()

            if rv[0][0] == 0:

                cur.execute(
                    "INSERT INTO htmltemplate(user_name,campaign_name,template_name,upload_date,template) values(%s,%s,%s,NOW(),%s) ", (username,campaignname,template_name,template))
                conn.commit ()
            else :

                cur.execute (
                    "UPDATE htmltemplate SET upload_date = NOW() , template = %s WHERE campaign_name = '"+campaignname+"'", (template))
                conn.commit ()

            message = {"message":"Html is successfuly stored in database"}
            logger.info("Html is successfuly stored in database")
        except Exception as e :
            logger.error(e)
            message = {"message": "Fail"}

        return message




