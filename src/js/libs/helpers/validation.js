function isNaturalNumber(str) {
    var n = ~~Number(str);
	if (typeof str === "string") { return String(n) === str && n >= 0; }
	if (typeof str === "number") { return n === str && n >= 0; }
	return false;
}

function isPositiveInteger(str) {
    var n = ~~Number(str);
	return isNaturalNumber(str) && n > 0;
    
}

function checkLicence(str){
    var reg = /^[A-Za-z0-9\-]+$/;
	var test = reg.test(str);
    return reg.test(str);
}