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
mutation CreateRepository( $organizationId: String!, $repositoryId: String!, $bountyId: String!) {
  createBounty(organizationId: $organizationId, repositoryId: $repositoryId, bountyId: $bountyId) {
    id
		participants
		organization
		bounties
  }
}`;

const GET_REPOSITORY = gql`
mutation GetRepository( $id: String!) {
  getRepository(id: $id) {
    id
		participants
		organization
		bounties
  }
}`;

const STAR_ORGANIZATION = gql`mutation StarOrg($userId: String!, $organizationId: String!) {
  starOrg(userId: $userId, organizationId: $organizationId) {
    id
		starringUsers {
			id
		}
  }
}`;

const UNSTAR_ORGANIZATION = gql`mutation StarOrg($userId: String!, $organizationId: String!) {
  unstarOrg(userId: $userId, organizationId: $organizationId) {
    id
		starringUsers {
			id
		}
  }
}`;

const WATCH_BOUNTY = gql`mutation AddUser($contractAddress: String, $userId: String) {
  watchBounty(
    contractAddress: $contractAddress
    userId: $userId
  ) {
    address
		watchingUsers {
			id
		}
  }
}`;

const CREATE_USER = gql`mutation CreateUser($github: String!) {
  upsertUser(github: $github) {
    id
    github
  }
}`;

const UNWATCH_BOUNTY = gql`mutation AddUser($contractAddress: String, $userId: String) {
  unwatchBounty(
    contractAddress: $contractAddress
    userId: $userId
  ) {
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
  }
}`;

const GET_USER = gql`query GetUser($id: String, $email: String, $github: String) {
  user(id: $id, email: $email, github: $github) {
		id
		email
		github
		starredOrganizations {
			id
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
		starringUsers {
			id
		}
  }
}`;

const BLACKLIST_ORGANIZATION = gql`mutation blacklistOrg($organizationId: String, $blacklist: Boolean) {
    blacklistOrg(organizationId: $organizationId, blacklist: $blacklist) {
      blacklisted
    }
  }
`;

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
	GET_REPOSITORY,
	GET_ORGANIZATION,
	BLACKLIST_ORGANIZATION,
	STAR_ORGANIZATION,
	UNSTAR_ORGANIZATION
};