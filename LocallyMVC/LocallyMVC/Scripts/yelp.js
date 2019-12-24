var url="http://localhost:8081";

function LoadDefaultPlaces()
{
	
	var decodedCookie = decodeURIComponent(document.cookie);
	var allCookies=decodedCookie.split(';')	
	var searchCookieExist=false;
	var searchText="";
	var cookieSearch="";
	
	for(var i=0;i<allCookies.length;i++)
		{
			
			if(allCookies[i].split("=")[0].trim()=="search")
			{
				searchCookieExist=true;
				searchText=allCookies[i].split("=")[1];	
				cookieSearch= JSON.parse(searchText).search;
				
			}
		}
	
	
	var cookieSearchText = '';
	var LastLocation="";
	var LastLat="";
	var LastLon="";
	var LastTerm="";
	
	if(searchCookieExist)
	{
		         LastLocation=cookieSearch.Location;
				 LastLat=cookieSearch.Lat;
				 LastLon=cookieSearch.Lon;
				 LastTerm=cookieSearch.Term;
				 
				 LastCoord=LastLat+LastLon;
			
				//alert(LastLocation+":"+LastTerm+" : "+LastLat+" : "+LastLon);
				
				if(LastCoord.trim()=="" && LastLocation.trim()=="")
				{
				 LastLocation="izmir";
				 GetPlacesByLocationAndTerm(LastLocation,LastTerm);
				}			
				
				else if(LastCoord.trim()=="")
				{
			
				GetPlacesByLocationAndTerm(LastLocation,LastTerm);				
				}
				
				else
				{	
                			
				GetPlacesByCoords(LastLat,LastLon,LastTerm);		   
				
				}
	}
	else
	{
		LastLocation="izmir";
		GetPlacesByLocationAndTerm(LastLocation,LastTerm);
	}
	
	document.getElementById("searchTerm").value=LastTerm;
	document.getElementById("searchPlace").value=LastLocation;
	document.getElementById("searchLatitude").value=LastLat;
	document.getElementById("searchLongitude").value=LastLon;
	cookieSearchText = '{"search":{"Location":"'+LastLocation+'","Lat":"'+LastLat+'","Lon":"'+LastLon+'","Term":"'+LastTerm+'" }}';
	document.cookie = "search="+cookieSearchText;
	

} 

function CreatePlaceCards(x,place)
{
   
	x.innerHTML+="<div class='col-sm-4 col-xs-6' >"+
				"<img src='"+imageUrlConvert(place.image_url)+"' style='width:100%;height:200px'>"+
				"<h4>"+utfConvert(place.name)+"</h4>"+	
				"<p>Uzaklık : "+parseInt(place.distance)+" m </p>"+	
				"<p>"+CategoriesToString(place.categories)+"</p>"+
        "<p><a  class='btn btn-primary' href='Detail/?id=" + place.id + "&name=" + place.alias + "' target='_blank'>Detaya Git</a></p></div>";

  
}



function CategoriesToString(categories)
{	
	var catCount=categories.length;
    var keys=[];
	
	for(var i=0;i<catCount;i++)
	{
		keys.push(categories[i].alias);
		keys.push(categories[i].title);
	}
	
	keysString=keys.toString();
	
	
	
	if(keysString.length>=40)
		keysString=keysString.substring(0,37)+"...";
	
	return keysString;
}

function CategoriesToStringLong(categories)
{	
	var catCount=categories.length;
    var keys=[];
	
	for(var i=0;i<catCount;i++)
	{
		keys.push(categories[i].alias);
		keys.push(categories[i].title);
	}
	
	keysString=keys.toString();
	

	
	return keysString;
}

function imageUrlConvert(text)
{
	var url=text;
if(url.length<5)
	url="/../Images/AvatarPlace.jpg";

	return url;
}

function utfConvert(text)
{
	
	var placeName=text;
	
	placeName=placeName.replace(/\\u00f6/g,"ö");
	placeName=placeName.replace(/\\u00d6/g,"Ö");
	placeName=placeName.replace(/\\u011f/g,"ğ");
	placeName=placeName.replace(/\\u0131/g,"ı");
	placeName=placeName.replace(/\\u0130/g,"İ");
	placeName=placeName.replace(/\\u00fc/g,"ü");
	placeName=placeName.replace(/\\u00dc/g,"Ü");
	
	placeName=placeName.replace(/\\u00e7/g,"ç");
	placeName=placeName.replace(/\\u00c7/g,"Ç");
	placeName=placeName.replace(/\\u015e/g,"Ş");
	placeName=placeName.replace(/\\u015f/g,"ş");
	
	return placeName;
}



function SetSearchCookie()
{
	
	var LastLocation=document.getElementById("searchPlace").value;
	var LastLat=document.getElementById("searchLatitude").value;
	var LastLon=document.getElementById("searchLongitude").value;
	var LastTerm=document.getElementById("searchTerm").value;
	
	defaultSearchText = '{"search":{"Location":"'+LastLocation+'","Lat":"'+LastLat+'","Lon":"'+LastLon+'","Term":"'+LastTerm+'" }}';
	document.cookie = "search="+defaultSearchText;
	
}

function GetPlacesByLocationAndTerm(searchLocation,term)
{
    $('#loadingModal').modal('toggle');
	searchLocation=searchLocation.toLowerCase();	
	term=term.toLowerCase();
	term=encodeURI(term);	
	
    if(searchLocation=="")
	{
		alert("Lütfen bir konum giriniz!");
		return;
	}
	
	
	$.post(url+"/process_getPlacesByLocationAndTerm",
		{
		 location:searchLocation,
		 term:term
		},
		function(data,status)
		{		
			var x = document.getElementById("placeContainer"); 		
			var obj = JSON.parse(data.substring(1, data.length-1).replace(/\\"/g, "\""));
				
			x.innerHTML="";
			 for(var i=0;i<obj.businesses.length;i++)
			 {
				var place=obj.businesses[i];
				CreatePlaceCards(x,place);
				
			 }	
			 
			 document.getElementById("searchResultSummary").innerHTML="Konum : "+searchLocation+", Kelime : "+term+" için, "+obj.businesses.length+" adet arama sonucu";
			 
			 if(obj.businesses.length==0)
        		 document.getElementById("searchResultSummary").innerHTML="Sonuç bulunamadı";
			 $('#loadingModal').modal('toggle');
		});	
	
} 

function getLocation() {
	
  if (navigator.geolocation) {	  
    navigator.geolocation.getCurrentPosition(showPlaces);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}



function showPlaces(position) {
	 	 var latitude = position.coords.latitude;
         var longitude= position.coords.longitude;  
		
	     document.getElementById("searchLatitude").value=latitude;
	     document.getElementById("searchLongitude").value=longitude;		
}






function GetPlacesByCoords(lat,lon,term)
{
	if(lat=="" || lon=="")
	{
		alert("Lütfen koordinatları kontrol ediniz!");
		return;
	}
	term=term.toLowerCase();
	term=encodeURI(term);

	
	$('#loadingModal').modal('toggle');
	
	$.post(url+"/process_getPlacesByCoords",
		{
		 latitude:lat,
		 longitude:lon,
		 term:term
		},
		function(data,status)
		{		
			var x = document.getElementById("placeContainer");  
		
		
			var obj = JSON.parse(data.substring(1, data.length-1).replace(/\\"/g, "\""));
				
			x.innerHTML="";
			 for(var i=0;i<obj.businesses.length;i++)
			 {
				var place=obj.businesses[i];
				CreatePlaceCards(x,place);
				
			 }		
         	
			document.getElementById("searchResultSummary").innerHTML="Lat : "+lat+"Lon :"+lon+", Kelime : "+term+" için, "+obj.businesses.length+" adet arama sonucu";
			 
			 if(obj.businesses.length==0)
        		 document.getElementById("searchResultSummary").innerHTML="Sonuç bulunamadı";
			 $('#loadingModal').modal('toggle');
		});	
	//$('#loadingModal').modal('toggle');
} 


function myMap(lat,lon,name) {

var mapProp= {
  center:new google.maps.LatLng(lat,lon),
  zoom:15,
};
var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
var marker = new google.maps.Marker({position: new google.maps.LatLng(lat,lon)});

marker.setMap(map);
var infowindow = new google.maps.InfoWindow({
  content:name
});

infowindow.open(map,marker);
}




function GetPlaceDetails(id)
{
	
	
	
	$.post(url+"/process_getPlaceDetails",
		{
		 id:id		 
		},
		function(data,status)
		{		
		var obj = JSON.parse(data.substring(1, data.length-1).replace(/\\"/g, "\""));
		
		document.getElementById("placeName").innerText=utfConvert(obj.name);  
		document.getElementById("placeNameCommentModal").innerText=utfConvert(obj.name);  
		document.getElementById("placeAddress").innerText=utfConvert(obj.location.display_address.toString()); 
		document.getElementById("placePhone").innerText=obj.display_phone; 
		document.getElementById("placeCategories").innerText=CategoriesToStringLong(obj.categories).toUpperCase();
		var lat=obj.coordinates.latitude;
		var lon=obj.coordinates.longitude;
		myMap(lat,lon,utfConvert(obj.name));
		
		
		document.getElementById("placeImg1").src="Images/AvatarPlace.jpg"; 
		document.getElementById("placeImg2").src="Images/AvatarPlace.jpg"; 
		document.getElementById("placeImg3").src="Images/AvatarPlace.jpg"; 
		if(obj.photos.length>2)
		{
		 document.getElementById("placeImg3").src=obj.photos[2]; 
		 document.getElementById("placeImg3").alt=utfConvert(obj.name)+"_foto_3"; 
		}
		if(obj.photos.length>1)
		{
		document.getElementById("placeImg2").src=obj.photos[1]; 
		document.getElementById("placeImg2").alt=utfConvert(obj.name)+"_foto_2"; 
		}
		if(obj.photos.length>0)
		{
		document.getElementById("placeImg1").src=obj.photos[0]; 
		document.getElementById("placeImg1").alt=utfConvert(obj.name)+"_foto_1"; 
		}
			
		});	
	
}




//*************************************************************************


