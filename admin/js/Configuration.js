var url;
var token;
var schoolName;
//修改路径
function httpUrl() {
	url = "http://api.jichuangsi.com/USERSERVICE"
	//url="http://school.jichuangsi.com:81"
	return url;
}
//获取token
function getToken() {
	//token = sessionStorage.getItem('token');
	return token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySW5mbyI6IntcImNsYXNzSWRcIjpcIjc3NzdcIixcInRpbWVTdGFtcFwiOlwiMTU1MzIyMzYzNDE1MVwiLFwidXNlcklkXCI6XCI0MzBjMjQyNzEzZTI0NjZmYTg3NzE3YmVjYTk1MmI5NlwiLFwidXNlck5hbWVcIjpcInh1ZXNoZW5nMDAxXCJ9In0.Yvv9iyCbNQjBMZB4CZxMVcgSSQjg11QqcyRviEBx7FMjRG31Z-dX1C4-fBGk0YvYrzaCLPgrNH708lGTACfaOQ'
}
function siteSchoolName(){
	schoolName=sessionStorage.getItem('name');
	return schoolName;
}
