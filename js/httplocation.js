var location;
var accessToken;

function httpLocation() {
	onLocation = 'http://school.jichuangsi.com:81';
	return onLocation;
}

function getAccessToken() {
	accessToken = sessionStorage.getItem('accessToken');
	return accessToken;
}