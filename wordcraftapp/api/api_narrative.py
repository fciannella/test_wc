import multiprocessing as mp
import os
import random
import time
from re import sub
#from subprocess import Popen, PIPE
from random import randint

import pandas as pd
import numpy as np
from flask import request
from flask_restful import Resource

from wordcraftapp.api.api_rule import query_rule, query_persona_rule_all, query_persona_rule, query_rule_p_f, query_rule_p_f_no_fr
from wordcraftapp.api.mylogging import configure_logger
from wordcraftapp.api.api_rule_parser import ruleToJson  
from wordcraftapp.api.narrative import GenerateNarrative  # validate_GenNarr, ExportNarr, CreateVars, GenNarr
from wordcraftapp.extentions import mysql

from wordcraftapp.api.api_html import htmlPreview
from wordcraftapp.api.api_html_preview import html_preview

logger = configure_logger ('default')


# def process_result(result):
#     typ = type (result)
#     if (typ == decimal.Decimal):
#         result = float (result)

#     return (result)


def getData(campaignname, preview = False):

    if campaignname == 'TS Renewal':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/TS Renewal/pre_cdo/gcsana.glb_elq_renewal_cdo_preinput.csv'
        else:
            file = './data/TS Renewal/pre_cdo/gcsana.glb_elq_renewal_cdo_preinput.csv'
    elif campaignname == 'Digital Revolution - Ransomware' or campaignname == 'Test Campaign':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Digital Revolution - Ransomware/pre_cdo/gcsana.digital_revolution_pre_cdo.csv'
        else:
            file = './data/Digital Revolution - Ransomware/pre_cdo/gcsana.digital_revolution_pre_cdo.csv'
    elif campaignname == '2nd Chance Attach':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/2nd Chance Attach/pre_cdo/gcsana.test_glb_elq_2nd_attach_cdo_preinput_stage1.csv'
        else:
            file = './data/2nd Chance Attach/pre_cdo/gcsana.test_glb_elq_2nd_attach_cdo_preinput_stage1.csv'
    elif campaignname == 'LCA Report Card':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/LCA Report Card/pre_cdo/gcs_misc.lca_sample.csv'
        else:
            file = './data/LCA Report Card/pre_cdo/gcs_misc.lca_sample.csv'
    elif campaignname == 'Security Renewal':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Security Renewal/pre_cdo/gcsana.eloqua_security_renewals_stage8.csv'
        else:
            file = './data/Security Renewal/pre_cdo/gcsana.eloqua_security_renewals_stage8.csv'
    elif campaignname == 'SNTC Digital Health Check':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/SNTC Digital Health Check/pre_cdo/sntc_digital_health_check_pre_cdo.csv'
        else:
            file = './data/SNTC Digital Health Check/pre_cdo/sntc_digital_health_check_pre_cdo.csv'
    elif campaignname == 'Email Security':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Email Security/pre_cdo/gcsana.email_security_pre_cdo.csv'
        else:
            file = './data/Email Security/pre_cdo/gcsana.email_security_pre_cdo.csv'
    elif campaignname == 'SNTC Welcome':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/SNTC Welcome/pre_cdo/gcsana.glb_welcome_cdo_preinput.csv'
        else:
            file = './data/SNTC Welcome/pre_cdo/gcsana.glb_welcome_cdo_preinput.csv'
    elif campaignname == 'SNTC Adopt - prototype':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/SNTC Adopt - prototype/pre_cdo/SNTC_Adopt_Clusters.csv'
        else:
            file = './data/SNTC Adopt - prototype/pre_cdo/SNTC_Adopt_Clusters.csv'
    elif campaignname == 'Inside Sales':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Inside Sales/pre_cdo/InsideSales_Sample_Data.csv'
        else:
            file = './data/Inside Sales/pre_cdo/InsideSales_Sample_Data.csv'
    elif campaignname == 'Web Security':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Web Security/pre_cdo/gcsana.web_security_precdo_seedlist.csv'
        else:
            file = './data/Web Security/pre_cdo/gcsana.web_security_precdo_seedlist.csv'
    elif campaignname == 'AMP for Endpoints on cisco.com':
        if "OPENSHIFT_APP_UUID" in os.environ:
            file = './app-root/repo/data/Cisco Channel/pre_cdo/amp_cisco_dot_com.csv'
        else:
            file = './data/Cisco Channel/pre_cdo/amp_cisco_dot_com.csv'


    #---Below only applicable for Linux---
    #p = Popen(["wc", "-l", file], stdout = PIPE)
    #wc = p.communicate()
    #total_lines = int(str(wc[0]).split(" ")[0].split("'")[1])

    #if preview:
    #    lines = 2
    #    df = pd.read_csv(file)
    #    total_lines = len(df)
    #    rand = randint(0, total_lines-1)
    #    df1 = pd.read_csv(file, nrows = lines, skiprows = range(1, rand))
    #else:
    #    df1 = pd.read_csv(file)

    df1 = pd.read_csv(file)

    # print("read dataset successfully, ", df[df.columns[3]].iloc[0] )
    return df1


def createSQLconstruct(dict, table, conn):
    st = ""
    for key in dict.keys ():
        st = st + key + " TEXT ,"
    st = '( ' + st[:-1] + ')' + " COLLATE utf8_unicode_ci"
    st = "CREATE TABLE " + table + ' ' + st

    # print(st)
    cur = conn.cursor ()
    cur.execute (st)
    conn.commit ()
    return True


def getSQLInsert(dict, table, conn):
    placeholders = ', '.join (['%s'] * len (dict))
    columns = ', '.join (dict.keys ())
    sql = "INSERT INTO %s ( %s ) VALUES ( %s )" % (table, columns, placeholders)
    cursor = conn.cursor ()
    cursor.execute (sql, list (dict.values ()))
    conn.commit ()
    return True

# function to generate narrative
def narrative_generation(username,campaignname,personas,language,template = None):
    conn = mysql.connect ()
    cur = conn.cursor ()
    df = getData (campaignname, preview = True)
    #print("user for get narrative",username)

    # Get the list of persona rules for all personas
    rv_pr_all = query_persona_rule_all (username, campaignname)
    print("all rule",rv_pr_all)

    pr_list = []
    for item in rv_pr_all:
        for ite in item:
            pr_list.append (ite)

    # narrative is combined narrative for all features
    # header has column names to show in data viewer
    # finalval stores column values for data viewer
    narrative = ""
    header = []
    finalval = []

    # Generating Narrative for each persona one by one
    for personaname in personas:
        print("persona" ,personaname)

        if (template == None):
            # Get all features mapped with selected Persona
            cur.execute (
                "SELECT f.feature_name FROM user u JOIN user_campaign_xref uc ON u.user_id=uc.user_user_id JOIN campaign c ON uc.campaign_campaign_id=c.campaign_id JOIN campaign_persona_xref cp ON c.campaign_id=cp.campaign_campaign_id JOIN persona p ON cp.persona_persona_id=p.persona_id JOIN persona_feature_xref pf ON p.persona_id=pf.persona_persona_id JOIN feature f ON pf.feature_feature_id=f.feature_id WHERE u.email='" + username + "' AND c.campaign_name='" + campaignname + "' AND p.persona_name='" + personaname + "'")
            features = cur.fetchall ()

            # Get the rule for all features associated with a persona
            rv = query_rule (username, campaignname, features, language)
            #print("featurerule",rv)

            # joining all feature rule with new line parameter
            template = "\n".join (ite for item in rv for ite in item)
            print ("here is rule", template)

        values = []

        # Get the persona rule for the selected persona
        rv_pr = query_persona_rule (username, campaignname, personaname)
        #print(rv_pr)

        pr = " ".join (ite for item in rv_pr for ite in item)
        #print("onep",pr)

        # passing combined feature rule, dataframe, personarule and all persona rule for narrative generation
        # return_str = validate_GenNarr(template, df, pr, pr_list)
        NarrGen = GenerateNarrative (template, df)
        return_str = NarrGen.validate_GenNarr (pr, pr_list)

        # return_str have three parameter narrative, column names and column values
        narrative = "\n".join ((narrative, return_str[0], "\n"))

        data = return_str[1]
        # print("here is the data",data)
        header = data[0]
        tempvalues = data[1]


        # For now Generating Html Preview for email security campaign only
        html_content = ''
        unused_tags_in_data = []
        unknown_tags_in_html = []

        html_data = dict(zip(header,tempvalues))

        cur.execute(
            "SELECT template FROM htmltemplate WHERE campaign_name = '"+campaignname+"'")
        rv = cur.fetchall ()

        # print("rv",rv[0][0])

        if ( rv != () ):
            sdict = NarrGen.GenNarrTag (html_data, CampaignName=campaignname,Language = language)
            final = html_preview(sdict, rv[0][0])

            unknown_tags_in_html = final['unknown_tags_in_html']
            unused_tags_in_data = final['unused_tags_in_data']

            # print("data b",unused_tags_in_data)
            # print("html b 2",unknown_tags_in_html)

            html_content = final['html_preview']
            print ("fail")
        # else :
        #     print ("successfully")

        # if (campaignname == 'Email Security') :

        #     sdict = NarrGen.GenNarrTag (html_data, CampaignName=campaignname,Language = language)
        #     # print("sdict",sdict)

        #     sdict['first_name'] = html_data ['first_name']
        #     # print(sdict)
        #     # print("button",sdict['clicktoactivatebutton'])
        #     # print("link",sdict['clicktoactivatelink'])
        #     # print("sicoon",sdict['statusicon'])


        #     html_content = htmlPreview(sdict)

        # elif (campaignname == 'Digital Revolution - Ransomware') :


        #     sdict = NarrGen.GenNarrTag (html_data, CampaignName=campaignname,Language = language)
        #     # print("sdict",sdict)
        #     final = html_preview(sdict, campaignname)

        #     unknown_tags_in_html = final['unknown_tags_in_html']
        #     unused_tags_in_data = final['unused_tags_in_data']

        #     # print("data b",unused_tags_in_data)
        #     # print("html b 2",unknown_tags_in_html)

        #     html_content = final['html_preview']
        # elif (campaignname == 'Digital Revolution - Ransomware') :
        #     print("came here")

        #     final = html_preview(sdict)
        #     data_tags_missing = final['data_tag_missing']
        #     html_tags_missing = final['html_tag_missing']
        #     print("data b",data_tags_missing)
        #     print("html b 2",html_tags_missing)
        #     html_content = final['html_preview']

        # print("s",html_content)

        # Relpacing Null values with None and removing Brackets present in data row selected for generating narrative
        for i in tempvalues:
            if pd.isnull (i):
                values.append ("None")
            else:
                clean_val = str (i).replace ("(", "")
                clean_val = str (clean_val).replace (")", "")
                values.append (clean_val)
        finalval.append (values)
    # Replacing tab and new line character as per html encoding character
    narrative = sub ("\\\\t", "\\t", sub ("\\\\n", "\\n", narrative))

    data = {"narrative": [narrative], "header": header, "values": finalval, "rule": [template] , "html" : html_content,
            "unused_tags_in_data":unused_tags_in_data , "unknown_tags_in_html":unknown_tags_in_html}

    # print("data",data['html'])
    return data


# To generate Narrative for all features associated with selected Persona
class getnarrative (Resource):
    def post(self):
        try:
            logger.info ("Generate narrative process started")

            content = request.get_json ()
            # print (content)
            username = content['user']
            campaignname = content['campaign'][0]
            personas = content['exportPersonas']
            # dataset = content['dataset']
            language = content['language']

            # Return Empty result if Persona list is empty
            if personas == []:
                data = {"narrative": [""], "header": [], "values": [], "rule": [""]}

            else:
                logger.info ("Generating narrative for Persona %s and Language '%s'", personas, language)


                data = narrative_generation(username,campaignname,personas,language)
                print("data",data['unused_tags_in_data'])
                print("data",data['unknown_tags_in_html'])

        except Exception as e:
            logger.error (e)
            data = ({'error': e.__str__ ()})

        logger.info ("Generate narrative process is completed")

        return data

# Exporting narratives generated for all features mapped with selected personas
class exportallnarrative (Resource):

    def process(self, df, row, NarrGen, filename, campaignname):
        t1 = time.time ()
        rowData = df.iloc[row].to_dict ()
        rowNarr = NarrGen.GenNarrTag (data=rowData, CampaignName=campaignname)
        conn = mysql.connect ()
        try:
            getSQLInsert (dict=rowNarr, table=filename, conn=conn)
        except Exception as e:
            logger.error (e.__str__ ())
        return True

    def post(self):
        try:
            pool = mp.Pool (processes=mp.cpu_count () * 5)
            logger.info ("Export Narrative Process started")

            content = request.get_json ()
            username = content['user']
            campaignname = content['campaign'][0]
            personas = content['exportPersonas']
            language = content['language']
            filename = content['filename']

            if personas == []:
                logger.info ("No Profile is Selected for Export Narrative")

                final = {"message": "Please Select a Profile to Export Narratives"}

            elif filename == "":
                logger.info ("Table Name is not provided")

                final = {"message": "Please Provide a Table Name to Export Narratives"}

            else:
                logger.info ("Generating narrative for Persona %s and Language '%s'", personas, language)

                conn = mysql.connect ()
                cur = conn.cursor ()

                # Checking if given filename is present in table `exportinfo`
                # And Inserting Expoting table info into `exportinfo` table

                cur.execute ("SELECT table_name from exportinfo")
                tables = cur.fetchall()

                if filename in [x[0] for x in tables]:
                    cur.execute(
                        "INSERT INTO exportinfo(campaign,table_name,status,create_date,user) VALUES (%s,%s,'Failed(Table already exists)',NOW(),%s)",(campaignname,filename,username))
                    conn.commit ()

                    logger.info ("Table %s already exists", filename)

                    final = {"message": "Table already exists."}

                else :
                    cur.execute (
                        "INSERT INTO exportinfo(campaign,table_name,status,create_date,user) VALUES (%s,%s,'In Process',NOW(),%s)",(campaignname,filename,username))
                    conn.commit ()

                    cur.execute ("SELECT table_id FROM exportinfo ORDER BY table_id DESC LIMIT 1")
                    tableid = cur.fetchall ()

                    try:
                        t0 = time.time ()
                        logger.info ("Generating narrative to export")

                        df_old = getData (campaignname)
                        NarrGen = GenerateNarrative (None, df_old)

                        # Filters dataframe to include only the data that falls into the personas
                        df = NarrGen.getUpdatedDF (username, campaignname, personas)
                        NarrGen = GenerateNarrative (None, df)

                        # Selecting any one language from database for selected campaign and creating table for export
                        cur.execute (
                            "SELECT l.language FROM user u JOIN user_campaign_xref us ON u.user_id=us.user_user_id JOIN campaign s ON us.campaign_campaign_id=s.campaign_id JOIN campaign_feature_xref cf ON s.campaign_id=cf.campaign_campaign_id JOIN feature f ON cf.feature_feature_id=f.feature_id JOIN feature_language_xref fl ON f.feature_id=fl.feature_feature_id JOIN language l ON fl.language_language_id=l.language_id WHERE u.email='" + username + "' AND s.campaign_name='" + campaignname + "'")
                        language = cur.fetchall ()

                        # if no language is present in database for this campaign then ending the export process
                        if language == () :
                            cur.execute ("UPDATE exportinfo SET status = 'Failed(No rule to export narrtive)' WHERE table_id = %s",tableid)
                            conn.commit ()
                        else:

                            # Getting column names for table from narrative tags
                            sdict = NarrGen.GenNarrTag (data=df.iloc[1].to_dict (), CampaignName=campaignname,Language = language[0][0])
                            createSQLconstruct (dict=sdict, table=filename, conn=conn)

                            # for row in range (len (df)):
                            #     self.process(df = df, row = row, NarrGen = NarrGen, filename = filename, conn = conn, campaignname = campaignname )

                            # iterate row by row and export. *Performance optimization to be explored.*
                            results = [pool.apply_async (self.process, args=(df, row, NarrGen, filename, campaignname)) for
                                       row in range (len (df))]
                            results = [p.get () for p in results]
                            tf = time.time () - t0
                            s = "%8.2f" % tf
                            msg = str ("Exported Successfully " + str (len (df)) + " records in " + str (s) + " seconds")
                            final = {"message": msg}
                            logger.info ("Narrative %s",msg)

                            # Updating status of completion of export narrative
                            cur.execute ("UPDATE exportinfo SET status = 'Successful' WHERE table_id = %s",tableid)
                            conn.commit ()

                    except Exception as e:
                        # Updating status as Unsuccessfull for export narrative
                        cur.execute ("UPDATE exportinfo SET status = 'Unsuccessful' WHERE table_id = %s",tableid)
                        conn.commit ()
                        logger.error (e)
                        final = {"message": e.__str__ ()}

            logger.info ("Export narrative process is completed")
            return final
        except Exception as e:
            logger.error (e)
            return (e.__str__ ())


# Get narrative for one persona and a selected feature
# Input parameter are username,campaign,perosonaname, featurename and language

def feature_narrative (username,campaignname,personaname,featurename,language):
    conn = mysql.connect ()
    cur = conn.cursor ()
    df = getData (campaignname, preview = True)

    # Get the list of persona rules for all personas
    rv_pr_all = query_persona_rule_all (username, campaignname)
    # print(rv_pr_all)

    pr_list = []
    for item in rv_pr_all:
        for ite in item:
            pr_list.append (ite)

    # header has column names to show in data viewer
    # finalval stores column values for data viewer
    narrative = ""
    header = []
    finalval = []
    # Get features associated with selected Persona

    rv = query_rule_p_f(username, campaignname, personaname, featurename, language)
    rv_no_fr = query_rule_p_f_no_fr(username, campaignname, personaname, featurename, language)

    # print("\n------- language = ", language, "\n--------- featurerule = ", rv)
    # feature rule for selected feature
    template = "\n".join (ite for item in rv for ite in item)
    template_no_fr = "\n".join (ite for item in rv_no_fr for ite in item)

    jsonRule = ruleToJson(template_no_fr)
    # print("jsonRule \n",jsonRule)

    # Get the persona rule for the selected persona

    rv_pr = query_persona_rule (username, campaignname, personaname)

    # print(rv_pr)

    pr = " ".join (ite for item in rv_pr for ite in item)
    # print("onep",pr)

    # return_str = validate_GenNarr (template, df, pr, pr_list)
    # print("template",template)

    return_str = GenerateNarrative (template, df).validate_GenNarr (pr, pr_list)
    
    narrative = "\n".join ((narrative, return_str[0], "\n"))
    
    data = return_str[1]
    # print("here is the data",data)
    header = data[0]
    tempvalues = data[1]

    values = []

    # Relpacing Null values with None and removing Brackets present in data row selected for generating narrative

    for i in tempvalues:
        if pd.isnull (i):
            values.append ("None")
        else:
            clean_val = str (i).replace ("(", "")
            clean_val = str (clean_val).replace (")", "")
            values.append (clean_val)
    finalval.append (values)
    # print(narrative)
    # Replacing tab and new line character as per html encoding character
    narrative = sub ("\\\\t", "\\t", sub ("\\\\n", "\\n", narrative))
    # out_t = time.time()
    # print(out_t-in_t)
    # print(narrative)
    data = {"narrative": [narrative], "header": header, "values": finalval, "rule": [template_no_fr] , "html" : '',"jsonRule":jsonRule}
    # print("final rule",data['rule'])

    return data



class featurenarrative (Resource):
    def post(self):
        try:
            logger.info ("Narrative generation for a feature is started")

            content = request.get_json ()
            username = content['user']
            campaignname = content['campaign'][0]
            personaname = content['previewPersona'][0]
            featurename = content['previewFeature'][0]
            language = content['language']
            # in_t = time.time()

            # Return Empty result if Persona list is empty
            if personaname == []:
                data = {"narrative": [""], "header": [], "values": [], "rule": [""]}

            else:
                logger.info ("Generating Narrative for Persona '%s' , Feature '%s' and Language '%s'", personaname,
                             featurename, language)
                data = feature_narrative(username,campaignname,personaname,featurename,language)

                print("html",data['html'])

        except Exception as e:
            logger.error (e.__str__ ())
            data = ({'error': e.__str__ ()})

        logger.info ("Narrative generation for a feature is completed")

        return data

class getHtml(Resource):
    def post(self):

        # for now static campaignname
        content = request.get_json ()
        column_names = content['dataViewerHead']
        data_row = content['dataViewerRow']

        username = 'admin@admin.com'
        campaignname = 'Email Security'
        personas = ['Default Profile']

        my_array = [np.nan if x=='None' else x for x in data_row]

        data = dict(zip(column_names,my_array))


        # df_old = getData (campaignname)

        NarrGen = GenerateNarrative (None, data)

        # Filters dataframe to include only the data that falls into the personas
        # df = NarrGen.getUpdatedDF (username, campaignname, personas)

        # NarrGen = GenerateNarrative (None, df)


        # i = random.randint (0,len(df)-1)

        # data = df.iloc[i].to_dict ()
        # print("this is data",data)
        sdict = NarrGen.GenNarrTag (data, CampaignName=campaignname,Language = 'EN-US')

        sdict['first_name'] = data ['first_name']

        html_content = htmlPreview (sdict)

        return html_content

class filterNarrative (Resource):
    def post(self):

        content = request.get_json ()
        print("content\n",content)

        columns = content ['columns']
        campaignname = content['campaign'][0]

        conn = mysql.connect ()
        cur = conn.cursor ()

        # personaname = content['persona']
        if columns[0]['columnName'] == '':
            html_st = {"html_preview":"Please select a column name" , "contentType":'text'}
        else:

            data = getData (campaignname)
            print("0")
            df = data.copy()

            column_check = {}

            for cdata in columns:

                if cdata['columnName'] != '':

                    data = data[ data[cdata['columnName']].astype('str') == str(cdata['columnVal'])]
                    print("len of data",len(data))

                    check_df = df[ df[cdata['columnName']].astype('str') == str(cdata['columnVal']) ]

                    column_check[cdata['columnName']] = [len(check_df),cdata['columnVal']]

            if (len(data) == 0):

                html_st =''

                if all(v[0]!=0 for v in column_check.values()):
                    html_st = html_st + 'No data for combination of given filter conditions'

                for k,v in column_check.items():
                    if v[0]==0:
                        if html_st == '':
                            html_st = html_st + 'No Record found in data for  " ' + str(k) + ' = ' + str(v[1])+'"\n'
                        else:
                            html_st = html_st + ' and ' + str(k) + ' = ' + str(v[1])+'"\n'

                html_st = {"html_preview": html_st , 'contentType': 'text'}



            else:
                NarrGen = GenerateNarrative (None, data)

                sdict = NarrGen.GenNarrTag (data.iloc[0].to_dict(), CampaignName=campaignname,Language = 'EN-US')

                cur.execute(
                    "SELECT template FROM htmltemplate WHERE campaign_name = '"+campaignname+"'")
                rv = cur.fetchall ()

                # print("rv",rv[0][0])

                if ( rv != () ):

                    html_st =  html_preview(sdict, rv[0][0])
                    html_st['contentType'] = 'html'

                # if (campaignname == 'Email Security') :

                #     sdict['first_name'] = data.iloc[0]['first_name']

                #     html_st =  html_preview(sdict, campaignname)
                #     html_st['contentType'] = 'html'

                #     # html_st = {"html_preview": html_content , 'contentType':'html'}

                # elif (campaignname == 'Digital Revolution - Ransomware') :

                #     html_st = html_preview(sdict, campaignname)

                #     html_st['contentType'] = 'html'

                else:
                    narrative = NarrGen.GenNarrTag (data.iloc[0].to_dict(), CampaignName=campaignname,Language = 'EN-US',NoTags = True)

                    narrative = sub ("\\\\t", "\\t", sub ("\\\\n", "\\n", narrative))


                    html_st = {"html_preview":narrative , 'contentType':'text'}

            # print("html_st",html_st)
        return html_st

class get_columns_names (Resource):
    def post(self):
        content = request.get_json ()
        print(content)

        campaignname = content['campaign'][0]

        data = getData( campaignname )

        columnNames = {"columnNames": list(data.columns.values)}
        print(columnNames)

        return columnNames
