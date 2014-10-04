/**
 * Created by antoniosilva on 03/10/14.
 */

function CreateXmlHttpRequestObject( )
{

    if (window.XMLHttpRequest)
    {
        xmlHttpObj=new XMLHttpRequest()

    }
    else if (window.ActiveXObject)
    {
        xmlHttpObj=new ActiveXObject("Microsoft.XMLHTTP")
    }
    return xmlHttpObj;
}

    //Function that calls via AJaX the php function that returns the top tags of an artist
function getArtistTopTags(){
    var xmlHttpObj = CreateXmlHttpRequestObject();
    var artist = document.getElementById("artistName").value;
    xmlHttpObj.open("GET", "http://phpdev2.dei.isep.ipp.pt/~i111305/trabalho1/trabalho1.php?artist=" + artist, true);
    xmlHttpObj.onreadystatechange = function() {
        if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
            var response = xmlHttpObj.responseText;
            var tagNameList = response.split(";");
            var divTopTags = document.getElementById("divTopTags");
            divTopTags.innerHTML="";
            var select = document.createElement("select");
            select.id="selectTopTag";
            select.onchange = function(){getTopTracksTag();};
            for (var i = 0; i < tagNameList.length - 1; i++){
                var option = document.createElement("option");
                var text = document.createTextNode(tagNameList[i]);
                option.appendChild(text);
                option.value = tagNameList[i];
                select.appendChild(option);
            }
            divTopTags.appendChild(select);
        }
    };
    xmlHttpObj.send(null);
}

    //Function that get's via AJaX the N top tracks of a tag
function getTopTracksTag() {
    var xmlHttpObj = CreateXmlHttpRequestObject();
    var tag = document.getElementById("selectTopTag").value;
    var limit = document.getElementById("topTrackLimit").value;
    xmlHttpObj.open("GET", "http://phpdev2.dei.isep.ipp.pt/~i111305/trabalho1/trabalho1.php?tag=" + tag + "&limit=" + limit, true);
    xmlHttpObj.onreadystatechange = function () {
        if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200){
            var response = JSON.parse(xmlHttpObj.responseText);
            var divTagTopTracks = document.getElementById("divTagTopTracks");
            var table = document.createElement("table");
            for (var i = 0; i < response.length; i++){
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                var a = document.createElement("a");
                var text = document.createTextNode(response[i].name);
                a.appendChild(text);
                a.href=response[i].url;
                td.appendChild(a);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            divTagTopTracks.appendChild(table);
        }
    };
    xmlHttpObj.send(null);
}













