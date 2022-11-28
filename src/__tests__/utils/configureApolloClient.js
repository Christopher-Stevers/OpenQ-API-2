const { ApolloClient, HttpLink, InMemoryCache, ApolloLink } = require('@apollo/client');
const fetch = require('cross-fetch');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });
const uri = process.env.OPENQ_API_URL;

const getClient = () => {
	const httpLink = new HttpLink({
		uri: uri + '/graphql', fetch,
		credentials: 'include'
	});
	return new ApolloClient({
		link: httpLink,
		onError: (e) => { console.log(e); },
		cache: new InMemoryCache()
	});
};

const getAuthenticatedClient = (token, signature) => {
	const authLink = new ApolloLink((operation, forward) => {
		// Retrieve the authorization token from local storage.

		// Use the setContext method to set the HTTP headers.
		operation.setContext({
			headers: {
				authorization: token,
				...(signature && { cookie: `signature=${signature}` })
			}
		});

		// Call the next link in the middleware chain.
		return forward(operation);
	});

	const httpLink = new HttpLink({ uri: uri + '/graphql', fetch });

	return new ApolloClient({
		link: authLink.concat(httpLink),
		onError: (e) => { console.log(e); },
		cache: new InMemoryCache(),
		request: (operation) => {
			if (token) {
				operation.setContext({
					headers: {
						'Authorization': token
					}
				});
			}
		},
	});
};
module.exports = { getClient, getAuthenticatedClient };