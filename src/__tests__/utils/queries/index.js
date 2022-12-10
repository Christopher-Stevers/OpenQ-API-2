const { gql } = require('@apollo/client');


const CREATE_NEW_BOUNTY = gql`
mutation CreateBounty( $address: String!, $organizationId: String!, $bountyId: String!, $repositoryId: String!,  $type: String!) {
  createBounty(address: $address, organizationId: $organizationId, bountyId: $bountyId, repositoryId: $repositoryId, type: $type) {
    address
		bountyId
		organizationId
		repositoryId
		type
  }
}`;

const UPDATE_BOUNTY = gql`
mutation UpdateBounty( $address: String!, $organizationId: String!, $bountyId: String!, $repositoryId: String!,  $type: String!) {
  createBounty(address: $address, organizationId: $organizationId, bountyId: $bountyId, repositoryId: $repositoryId, type: $type) {
    address
		bountyId
		organizationId
		repositoryId
		type
  }
}`;

const CREATE_NEW_REPOSITORY = gql`
mutation CreateRepository($organizationId: String!, $repositoryId: String!) {
  createRepository(organizationId: $organizationId, repositoryId: $repositoryId) {
    id		
		organization {
			id
		}
  }
}`;


const ADD_USER_TO_REPOSITORY = gql`
mutation AddUserToRepository( $repositoryId: String!, $userId: String!) {
  addUserToRepository(repositoryId: $repositoryId, userId: $userId) {
    id
		participants{
			id
		}
		  }
}`;

const SET_HACKATHON_BLACKLIST = gql`
mutation SetHackathonBlacklist( $repositoryId: String!, $hackathonBlacklisted: Boolean!) {
  setHackathonBlacklist(repositoryId: $repositoryId, hackathonBlacklisted: $hackathonBlacklisted) {
    id
		hackathonBlacklisted
		  }
}`;

const SET_IS_CONTEST = gql`
mutation SetIsContest( $repositoryId: String!, $isContest: Boolean!, $organizationId: String!, $startDate: String!, $registrationDeadline: String!) {
  setIsContest(repositoryId: $repositoryId, isContest: $isContest, organizationId: $organizationId, startDate: $startDate, registrationDeadline: $registrationDeadline) {
    id
	startDate
		  }
}`;

const GET_REPOSITORY = gql`
query GetRepository( $id: String!) {
  repository(id: $id){
    id
	participants{
		id
	}
    organization{
      id
    }
	hackathonBlacklisted
	isContest
	startDate
	registrationDeadline
  }
}`;

const STAR_ORGANIZATION = gql`mutation StarOrg($userId: String!, $organizationId: String!, $github: String, $email: String) {
  starOrg(userId: $userId, organizationId: $organizationId, github: $github, email: $email) {
    id
		starringUsers(limit:10) {
			 
		nodes{
		id}
			
		
		}
  }
}`;

const UNSTAR_ORGANIZATION = gql`mutation StarOrg($userId: String!, $organizationId: String!, $github: String, $email: String) {
  unstarOrg(userId: $userId, organizationId: $organizationId, github: $github, email: $email) {
    id
	starringUsers(limit:10) {
			 
		nodes{
		id}
			
		
		}
  }
}`;

const WATCH_BOUNTY = gql`mutation WatchBounty($contractAddress: String!, $userId: String!, $github: String, $email: String) {
  watchBounty(
    contractAddress: $contractAddress
    userId: $userId,
		github: $github,
		email: $email
  ) {
    address
		watchingUsers {
			id
		}
  }
}`;

const CREATE_USER = gql`mutation CreateUser($github: String, $email: String) {
  upsertUser(github: $github, email: $email) {
    id
    github
		email
  }
}`;

const UNWATCH_BOUNTY = gql`mutation UnwatchBounty($contractAddress: String!, $userId: String!, $github: String, $email: String) {
  unwatchBounty(contractAddress: $contractAddress, userId: $userId, github: $github, email: $email) {
    address
		watchingUsers {
			id
		}
  }
}`;

const GET_BOUNTY_BY_ID = gql`query bounty($contractAddress: String!) {
  bounty(address: $contractAddress) {
    tvl
		address
		bountyId
		organizationId
    type
		blacklisted
		watchingUsers {
			id
		}
    organization {
      id
    }
    repository {
      id
    }
  }
}`;

const UPSERT_USER = gql`mutation UpsertUser($email: String, $github: String) {
  upsertUser(email: $email, github: $github) {
    id
		email
		github
		username
  }
}`;

const GET_USER = gql`query GetUser($id: String, $email: String, $github: String) {
  user(id: $id, email: $email, github: $github) {
		id
		username
		email
		github
		starredOrganizations {
		nodes{
			id
		}			
		}
		watchedBounties(limit: 10) {
      bountyConnection{
        nodes {
          address
        }
      }
    }
  }
}`;

const GET_BOUNTY_PAGE = gql`
query BountiesConnection($after: ID, $limit: Int!, $orderBy: String, $sortOrder: String, $organizationId: String) {
  bountiesConnection(after: $after, limit: $limit, orderBy: $orderBy, sortOrder: $sortOrder, organizationId: $organizationId) {
    bounties {
      tvl
			address
			organizationId
			bountyId
    }
		cursor
  }
}
`;

const GET_ORGANIZATION = gql`query GetOrganization($organizationId: String!) {
  organization(organizationId: $organizationId) {
		id
		blacklisted
		starringUsers 
			(limit:10) {
		nodes{
		id}
			
		
		}
  }
}`;

const BLACKLIST_ORGANIZATION = gql`mutation blacklistOrg($organizationId: String, $blacklist: Boolean) {
    blacklistOrg(organizationId: $organizationId, blacklist: $blacklist) {
      blacklisted
    }
  }
`;

const UPSERT_PR = gql`mutation UpsertPr($prId: String!, $blacklisted: Boolean!) {
  upsertPr(prId: $prId, blacklisted: $blacklisted) {
    prId
	  }
}`;

const ADD_CONTRIBUTOR = gql`mutation AddContributor($repositoryId: String!, $prId: String!, $userId: String!) {
  addContributor(repositoryId: $repositoryId, prId: $prId, userId: $userId) {
    prId
	  }
}`;

const REMOVE_CONTRIBUTOR = gql`mutation AddContributor($prId: String!, $userId: String!) {
  addContributor(prId: $prId, userId: $userId) {
    prId
	  }
}`;

const UPSERT_PRICES = gql`mutation UpsertPrices($priceObj: JSON!, $pricesId: String!) {
  updatePrices(priceObj: $priceObj, pricesId: $pricesId) {
    priceObj
	    }
}`;

const GET_PRICES = gql`query GetPrices {
  prices{
    pricesId
    priceObj
  
  }
}`;




const GET_PR = gql`query GetPr($prId: String!) {
  pr(prId: $prId) {
    prId
	contributors {
		userId
	}
}
}`;

module.exports = {
	CREATE_NEW_BOUNTY,
	UPDATE_BOUNTY,
	WATCH_BOUNTY,
	UNWATCH_BOUNTY,
	GET_BOUNTY_BY_ID,
	GET_BOUNTY_PAGE,
	CREATE_USER,
	GET_USER,
	UPSERT_USER,
	CREATE_NEW_REPOSITORY,
	ADD_USER_TO_REPOSITORY,
	SET_HACKATHON_BLACKLIST,
	SET_IS_CONTEST,
	GET_REPOSITORY,
	GET_ORGANIZATION,
	BLACKLIST_ORGANIZATION,
	STAR_ORGANIZATION,
	UNSTAR_ORGANIZATION,
	UPSERT_PR,
	ADD_CONTRIBUTOR,
	REMOVE_CONTRIBUTOR,
	GET_PR,
	UPSERT_PRICES,
	GET_PRICES
};