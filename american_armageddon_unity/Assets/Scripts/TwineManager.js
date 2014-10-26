#pragma strict

import System.Collections.Generic;
import System.Text;

    public class TwinePassage {

        var title : String;
        var tags : String[];
        var body : String;
        var links : String[];

        function CheckTag(txt:String){

            for(var i: int = 0; i < tags.Length; i++){
                if(txt == tags[i]){
                    return true;
                }
            }
            return false;
        }

        function FindLinks(){

            // check if passage is of type domain or verb
            if(CheckTag("domain")||CheckTag("verb")){

                // body text will consist of "[[some link]]" so split string based on lines
                links = body.Split("\n"[0]);

                // trim "[[" and "]]" from each link

                var text : String;
                var index : int;
                for (var i : int = 0; i < links.Length; i++){

                    text = links[i];
                    index = text.Length;
                    if(index > 0){
                        text = text.Substring(2,index-4);
                        links[i] = text;
                    }
                }
            }

        }

        function GetRandomLink() {

            var linkTitle : String;
            if(links.Length > 0){
                var r : int = Random.Range(0,links.Length);
                linkTitle = links[r];
                if(linkTitle.length > 0){
                    return linkTitle;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }


        }

        function DebugPassage() {

            Debug.Log(title);
            for(var i : int = 0; i < tags.Length; i++){
                Debug.Log(tags[i]);
            }
            Debug.Log(body);
            for(var j : int = 0; j < links.Length; j++){
                Debug.Log(links[j]);
            }
        }

        function GetBeat() : Beat {

            var b : Beat;

            if(CheckTag("drama")){
                b = Beat.Drama;
            }
            else if(CheckTag("action")){
                b = Beat.Action;
            }
            else if(CheckTag("break")){
                b = Beat.Break;
            }
            else{
                b = Beat.Null;
            }

            return b;

        }

    }

    public class TwineManager extends MonoBehaviour {

        // the TextAsset resource for parsing
        public var twineSourceAsset : TextAsset;

        // the Dictionary to hold all the Twine passages, keyed by title
        var passages = new Dictionary.<String,TwinePassage>();

        // a reference array of the dictionary keys
        var titles : String[] = new String[0];

        // the string that will contain the unformatted Twine file
        private var twineSource : String;

        function Parse() {

            // reference to the current passage being built from source
            var currentPassage : TwinePassage = null;

            // buffer to hold the content of current passage while building it
            var buffer : StringBuilder = new StringBuilder();

            // array that will hold all the individual lines in the Twine source
            var lines : String[];

            // utility array used when splitting a string
            var chunks : String[];

            // split the Twine source into lines
            lines = twineSource.Split("\n"[0]);

            // iterating through entire file
            for (var i : int = 0; i < lines.Length; i++){

                // if a line begins with "::" then a new passage has started
                if(lines[i].StartsWith("::")){

                    // if we were already building a passage, that one is now complete
                    // wrap it up and add it to the dictionary
                    if(currentPassage != null){
                        currentPassage.body = buffer.ToString();
                        currentPassage.FindLinks();
                        passages.Add(currentPassage.title, currentPassage);
                        buffer = new StringBuilder();
                    }

                    // 2 represents ignoring the "::" prefix, then splits the line at "["
                    chunks = lines[i].Substring(2).Replace("]","").Split("["[0]);

                    // start a new passage with passage title
                    currentPassage = new TwinePassage();
                    currentPassage.title = chunks[0].Trim();

                    // if there is anything after "[" the passage has tags, so these are split and then added
                    if(chunks.Length > 1){
                        currentPassage.tags = chunks[1].Trim().Split(" "[0]);
                    }

                } else if(currentPassage != null){

                    //if didn't start a new passage we are still in previous passage, so append line to current passage buffer
                    buffer.AppendLine(lines[i]);
                }
            }

            // at end of loop wrap up last passage and end
            if (currentPassage != null){
                currentPassage.body = buffer.ToString();
                currentPassage.FindLinks();
                passages.Add(currentPassage.title, currentPassage);
            }

        }

        function GetPassages() : Dictionary.<String,TwinePassage> {

            return passages;

        }

        function GetTitles() : String[] {

            return titles;

        }

        function Awake() {

            // Load the twine source file from resources and store the text as a huge String
            //twineSourceAsset = Resources.Load("storybeats") as TextAsset;
            twineSource = twineSourceAsset.text;

            // Parse the data
            Parse();

            // Populate the reference array
            titles = new String[passages.Count];
            passages.Keys.CopyTo(titles, 0);

        }

    }
