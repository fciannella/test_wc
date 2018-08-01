import datetime
import random
import re
import pandas as pd
from bs4 import BeautifulSoup
#import time

from wordcraftapp.api.api_rule import query_rule_p, query_persona_rule, query_persona_rule_all, query_persona_name, \
                                        query_persona_and_rule, query_pr_and_rule
from wordcraftapp.api.mylogging import configure_logger
from wordcraftapp.extentions import mysql

logger = configure_logger ('default')

#------------------------------------------------------------------------------------
# eval() and exec() are potential security loopholes and their use must be limited.
#------------------------------------------------------------------------------------

# Optimize: Return None instead of empty string as a default return for all functions?

class GenerateNarrative (object):

    # To Do: Make campaign_content generic for all campaigns & store "campaign_id:content"
    campaign_content = {}

    def __init__(self, narr, df, varList=None):   
        self.narr = narr
        self.df = df
        if varList is None:
            self.varList = list(df)
        else:
            self.varList = varList

    # Returns dictionary with eloqua tags/columns as keys and the narrative enclosed in the tag as the value
    @classmethod
    def GenTagDict(cls, narr):

        # If empty string, return empty string
        if not narr: return ""

        if narr.startswith ("<p>") or "<br />" in narr:
            soup = BeautifulSoup (narr, "html.parser")
            narr = soup.get_text ()
        soup = BeautifulSoup (narr, "html.parser")

        tagDict = {}
        for tag in soup.find_all ():
            tagStr = tag.string
            if((tagStr == None) or (tagStr == "") or (not tagStr)):
                pass
            else:
                tagStr = tagStr.replace('\n','')
                tagStr = tagStr.replace('\xa0','')
            tagDict[tag.name] = tagStr
        # print(tagDict)

        # Remove the default tags BeautifulSoup generates
        tagDict.pop ('html', None)
        tagDict.pop ('body', None)

        return tagDict
        
    @classmethod
    def GetTemplate(cls, CampaignID = None, CampaignName = None, Language = None):
        
        if not GenerateNarrative.campaign_content:
            pass
        else:
            print("\n\n--------------------returning local copy--------------------\n\n")
            return
            #return GenerateNarrative.campaign_content
        
        print("\n\n--------------------making a db call!--------------------\n\n")
        
        # Hard-coded values for now:
        username = 'admin@admin.com'

        #Raise an exception if both CampaignName and CampaignID are nulls or incorrect.
        #Input data checks need to be put in either here or in the api file.
        if CampaignID == None and CampaignName == None:
            logger.error ("Neither campaign name nor campaign id provided to the API request identify the campaign.")
            return {"error":"Neither campaign name nor campaign id provided to the API request identify the campaign. Please review."}

        # All persona rules and corresponding templates
        rv_all = query_persona_and_rule(username, campaignname = CampaignName, campaignid = str(CampaignID))
        #print(rv_all)

        # Dictionary of Language (key) and [persona_rule,narrative] (value)
        ContentDict = {}
        for item in rv_all:
            content_added = 0
            #print(item)
            if item[1] not in ContentDict.keys():
                ContentDict[item[1]] = [[item[0], GenerateNarrative.GenTagDict(item[2])]]
            elif not ContentDict[item[1]]:
                ContentDict[item[1]].append([item[0], GenerateNarrative.GenTagDict(item[2])])
            else:
                for index, pr_and_narr in enumerate(ContentDict[item[1]]):
                    if pr_and_narr[0] == item[0]:
                        ContentDict[item[1]][index][1].update(GenerateNarrative.GenTagDict(item[2]))
                        content_added = 1
                        break
                if content_added == 0:
                    ContentDict[item[1]].append([item[0], GenerateNarrative.GenTagDict(item[2])])
        
        GenerateNarrative.campaign_content = ContentDict
        #print(GenerateNarrative.campaign_content)
        #return ContentDict
        
    # Be wary of the string to variable conversion. column name could be keyword
    # Function to read rows from dataframe.
    def CreateVars(self, row, dataDict=None):

        try:
            # If a data dictionary is passed instead of a data frame ( true with API calls)
            if dataDict is not None:
                self.varDict = dataDict
                for key, value in self.varDict.items():
                    if(pd.isnull(value) or value == ""):
                        setattr(self, key, None)
                    else:
                        setattr(self, key, value)
            else:    
                self.varDict = self.df.iloc[row].to_dict()
                for key, value in self.varDict.items():
                
                    #if hasattr(self, key):
                    #    delattr(self, key)
                
                    if(pd.isnull(value) or value == ""):
                        setattr(self, key, None)
                    #elif(isinstance(value, str) and not value):
                    #    setattr(self, key, None)
                    else:
                        setattr(self, key, value)
                #print(self.first_name)
        except Exception as e:
            logger.info (" -- Variable creation failed -- ")
            logger.error (e.__str__ ())
                
    # Optmize: BS is expensive. Also, can the re.sub be avoided?
    def CleanNarr(self, narr):
        try:
            # Hard space or Non-Breaking Space(NBSP) is a space in a line that can't be broken by word wrap.
            # With HTML &nbsp; you can create multiple spaces that are visible on a web page and not only in the source
            narr = re.sub("\#\#.*</p>|\#\#.*$", "</p>", narr)
            narr = re.sub ("&nbsp;|</*p>\n*|</*br>", "", narr)
            
            #print("narr before beautifulsoup is: ", narr, "\n")
            # Use BS to remove html tags generated by editor
            soup = BeautifulSoup (narr, "html.parser")
            outStr = soup.get_text ()
            # Second iteration required to remove custom tags
            soup = BeautifulSoup (outStr, "html.parser")
            outStr = soup.get_text ()

            #varList = list(self.varDict.keys())
            #print(varList)
            #for item in self.varList:
            #    if(len(re.findall('\\b'+str(item)+'\\b', outStr, flags=re.IGNORECASE)) > 0):
            #        outStr = re.sub('\\b'+str(item)+'\\b', 'self.'+str(item), outStr, flags=re.IGNORECASE)

            #print("\n\nTemplate after replacing data variables with class variables:\n", outStr, "\n")
            return outStr
        except Exception as e:
            logger.info (" -- Narrative clean up step before narrative generation failed -- ")
            logger.error (e.__str__ ())
            return ""

    # Resolve narrative from cleaned up input. Resolve conditionals and synonyms, data input
    def ResolveNarr(self, narr):
        # Resolve content in the inner most bracket first
        try:
            #print("narr is: ", narr, "\n")
            bp = self.GetBracketPairs (narr)
            if not bp:
                return narr
            i = max (bp.keys ())
            j = bp[i]
            # Below is needed as some data is in non-string format
            tmpStr = str (self.ResolveString (narr[i:j]))
            if not tmpStr:
                # Using ''.join() is preferred and faster
                narr = narr[:i - 2] + narr[j + 2:]
            else:
                narr = narr[:i - 2] + tmpStr + narr[j + 2:]

            # iterate till everything is resolved
            if not narr:
                return ""
            else:
                return self.ResolveNarr (narr)
            logger.info ("Narrative generated")
        except Exception as e:
            logger.info (" -- Narrative generation failed -- ")
            logger.error (e.__str__ ())
            return ""

    # Output narrative after resolving conditionals and synonyms, data input
    def GenNarr(self, narr):
        # Resolve content in the inner most bracket
        try:
            #print("narr before cleaning string is: ", narr, "\n")
            cleanStr = self.CleanNarr(narr)
            outStr = self.ResolveNarr(cleanStr)
            return outStr
        except Exception as e:
            logger.info (" -- Narrative generation failed -- ")
            logger.error (e.__str__ ())
            return ""


    # Find all [[]] in the string
    # optimize: BracketPairs using "stack" "pop". Alternatively use regex lazy search.
    def GetBracketPairs(self, narr):
        # Get list of Bracket positions in String. Skip the "[[" for openBracketsList
        openBracketsList = [m.start() + 2 for m in re.finditer ("\[\[", narr)]
        closedBracketsList = [m.start() for m in re.finditer ("\]\]", narr)]

        # Check for any brackets which aren't paired up
        if (len (openBracketsList) != len (closedBracketsList)):
            logger.error ("Error: Some brackets aren't paired off \n", "# open brackets:", len (openBracketsList),
                   "# closed brackets:", len (closedBracketsList))
        
        # Sorting the lists.
        openBracketsList.sort (reverse=True)
        closedBracketsList.sort ()

        # Brackets store pair-wise
        BracketPairs = {}
        for i in openBracketsList:
            for j in closedBracketsList:
                if j >= i:
                    if i in BracketPairs.keys ():
                        pass
                    else:
                        BracketPairs[i] = j
                        # Implement a better way to do the below
                        closedBracketsList.remove (j)

        # Check for any brackets which aren't paired up
        if (len (BracketPairs) != len (openBracketsList)):
            logger.error ("Error: Some brackets aren't paired off \n", narr)

        return BracketPairs

    # Resolve conditionals and synonyms, data input

    # Resolve the input string
    def ResolveString(self, narr):
        try:
            if narr.startswith ("if("):
                return self.ResolveConditional (narr)
            elif narr.startswith ("synonym("):
                return self.ResolveSynonym (narr)
            elif narr.startswith ("listcount("):
                return self.Resolve_listcount (narr)
            elif narr.startswith ("listcountunique("):
                return self.Resolve_listCountUnique (narr)
            elif narr.startswith ("num_to_word_ordinal("):
                return self.Resolve_num_to_word_ordinal (narr)
            elif narr.startswith ("num_to_word("):
                return self.Resolve_num_to_word (narr)
            elif narr.startswith ("andlist("):
                return self.Resolve_andorlist (narr, "and")
            elif narr.startswith ("orlist("):
                return self.Resolve_andorlist (narr, "or")
            elif narr.startswith ("today("):
                return self.Resolve_today (narr)
            elif narr.startswith ("int("):
                return self.Resolve_int (narr)
            else:
                return self.ResolveData (narr)
        except Exception as e:
            logger.error (e.__str__())
            return ""

    # While resolving conditionals, get content in the if() and replace variables with
    # df[variable] to remove the security risks associated with eval() and exec().
    # Similarly apply this to ResolveData and remove the direct eval and exec usage.

    #def ResolveFeature(self, narr):
    #    feature = [p.split (')')[0] for p in narr.split ('(') if ')' in p]
    #    if eval (feature) == None:
    #        return ""


    # Resolve the conditionals
    # Optimize: Use RegEx patterns to simplify
    def ResolveConditional(self, narr):
        elList = [m.start () for m in re.finditer ("else\(\)", narr)]
        # Check for else statement
        elseFlag = 0
        if len (elList) > 1:
            logger.error ("Error: Multiple else conditionals found")
        elif len (elList) == 0:
            elseFlag = 0
        else:
            elseFlag = 1

        # The below splits after if and before {statement}.
        # Should work for all properly formatted narratives.
        evalList = [p.split ('){')[0] for p in narr.split ('if(') if '{' in p]

        for i in range(len(evalList)):
            for var in self.varList:
                if(len(re.findall('\\b'+str(var)+'\\b', str(evalList[i]), flags=re.IGNORECASE)) > 0):
                    evalList[i] = re.sub('\\b'+str(var)+'\\b', 'self.'+str(var), str(evalList[i]), flags=re.IGNORECASE)

        # If else present, add a true statement.
        if elseFlag == 1:
            evalList.append ("1 == 1")

        # This is not necessarily correct. Eg: [[if(new_to_500k_club == True){[[synonym(){The 500k club has a new member!}{Make room in the 500k club for a new member!}]]}]]
        #                                                                       ^ problem is here
        # Possible fix: ResolveSynonym(narr)
        stmtList = self.GetStmtList (narr)

        #print("eval & stmt lists: ", evalList, stmtList)

        # Evaluate if all conditionals are paired up with their respective statements.
        if len (evalList) != len (stmtList):
            evalList_str = ','.join(str(item) for item in evalList)
            stmtList_str = ','.join(str(item) for item in stmtList)
            # Raise or Return to be used instead.
            logger.error ("Error: Number of conditionals and their corresponding statements do not match. Eval: " + evalList_str + 
                   " Stmt: " + stmtList_str)

        len_cond_list = len (evalList)

        # This looks incorrect
        # Possible fix: conditionalDict = {}; conditionalDict[evalList] = stmtList # After fixing stmtList
        # conditionalDict = dict (zip (evalList, stmtList))
        # print ("evalList is: ", evalList, "\n")
        # print ("stmtList is: ", stmtList, "\n")
        # print ("conditionalDict is: ", conditionalDict, "\n")

        # Do not evaluate empty strings. Also python doesn't handle that well
        for list_index in range (0, len_cond_list):
            #for key in conditionalDict.keys ():
            # Remove the empty key corresponding to else statement
            # print("condition being evaluated: ", evalList[list_index])
            if evalList[list_index] == None or evalList[list_index] == "" or not evalList[list_index]:
                pass
                # dictionary cannot change size during iteration
                # conditionalDict.pop(key)
            else:
                try:
                    # print("eval status is:", eval (evalList[list_index]))
                    if eval (evalList[list_index]):
                        return stmtList[list_index]
                except TypeError:
                    # Suppress TypeError. Need to deal with this going forward.
                    pass
                except Exception:
                    logger.error ("Error: Evaluation failed for the statement: ", evalList[list_index],
                                  stmtList[list_index])
                    raise

        # Assumption that else statement is always at the end.
        # Unnecessary since else statement is paired with true conditional.
        if elseFlag == 1:
            return stmtList[-1]
            #return list (conditionalDict.values ())[-1]

        # Is it wise to use empty string as placeholder?
        emptyStr = ""
        return emptyStr

    def GetStmtList(self, narr):
        return [p.split ('}')[0] for p in narr.split ('{') if '}' in p]

    # Resolve the synonyms
    def ResolveSynonym(self, narr):
        stmtList = self.GetStmtList (narr)
        return stmtList[random.randint (0, len (stmtList) - 1)]

    # Resolve number to word. List used but only one number at a time
    # Use some number to word library instead
    def Resolve_num_to_word(self, narr):
        NumList = [p.split (')')[0] for p in narr.split ('(') if ')' in p]
        if eval (NumList[0]) == None:
            return ""
        if int (eval (NumList[0])) == 1:
            return "one"
        elif int (eval (NumList[0])) == 2:
            return "two"
        elif int (eval (NumList[0])) == 3:
            return "three"
        elif int (eval (NumList[0])) == 4:
            return "four"
        elif int (eval (NumList[0])) == 5:
            return "five"
        elif int (eval (NumList[0])) == 6:
            return "six"
        elif int (eval (NumList[0])) == 7:
            return "seven"
        elif int (eval (NumList[0])) == 8:
            return "eight"
        elif int (eval (NumList[0])) == 9:
            return "nine"
        else:
            return eval (NumList[0])

    def Resolve_num_to_word_ordinal(self, narr):
        NumList = [p.split (')')[0] for p in narr.split ('(') if ')' in p]
        if eval (NumList[0]) == None:
            return ""
        if int (eval (NumList[0])) == 1:
            return "first"
        elif int (eval (NumList[0])) == 2:
            return "second"
        elif int (eval (NumList[0])) == 3:
            return "third"
        elif int (eval (NumList[0])) == 4:
            return "fourth"
        elif int (eval (NumList[0])) == 5:
            return "fifth"
        elif int (eval (NumList[0])) == 6:
            return "sixth"
        elif int (eval (NumList[0])) == 7:
            return "seventh"
        elif int (eval (NumList[0])) == 8:
            return "eighth"
        elif int (eval (NumList[0])) == 9:
            return "ninth"
        else:
            return eval (NumList[0])

    def Resolve_listcount(self, narr):
    
        WordList = [p.split (')')[0] for p in narr.split ('(') if ')' in p]
        WordList[0] = "self." + str(WordList[0]).strip()
        if eval (WordList[0]) is None:
            return 0
        
        narr = str (eval (WordList[0]))
        word_list = narr.split (',')
        # clean the list off white spaces
        word_list = [item for item in word_list if item != ' ' and item != '']
        
        return len(word_list)
    
    # This function takes 2 lists and returns the count of non null elements in the first list which aren't present in the second
    def Resolve_listCountUnique(self, narr):
    
        WordList = [p.split (')')[0] for p in narr.split ('(') if ')' in p]
        VarList = [p for p in WordList[0].split (',')]
        
        # clean the list off white spaces
        VarList_clean = [item for item in VarList if item != ' ' and item != '']
        VarList_stripped = [item.strip() for item in VarList_clean]
                
        WordList1 = "self." + str(VarList_stripped[0])
        WordList2 = "self." + str(VarList_stripped[1])
        
        list1_len = 0
        list2_len = 0
        
        if eval (WordList1) is None:
            return 0
            
        narr = str (eval (WordList1))
        # remove [] and "". Strip only removes from start and end of string, replace removes all instances
        narr = narr.replace ('[', '')
        narr = narr.replace (']', '')
        narr = narr.replace ('\"', '')
        
        word_list_1 = narr.split (',')

        # ensure spaces don't create a new word
        word_list_1_clean = [item for item in word_list_1 if item != ' ' and item != '']
        word_list_1_stripped = [item.strip() for item in word_list_1_clean]
        
        if eval (WordList2) == None:
            return len(word_list_1_clean)
        
        narr = str (eval (WordList2))
        # remove [] and "". Strip only removes from start and end of string, replace removes all instances
        narr = narr.replace ('[', '')
        narr = narr.replace (']', '')
        narr = narr.replace ('\"', '')
        
        word_list_2 = narr.split (',')

        # ensure spaces don't create a new word
        word_list_2_clean = [item for item in word_list_2 if item != ' ' and item != '']
        word_list_2_stripped = [item.strip() for item in word_list_2_clean]

        word_list_excl = [item for item in word_list_1_stripped if item not in word_list_2_stripped]
        
        #print("\n-------------word_list_1_stripped, word_list_2_stripped, word_list_excl \n", 
        #    word_list_1_stripped, word_list_2_stripped, word_list_excl, "-------------\n")
        
        if not word_list_excl:
            return 0
        else:
            return len(word_list_excl)  


    def Resolve_andorlist(self, narr, conj):
        WordList = [p.split (')')[0] for p in narr.split ('(') if ')' in p]
        WordList[0] = "self." + str(WordList[0])
        #print(eval (WordList[0]))
        if eval (WordList[0]) == None:
            return ""
        # print("list count string: ", WordList[0])
        narr = str (eval (WordList[0]))
        # remove [] and "". Strip only removes from start and end of string, replace removes all instances
        narr = narr.replace ('[', '')
        narr = narr.replace (']', '')
        narr = narr.replace ('\"', '')

        # print("list count string after eval: ", narr)
        word_list = narr.split (',')
        # print("list of words: ", word_list)
        # ensure spaces don't create a new word
        if ' ' in word_list:
            # word_list = word_list.remove(' ')
            word_list.remove (' ')
        for idx, word in enumerate (word_list):
            word_list[idx] = word_list[idx].strip ()
        word_list_len = len (word_list)
        #print ("list of words: ", word_list)
        # word_list_andoror = ", ".join(word for word in word_list)
        if word_list_len > 1:
            word_list_andor = word_list[0]
            for word_list_index in range (1, word_list_len - 1):
                word_list_andor = word_list_andor + ", " + word_list[word_list_index]
            if conj == "and":
                word_list_andor = word_list_andor + " and " + word_list[word_list_len - 1]
            elif conj == "or":
                word_list_andor = word_list_andor + " or " + word_list[word_list_len - 1]
        elif (word_list_len == 1):
            word_list_andor = word_list[0]
        else:
            word_list_andor = ""
        # print(word_list_andor)
        return word_list_andor

    # Resolve the today() function
    def Resolve_today(self, narr):
        today = datetime.datetime.now()
        month = str(today.month)
        date = str(today.day)
        year = str(today.year)
        if len(month)==1:
            month = '0' + month
        today = "'" + year + "/" + month + "/" + date + "'"
        return today

    def Resolve_int(self, narr):

        #Remove the "int(" and the ")"
        number = narr[4:-1]

        resolved_number = self.ResolveData(number)
        
        if (pd.isnull(resolved_number) or resolved_number == "" or resolved_number == " "):
            return ""

        try:
            return(int(float(resolved_number)))
        except Exception as e:
            logger.error (e.__str__())
            return ""

    # Resolve the data insertion
    def ResolveData(self, narr):
        #return eval (narr)
        #return eval ("self." + narr)
        #print(self.varDict[narr])

        #if self.varDict[narr] == None or pd.isnull(self.varDict[narr]) or not self.varDict[narr]:
        #    return ""
        #else:
        #    return self.varDict[narr]
        for var in self.varList:
            if(len(re.findall('\\b'+str(var)+'\\b', str(narr), flags=re.IGNORECASE)) > 0):
                narr = re.sub('\\b'+str(var)+'\\b', 'self.'+str(var), str(narr), flags=re.IGNORECASE)

        resolved_data = eval (narr)

        if pd.isnull(resolved_data) or resolved_data == "":
            return ""
        else:
            return resolved_data

    # Define a function to choose the right row for the selected persona at random
    # CreateVars with PersonaRule
    def CreateVarsWPR(self, personaRule, personaRuleList):

        # Create dictionary of personarules
        prDict = {}
        rule_num = 0
        for rule in personaRuleList:
            prDict[rule] = rule_num
            rule_num = rule_num + 1

        logger.info ("Printing persona rule dictionary: %s", prDict)
        # Create a dictionary with key, value swap for easier referencing
        prNumDict = dict ((v, k) for k, v in prDict.items ())

        # create buckets of bucket_size rows each.
        total_rows = len (self.df)
        if total_rows > 300:
            bucket_size = 100  # Default bucket size
        elif total_rows > 50:
            bucket_size = 5
        else:
            bucket_size = 1
        num_buckets = int (total_rows / bucket_size)
        # ignore the last bucket
        # What if a particular persona lies only in the last bucket? See loop.
        if num_buckets > 1:
            num_buckets = num_buckets - 1

        logger.info ("Number of buckets formed: %s", num_buckets)
        # choose random bucket
        rand_bucket = random.randint (0, num_buckets - 1)

        # create vars from random bucket
        row_start = rand_bucket * bucket_size
        row_end = (rand_bucket + 1) * bucket_size
        vRowID = row_start
        while vRowID < row_end:
            self.CreateVars (vRowID)
            # print(gs). None values are showing up as NaN making personarule fail
            # Check for Persona Rules
            right_row = 0
            if eval (str (personaRule)):
                right_row = 1
                # print("pr eval passes", vRowID)
                for rule_num in range (0, prDict[personaRule]):
                    if eval (str (prNumDict[rule_num])):
                        right_row = 0
                        # print("Other pr eval passes too", vRowID)
            if right_row == 1:
                break
            # What if the right_row isn't found?
            if (row_end - vRowID < 2):
                if (total_rows - row_end > bucket_size):
                    row_end = row_end + bucket_size
                elif row_end < total_rows - 1:
                    row_end = total_rows - 1
                else:
                    vRowID = 1
                    row_start = 0
                    row_end = bucket_size

            vRowID = vRowID + 1

        logger.info ("Row selected for the narrative is %s ", vRowID)
        # print(df.iloc[vRowID])

    # Generate Narrative With Persona Rules - Random Row
    # Latest iteration of GenNarrWPR_RR
    # Looks like the function name has been repeated
    def GenNarrWPR_RR(self, personaRule, personaRuleList):
        if (personaRule == "" or personaRule == " " or personaRule is None):
            personaRule = "1 == 1"

        for item in self.varList:
            # Also, only if item in personarule, do the substitution operation
            if(len(re.findall('\\b'+str(item)+'\\b', personaRule, flags=re.IGNORECASE)) > 0):
                personaRule = re.sub('\\b'+str(item)+'\\b', 'self.'+str(item), personaRule, flags=re.IGNORECASE)

        # To modify list items, modify by using list[i] = x and not item = x
        for i in range(len(personaRuleList)):
            if (personaRuleList[i] == "" or personaRuleList[i] == " " or personaRuleList[i] is None):
                personaRuleList[i] = "1 == 1"
            for item in self.varList:
                #print("pr before self: ", personaRuleList[i])
                if(len(re.findall('\\b'+str(item)+'\\b', personaRuleList[i], flags=re.IGNORECASE)) > 0):
                    personaRuleList[i] = re.sub('\\b'+str(item)+'\\b', 'self.'+str(item), personaRuleList[i], flags=re.IGNORECASE)
                #print("pr after self: ", personaRuleList[i])

        # print("persona rule is: ", personaRule)
        #print("persona rule list is: ", personaRuleList)

        try:
            self.CreateVarsWPR (personaRule, personaRuleList)
        except Exception as e:
            logger.error (e.__str__())
            raise

        outNarr = self.GenNarr (self.narr)
        return outNarr

    # Used in api_narrative.py
    def validate_GenNarr(self, pr, pr_all):
        if self.narr[:3] == "<p>":
            self.narr = self.narr[3:-4]
        try:
            logger.info ("Narrative successfully generated")
            generated_narrative = self.GenNarrWPR_RR (pr, pr_all)
            dataviewer = self.dataRow ()
            return generated_narrative, dataviewer
        except Exception as e:
            logger.error ("Narrative generation failed. Please review.")
            logger.error (e.__str__())
            #print(e.__str__())
            return ("Cannot process the rule", [[], []])

    # Returns a list of 2 lists. First list is the name of the columns, 2nd is the values of the row for which narrative was generated.
    def dataRow(self):
        
        col_list = list(self.varDict.keys())
        col_val_list = list(self.varDict.values())
        dViewer_list = []
        dViewer_list.append (col_list)
        dViewer_list.append (col_val_list)
        return dViewer_list

    # Used in api_narrative.py
    # Can be optimized further.
    # If personas are associated with dataset rows once, they can be used over and over again saving computational power.
    def getUpdatedDF(self, username, campaignname, personas):

        # Get all Persona rules
        rv_pr_all = query_persona_rule_all (username, campaignname)

        # make a list of all the personas
        pr_list = []
        for item in rv_pr_all:
            for ite in item:
                pr_list.append (ite)

        #Performance can be improved here. 3 nested loops is overkill
        for i in range(len(pr_list)):
            for var in self.varList:
                if(len(re.findall('\\b'+str(var)+'\\b', pr_list[i], flags=re.IGNORECASE)) > 0):
                    pr_list[i] = re.sub('\\b'+str(var)+'\\b', 'self.'+str(var), pr_list[i], flags=re.IGNORECASE)

        # Create dictionary of personarules
        prDict = {}
        rule_num = 0
        for rule in pr_list:
            prDict[rule] = rule_num
            rule_num = rule_num + 1

        #Persona rule number list containing input personas.
        pr_list_selected = []

        #Find out the rules for personas
        for personaname in personas:
            rv = query_persona_rule(username, campaignname, personaname)
            personarule = " ".join (ite for item in rv for ite in item)
            for var in self.varList:
                    if(len(re.findall('\\b'+str(var)+'\\b', personarule, flags=re.IGNORECASE)) > 0):
                        personarule = re.sub('\\b'+str(var)+'\\b', 'self.'+str(var), personarule, flags=re.IGNORECASE)
            pr_list_selected.append(prDict[personarule])

        #print ("Printing persona rule dictionary: ", prDict)
        # Create a dictionary with key, value swap for easier referencing
        prNumDict = dict ((v, k) for k, v in prDict.items ())
        # print(prNumDict)

        #List of rows to be used in the updated df
        row_list = []

        # identify if the row belongs to any of the personas to be exported.
        for row in range(len(self.df)):
            self.CreateVars(row)
            for rule_num in range (0, len(prDict)):
                if eval (str (prNumDict[rule_num])):
                    if rule_num in pr_list_selected:
                        row_list.append(row)
                        #df_updated = df_updated.append(self.df.iloc[row], ignore_index=True)
                    break

        #Updated dataframe
        df_updated = self.df.iloc[row_list]

        #print("-------------------------\n df_updated is", df_updated, "\n-------------------------------")
        return df_updated

    # Used in bycampaign() from api.py
    # Used in api_narrative.py
    ## Generate narrative with Tags.
    ## CampaignID and data determine the narrative and data and are sufficient for narrative generation.
    def GenNarrTag(self, data, CampaignName=None, CampaignID=None, Language=None , NoTags=False):
        # Hard-coded values for now:
        username = 'admin@admin.com'

        #t1 = time.time()
        #Input data checks need to be put in either here or in the api file.

        # Variables are created here. example: self.party_id = 45166206
        self.CreateVars (0, dataDict = data)

        #t2 = (time.time() - t1)*1000
        #print("Variable creation time: ", t2, "ms \n")
        #The default language is now English if no preferred_language is provided.
        try:
            if Language is None:
                if  'primary_language' in self.varList:
                    language = str (self.primary_language)
                elif 'preferred_language' in self.varList:
                    language = str (self.preferred_language)
                else:
                    language = "EN-US"
            else:
                language = Language
        except:
            logger.info (" -- Preferred Language not found. Content generated in the default language EN-US -- ")
            language = "EN-US"
    
        
        # Query the persona/profile rule and the rule/template
        rv_pr_r = query_pr_and_rule(username, language, campaignname=str(CampaignName), campaignid=str(CampaignID))

        # Initialize the narrative to be empty string in case the correct profile isn't found
        narr = ""
        
        # Identify the correct narrative using the persona/profile rule
        for i in range(len(rv_pr_r)):
            pr_self = rv_pr_r[i][0]
            for item in self.varList:
                if(len(re.findall('\\b'+str(item)+'\\b', pr_self, flags=re.IGNORECASE)) > 0):
                    pr_self = re.sub('\\b'+str(item)+'\\b', 'self.'+str(item), pr_self, flags=re.IGNORECASE)
            if eval (str (pr_self)):
                narr = rv_pr_r[i][1]
                break

        if ( NoTags ):
            narrative = self.GenNarr (narr)
            return narrative
        #print("-------------------------\n username, campaignname, personaname, language",
        #        username, campaignname, personaname, language, "\n-------------------------------")
        #print("-------------------------\n narr is", narr, "\n-------------------------------")

        #t7 = (time.time() - t1)*1000
        #print("Fetch template time: ", t7 - t6, "ms \n")
        # Use BeautifulSoup to parse the custom tags. Need 2 parses if <p>, <br /> and other tags are present.
        if narr.startswith ("<p>") or "<br />" in narr:
            soup = BeautifulSoup (narr, "html.parser")
            narr = soup.get_text ()
        soup = BeautifulSoup (narr, "html.parser")

        #t8 = (time.time() - t1)*1000
        #print("BeautifulSoup 2 parses time: ", t8 - t7, "ms \n")
        # Create a dictionary with tags as keys and narrative string enclosed within them as values.
        # The narrative within the Eloqua tag shouldn't contain \n or other such characters.
        tagDict = {}
        for tag in soup.find_all ():
            tagStr = tag.string
            if((tagStr is None) or (tagStr == "")):
                pass
            else:
                tagStr = tagStr.replace('\n','')
                tagStr = tagStr.replace('\xa0','')
            tagDict[tag.name] = tagStr
        # print(tagDict)

        # Remove the default tags BeautifulSoup generates
        tagDict.pop ('html', None)
        tagDict.pop ('body', None)

        #t9 = (time.time() - t1)*1000
        #print("Tag Identification time: ", t9 - t8, "ms \n")
        # Resolve the narratives.
        for key, value in tagDict.items ():
            value_tmp = value
            if value_tmp == None:
                value_tmp = ""
            tagDict[key] = self.GenNarr (value_tmp)

        #t10 = (time.time() - t1)*1000
        #print("Resolving narratives time: ", t10 - t9, "ms \n")

        #print("Total time taken: ", t10, "ms \n")
        return tagDict

    # Used in bytemplatenew() from api.py
    #Given the data, return content in tagDict format.
    def ResolveTagDictNew(self, data):

        content = GenerateNarrative.campaign_content
        # Ensure non-null inputs
        num_rows = len(data)
        if num_rows <= 0:
            return {"error":"No data provided."}

        if len(content) <=0:
            return {"error":"No narratives provided."}

        # make a list of all the profile rules
        pr_list = []
        for item in list(content.values()):
            for tuple in item:
                if tuple[0] in pr_list:
                    pass
                else:
                    pr_list.append(tuple[0])

        self.df = pd.DataFrame (data)

        ResolvedContentDict = {}
        for row in range(0, num_rows):
           
            # The dictionary to store tag-content template
            tagDict = {}
            
            # Variables are created here. example: self.party_id = 45166206
            self.CreateVars (row)
            
            if  'primary_language' in list(self.df):
                language = str (self.primary_language)
            elif 'preferred_language' in list(self.df):
                language = str (self.preferred_language)
            else:
                language = "EN-US"
            
            pr_content = content[language]

            for tuple in pr_content:

                pr_self = str(tuple[0])
                for item in self.varList:
                    if(len(re.findall('\\b'+str(item)+'\\b', pr_self, flags=re.IGNORECASE)) > 0):
                        pr_self = re.sub('\\b'+str(item)+'\\b', 'self.'+str(item), pr_self, flags=re.IGNORECASE)

                if eval (str (pr_self)):
                    tagDict = tuple[1]
                    break
                else:
                    tagDict = {}
            
            ResolvedContentDict[row] = {}
            for key, value in tagDict.items ():
                if(isinstance(value, str) and not value):
                    ResolvedContentDict[row][key] = ""
                else:
                    ResolvedContentDict[row][key] = self.GenNarr (value)    #str(value) + str(self.party_name)

        return ResolvedContentDict 

    # Used in bytemplate() from api.py
    #Given the data and the content (in tag dictionary format), return content in tagDict format.
    def ResolveTagDict(self, data, content):

        # Ensure non-null inputs
        num_rows = len(data)
        if num_rows <= 0:
            return {"error":"No data provided."}

        if len(content) <=0:
            return {"error":"No narratives provided."}

        # make a list of all the profile rules
        pr_list = []
        for item in list(content.values()):
            for tuple in item:
                if tuple[0] in pr_list:
                    pass
                else:
                    pr_list.append(tuple[0])

        self.df = pd.DataFrame (data)

        ResolvedContentDict = {}
        for row in range(0, num_rows):
           
            # The dictionary to store tag-content template
            tagDict = {}
            
            # Variables are created here. example: self.party_id = 45166206
            self.CreateVars (row)

            if  'primary_language' in list(self.df):
                language = str (self.primary_language)
            elif 'preferred_language' in list(self.df):
                language = str (self.preferred_language)
            else:
                language = "EN-US"

            pr_content = content[language]

            for tuple in pr_content:

                pr_self = str(tuple[0])
                for item in self.varList:
                    if(len(re.findall('\\b'+str(item)+'\\b', pr_self, flags=re.IGNORECASE)) > 0):
                        pr_self = re.sub('\\b'+str(item)+'\\b', 'self.'+str(item), pr_self, flags=re.IGNORECASE)

                if eval (str (pr_self)):
                    tagDict = tuple[1]
                    break
                else:
                    tagDict = {}
            
            # Python never implicitly copies objects and just adds references. Use deepcopy to make copies of lists, dicts etc.
            ResolvedContentDict[row] = {}
            for key, value in tagDict.items ():
                if(isinstance(value, str) and not value):
                    ResolvedContentDict[row][key] = ""
                else:
                    ResolvedContentDict[row][key] = self.GenNarr (value)    #str(value) + str(self.party_name)

        return ResolvedContentDict

class GenerateTemplate (object):

    # Returns dictionary with eloqua tags/columns as keys and the narrative enclosed in the tag as the value
    def GenTagDict(self, narr):

        # If empty string, return empty string
        if not narr: return ""

        if narr.startswith ("<p>") or "<br />" in narr:
            soup = BeautifulSoup (narr, "html.parser")
            narr = soup.get_text ()
        soup = BeautifulSoup (narr, "html.parser")

        tagDict = {}
        for tag in soup.find_all ():
            tagStr = tag.string
            if((tagStr == None) or (tagStr == "") or (not tagStr)):
                pass
            else:
                tagStr = tagStr.replace('\n','')
                tagStr = tagStr.replace('\xa0','')
            tagDict[tag.name] = tagStr
        # print(tagDict)

        # Remove the default tags BeautifulSoup generates
        tagDict.pop ('html', None)
        tagDict.pop ('body', None)

        return tagDict

    # Used in template() from api.py
    # GenTemplate returns persona rules and related content for a campaign_id. It returns a dictionary {'perosna_rule':'template'}
    # The primary purpose is to integrate it into API calls by avoiding queries to MySQL for every record.
    # Also, it can help retreive templates for any other use. The template is retreived with tags
    def GenTemplate(self, CampaignID = None, CampaignName = None, Language = None):
        # Hard-coded values for now:
        username = 'admin@admin.com'

        #Raise an exception if both CampaignName and CampaignID are nulls or incorrect.
        #Input data checks need to be put in either here or in the api file.
        if CampaignID == None and CampaignName == None:
            logger.error ("Neither campaign name nor campaign id provided to the API request identify the campaign.")
            return {"error":"Neither campaign name nor campaign id provided to the API request identify the campaign. Please review."}

        # All persona rules and corresponding templates
        rv_all = query_persona_and_rule(username, campaignname = CampaignName, campaignid = str(CampaignID))
        #print(rv_all)

        # Dictionary of Language (key) and [persona_rule,narrative] (value)
        ContentDict = {}
        for item in rv_all:
            content_added = 0
            #print(item)
            if item[1] not in ContentDict.keys():
                ContentDict[item[1]] = [[item[0], self.GenTagDict(item[2])]]
            elif not ContentDict[item[1]]:
                ContentDict[item[1]].append([item[0], self.GenTagDict(item[2])])
            else:
                for index, pr_and_narr in enumerate(ContentDict[item[1]]):
                    if pr_and_narr[0] == item[0]:
                        ContentDict[item[1]][index][1].update(self.GenTagDict(item[2]))
                        content_added = 1
                        break
                if content_added == 0:
                    ContentDict[item[1]].append([item[0], self.GenTagDict(item[2])])
        
        return ContentDict

