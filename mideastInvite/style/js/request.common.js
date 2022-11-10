var SUCCESS_CODE = 0;

RequestCommon = (function (info) {
    return (info = {
        callSuccess: null,
        callError: null,
        requestDomain: RequestDomain,

        /**
         *  init
         */
        init: function () {
            $.ajaxSetup({
                //request error
                error: function (xhr) {
                    RequestCommon.showRequestTipModal(
                        "خلل في البيانات،يُرجى المحاولة مرة أخرى لاحقاً"
                    );
                },
                //global set param
                data: {
                    partnerToken: RequestCommon.partnerToken,
                    partnerId: RequestCommon.partnerId,
                },
            });
        },
        /**
         * ajax request
         * @param url           url
         * @param data          data
         * @param callSuccess   callSuccess
         * @param callError     callError
         */
        request: function (type, url, data, callSuccess, callError) {
            RequestCommon.callSuccess = callSuccess;
            RequestCommon.callError = callError;

            if (RequestCommon.callError) {
                $.ajax({
                    url: RequestCommon.requestDomain + url,
                    type: type,
                    dataType: "json",
                    data: data,
                    async: false,
                    success: RequestCommon.success,
                    error: RequestCommon.callError,
                });
            } else {
                $.ajax({
                    url: RequestCommon.requestDomain + url,
                    type: type,
                    dataType: "json",
                    data: data,
                    async: false,
                    success: RequestCommon.success,
                });
            }
        },

        /**
         * ajax get
         * @param url           url
         * @param data          data
         * @param callSuccess   callSuccess
         * @param callError     callError
         */
        get: function (url, data, callSuccess, callError) {
            RequestCommon.request("get", url, data, callSuccess, callError);
        },

        /**
         * ajax post
         * @param url           url
         * @param data          data
         * @param callSuccess   callSuccess
         * @param callError     callError
         */
        post: function (url, data, callSuccess, callError) {
            RequestCommon.request("post", url, data, callSuccess, callError);
        },

        /**
         * ajax global exception handle
         * @param data
         */
        success: function (data) {
            if (data) {
                RequestCommon.callSuccess(data);
                return;
            }

            if (RequestCommon.callError) {
                RequestCommon.callError();
            } else {
                RequestCommon.showRequestTipModal("خلل في البيانات،يُرجى المحاولة مرة أخرى لاحقاً");
            }
        },

        /**
         * get params from url
         * @param variable
         * @returns {string|boolean}
         */
        getParam: function (variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return "";
        },

        showRequestTipModal: function (content) {
            $("#operator-tips-modal").show();
            $("#operator-tips-modal .pay-tips p").html(content);
        },
    });
})();
RequestCommon.init();
