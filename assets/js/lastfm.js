// Global Variables
var divTooltip;

//Function that calls via AJaX the php function that returns the top tags of an artist
function getArtistTopTags(){
    var artist = document.getElementById("artistName").value;

    //send ajax request
    sendRequest("assets/php/lastfm.php?func=getArtistTopTags&artist=" + artist, function(xmlHttpObj) {
        var response = xmlHttpObj.responseText;
        var tagNameList = response.split(";");
        var divTopTags = document.getElementById("divTopTags");
        var select = document.getElementById("selectTopTag");
        select.innerHTML="";
        select.onchange = function(){getTopTracksTag();};

        var option0 = document.createElement("option");
        var text0 = document.createTextNode("--");
        option0.appendChild(text0);
        option0.value = "--";
        select.appendChild(option0);

        for (var i = 0; i < tagNameList.length - 1; i++){
            var option = document.createElement("option");
            var text = document.createTextNode(tagNameList[i]);
            option.appendChild(text);
            option.value = tagNameList[i];
            select.appendChild(option);
        }
    }, "GET");
}

//Function that get's via AJaX the N top tracks of a tag
function getTopTracksTag() {
    var limit = document.getElementById("topTrackLimit").value;
    var tag = document.getElementById("selectTopTag").value;
    tag = tag.replace(/ /g, "%20");

    var url = "assets/php/lastfm.php?func=getTopTracksTag&tag=" + tag + "&limit=" + limit + "&format=json";

    //send ajax request
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var topTracks = response.toptracks.track;
        var divTagTopTracks = document.getElementById("divTagTopTracks");
        divTagTopTracks.innerHTML="";
        var table = document.createElement("table");
        for (var i = 0; i < topTracks.length; i++) {
            //getMoreInfo(topTracks[i].artist.name, topTracks[i].name);
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var a = document.createElement("a");
            var text = document.createTextNode(topTracks[i].name);
            a.appendChild(text);
            var method = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+")";
            a.href="javascript:"+method+";";
            td.appendChild(a);
            tr.appendChild(td);
            table.appendChild(tr);
        }
        divTagTopTracks.appendChild(table);
    }), "GET";
}
//Function that  get's via AJaX a list of info of selected track
function getMoreInfo(artistName, trackName) {
    divTooltip = document.getElementById("divToolTip");
    divTooltip.innerHTML = "";
    var artistNameCorrect = artistName;
    artistName = artistName.replace(/ /g, "%20");
    // set album name
    setAlbumName(artistName,trackName);
    // set artist image
    setArtistImage(artistName);
    // set artist top 3 albums artist
    setTop3Albums(artistName);
    // set artist toptrack
    setArtistTopTrack(artistName);
}

function setAlbumName(artistName,trackName) {
    trackName = trackName.replace(/ /g, "%20");
    var url = "assets/php/lastfm.php?func=getTrackInfo&track=" + trackName + "&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var p = document.createElement("p");
        p.innerHTML += "Artist Name: " + response.track.artist.name;
        divTooltip.appendChild(p);
        var p2 = document.createElement("p");
        p2.innerHTML += "Album Name " + response.track.album.title;
        divTooltip.appendChild(p2);
    }), "GET";
}

function setArtistImage(artistName) {
    var url = "assets/php/lastfm.php?func=getArtistImage&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var image = document.createElement("img");
        image.src = response.artist.image[2]["#text"];
        divTooltip.appendChild(image);
    }), "GET";
}

function setTop3Albums(artistName) {
    url = "assets/php/lastfm.php?func=getArtistTop3Albums&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var p = document.createElement("p");
        p.innerHTML += "Top 3 albums: ";
        for(var i=0; i < 3; i++) {
            p.innerHTML += response.topalbums.album[i].name;
            if(i==0 || i==1) {
                p.innerHTML += ", ";
            }
        }
        divTooltip.appendChild(p);
    }), "GET";
}

function setArtistTopTrack(artistName) {
    url = "assets/php/lastfm.php?func=getArtistTopTrack&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var p = document.createElement("p");
        p.innerHTML += "Top Track: " + response.toptracks.track[0].name;
        divTooltip.appendChild(p);
    }), "GET";
}