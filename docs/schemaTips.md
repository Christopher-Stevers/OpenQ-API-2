### Relations

When writing the resolver chain for a parent field that has a one- or many- to-many relation(organization to repository or organization to bounties) with a model we want to access via its child fields, we want the api consumer to be able to get the relational data by a query like this:


```js
parentField(parentFieldId: $parentFieldId) {
      childFieldPluralized{childFieldConnection{
      id
           
      }
      }
    }

```
To implement the types and resolvers for this pattern, check out Bounties, BountyConnection and BountyConnection, they recieve parent props from the parent field and then resolve as needed, **independent** of what the parent field is. The parent field can even have a different name, (such as watchedBounties) - as long as the parent returns a bounties in type defs object and has a resolver to pass parent props to it, Bounties can handle it.
While you can use "include:" within prisma to accomplish this, the ideal method is resolver chaining, as its more extensible.
Check out https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains to see what I'm talking about.