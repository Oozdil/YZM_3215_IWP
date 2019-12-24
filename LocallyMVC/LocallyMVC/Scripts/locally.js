 
var url = "http://localhost:8081";

function PageLoad() {
    var myPageWindowLocation = window.location.href;


    //1. User girişi control et
    var user = GetUserCookie();

  
    
    //Eğer kullanıcı admin ise
    if (user.IsAdmin == "1") {

        document.getElementById("adminMessages").style.display = "block";
    }
    else {
        document.getElementById("adminMessages").style.display = "none";
    }


    //Eğer kullanıcı var ise
    if (user.ID > 0) {

        document.getElementById("placesMenuIcon").style.display = "block";
        document.getElementById("registerIcon").style.display = "none";
        document.getElementById("loginIcon").style.display = "none";
        document.getElementById("logoutIcon").style.display = "block";
        document.getElementById("nameBadge").style.display = "block";
        document.getElementById("nameBadgeText").innerText = user.Name.substring(0, 1).toUpperCase() + user.Surname.substring(0, 1).toUpperCase();


    }
    else {

        document.getElementById("placesMenuIcon").style.display = "none";
        document.getElementById("registerIcon").style.display = "block";
        document.getElementById("loginIcon").style.display = "block";
        document.getElementById("logoutIcon").style.display = "none";
        document.getElementById("nameBadge").style.display = "none";
    }

    
    if (myPageWindowLocation.includes("Places")) {
       
       if (user.ID == 0)
            location.href = "../Index";
        else {
            LoadDefaultPlaces();
        }
    }
   

    if (myPageWindowLocation.includes("Detail")) {
       
    
        if (user.ID == 0)
            location.href = "../Index";
        else {
            document.getElementById("hiddenUserID").value = user.ID;
            LoadDetails();
        }

    }

    if (myPageWindowLocation.includes("Admin")) {

        if (user.IsAdmin == "1")
            GetMessages();
        else {
            location.href = "../Index";
        }
    }




}

function Login(email, pwd) {
    //validasyonlar
    if (!validateEmail(email)) {
        alert("Geçerli bir email giriniz");
        return;
    }
    if (pwd.trim() == "") {
        alert("Şifre boş olamaz");
        return;
    }


    $.post(url + "/process_login",
        {
            email: email,
            pwd: pwd
        },
        function (data, status) {
            if (status == 'success') {

                var obj = JSON.parse(data);

                if (obj.UserID == "") {
                    alert("Kullanıcı bulunamadı");
                }
                else {
                    document.getElementById("loginForm").reset();
                    var userCookieText = '{"user":{"ID":' + obj.UserID + ',"Name":"' + obj.Name + '","Surname":"' + obj.Surname + '","IsAdmin":' + obj.IsAdmin + ' }}';
                    document.cookie = "user=" + userCookieText;
                    location.reload();
                }
            }
        });

}

function Logout() {
    document.cookie = "user=";
    location.reload();
}

function Register(email_reg, name_reg, surname_reg, pwd_req, pwd_req_repeat) {

    //validasyonlar
    if (!validateEmail(email_reg)) {
        alert("Geçerli bir email giriniz");
        return;
    }
    if (name_reg.trim() == "" || surname_reg.trim() == "") {
        alert("İsim veya Soyisim boş olamaz");
        return;
    }
    if (pwd_req.trim() == "" || pwd_req_repeat.trim() == "") {
        alert("Şifreler boş olamaz");
        return;
    }
    if (pwd_req.trim() != pwd_req_repeat.trim()) {
        alert("Şifrelerin eşleşmiyor");
        return;
    }




    $.post(url + "/process_register",
        {
            email_reg: email_reg,
            name_reg: name_reg,
            surname_reg: surname_reg,
            pwd_req: pwd_req,
            pwd_req_repeat: pwd_req_repeat
        },
        function (data, status) {
            if (status == 'success') {

                var obj = JSON.parse(data);
                if (obj.success) {
                    alert("Kayıt Başarılı, " + name_reg + " " + surname_reg);
                    document.getElementById("registerForm").reset();
                    location.reload();
                }
                else
                    alert("Kayıt Yapılamadı, kullanıcı önceden kayıtlı");
            }

        });

}

function Contact(email_contact, subject, message) {
    if (!validateEmail(email_contact)) {
        alert("Geçerli bir email giriniz");
        return;
    }
    if (subject.trim() == "" || message.trim() == "") {
        alert("Konu veya Mesaj boş olamaz");
        return;
    }


    $.post(url + "/process_contact",
        {
            email_contact: email_contact,
            subject: subject,
            message: message,
        },
        function (data, status) {
            if (status == 'success') {
                var obj = JSON.parse(data);

                if (obj.success) {
                    alert("Mesajınız Gönderildi");
                    document.getElementById("contactForm").reset();
                }
                else
                    alert("Mesajınız gönderilemedi, bir hata oluştu");
            }
        });

}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function GetUserCookie() {


    var decodedCookie = decodeURIComponent(document.cookie);
    var allCookies = decodedCookie.split(';')

    var user = { "ID": "0", "Name": "", "Surname": "", "IsAdmin": "0" };
    


    if (allCookies.length > 0) {

        for (var i = 0; i < allCookies.length; i++) {


            if (allCookies[i].split("=")[0].trim() == "user") {
             
                try {
                    var userText = allCookies[i].split("=")[1];
                    var cookieUser = JSON.parse(userText).user;

                    user = cookieUser;
                }
                catch
                {
                  //  alert(decodedCookie);
                }
            }
        }
    }
   
    return user;
}

function ShowModal(modalIndex) {
    if (modalIndex == 1)
        $('#loginModal').modal('toggle');

    if (modalIndex == 2)
        $('#registerModal').modal('toggle');

    if (modalIndex == 3)
        $('#logoutModal').modal('toggle');

}

function GetMessages() {

    var table = document.getElementById("messageTable");

    var rowCount = table.rows.length;

    if (rowCount > 1) {
        for (var i = rowCount - 1; i > 0; i--)
            table.deleteRow(i);
    }

    $.get(url + "/process_contactMessageList", function (data, status) {
        var obj = JSON.parse(data);

        for (var i = 0; i < obj.length; i++) {
            var row = table.insertRow(i + 1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = obj[i].ID;
            var cell2 = row.insertCell(1);
            cell2.innerHTML = obj[i].FromEmail;
            var cell3 = row.insertCell(2);
            cell3.innerHTML = obj[i].Subject;
            var cell4 = row.insertCell(3);
            cell4.innerHTML = obj[i].Message;
            var cell6 = row.insertCell(4);
            cell6.innerHTML = obj[i].DateOfCreate;
            //var cell5 = row.insertCell(5);
            //cell5.innerHTML =obj[i].IsRead;					
        }
    }
    );
}
//********Checked Functions**************
 

 
 
 
 
 
 
 
 
 

 
 

//********************Details
function LoadDetails()
{	
	var myUrl=window.location.href;
	var name=myUrl.split("&name=")[1];
	var id=myUrl.split("id=")[1].split("&name=")[0];
	document.getElementById("hiddenPlaceID").value=id;
	document.title=utfConvert(name);
	
	
	$('#loadingModal').modal('toggle');	
	GetPlaceDetails(id);	
	GetComments(true);	
	$('#loadingModal').modal('toggle');	
}
function GetComments(onload)
{  
    var id = document.getElementById("hiddenPlaceID").value;
    var userid=	document.getElementById("hiddenUserID").value;
    var commentsDiv = document.getElementById("placeComments");
    commentsDiv.innerHTML = "";
    $.get(url + "/process_commentsList", function (data, status) {
        var obj = JSON.parse(data);
     
		
        for (var i = 0; i < obj.length; i++) {
            var fullDate = obj[i].DateOfCreate;
            var date = fullDate.substring(0, 10);
            var time = fullDate.substring(11, 19);
            fullDate = date + " " + time;
            var info = " (" + fullDate + " " + obj[i].FullName + ") ";
			
            if (obj[i].PlaceID == id && obj[i].Active==1)
			{
				var buttonText="";
				if(obj[i].AuthorID==userid)
				{
					buttonText="<button id="+obj[i].ID+" onclick=\"DeleteComment(this.id);\">Yorumumu Sil</button>";
				}
				
				
				 commentsDiv.innerHTML += "<p><span class='glyphicon glyphicon-pushpin'></span> <i>" + obj[i].Comment + "</i>" + "<br> <b>" + info + "</b>"+buttonText+"</p><hr>";
			}
               
        }
        if (commentsDiv.innerHTML == "")
            commentsDiv.innerHTML = "<p><i>İlk Yorum Yapan Siz Olun....</i></p>";
		if(onload)
        GetLikes(true);
    }


    );	
	
}

function GetLikes(onload)
{
	
	var likes=0;
	var dislikes=0;
	var placeid=document.getElementById("hiddenPlaceID").value;
	var userid=	document.getElementById("hiddenUserID").value;
	
	var userRating=0;
	
	$.get(url+"/process_getRatings", function(data, status)
	{	
	
		var obj = JSON.parse(data);
		
		for(var i = 0;i<obj.length;i++)
		{
			
			if(obj[i].PlaceID==placeid)
			{
				
				if(obj[i].PlaceLike.toString()=="1")
				likes++;
		     	if(obj[i].PlaceLike.toString()=="-1")
				dislikes++;
			
		    	 
			    if(obj[i].AuthorID==userid)
				{
					 //alert(JSON.stringify(obj[i]));
					 userRating=obj[i].PlaceLike;
				}
			   
			
			}
			
		}
	
	document.getElementById("pageLikes").innerHTML=likes.toString();
	document.getElementById("pageDislikes").innerHTML=dislikes.toString();
	
	//alert(userRating);
	            document.getElementById("on").checked=false;
				document.getElementById("na").checked=true;
				document.getElementById("off").checked=false;
				
			if(userRating==1)
			{		
				document.getElementById("on").checked=false;
				document.getElementById("na").checked=false;
				document.getElementById("off").checked=true;
				document.getElementById("RateResult").innerHTML="Liked";
				document.getElementById("RateSelection").style.backgroundColor ="green";
			}
			if(userRating=="-1")
			{		
				document.getElementById("on").checked=true;
				document.getElementById("na").checked=false;
				document.getElementById("off").checked=false;
				document.getElementById("RateResult").innerHTML="Disliked";
				document.getElementById("RateSelection").style.backgroundColor ="red";
			}
			
			if(onload)
			GetImages(placeid);
		
	}
	);
	
}
 function GetImages(placeid)
 {	 
	var imagecontainer=document.getElementById("userImageContainer");
	imagecontainer.innerHTML="";
    $.get(url + "/process_UserImagesList", function (data, status) {
		 var obj = JSON.parse(data);
		 for(var i=0;i<obj.length;i++)
		 {
			 if(placeid==obj[i].PlaceID)
			imagecontainer.innerHTML+="<img src="+url+"/Uploaded/"+obj[i].ImageUrl+" onclick='OpenBigImage(this.src);' class='userImages' alt='"+obj[i].PlaceID+"-"+i.toString()+"' width='48%' height='200px'>";
		 }
		 
		 if(imagecontainer.innerHTML=="")
		 imagecontainer.innerHTML="<p><i>İlk Resim Yükleyen Siz Olun....</i></p>";
	 
	 
        PageVisit();

    }


    );	

 }
 function PageVisit()
 {
	var placeid=document.getElementById("hiddenPlaceID").value;
	var userid=	document.getElementById("hiddenUserID").value;
	 	$.post(url + "/process_pageVisit",
		{
		 AuthorID:userid, 
		 PlaceID:placeid				 
		},
		function(data,status){	
		var visitCount = JSON.parse(data)[0].PlaceVisitCount;
		document.getElementById("pageHit").innerHTML=visitCount;
		 
		}); 
	 
 }
 function Rate(rating)
{

var resultText=document.getElementById("RateResult");
var selectionBox=document.getElementById("RateSelection");
		

		if(rating==-1)
		{
		resultText.innerHTML="Disliked";
		selectionBox.style.backgroundColor ="#e2b4b6";		
		}

		if(rating==1)
		{
		resultText.innerHTML="Liked";
		selectionBox.style.backgroundColor ="#b4cde2";
		}
		if(rating==0)
		{
		resultText.innerHTML="Not Rated";
		selectionBox.style.backgroundColor="#a5dba2";
		}
        ChangeRatingStatus(rating);
}

function ChangeRatingStatus(rating)
{
	var Rating=rating;
	var AuthorID=document.getElementById("hiddenUserID").value;
	var PlaceID=document.getElementById("hiddenPlaceID").value;
	
		$.post(url+"/process_changeRating",
		{
		 PlaceID: PlaceID,
		 AuthorID: AuthorID,
		 Rating: Rating
		},
		function(data,status){
			//alert("like değişti");
			GetLikes(false);
			
		});
	
	
}
//********************Details







 //*******************************************************
 
function MakeComment()
{
	var PlaceID=document.getElementById("hiddenPlaceID").value;
	var AuthorID=	document.getElementById("hiddenUserID").value;
	
	var Comment=document.getElementById("placeComment").value;
	
	
	$.post(url+"/process_makeComment",
		{
		 PlaceID: PlaceID,
         AuthorID: AuthorID,
		 Comment: Comment,
		},
		function(data,status){
		  if(status=='success')
		  {
			 alert("Make Comment Başarılı");			 
			 GetComments(false);
			 document.getElementById("placeComment").value="";			 
	         document.getElementById("remainingChars").innerText="250";
		  }
		  
		});
	
}
 
function commentLengthValidation(commentValue)
{
	var remaining=250-commentValue.length;
	document.getElementById("remainingChars").innerText=remaining;
	

}
 

 
function OpenBigImage(sourceOfImage)
{
   // var img = new Image();
   // img.onload = function () {
   //     var x = this.width / this.height;
   //     document.getElementById("bigImg").width = document.getElementById("bigImg").height / x;
   // }
   //img.src = 'http://www.google.com/intl/en_ALL/images/logo.gif';

	document.getElementById("bigImg").src=sourceOfImage;
	$('#bigImageModal').modal('toggle');
	//alert(sourceOfImage);
	
}
function previewUploadImage(FileInput)
{   

	if (FileInput.files && FileInput.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#previewImg')
                        .attr('src', e.target.result);
                };

                reader.readAsDataURL(FileInput.files[0]);
            }
	
	
}
 
 
function DeleteComment(commentID)
{
	
		$.post(url+"/process_deleteComment",
		{
		 CommentID: commentID
		},
		function(data,status){
		  if(status=='success')
		  alert("Yorumunuz silinmiştir");
	  
	      GetComments(false);
		});	
}
 
function UploadFile()
{
	
	var filesCount=document.getElementById('userPhoto').files.length;
	var PlaceID=document.getElementById("hiddenPlaceID").value;
	var AuthorID=	document.getElementById("hiddenUserID").value;
	if(filesCount>0)
	{
	    var MyFile=document.getElementById('userPhoto').files[0];		
        var MyExtension=MyFile.name.split('.')[1];	
		
		var d = new Date().toLocaleString().replace(/\s/g, '').replace(/\./g, '').replace(/\:/g, '');
		var date=d.substring(4,8)+d.substring(2,4)+d.substring(0,2);
		var time=d.substring(8,16);
		var MyDate=date+time;
		
		
		var NewName=PlaceID+"_"+MyDate+"."+MyExtension;
		
		
		
		
		
        var data= new FormData();
		data.append("userPhoto",MyFile,NewName);
		
		
		
		var result=$.ajax({
                url: url+'/process_upload',
                processData: false,
                contentType: false,
                data: data,
				dataType: "text",
                type: 'POST',
				 success: function(response) {
					
				}
            });
		
			
		 
		
		SaveUploadedUrl(NewName,AuthorID,PlaceID);
		
		document.getElementById("userPhoto").value="";	
	}
	else{
		alert("Dosya seçmediniz...");
	}
	 
      
        
}
function SaveUploadedUrl(NewName,AuthorID,PlaceID)
{
	
	$.post(url+"/process_saveImageUrl",
		{
		 NewName:NewName,
		 AuthorID:AuthorID,
		 PlaceID:PlaceID
		},
		function(data,status){
		  if(status=='success')
		  {}
	      
		});		
	alert("Fotoğrafınız yüklenmiştir"); 
	location.reload();
}






















