# Permissions and Directives

## How to use directives
To use directives you'll need to add them to the schema via a transformer function (such as authDirectiveTransformer). This will add the directive to the schema and allow you to use it in your schema. For example, if you want to use the @auth directive, you'll need to add it to your schema like so:

```graphql
type Post  @hasRoles(roles: ["MEMBER", "ADMIN"]) {
  id: ID!
  title: String!
  owner: String
}
```

## Directives
### @auth
The @auth directive allows you to specify that a user field can only be accessed by the logged in request user. For example, if you have a User type with a field called email, you can specify that only the logged in user can access that field like so:

```graphql
type User  {
  id: ID!
  name: String!
  email: String @auth
}
```

### @hasRoles
The @hasRoles directive allows you to specify that a proAccount field can only be accessed by the logged in a logged in user if they have the specified roles. For example, if you have a Post type with a field called owner, you can specify that only the logged in user can access that field if they have that proAccount in their memberOrganizationIds field like so.