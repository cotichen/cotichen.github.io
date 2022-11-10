PageCommon = (function (info) {
    return (info = {
        init: function () {},
        closeModal: function (node) {
            $(node).hide();
        },
    });
})();
PageCommon.init();
