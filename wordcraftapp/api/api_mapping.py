from flask import request
from flask_restful import Resource

from wordcraftapp.extentions import mysql
from wordcraftapp.api.mylogging import configure_logger  

logger = configure_logger('default')



# Getting persona and feature mapping
class getmapping (Resource):
    def post(self):
        logger.info("Getting mapping data")
        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]

        cur = mysql.connect ().cursor ()

        # Getting all features mapped with a persona
        cur.execute(
            "SELECT p.persona_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "'")
        rv=cur.fetchall()

        pfm={}

        for a in rv:
            personaname=a[0]

            cur.execute(
                "SELECT f.feature_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND p.persona_name='" + personaname + "' ")
            fname = cur.fetchall ()

            features = []
            for b in fname:
                b = b[0]
                features.append (b)
            pfm[personaname] = features

        # Getting all personas mapped to a feature
        cur.execute(
                "SELECT f.feature_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' and c.campaign_name='"+campaignname+"' ")
        featurename=cur.fetchall()

        fpm={}

        for b in featurename:
            f_name=b[0]
            cur.execute(
                "SELECT p.persona_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' and c.campaign_name='"+campaignname+"' AND f.feature_name='"+f_name+"' ")
            pname = cur.fetchall()
            personas=[]
            for c in pname:
                c=c[0]
                personas.append(c)
            fpm[f_name]=personas


        data={"personafeature":pfm,"featurepersona":fpm}

        logger.info("Mapping data is collected")

        return data


# To remove persona feature mapping
class removemapping (Resource):
    def post(self):
        logger.info("Remove mapping process is started")
        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]
        persona = content['removePersona']
        feature = content['removeFeature']

        logger.info("Removing mapping for Persona '%s' and Feature '%s'",persona,feature)

        conn = mysql.connect ()
        cur = conn.cursor ()

        cur.execute(
                "SELECT pf.persona_persona_id, pf.feature_feature_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' and c.campaign_name='"+campaignname+"' and p.persona_name='"+persona+"' and f.feature_name='"+feature+"'")
        ids=cur.fetchall()
        # print("ids",ids)

        personaid=ids[0][0]
        # print("personaid",personaid)
        featureid=ids[0][1]
        # print("featureid",featureid)

        delquery="DELETE FROM `persona_feature_xref` where persona_persona_id = " + str(personaid) + " and feature_feature_id = " + str(featureid)

        cur.execute(delquery)
        # print(cur.rowcount)
        conn.commit ()
        logger.info("Mapping is removed")



# To create persona and feature mappings
class createmapping (Resource):
    def post(self):
        logger.info("Create mappings process is started")
        content = request.get_json ()
        username = content['user']
        campaignname = content['campaign'][0]
        personas = content['personas']
        # print (personas)
        features = content['features']
        # print (features)

        conn = mysql.connect ()

        cur = conn.cursor ()

        for a in personas:
            personaname=a

            cur.execute(
                "SELECT persona_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id WHERE u.email='" + username + "' and c.campaign_name='"+campaignname+"' and p.persona_name='"+personaname+"'")
            pid=cur.fetchall()
            # print("pid",pid)
            pid=pid[0][0]
            # print("pid2",pid)

            for b in features:
                featurename=b

                cur.execute(
                    "SELECT f.feature_id FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_feature_xref cf ON c.campaign_id=cf.campaign_campaign_id JOIN feature f ON cf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' and c.campaign_name='"+campaignname+"' and f.feature_name='"+featurename+"'")
                fid=cur.fetchall()
                # print("fid",fid)
                fid=fid[0][0]
                # print("fid2",fid)

                cur.execute(
                    "SELECT COUNT(*) FROM persona_feature_xref where persona_persona_id="+ str(pid) +" AND feature_feature_id="+ str(fid) +" ")
                ret=cur.fetchall()
                ret=ret[0][0]

                if ret == 0:
                    logger.info("Creating mapping for Persona '%s' and Feature '%s'",personaname,featurename)

                    cur.execute("INSERT INTO persona_feature_xref VALUES (%s,%s)",(pid,fid))
                    conn.commit()
                else:
                    logger.info("Mapping for Persona '%s' and Feature '%s' is already exists",personaname,featurename)
        logger.info("Mapping is successfuly created")