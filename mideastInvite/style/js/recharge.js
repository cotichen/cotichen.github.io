Recharge = (function (info) {
    return (info = {
        ProductId: 0,
        userId: 0,
        wait: 60,
        shopConfig: null,
        shopInfo: {
            Amount: 0,
            Bonus: 0,
            Extra: "",
            IsHot: 0,
            PayType: 1,
            Price: 0,
            ProductId: "",
            ProductName: "",
            Rate: 0,
            ShopType: 0,
            Status: 0,
        },
        payType: 0,
        centerOrderId: "",
        payInterval: null,
        isSubmit: true,
        timer: 0,
        init: function () {
            Recharge.initShopConfig();
        },
        initShopConfig: function () {
            RequestCommon.post("hall/getShopList", { Currency: Currency }, function (list) {
                console.log(list);
                Recharge.shopConfig = list;
                Recharge.initGoldConfigPage();
            });
        },
        showInfullTypeModal: function (productId) {
            console.log(productId);
            var userId = $("#userId").val();
            if (!userId || "" == userId.trim()) {
                Recharge.showOperatorModal("برجاء إدخال رقمID صحيح للمستخدم");
                return;
            }
            Recharge.userId = userId;
            Recharge.ProductId = productId;
            Recharge.shopInfo = Recharge.getShopInfo(Recharge.ProductId);
            console.log(Recharge.shopInfo);
            Recharge.showInfullConfirmModal(Recharge.shopInfo.PayType);
        },
        showInfullConfirmModal: function (payType) {
            RequestCommon.post(
                "hall/userInfo",
                { UserID: Recharge.userId },
                function (ret) {
                    // //TODO:测试
                    // var resp = { data: { userName: 1000, centerOrderId: 1000, extraData: 4545 } };
                    Recharge.payType = payType;
                    $("#userIdShow").text(Recharge.userId);
                    $("#userNameShow").text(ret.NickName);
                    $("#priceShow").text(`${Recharge.shopInfo.Price} ${Currency}`);

                    var num = Recharge.shopInfo.Amount;
                    //var freeNum = (Recharge.shopInfo.num * Recharge.shopInfo.extraPercent) / 100;
                    var freeNum = 0;
                    var totalNum = num + freeNum;

                    totalNum = Recharge.formatNum(totalNum, 2);
                    totalNum = totalNum.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");

                    $("#numShow").text(totalNum);
                    $("#dimondDesc").html("كمية الذهب<span>:</span>");

                    $("#infull-confirm-modal").show();
                },
                function () {
                    RequestCommon.showRequestTipModal("المستخدم غيرموجود");
                }
            );
        },
        jumpUrl(url, data) {
            window.location.href = RequestCommon.requestDomain + url + "?" + data;
        },
        confirmSubmit: function () {
            //加loading动画
            Recharge.loadingToggle();
            //防止连点
            if (Recharge.isSubmit) {
                Recharge.isSubmit = false;
                //下面需要添加执行的事件
                Recharge.timer = setTimeout(() => {
                    Recharge.confirmInFull();
                    $("#infull-confirm-modal").hide();
                    Recharge.isSubmit = true;
                }, 1000);
            }
            //3秒后恢复
            setTimeout(() => {
                Recharge.loadingToggle();
            }, 3000);
        },
        loadingToggle: function () {
            document.getElementsByClassName("loading")[0].classList.toggle("loading-none");
        },
        confirmInFull: function () {
            Recharge.jumpUrl(
                "payermax/payOrder",
                `UserID=${Recharge.userId}&ProductID=${Recharge.shopInfo.ProductId}&Price=${
                    Recharge.shopInfo.Price
                }&PartnerID=30001`
            );
        },
        checkOrderState: function () {
            $("#pay-detail-modal").hide();
            $("#payWaitModal").show();
            Recharge.payInterval = setInterval(function () {
                Recharge.time();
            }, 1000);
        },
        time: function () {
            if (Recharge.wait == 0) {
                Recharge.queryOrder(1);
            } else {
                if (Recharge.wait % 5 == 0) {
                    Recharge.queryOrder(0);
                }
                Recharge.wait--;
                $(".time-count").html("(" + Recharge.wait + ")");
            }
        },

        queryOrder: function (continueType) {
            RequestCommon.post(
                "",
                {
                    centerOrderId: Recharge.centerOrderId,
                },
                function (resp) {
                    if (resp.data.success == 1) {
                        Recharge.showPaySuccessModal();
                        clearInterval(Recharge.payInterval);
                    } else {
                        if (continueType == 1) {
                            Recharge.showPayErrorModal();
                            clearInterval(Recharge.payInterval);
                            $("#payWaitModal").hide();
                        }
                    }
                },
                function () {
                    Recharge.showPayErrorModal();
                    clearInterval(Recharge.payInterval);
                }
            );
        },
        showOperatorModal: function (content) {
            $("#operator-tips-modal").show();
            $("#operator-tips-modal .pay-tips p").html(content);
        },
        initGoldConfigPage: function () {
            $("#project-list-money").empty();
            $.each(Recharge.shopConfig, function (index, ele) {
                let  extra = ele.Extra;
                let  itemId = extra[0].ItemId;
                let  count = extra[0].Count;
                var template =
                    ' <div class="project-item" onclick="Recharge.showInfullTypeModal(' +
                    ele.ProductId +
                    ')">' +
                    '                        <div class="project-item__wrapper">' +
                    '                            <div class="direction-ltr big_num_wrapper big_num_money_' +
                    count +
                    '">' +
                    Recharge.formatNum(count) +
                    "                            </div>" +
                    '                            <div class="direction-ltr small_num_wrapper small_num_money_' +
                    count +
                    '">' +
                    "                            </div>" +
                    '                            <div  class="project-item__img">' +
                    '                                <img src="' +
                    Recharge.getGoldProjectItemImg(itemId, ele.ProductId) +
                    '">' +
                    "                            </div>" +
                    '                            <div class="direction-ltr project-item__bottom">' +
                    "                                <span>" +
                    `${ ele.Price} ${Currency}`
                    " </span>" +
                    "                            </div>" +
                    "                        </div>" +
                    "                    </div>";
                $("#project-list-money").append(template);
            });
        },
        getGoldProjectItemImg: function (itemId, productId) {
               //容错处理
             productId =productId>1300004?1300004:productId;
            return `./style/images/recharge/item_${itemId}_${productId}.png`;
        },
        getShopInfo: function (ProductId) {
            var result = {};
            $.each(Recharge.shopConfig, function (index, ele) {
                if (ele.ProductId == ProductId) {
                    result = ele;
                }
            });
            return result;
        },
        showPaySuccessModal() {
            $("#payWaitModal").hide();
            $("#infull-confirm-modal").hide();
            $("#pay-success").show();
        },
        showPayErrorModal() {
            $("#payWaitModal").hide();
            $("#pay-error").show();
        },
        formatNum: function (number, fixed) {
            const limit = [1000000000000, 1000000000, 1000000, 1000];
            const chars = ["T", "B", "M", "K"];
            if (Math.abs(number) < 10000) {
                return "" + number;
            }
            number = Math.floor(number / 1000) * 1000;

            for (let i = 0; i < 4; i++) {
                if (number >= limit[i]) {
                    number = (number * 1) / limit[i];
                    let remain = number % 1;
                    let str = "";
                    if (remain > 0) {
                        str = remain >= 0.01 ? number.toFixed(2) : Math.floor(number) + "";
                    } else {
                        str += number;
                    }
                    return str + chars[i];
                }
            }
        },
    });
})();
Recharge.init();
