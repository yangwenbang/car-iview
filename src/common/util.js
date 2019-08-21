var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding(s, len) {
  var len = len - (s + '').length;
  for (var i = 0; i < len; i++) {
    s = '0' + s;
  }
  return s;
};

export default {
  downloadUrl: "//mgt.banksteel.com/bigdata/ironman/v4",
  downloadUrl5: "//mgt.banksteel.com/bigdata/ironman/v5",
  getQueryStringByName: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
      context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
  },
  //重量保留四位小数
  formatWeight(weight) {
    return weight ? weight.toFixed(4) : '0.0000';
  },
  //价格保留两位小数
  formatPrice(price) {
    return price ? price.toFixed(2) : '0.00';
  },
  formatSeconds(value) { //毫秒数转化为年月日时分秒格式
    if(value && (value != "-") && (value != "0")){
      var date = new Date(value);
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var Hour = date.getHours();
      var Minute = date.getMinutes();
      var Second = date.getSeconds();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      if (Hour >= 0 && Hour <= 9) {
          Hour = "0" + Hour;
      }
      if (Minute >= 0 && Minute <= 9) {
          Minute = "0" + Minute;
      }
      if (Second >= 0 && Second <= 9) {
          Second = "0" + Second;
      }
      var dateTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
              + " " + Hour + seperator2 + Minute
              + seperator2 + Second;
      return dateTime;
    }else{
        return "-"
    }
  },
  formatDate: {
    format: function(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length);
          case 'M':
            return padding(date.getMonth() + 1, $0.length);
          case 'd':
            return padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return padding(date.getHours(), $0.length);
          case 'm':
            return padding(date.getMinutes(), $0.length);
          case 's':
            return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse: function(dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP);
      var matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1);
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i]);
          var sign = matchs1[i];
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int);
              break;
            case 'M':
              _date.setMonth(_int - 1);
              break;
            case 'd':
              _date.setDate(_int);
              break;
            case 'h':
              _date.setHours(_int);
              break;
            case 'm':
              _date.setMinutes(_int);
              break;
            case 's':
              _date.setSeconds(_int);
              break;
          }
        }
        return _date;
      }
      return null;
    }

  },
  formatYMD(value) {
    if(value){
        var date = new Date(value);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var dateTime = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return dateTime;
    }else{
        return "-"
    }
  },
  //正整数及小数点后4位
  decimalWeight(e) {
    let value = e.target.value;
    if (value != "" && value.substr(0, 1) == ".") {
      value = "";
    }
    //清除“数字”和“.”以外的字符
    value = value.replace(/[^\d.]/g, ""); 
    //只保留第一个. 清除多余的
    value = value.replace(/\.{2,}/g, "."); 
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    //只能输入两个小数
    value = value.replace(/^(\-)*(\d+)\.(\d{0,4}).*$/, "$1$2.$3"); 
    if (String(value).indexOf(".") < 0 && value != "") {
      if (value.substr(0, 1) == "0" && value.length == 2) {
        value = value.substr(1, value.length);
      }
    }
    return value;
  },

};
