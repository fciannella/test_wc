from bcrypt import gensalt, hashpw
from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql
from wordcraftapp.api.mylogging import configure_logger

logger = configure_logger('default')


class checksignup (Resource):
    def post(self):
        logger.info("Registering for new user")
        content = request.get_json ()
        email = str (content['email'])
        password = str (content['password'])
        conn = mysql.connect ()
        cur = conn.cursor ()
        logger.info("Adding user with email_id %s ",email)

        # Checking if user already exists
        cur.execute ("SELECT COUNT(*) FROM user WHERE email = '" + email + "'")
        ret = cur.fetchall ()
        ret = ret[0][0]

        # if user is not registered then adding that to database
        if (ret == 0):
            hashed_password = hashpw (password.encode ("utf-8"), gensalt ())
            hashed_password = hashed_password.decode ("utf-8")
            query = '''INSERT INTO user (email, password) VALUES ("''' + email + '''", "''' + hashed_password + '''")'''
            cur.execute (query)
            conn.commit ()

            cur.execute ("SELECT user_id FROM user ORDER BY user_id DESC LIMIT 1")
            uid = cur.fetchall ()

            # Creating a copy of database for new user

            # Selecting all campaign for user_id = 1
            cur.execute (
                "SELECT c.campaign_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id WHERE u.user_id=1")
            campaigns = cur.fetchall ()

            # Inserting campaign data for new user for each campaign
            for campaignname in campaigns:

                cur.execute (
                    "SELECT campaign_id FROM campaign WHERE campaign_name = '"+campaignname[0]+"' AND role = 'Reviewer' ")
                cid = cur.fetchall ()

                # if there is no role for that campaign then adding the role first
                if cid == ():
                    cur.execute (
                        "SELECT c.campaign_description FROM campaign c WHERE c.campaign_name = '"+campaignname[0]+"'  AND c.role = 'Editor' ")
                    c_des = cur.fetchall ()
                    cur.execute (
                        "INSERT INTO campaign(campaign_name,campaign_description,campaign_createdate,is_active,role) VALUES(%s,%s,CURDATE(),0,'Reviewer') ",(campaignname,c_des[0]))
                    conn.commit ()

                    cur.execute (
                        "SELECT campaign_id FROM campaign ORDER BY campaign_id DESC LIMIT 1")
                    cid = cur.fetchall ()


                cur.execute (
                    "INSERT INTO `user_campaign_xref` VALUES(%s,%s)",(uid,cid))
                conn.commit ()

                # cur.execute (
                #     "SELECT s.channel_name,s.is_active FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_channel_xref cs ON c.campaign_id=cs.campaign_campaign_id JOIN channel s ON cs.channel_channel_id=s.channel_id WHERE u.user_id=1 AND c.campaign_name='" + campaignname + "'")
                # channels = cur.fetchall ()

                # for ch in channels:
                #     channelname = ch[0]
                #     flag = ch[1]

                #     if channelname =="Eloqua":

                #     	cur.execute("SELECT c.channel_id FROM channel c WHERE c.channel_name='Eloqua'")
                #     	chid = cur.fetchall()

                #     	cur.execute ("INSERT INTO `campaign_channel_xref` VALUES (%s,%s)", (cid[0],chid[0]))
                #         conn.commit ()

                #     else:

	               #      cur.execute ("INSERT INTO channel(channel_name,is_active) VALUES (%s,%s)", (channelname,flag))
	               #      conn.commit ()
	               #      cur.execute ("SELECT channel_id FROM channel ORDER BY channel_id DESC LIMIT 1")
	               #      chid = cur.fetchall ()
	               #      cur.execute ("INSERT INTO `campaign_channel_xref` VALUES (%s,%s)", (cid[0], chid[0]))
	               #      conn.commit ()

                # cur.execute (
                #     "SELECT s.solution_name,s.is_active FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_solution_xref cs ON c.campaign_id=cs.campaign_campaign_id JOIN solution s ON cs.solution_solution_id=s.solution_id WHERE u.user_id=1 AND c.campaign_name='" + campaignname + "'")
                # solutions = cur.fetchall ()

                # for b in solutions:
                #     solutionname = b[0]
                #     flag = b[1]
                #     cur.execute ("INSERT INTO solution(solution_name,is_active) VALUES (%s,%s)", (solutionname,flag))
                #     conn.commit ()
                #     cur.execute ("SELECT solution_id FROM solution ORDER BY solution_id DESC LIMIT 1")
                #     sid = cur.fetchall ()
                #     cur.execute ("INSERT INTO `campaign_solution_xref` VALUES (%s,%s)", (cid[0], sid[0]))
                #     conn.commit ()

                # cur.execute (
                #     "SELECT s.offer_name,s.is_active FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_offer_xref cs ON c.campaign_id=cs.campaign_campaign_id JOIN offer s ON cs.offer_offer_id=s.offer_id WHERE u.user_id=1 AND c.campaign_name='" + campaignname + "'")
                # offers = cur.fetchall ()

                # for c in offers:
                #     offername = c[0]
                #     flag = c[1]
                #     cur.execute ("INSERT INTO offer(offer_name,is_active) VALUES (%s,%s)", (offername,flag))
                #     conn.commit ()
                #     cur.execute ("SELECT offer_id FROM offer ORDER BY offer_id DESC LIMIT 1")
                #     sid = cur.fetchall ()
                #     cur.execute ("INSERT INTO `campaign_offer_xref` VALUES (%s,%s)", (cid[0], sid[0]))
                #     conn.commit ()

                # cur.execute (
                #     "SELECT s.motion_name,s.is_active FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_motion_xref cs ON c.campaign_id=cs.campaign_campaign_id JOIN motion s ON cs.motion_motion_id=s.motion_id WHERE u.user_id=1 AND c.campaign_name='" + campaignname + "'")
                # motions = cur.fetchall ()

                # for d in motions:
                #     motionname = d[0]
                #     flag = d[1]
                #     cur.execute ("INSERT INTO motion(motion_name,is_active) VALUES (%s,%s)", (motionname,flag))
                #     conn.commit ()
                #     cur.execute ("SELECT motion_id FROM motion ORDER BY motion_id DESC LIMIT 1")
                #     sid = cur.fetchall ()
                #     cur.execute ("INSERT INTO `campaign_motion_xref` VALUES (%s,%s)", (cid[0], sid[0]))
                #     conn.commit ()

                # cur.execute (
                #     "SELECT s.persona_name,s.persona_rule,s.is_active FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cs ON c.campaign_id=cs.campaign_campaign_id JOIN persona s ON cs.persona_persona_id=s.persona_id WHERE u.user_id=1 AND c.campaign_name='" + campaignname + "'")
                # personas = cur.fetchall ()

                # for e in personas:
                #     personaname = e[0]
                #     personarule = e[1]
                #     flag = e[2]
                #     cur.execute ("INSERT INTO persona(persona_name,persona_rule,is_active) VALUES (%s,%s,%s)",
                #                  (personaname, personarule, flag))
                #     conn.commit ()
                #     cur.execute ("SELECT persona_id FROM persona ORDER BY persona_id DESC LIMIT 1")
                #     sid = cur.fetchall ()
                #     cur.execute ("INSERT INTO `campaign_persona_xref` VALUES (%s,%s)", (cid[0], sid[0]))
                #     conn.commit ()

                # cur.execute (
                #     "SELECT s.feature_name,s.is_active FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_feature_xref cs ON c.campaign_id=cs.campaign_campaign_id JOIN feature s ON cs.feature_feature_id=s.feature_id WHERE u.user_id=1 AND c.campaign_name='" + campaignname + "'")
                # features = cur.fetchall ()

                # for f in features:
                #     featurename = f[0]
                #     flag = f[1]
                #     cur.execute (
                #         "SELECT l.language,l.rule FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_feature_xref cf ON s.campaign_id=cf.campaign_campaign_id JOIN feature g ON cf.feature_feature_id=g.feature_id JOIN feature_language_xref fl ON g.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.user_id=1 AND s.campaign_name='" + campaignname + "' AND g.feature_name='" + featurename + "'")
                #     languages = cur.fetchall ()
                #     cur.execute ("INSERT INTO feature(feature_name,is_active) VALUES (%s,%s)", (featurename, flag))
                #     conn.commit ()
                #     cur.execute ("SELECT feature_id FROM feature ORDER BY feature_id DESC LIMIT 1")
                #     fid = cur.fetchall ()
                #     cur.execute ("INSERT INTO `campaign_feature_xref` VALUES (%s,%s)", (cid[0], fid[0]))
                #     conn.commit ()
                #     for g in languages:
                #         language = g[0]
                #         rule = g[1]

                #         cur.execute ("INSERT INTO language(language,rule) VALUES(%s,%s)", (language, rule))
                #         conn.commit ()
                #         cur.execute ("SELECT language_id FROM language ORDER BY language_id DESC LIMIT 1")
                #         lid = cur.fetchall ()
                #         cur.execute ("INSERT INTO `feature_language_xref` VALUES (%s,%s)", (fid[0], lid[0]))
                #         conn.commit ()

            final = {"success": True}
            logger.info("User %s is successfully registered",email)

        else:
            final = {"errors": {"email": True}}
            logger.info("User %s is already registered",email)


        return final
