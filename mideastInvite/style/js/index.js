Index = (function (info) {
    return (info = {
        downloadUrl: "",
        swiper: null,
        packageType: 1,
        shareId: "",

        init: function () {
            $(".login-button").show();
            $(".logged").hide();
            $(".loader-wrapper").hide();
            $("html, section").css("visibility", "visible");
            Index.initPage();
            Index.initDownloadUrl();
        },
        initPage: function () {
            swiper = new Swiper(".swiper-container", {
                loop: true,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                autoplay: true,
                // autoplay: {
                //     delay: 2500,
                //     disableOnInteraction: false,
                // },
            });
        },
        initDownloadUrl: function () {
            var param = {};
            Index.shareId = RequestCommon.getParam("shareId");
            if (Index.shareId && Index.shareId.trim() != "") {
                param.shareId = Index.shareId;
            }
            $("#g_id_onload").attr("data-client_id", GoogleClientId);

            $("#googleDown").attr("href", DownloadAndroidUrl);
            $("#googleDown").show();
        },
        showPopup: function () {
            $("#operator-tips-modal").show();
            // $("#operator-tips-modal .pay-tips p").html(content);
        },
        hidePopup: function () {
            $("#operator-tips-modal").hide();
        },
        makeColor: function () {
            var color = "rgb(" + ran() + "," + ran() + "," + ran() + ")";
            $(".sk-grid-cube").css({
                background: color,
            });
        },
        ran: function () {
            return Math.floor(Math.random() * 256);
        },
        statusChangeCallback: function (response) {
            // Called with the results from FB.getLoginStatus().
            console.log("statusChangeCallback");
            console.log(response); // The current login status of the person.
            if (response.status === "connected") {
                // Logged into your webpage and Facebook.
                FacebookAPI(response.authResponse);
                $(".login-button").hide();
                $(".logged").show();
            } else {
                // Not logged into your webpage or we are unable to tell.
                $(".login-button").show();
                $(".logged").hide();
            }
        },
        checkLoginState: function () {
            // Called when a person is finished with the Login Button.
            FB.getLoginStatus(function (response) {
                // See the onlogin handler
                Index.statusChangeCallback(response);
            });
        },
        initializeFacebookSdk: function () {
            /* Asynchronous flow: if the global 'FB' variable is still undefined,
               then the facebook script hasn't loaded yet, in that case, provide
               a global callback that will be called by the facebook code. If the 
               variable is already present, just call the code right away and forget
               about the callback. */
            if (window.FB === undefined) {
                console.log("FB undefined -> provide callback");
                window.fbAsyncInit = function () {
                    initialize();
                };
            } else {
                console.log("FB defined -> call init right away");
                initialize();
            }

            function initialize() {
                window.FB.init({
                    appId: FacebookAPPId,
                    cookie: true, // Enable cookies to allow the server to access the session.
                    xfbml: true, // Parse social plugins on this webpage.
                    version: FacebookVersion, // Use this Graph API version for this call.
                });
                Index.checkLoginState();
            }
        },
        fbLogin: function () {
            FB.login(function (response) {
                Index.statusChangeCallback(response); // Returns the login status.
            });
        },
        FacebookAPI: function (authResponse) {
            // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
            if (!authResponse) {
                return;
            }
            let accessToken = authResponse.accessToken;
            if (!accessToken) {
                return;
            }
            FB.api("/me", function (response) {
                let faceUrl = "https://graph.facebook.com/" + response.id + "/picture?type=large";
                console.log("faceUrl1 =", faceUrl);
                if (response && response.picture && response.picture.data) {
                    faceUrl = response.picture.data.url;
                    console.log("faceUrl2 =", faceUrl);
                }
                let imei = "fb." + response.id;
                let nickname = response.name;
                let headImg = faceUrl;
                console.log("Successful login for: " + response.name);
                this.Request = utils.getRequest();
                if (this.Request) {
                    let teacherId = this.Request.teacherId;
                    if (!teacherId || utils.isBlank(teacherId)) return;

                    let model = {
                        IMei: imei,
                        NickName: nickname,
                        FaceUrl: headImg, //escape(headImg),
                        PartnerID: PartnerID,
                        Version: Version,
                        TeacherID: teacherId,
                        AccessToken: accessToken,
                    };
                    Index.register(model);
                }
            });
        },
        GoogleAPI: function (authResponse) {
            // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
            if (!authResponse) {
                return;
            }
            let clientId = authResponse.clientId;
            let accessToken = authResponse.credential;
            if (!accessToken) {
                return;
            }
            //调用接口
            var apiUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`;
            $.ajax({
                type: "post", //使用提交的方法 post、get
                url: apiUrl, //提交的地址
                data: null, //数据
                async: true, //配置是否异步操作
                dataType: "json", //返回数据类型的格式
                complete: function (XMLHttpRequest, textStatus) {
                    var result = null;
                    try {
                        result = eval("(" + XMLHttpRequest.responseText + ")");
                    } catch (e) {
                        alert("فشل ف الاتصال: " + e.message);
                        return;
                    }
                    if (!result) {
                        $(".icon-status").attr("src", "style/images/icon_status_fail.png");
                        $(".title-status").html("فشل الربط ");
                        $(".text").html("عندما تفشل قاعدة بيانات الربط ستظهر رسالة فشل ف الاتصال");
                        Index.showPopup();
                        return;
                    }
                    console.log("result =", result);
                    let imei = "gg." + result.sub; //V1/V2是user_id
                    let nickname = result.name;
                    let headImg = result.picture;

                    this.Request = utils.getRequest();
                    if (this.Request) {
                        let teacherId = this.Request.teacherId;
                        if (!teacherId || utils.isBlank(teacherId)) return;

                        let model = {
                            IMei: imei,
                            NickName: nickname,
                            FaceUrl: headImg, //escape(headImg),
                            PartnerID: PartnerID,
                            Version: Version,
                            TeacherID: teacherId,
                            AccessToken: accessToken,
                        };
                        Index.register(model);
                        $(".login-button").hide();
                        $(".logged").show();
                    }
                },
            });
        },
        register: function (model) {
            //调用接口
            var apiUrl = RegisterUrl;

            $.ajax({
                type: "post", //使用提交的方法 post、get
                url: apiUrl, //提交的地址
                data: model, //数据
                async: false, //配置是否异步操作
                dataType: "json", //返回数据类型的格式
                complete: function (XMLHttpRequest, textStatus) {
                    var result = null;
                    try {
                        result = eval("(" + XMLHttpRequest.responseText + ")");
                    } catch (e) {
                        alert("فشل ف الاتصال: " + e.message);
                        return;
                    }
                    if (!result) {
                         $(".icon-status").attr("src", "style/images/icon_status_fail.png");
                         $(".title-status").html("فشل الربط ");
                         $(".text").html("عندما تفشل قاعدة بيانات الربط ستظهر رسالة فشل ف الاتصال");
                         Index.showPopup();
                        return;
                    }
                    //解析失败
                    if (result.RetCode != 1) {
                        $(".icon-status").attr("src", "style/images/icon_status_fail.png");
                        $(".title-status").html("فشل الربط ");
                        $(".text").html(
                            "الرجاء الدخول للعبة لمعرفة ما إذا كان هناك لاعبون أخرون ام لا ، أو اتصل بموظفينا !"
                        );
                        Index.showPopup();
                    } else {
                        $(".icon-status").attr("src", "style/images/icon_status_success.png");
                        $(".title-status").html("تهانينا ، تم الربط بنجاح ");
                        $(".text").html(
                            "تم توزيع الجوائز ذات الصلة علي حساب اللعبة الخاص بك ويمكنك التحقق منها في اللعبة "
                        );
                        Index.showPopup();
                        return true;
                    }
                },
            });
        },
    });
})();
Index.init();
