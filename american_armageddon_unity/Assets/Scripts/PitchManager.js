#pragma strict

    enum Beat{Drama, Action, Break};

    public class PitchManager extends MonoBehaviour {

        var twineManager : GameObject;
        var scriptCharacters : StoryCharacter[];
        var twineTitles : String[];
        var twinePassages : Dictionary.<String,TwinePassage>;

        function FindTitle(title:String) : boolean {

            if(System.Array.IndexOf(twineTitles, title) == -1){
                Debug.Log("broken link: " + title);
                return false;
            }
            else{
                return true;
            }
        }

        function GetCharacter() : StoryCharacter {

            //select verb domain
            var getCharacter : StoryCharacter = scriptCharacters[Random.Range(0,scriptCharacters.Length)];
            return getCharacter;

        }

        function GetVerb(getType:String) : TwinePassage {

            var verbType : TwinePassage = twinePassages[getType];
            var verbLink : String = verbType.GetRandomLink();
            if(verbLink != null && FindTitle(verbLink)) {
                var verb : TwinePassage = twinePassages[verbLink];
                return verb;
            }
            else {
                // if function breaks re-start
                return GetVerb(getType);
            }

        }

        function WriteStoryBeat() : StoryBeat {

            var scriptText : String;

            // pick a POV character
            var povChar : StoryCharacter = GetCharacter();

            // pick a verb domain
            var domain : String = povChar.GetDomain();

            // get verb
            var verb : TwinePassage = GetVerb(domain);

            // get beat
            var beat : TwinePassage = GetVerb(verb.title);
            var beatType : Beat = beat.GetBeat();

            scriptText = povChar._cn + " " + verb.title + " " + beat.title + ".";

            // replace placeholder text
            scriptText = scriptText.Replace("%PP",povChar._pp);
            scriptText = scriptText.Replace("%PN",povChar._pn);
            scriptText = scriptText.Replace("%ON",povChar._on);
            scriptText = scriptText.Replace("%FF",povChar._ff);
            scriptText = scriptText.Replace("%NN",povChar._nn);

            var scriptLine : StoryBeat = new StoryBeat(scriptText, beatType, povChar);
            return scriptLine;

        }

        function Start() {

            // create new characters and store in an array
            var duke : StoryCharacter = new StoryCharacter("Duke","he","his","Herzog","the group","the undead",["generic","justice","chaos"],false);
            var herzog : StoryCharacter = new StoryCharacter("Herzog","he","his","Duke","his congregation","the undead",["generic","gain","order"],false);
            var maggie : StoryCharacter = new StoryCharacter("Maggie","she","her","Herzog","the group","the militia",["generic","justice","order"],false);
            var jil : StoryCharacter = new StoryCharacter("Bubonic Jil","she","her","Maggie","the militia","the congregation",["generic","gain","chaos"],false);

            scriptCharacters = [duke, herzog, maggie, jil];

            // get Twine passages from TwineManager
            twinePassages = twineManager.GetComponent(TwineManager).GetPassages();
            twineTitles = twineManager.GetComponent(TwineManager).GetTitles();

            for(var i : int = 0;i < 10; i++){

                Debug.Log(WriteStoryBeat()._text);
            }

        }

    }

    public class StoryCharacter {

        var _cn : String; // name
        var _pp : String; // pronoun
        var _pn : String; // possessive
        var _on : String; // opposition character
        var _ff : String; // faction
        var _nn : String; // nemesis
        var _dn : String[]; // domains
        var _pl : boolean; // plural

        function StoryCharacter(  cn : String,
                                  pp : String,
                                  pn : String,
                                  on : String,
                                  ff : String,
                                  nn : String,
                                  dn : String[],
                                  pl : boolean ) {

            this._cn = cn;
            this._pp = pp;
            this._pn = pn;
            this._on = on;
            this._ff = ff;
            this._nn = nn;
            this._dn = dn;
            this._pl = pl;

        }

        function GetDomain(): String {

            //select verb domain
            var getDomain : String = _dn[Random.Range(0,_dn.Length)];
            return getDomain;

        }

    }

    public class StoryBeat {

        var _text : String;
        var _beat : Beat;
        var _role : StoryCharacter;

        function StoryBeat(  text : String,
                              beat : Beat,
                              role : StoryCharacter ) {

            this._text = text;
            this._beat = beat;
            this._role = role;

        }

    }
