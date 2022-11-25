const { verifySignature } = require('../../utils/auth/verifySignature');

describe('verifySignature', () => {
	const address = '0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e';
	const otherAddress = '0x46e09468616365256F11F4544e65cE0C70ee624b';
	const validSignatureFor0x1abc = '0xb4fceac372e7dd620bf581ef3bd399116e79a3c3744ac8b09e876132ff32142b5e612bc0e3b169b4b5e930aa598c7c3501f4e2d3e9e26548d8dde0ac916aff7c1b';
	const invalidSignatureFor0x1abc = '0xb4fceac372e7dd620bf581ef3bd399116e79a3c3744ac8b09e876132ff32142b5e612bc0e3b169b4b5e930aa598c7c3501f4e2d3e9e26548d8dde0ac916aff7c1b';

	const req = {
		headers: {
			cookie: `signature=${validSignatureFor0x1abc}`
		}
	};

	it('should verify signature', async () => {	
		const result = verifySignature(req, address);
		expect(result).toEqual(true);
	});

	it('should return false if recovered address doesnt match desired address', async () => {	
		const result = verifySignature(req, otherAddress);
		expect(result).toEqual(false);
	});
});
