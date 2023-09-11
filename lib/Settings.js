'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function () {
    function Settings() {
        _classCallCheck(this, Settings);
    }

    _createClass(Settings, null, [{
        key: 'load',
        value: function load() {
            var data = JSON.parse(localStorage.getItem(Settings.Save_ID));
            if (!data) data = {};
            if (undefined !== data.count) Settings.count = data.count;
        }
    }, {
        key: 'save',
        value: function save() {
            var data = {
                count: Settings.count
            };

            localStorage.setItem(Settings.Save_ID, JSON.stringify(data));
        }
    }]);

    return Settings;
}();

Settings.count = '';
Settings.Save_ID = 'Akvarie_V1';