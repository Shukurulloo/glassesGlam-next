import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';
let apolloClient: ApolloClient<NormalizedCacheObject>; // apolloclient create bo'lsa shunga auto briktriladi

/** bu dokumentationdan yeg'ib chiqilgan mantiqlar */
function getHeaders() {
	// agar member auth bo'lga  bo'lsa localStoragedan aceesTokenga briktrilgan tokenni qabul qilib headerni boyitadi
	const headers = {} as HeadersInit;
	const token = getJwtToken(); // bu method tookenni beradi. kookieni ishlatmaganizmizi sababi kelajakda haqiqiy mobile ishlatsh uchun
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;// tokenni berar token qilib Authorizationni ichiga joylaymiz
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});
// Custom WebSocket client
class LoggingWebSocket {
	private socket: WebSocket;

	constructor(url: string) { // uri
		this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
		socketVar(this.socket);

		this.socket.onopen = () => { //ulansa
			console.log('WebSocket connection!');
		};

		this.socket.onmessage = (msg) => { // habar kelsa
			console.log('WebSocket message:', msg.data);
		};

		this.socket.onerror = (error) => {
			console.log('WebSocket, error:', error);
		};
	}
	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data); // serverga malumot yuborish
	}

	close() {
		this.socket.close();
	}
}

function createIsomorphicLink() {
	if (typeof window !== 'undefined') { // client site rendering bo'ganda ishga tushsin deymz. undefined SSRda boladi
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(), // hamm requestdan auth bo'lgan memberni tookenini requestni headers qismiga bog'lab beradi. uni tookendan olamz
				},
			}));
			console.warn('requesting.. ', operation);
			return forward(operation);
		});

		// @ts-ignore
		const link = new createUploadLink({ // bu http link hisoblanadi
			uri: process.env.REACT_APP_API_GRAPHQL_URL, // serverimz localhost:3007 ga bog'lanadi. 
		});

		/* bu esa WEBSOCKET SUBSCRIPTION LINK.*/
		const wsLink = new WebSocketLink({
			uri: process.env.REACT_APP_API_WS ?? 'ws://127.0.0.1:3007',
			options: {
				reconnect: false,
				timeout: 30000,
				connectionParams: () => {
					return { headers: getHeaders() };
				},
			},
			webSocketImpl: LoggingWebSocket
		});

		/* errorni client 2 xil handling qiladi 
		1) try-catchni catch qismiga error qo'yilsa o'sha ishga tushadi
		2) try-catchda handling qilinmasa quyidagi ishga tushadi
		*/
		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					if(!message.includes("input")) sweetErrorAlert(message) // tarkibida input bo'lmagan messagelar kelsa shu messageni chiqar

				});
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(link),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);// hammasi birga briktiriladi
	}
}

/**  avvalda mavjud bo'lmasa apolloClient yangi apollo,clientni quradi*/
function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(), // yuqoridagi functionlar shu link uchun bu linkda http ham bor webSocket ham bor
		cache: new InMemoryCache(), // keshing ochilyapti
		resolvers: {}, // bu shart emas
	});
}

/**  initialState boshlang'ich qiymati null bo'ladi
  agar  apolloClient qiymat bo'lsa o'zini ol aks holda yuqoridagi  createApolloClient ishga tushadi
 */
export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}
/** useMemo kesh arxitekga ega hook hisoblanadi, keshlab qo'yadi yangisi kelsa o'zini qiymatini yangilaydi ungacha eskisini beradi */
export function useApollo(initialState: any) { // initialState propsdan keladi _app.tsx
	// bu customized hookimz
	return useMemo(() => initializeApollo(initialState), [initialState]);
}

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for develop process

const httpLink = createHttpLink({
  uri: "http://localhost:3007/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/
