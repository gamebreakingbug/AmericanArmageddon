#pragma strict

import UnityEngine.UI;

    public class TextBoxClass extends MonoBehaviour {

        var txt : Text;
        var img : Image;

        function Awake(){

            txt = gameObject.GetComponentInChildren(Text);
            img = gameObject.GetComponentInChildren(Image);

        }

        function SetText (t:String) {

            txt.text = t;
            Debug.Log("text  = " + txt.rectTransform.rect);
            Debug.Log("image = " + img.rectTransform.rect);

        }

    }
