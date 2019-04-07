const request = require('supertest');
const bcrypt = 

require('dotenv').config();

const app = require('./../app');

describe('/POST /apiv1/authenticate', () => {
    it('should return 200', (done) => {
        request(app)
        .post('/apiv1/authenticate')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
            email: "user@example.com",
            password: "1234"
        })
        .expect(200)
        .end((err, res) => {
            if (err) throw err;
            done();
        })
    });
});