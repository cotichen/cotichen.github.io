window.utils = {
    /*
     * 去除字符串头尾空白
     */
    trim: function(str) {
        if (str == null)
            return "";
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    /*
     *判断字符串是否为空
     */
    isBlank: function(str) {
        if (!str)
            return true;
        if (this.trim(str).length == 0)
            return true;
        return false;
    },
    /*
     *随机数
     */
    randomsort: function() {
        return Math.random() > .5 ? -1 : 1;
    },

    /*
     * 判断当前登陆设备  
     */
    JudgmentEquipment: function() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid == true)
            return "Android";
        else if (isiOS == true)
            return "IOS";
        return "其他";
    },

    //数字格式化 逗号分隔
    numFormat: function(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse();
        r = s.split(".")[1];
        t = "";
        if (s < 0) {
            l = ((Math.abs(s.split(".")[0])) + "").split("").reverse();
        }
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        if (s < 0) {
            t += "-";
        }
        var result = t.split("").reverse().join("") + "." + r;
        if (result == null || result == undefined || result.indexOf('NaN') >= 0 || result.indexOf('Undefined') >= 0) {
            result = '0.00';
        }
        return result;
    },

    //将1,234,567.00转换为1234567.00
    moneyToNumValue: function(val) {
        var num = val.trim();
        var ss = num.toString();
        if (ss.length == 0) {
            return "0";
        }
        return ss.replace(/,/g, "");
    },

    formatMoney: function(s, type) {
        if (/[^0-9\.]/.test(s))
            return "0";
        if (s == null || s == "")
            return "0";
        s = s.toString().replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        if (type == 0) { // 不带小数位(默认是有小数位)  
            var a = s.split(".");
            if (a[1] == "00") {
                s = a[0];
            }
        }
        return s;
    },

    //判断是否为空
    JudgmentInpAir: function(val) {
        if (val == undefined || val == "" || val.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
            return false;
        }
        return true;
    },

    /*
     *获取url串
     */
    getRequest: function() {
        var url = location.search;  //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
}