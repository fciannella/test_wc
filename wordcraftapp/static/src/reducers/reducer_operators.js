/* Added by manoj  27-06-2018 ----- This reducer provides the list of all the possible operators and Math Functions */
export default function(){
  return(
    [
      {"operator":"==", "operatorName"         :"=    \u00A0\u00A0\u00A0Is Equals"},
      {"operator":"!=", "operatorName"        :"!=   \u00A0\u00A0Is Not Eqaul"},
      {"operator":"<=", "operatorName"        :"<=  \u00A0Is Less Than "},
      {"operator":">", "operatorName"         :">    \u00A0\u00A0\u00A0Is Greater Than "},
      {"operator":">=", "operatorName"        :">=   \u00A0Is Greater Than or Equal "},
      {"operator":"isEmpty", "operatorName"   :"''   \u00A0 \u00A0Is Empty"},
      {"operator":"isNotEmpty", "operatorName":"\u00A0 \u00A0 \u00A0 Is Not Empty"},
      {"operator":"contains", "operatorName":"\u00A0 \u00A0 \u00A0 Contains"}
    ]
  )
}
