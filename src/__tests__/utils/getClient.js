const { ApolloClient, HttpLink, InMemoryCache, ApolloLink } = require('@apollo/client');
const fetch = require('cross-fetch');
const uri = process.env.OPENQ_API_URL;

const getClient = () => {
	return new ApolloClient({
		link: new HttpLink({ uri: uri + '/graphql', fetch }),
		onError: (e) => { console.log(e); },
		cache: new InMemoryCache()
	});
};


const getAuthenticatedClient = (token) => {
	const authLink = new ApolloLink((operation, forward) => {
		// Retrieve the authorization token from local storage.

		// Use the setContext method to set the HTTP headers.
		operation.setContext({
			headers: {
				authorization: token
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