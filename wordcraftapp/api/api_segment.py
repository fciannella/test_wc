from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql
from wordcraftapp.api.mylogging import configure_logger  

logger = configure_logger('default')

# Getting content for a selected campaign
# Returns all and previously selected solution, offer, motion, channel, dataset, persona and feature for selected campaign
class selectcampaign(Resource):
    def post(self):
        logger.info("Getting content for selected campaign")

        content = request.get_json()
        username = content['user']
        campaignname = content['campaign'][0]

        logger.info("Selected campaign is '%s'",campaignname)


        conn = mysql.connect ()

        cur = conn.cursor ()

        cur.execute(
            "SELECT DISTINCT c.dataset from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"' ")
        dataset=cur.fetchall()

        cur.execute(
            "SELECT c.dataset from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        selecteddataset=cur.fetchall()

        cur.execute(
            "SELECT c.campaign_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"'")
        campaign=cur.fetchall()

        cur.execute(
            "SELECT s.channel_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_channel_xref cs on c.campaign_id=cs.campaign_campaign_id join channel s on cs.channel_channel_id=s.channel_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        channel=cur.fetchall()

        cur.execute(
            "SELECT s.channel_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_channel_xref cs on c.campaign_id=cs.campaign_campaign_id join channel s on cs.channel_channel_id=s.channel_id where s.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        selectedchannel=cur.fetchall()

        cur.execute(
            "SELECT s.solution_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_solution_xref cs on c.campaign_id=cs.campaign_campaign_id join solution s on cs.solution_solution_id=s.solution_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        solution=cur.fetchall()

        cur.execute(
            "SELECT s.solution_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_solution_xref cs on c.campaign_id=cs.campaign_campaign_id join solution s on cs.solution_solution_id=s.solution_id where s.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        selectedsolution=cur.fetchall()

        cur.execute(
            "SELECT o.offer_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_offer_xref co on c.campaign_id=co.campaign_campaign_id join offer o on co.offer_offer_id=o.offer_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        offer=cur.fetchall()

        cur.execute(
            "SELECT o.offer_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_offer_xref co on c.campaign_id=co.campaign_campaign_id join offer o on co.offer_offer_id=o.offer_id where o.is_active=1 and c.campaign_name='"+campaignname+"'")
        selectedoffer=cur.fetchall()

        cur.execute(
            "SELECT m.motion_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_motion_xref cm on c.campaign_id=cm.campaign_campaign_id join motion m on cm.motion_motion_id=m.motion_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        motion=cur.fetchall()

        cur.execute(
            "SELECT m.motion_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_motion_xref cm on c.campaign_id=cm.campaign_campaign_id join motion m on cm.motion_motion_id=m.motion_id where m.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        selectedmotion=cur.fetchall()

        cur.execute(
            "SELECT p.persona_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_persona_xref cp on c.campaign_id=cp.campaign_campaign_id join persona p on cp.persona_persona_id=p.persona_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' and c.campaign_name='"+campaignname+"'")
        persona=cur.fetchall()

        cur.execute(
            "SELECT p.persona_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_persona_xref cp on c.campaign_id=cp.campaign_campaign_id join persona p on cp.persona_persona_id=p.persona_id where p.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
        selectedpersona=cur.fetchall()

        cur.execute(
            "SELECT f.feature_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_feature_xref cf on c.campaign_id=cf.campaign_campaign_id join feature f on cf.feature_feature_id=f.feature_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' and c.campaign_name='"+campaignname+"'")
        feature=cur.fetchall()

        cur.execute(
            "SELECT f.feature_name from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_feature_xref cf on c.campaign_id=cf.campaign_campaign_id join feature f on cf.feature_feature_id=f.feature_id where f.is_active=1 and u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
        selectedfeature=cur.fetchall()

        data = {"campaigns": [x[0] for x in campaign], "selectedcampaign": [campaignname],
                "datasets": [x[0] for x in dataset], "selecteddataset": [x[0] for x in selecteddataset],
                "channels": [x[0] for x in channel], "solutions": [x[0] for x in solution],
                "offers": [x[0] for x in offer], "motions": [x[0] for x in motion], "personas": [x[0] for x in persona],
                "features": [x[0] for x in feature], "selectedchannels": [x[0] for x in selectedchannel],
                "selectedsolutions": [x[0] for x in selectedsolution], "selectedoffers": [x[0] for x in selectedoffer],
                "selectedmotions": [x[0] for x in selectedmotion], "selectedpersonas": [x[0] for x in selectedpersona],
                "selectedfeatures": [x[0] for x in selectedfeature]}
                
        logger.info("Data is selected for campaign")
                
        return data

# Updating active flag for selected campaign, solutions, offers, motions and channels
class updatecampaign (Resource):
    def post(self):
        logger.info("Updating active flag for selection made on home page")
        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]
        solutions = content['solutions']
        offers = content['offers']
        motions = content['motions']
        channels = content['channels']

        logger.info("Selected Campaign is '%s'",campaignname)
        logger.info("Selected Solutions are %s",solutions)
        logger.info("Selected Offers are %s",offers)
        logger.info("Selected Motions are %s",motions)
        logger.info("Selected Channels are %s",channels)

        conn = mysql. connect ()
        cur = conn.cursor ()

        # Setting active flag as zero

        cur.execute("SELECT c.campaign_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c on uc.campaign_campaign_id=c.campaign_id where u.email='"+username+"' ")
        rv = cur.fetchall()
        for a in rv:
            cname=a[0]
            cur.execute("UPDATE campaign SET is_active=0 where campaign_id='"+str(cname)+"' ")
            conn.commit()

        #updating offer flag to zero
        cur.execute(
            "SELECT o.offer_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_offer_xref co on c.campaign_id=co.campaign_campaign_id join offer o on co.offer_offer_id=o.offer_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        oid=cur.fetchall()

        for a in oid:
            a=a[0]
            cur.execute("UPDATE offer SET is_active=0 where offer_id=%s",(a))
            conn.commit()
        #updating solution flag to zero
        cur.execute(
            "SELECT s.solution_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_solution_xref cs on c.campaign_id=cs.campaign_campaign_id join solution s on cs.solution_solution_id=s.solution_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
        sid=cur.fetchall()

        for a in sid :

            a=a[0]

            cur.execute("UPDATE solution SET is_active=0 where solution_id=%s",(a))
            conn.commit()

        # updating motion flag to zero
        cur.execute(
            "SELECT m.motion_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_motion_xref cm on c.campaign_id=cm.campaign_campaign_id join motion m on cm.motion_motion_id=m.motion_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' ")
        mid=cur.fetchall()

        for a in mid :
            a=a[0]
            cur.execute("UPDATE motion SET is_active=0 where motion_id=%s",(a))
            conn.commit()

        #updating channel flag to zero
        cur.execute(
            "SELECT s.channel_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_channel_xref cs on c.campaign_id=cs.campaign_campaign_id join channel s on cs.channel_channel_id=s.channel_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"'")
        cid=cur.fetchall()

        for a in cid :
            a=a[0]
            cur.execute("UPDATE channel SET is_active=0 where channel_id=%s",(cid))
            conn.commit()


        #Updating active flag for campaign
        cur.execute(
            "SELECT c.campaign_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id where c.campaign_name='"+campaignname+"' and u.email='"+username+"'")
        cid=cur.fetchall()
        cid=cid[0][0]

        cur.execute("UPDATE campaign SET is_active=1 where campaign_id= '"+ str(cid) +"'")
        conn.commit()

        #Updating active flag for solution
        for a in solutions:
            cur.execute(
                "SELECT s.solution_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_solution_xref cs on c.campaign_id=cs.campaign_campaign_id join solution s on cs.solution_solution_id=s.solution_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' and s.solution_name='"+ a +"'")
            sid=cur.fetchall()


            if sid is not ():
                sid=sid[0]
                cur.execute("UPDATE solution SET is_active=1 where solution_id=%s",(sid))
                conn.commit()
        for a in offers:
            cur.execute(
                "SELECT o.offer_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_offer_xref co on c.campaign_id=co.campaign_campaign_id join offer o on co.offer_offer_id=o.offer_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' and o.offer_name='"+ a +"'")
            oid=cur.fetchall()
            oid=oid[0]

            cur.execute("UPDATE offer SET is_active=1 where offer_id=%s",(oid))
            conn.commit()

        for a in motions:
            cur.execute(
                "SELECT m.motion_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_motion_xref cm on c.campaign_id=cm.campaign_campaign_id join motion m on cm.motion_motion_id=m.motion_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' and m.motion_name='"+ a +"'")
            mid=cur.fetchall()
            mid=mid[0]

            cur.execute("UPDATE motion SET is_active=1 where motion_id=%s",(mid))
            conn.commit()

        for a in channels:
            cur.execute(
                "SELECT s.channel_id from user u join user_campaign_xref uc on u.user_id=uc.user_user_id join campaign c on uc.campaign_campaign_id=c.campaign_id join campaign_channel_xref cs on c.campaign_id=cs.campaign_campaign_id join channel s on cs.channel_channel_id=s.channel_id where u.email='"+username+"' and c.campaign_name='"+campaignname+"' and s.channel_name='"+ a +"'")
            cid=cur.fetchall()
            cid=cid[0]

            cur.execute("UPDATE channel SET is_active=1 where channel_id=%s",(cid))
            conn.commit()
        logger.info("Active flag is updated for selections made on home page")


# class addcampaign (Resource):
#     def post(self):
#         content = request.get_json ()
#         username = content['user']
#         campaignname = content['newCampaign']
#         solutionname = content['solutions']
#         offername = content['offers']
#         motionname = content['motions']
#         campaigndescription = "No description added"
#         cur = mysql.connect ().cursor ()

#         cur.execute (
#             "INSERT INTO campaign(campaign_name,campaign_description,campaign_createdate) VALUES(%s,%s,CURDATE())",
#             (campaignname, campaigndescription))
#         mysql.connect ().commit ()
#         cur.execute ("SELECT campaign_id FROM campaign ORDER BY campaign_id DESC LIMIT 1")
#         cid = cur.fetchall ()

#         cur.execute ("SELECT user_id FROM user WHERE email='" + username + "'")
#         uid = cur.fetchall ()

#         cur.execute ("INSERT INTO `user_campaign_xref` VALUES(%s,%s)", (uid[0], cid[0]))
#         mysql.connect ().commit ()

#         cur.execute ("SELECT persona_id FROM persona")
#         pid = cur.fetchall ()
#         for a in pid:
#             cur.execute ("INSERT INTO `campaign_persona_xref` VALUES(%s,%s)", (cid[0], [a]))
#             mysql.connect ().commit ()

#         cur.execute ("SELECT feature_id FROM feature")
#         fid = cur.fetchall ()
#         for a in fid:
#             cur.execute ("INSERT INTO `campaign_feature_xref` VALUES(%s,%s)", (cid[0], [a]))
#             mysql.connect ().commit ()

#         for a in solutionname:
#             cur.execute (
#                 "INSERT INTO solution(solution_name,solution_createdate,is_active) VALUES (%s,CURDATE(),1)", [a])
#             mysql.connect ().commit ()

#             cur.execute ("SELECT solution_id FROM solution ORDER BY solution_id DESC LIMIT 1")
#             sid = cur.fetchall ()

#             cur.execute ("INSERT INTO `campaign_solution_xref` VALUES(%s,%s)", (cid[0], sid[0]))
#             mysql.connect ().commit ()

#         for a in offername:
#             cur.execute (
#                 "INSERT INTO offer(offer_name,offer_createdate,is_active) VALUES (%s,CURDATE(),1)", [a])
#             mysql.connect ().commit ()

#             cur.execute ("SELECT offer_id FROM offer ORDER BY offer_id DESC LIMIT 1")
#             sid = cur.fetchall ()

#             cur.execute ("INSERT INTO `campaign_offer_xref` VALUES(%s,%s)", (cid[0], sid[0]))
#             mysql.connect ().commit ()

#         for a in motionname:
#             cur.execute (
#                 "INSERT INTO motion(motion_name,motion_createdate,is_active) VALUES (%s,CURDATE(),1)", [a])
#             mysql.connect ().commit ()

#             cur.execute ("SELECT motion_id FROM motion ORDER BY motion_id DESC LIMIT 1")
#             sid = cur.fetchall ()

#             cur.execute ("INSERT INTO `campaign_motion_xref` VALUES(%s,%s)", (cid[0], sid[0]))
#             mysql.connect ().commit ()
