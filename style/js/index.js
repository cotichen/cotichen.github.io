$(document).ready(function() {
    $('.fb-login-button').hide();
    $('.logged').hide();
    this.Request = utils.getRequest();

});


$(window).load(function() {
    $('.loader-wrapper').hide();
    $('html, section').css('visibility', 'visible');
});


var swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    }
});

function showPopup() {
    $("#popupDiv").show();
    $("#shadowDiv").show();
};

function hidePopup() {
    $("#popupDiv").hide();
    $("#shadowDiv").hide();
};


//setInterval(makeColor, 500)

function makeColor() {
    var color = 'rgb(' + ran() + ',' + ran() + ',' + ran() + ')';
    $('.sk-grid-cube').css({
        "background": color
    });
}

function ran() {
    return Math.floor(Math.random() * 256);
}

function statusChangeCallback(response) { // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response); // The current login status of the person.
    if (response.status === 'connected') { // Logged into your webpage and Facebook.
        // test(response.authResponse.accessToken)
        // let testUrl ="https://graph.facebook.com/me?fields=" + response.authResponse.userID +"&access_token=" + response.authResponse.accessToken;
        // console.log("testUrl");
        // console.log(testUrl);
        FacebookAPI();
        $('.fb-login-button').hide();
        $('.logged').show();
    } else { // Not logged into your webpage or we are unable to tell.
        $('.fb-login-button').show();
        $('.logged').hide();
    }
}

function checkLoginState() { // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) { // See the onlogin handler
        statusChangeCallback(response);
    });
}


window.fbAsyncInit = function() {
    FB.init({
        appId: '912378863044075',
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: 'v12.0' // Use this Graph API version for this call.
    });


    FB.getLoginStatus(function(response) { // Called after the JS SDK has been initialized.
        statusChangeCallback(response); // Returns the login status.
    });
};

function h5Url() {
    window.location.href = "https://www.dominogaming.net/game/";
};

function downloadAndroidUrl() {
    window.location.href = "https://dl.dominogaming.net/domino.apk";
};

function fbLogin() {
    FB.login(function(response) {
        statusChangeCallback(response); // Returns the login status.
        //     if (response.authResponse) {
        //         console.log('Welcome!  Fetching your information.... ');
        //         //console.log(response); // dump complete info
        //         access_token = response.authResponse.accessToken; //get access token
        //         user_id = response.authResponse.userID; //get FB UID

        //         FB.api('/me', function(response) {
        //             user_email = response.email; //get user email
        //             // you can store this data into your database             
        //         });

        //     } else {
        //         //user hit cancel button
        //         console.log('User cancelled login or did not fully authorize.');

        //     }
        // }, {
        //     scope: 'publish_stream,email'
    });
}

function FacebookAPI() { // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {

        let faceUrl = "https://graph.facebook.com/" + response.id + "/picture?type=large"
        console.log("faceUrl1 =", faceUrl)
        if (response && response.picture && response.picture.data) {
            faceUrl = response.picture.data.url
            console.log("faceUrl2 =", faceUrl)
        }
        let imei = "fb." + response.id;
        let nickname = response.name;
        let headImg = faceUrl;
        console.log('成功登录信息 ', response);
        console.log('Successful login for: ' + response.name);
        // document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';


        if (this.Request) {
            let teacherId = this.Request.teacherId;
            if (!teacherId || utils.isBlank(teacherId))
                return

            let model = {
                "IMei": imei,
                "NickName": nickname,
                "FaceUrl": headImg, //escape(headImg),
                "PartnerID": 30002,
                "Version": 1,
                "TeacherID": teacherId,
            };
            register(model)
        }


    });
}

function register(model) {
    //调用接口
    var apiUrl = 'https://domino.ss2007.com:8088/hall/register';

    $.ajax({
        type: "post", //使用提交的方法 post、get
        url: apiUrl, //提交的地址
        data: model, //数据
        async: false, //配置是否异步操作
        dataType: "json", //返回数据类型的格式
        complete: function(XMLHttpRequest, textStatus) {
            var result = null;
            try {
                result = eval("(" + XMLHttpRequest.responseText + ")");
            } catch (e) {
                alert("Komunikasi data gagal: " + e.message);
                return;
            }
            if (!result) {
                alert('Komunikasi data gagal！');
                return;
            }
            //解析失败
            if (result.RetCode != 1) {
                $('.icon-status').attr('src', 'style/images/icon_status_fail.png');
                $('.title-status').html('Binding gagal');
                $('.text').html('Silakan masuk ke game untuk memeriksa apakah pemain lain telah terikat. Atau hubungi staf kami!')
                showPopup()
            } else {
                $('.icon-status').attr('src', 'style/images/icon_status_success.png');
                $('.title-status').html('Selamat, pengikatan berhasil!');
                $('.text').html('Hadiah yang relevan telah didistribusikan ke akun game Anda, Anda dapat memeriksanya di dalam game!')
                showPopup()
                return true;
            }

        }
    });

}