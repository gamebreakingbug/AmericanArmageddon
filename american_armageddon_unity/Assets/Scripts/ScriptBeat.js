#pragma strict

    public class StoryCharacter {

        var _cn : String; // name
        var _pp : String; // pronoun
        var _pn : String; // possessive
        var _on : String; // opposition character
        var _ff : String; // faction
        var _nn : String; // nemesis
        var _dn : String[]; // domains

        function StoryCharacter(  cn : String,
                                  pp : String,
                                  pn : String,
                                  on : String,
                                  ff : String,
                                  nn : String,
                                  dn : String[] ) {

            this._cn = cn;
            this._pp = pp;
            this._pn = pn;
            this._on = on;
            this._ff = ff;
            this._nn = nn;
            this._dn = dn;
        }

    }

    public class ScriptLine {

        var _text : String;
        var _type : String;
        var _role : String;

        function ScriptLine(  text : String,
                              type : String,
                              role : String ) {

            this._text = text;
            this._type = type;
            this._role = role;

        }

    }

    public class ScriptBeat extends MonoBehaviour {

        var scriptCharacters : StoryCharacter[];
        var twineTitles : String[];
        var twinePassages : Dictionary.<String,TwinePassage>;

        function LoadData() {

            // create new characters and store in an array
            var duke : StoryCharacter = new StoryCharacter("Duke","he","his","Herzog","the group","the militia",["generic","justice","chaos"]);
            var herzog : StoryCharacter = new StoryCharacter("Herzog","he","his","Duke","his congregation","the group",["generic","gain","order"]);
            var maggie : StoryCharacter = new StoryCharacter("Maggie","she","her","Bubonic Jil","the group","the undead",["generic","justice","order"]);
            var jil : StoryCharacter = new StoryCharacter("Bubonic Jil","she","her","Duke","the militia","the congregation",["generic","gain","chaos"]);

            scriptCharacters = [duke, herzog, maggie, jil];

            // get Twine passages from TwineManager
            twinePassages = gameObject.GetComponent(TwineManager).GetPassages();
            twineTitles = gameObject.GetComponent(TwineManager).GetTitles();

            for(var i : int = 0;i < 200; i++){

                Debug.Log(StoryLine());
                Debug.Log(FlavourText());
            }

        }

        function FindTitle(title:String) : boolean {

            if(System.Array.IndexOf(twineTitles, title) == -1){
                Debug.Log("broken link" + title);
                return false;
            }
            else{
                return true;
            }
        }

        function StoryLine() : String {

            // POV Character
            var pov : StoryCharacter;
            // story text
            var storyLine : String;
            // temp string
            var buffer : StringBuilder = new StringBuilder();
            // get random POV character
            var rnd : int = Random.Range(0,scriptCharacters.Length);
            pov = scriptCharacters[rnd];
            var name : String;
            var space : String = " ";

            // decide if a prefix will be added
            var prefixList : String[] = ["prefixes","short_prefixes", null];
            var getPrefixType : String = prefixList[Random.Range(0,prefixList.Length)];

            if(getPrefixType != null && FindTitle(getPrefixType)) {
                var prefixType : TwinePassage = twinePassages[getPrefixType];
                // select from list of link passages
                var prefixLink : String = prefixType.GetRandomLink();
                if(prefixLink != null && FindTitle(getPrefixType)) {
                    var prefix = twinePassages[prefixLink];
                    // add prefix text to buffer
                    buffer.Append(prefix.title);
                    buffer.Append(space);
                }
            }

            // add POV character name
            buffer.Append(pov._cn);
            buffer.Append(space);

            //select verb domain
            var getVerbType : String = pov._dn[Random.Range(0,pov._dn.Length)];
            var verbType = twinePassages[getVerbType];
            // select from list of link passages
            var verbLink : String = verbType.GetRandomLink();
            if(verbLink != null && FindTitle(verbLink)) {
                var verb : TwinePassage = twinePassages[verbLink];
                // add verb text to buffer
                buffer.Append(verb.title);
                buffer.Append(space);
            }
            else {
                // if function breaks re-start
                return StoryLine();
            }

            // select story beat
            var beatLink : String = verb.GetRandomLink();
            if(beatLink != null && FindTitle(beatLink)) {
                var beat : TwinePassage = twinePassages[beatLink];
                // add verb text to buffer
                buffer.Append(beat.title);
                buffer.Append(".");
            }
            else {
                // if function breaks re-start
                return StoryLine();
            }

            var txt : String = buffer.ToString();

            // replace placeholder text
            txt = txt.Replace("%PP",pov._pp);
            txt = txt.Replace("%PN",pov._pn);
            txt = txt.Replace("%ON",pov._on);
            txt = txt.Replace("%FF",pov._ff);
            txt = txt.Replace("%NN",pov._nn);

            // capitalise first letter
            var capital : String = txt.Substring(0,1);
            txt = txt.Substring(1,txt.Length-1);
            capital = capital.ToUpper();
            txt = capital+txt;

            return txt;

        }

        function FlavourText() : String {

            var flavour_EE : String[] = [         "the swarm",
                                                  "the undead horde",
                                                  "a murderous mob",
                                                  "a direful throng",
                                                  "a savage flock",
                                                  "a dark force",
                                                  "an ominous terror",
                                                  "the herd" ];

            var flavour_VV : String[] = [         "sinister lies",
                                                  "evil horrors",
                                                  "terrible nightmares",
                                                  "painful terrors",
                                                  "fearful truths" ];

            var buffer : StringBuilder = new StringBuilder();
            var space : String = " ";

            var flavourType : TwinePassage = twinePassages["flavourPfx"];
            var flavourLink : String = flavourType.GetRandomLink();
            if(flavourLink != null) {
                var flavour : TwinePassage = twinePassages[flavourLink];
                // add flavour text to buffer
                buffer.Append(flavour.title);
                buffer.Append(space);
            }
            else {
                // if function breaks re-start
                return FlavourText();
            }

            var textType : TwinePassage = twinePassages["flavourSfx"];

            var textLink : String = textType.GetRandomLink();
            if(textLink != null) {
                var text : TwinePassage = twinePassages[textLink];
                // add text to buffer
                buffer.Append(text.title);
                buffer.Append(".");
            }
            else {
                // if function breaks re-start
                return FlavourText();
            }

            var txt : String = buffer.ToString();

            // replace placeholder text
            txt = txt.Replace("%EE",flavour_EE[Random.Range(0,flavour_EE.Length)]);
            txt = txt.Replace("%VV",flavour_VV[Random.Range(0,flavour_VV.Length)]);

            // capitalise first letter
            var capital : String = txt.Substring(0,1);
            txt = txt.Substring(1,txt.Length-1);
            capital = capital.ToUpper();
            txt = capital+txt;

            return txt;


        }



    }
