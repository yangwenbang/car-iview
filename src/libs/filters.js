export function formatWeight(weight) {
	return weight && Number(weight) ? Number(weight).toFixed(4) : '0.0000';
}


export function formatPrice(price) {
	return price && Number(price) ? Number(price).toFixed(2) : '0.00';
}

export function formatThousandNum(num) {
	num = num.toString();
	if (num.indexOf('.') == -1) {
		return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	} else {
		var cent = num.split('.');
		var cent1 = cent[1];
		var sign = cent[0];
		return (sign + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '.' + cent1;
	}

}

export function formatThousandPrice(num) {
    if(num != "-"){
    num = num ? num.toFixed(2) : '0.00';
	num = num.toString();
	if (num.indexOf('.') == -1) {
		return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	} else {
		var cent = num.split('.');
		var cent1 = cent[1];
		var sign = cent[0];
		return (sign + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '.' + cent1;
	}
    }else{
        return "-"
    }

}

export function formatStringDate(second_time) {
    var time = parseInt(second_time);
    if(parseInt(second_time) > 60) {
        var second = parseInt(second_time) % 60;
        var min = parseInt(second_time / 60);
        time = min + ":" + second;

        if(min > 60) {
            min = parseInt(second_time / 60) % 60;
            var hour = parseInt(parseInt(second_time / 60) / 60);
            time = hour + ":" + min + ":" + second;

            if(hour > 24) {
                hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                time = day + "天  " + hour + ":" + min + ":" + second;
            }
        }else{
            time = '00:' + time;
        }
    }
    return time;

}

export function formatSeconds(value) {
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

}


export function formatSecondTime(value) {
    if(value == '0'){
        return ''
    }else{
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
    }
}

export function formatDate(value) {
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
}