const nock = require('nock')

const scope = nock('http://localhost:3002')
    .get('/')
    .reply(200, 'path matched')