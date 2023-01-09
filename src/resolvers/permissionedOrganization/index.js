const Mutation = require('./mutation');
const Query = require('./query');
const PermissionedOrganization = require('./permissionedOrganization');
const PermissionedOrganizations = require('./permissionedOrganizations');

const permissionedOrganizationResolvers = {
	Mutation,
	Query,
	PermissionedOrganization,
	PermissionedOrganizations
};

module.exports = permissionedOrganizationResolvers;