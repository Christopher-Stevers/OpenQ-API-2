const getGithubOAuthToken = (req) => {
	const signatureRegex = /github_oauth_token_unsigned=\w+/;
	const token =  req.headers.cookie.match(signatureRegex)?.[0]?.slice(28);
	if(token){
		return token;}
	else{
		return null;}
			
};
module.exports = getGithubOAuthToken;