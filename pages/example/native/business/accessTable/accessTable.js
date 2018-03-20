/**
 *
 * @authors lupan
 * @date    2017-12-25 21:20:41
 * @version $1.0$
 */
define([
        './custom/widgets/js/yufpUploadTable.js'
    ],
    function (require, exports) {
        exports.ready = function (hashCode, data, cite) {
            var vm = yufp.custom.vue({
                el: "#accessTable",
                data: function () {
                },
                methods: {}
            });
        };
        exports.onmessage = function (type, message) {
        };

        exports.destroy = function (id, cite) {
        };
    });