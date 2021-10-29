const H5Url = 'https://www.dominogaming.net/game/';
const DownloadAndroidUrl = 'https://dl.dominogaming.net/domino.apk';
const FacebookAPPId = '912378863044075'; //自己的912378863044075 //629934927889653
const FacebookVersion = 'v12.0';
const PartnerID = '30002';
const Version = '1';
const RegisterUrl = 'https://domino.ss2007.com:8088/hall/register';

$(document).ready(function() {
    $('.fb-login-button').hide();
    $('.logged').hide();

    window.fbAsyncInit = function() {
        FB.init({
            appId: FacebookAPPId,
            cookie: true, // Enable cookies to allow the server to access the session.
            xfbml: true, // Parse social plugins on this webpage.
            version: FacebookVersion // Use this Graph API version for this call.
        });

        checkLoginState();
    };
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




function h5Url() {
    window.location.href = H5Url;
};

function downloadAndroidUrl() {
    window.location.href = DownloadAndroidUrl;
};

function fbLogin() {
    FB.login(function(response) {
        statusChangeCallback(response); // Returns the login status.
    });
}

function FacebookAPI() { // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
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
        console.log('Successful login for: ' + response.name);
        this.Request = utils.getRequest();
        if (this.Request) {
            let teacherId = this.Request.teacherId;
            if (!teacherId || utils.isBlank(teacherId))
                return

            let model = {
                "IMei": imei,
                "NickName": nickname,
                "FaceUrl": headImg, //escape(headImg),
                "PartnerID": PartnerID,
                "Version": Version,
                "TeacherID": teacherId,
            };
            register(model)
        }


    });
}

function register(model) {
    //调用接口
    var apiUrl = RegisterUrl;

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