const request = require("supertest");

require("dotenv").config();

const app = require("./../app");

describe('GET /apiv1/ads without filter', () => {
    it('should return 200 with token', (done) => {
        request(app)
        .get('/apiv1/ads')
        .set('Authorization', `Bearer ${process.env.API_KEY}`)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            done();
        })
    });
    
    it('should return 401 without token', (done) => {
        request(app)
        .get('/apiv1/ads')
        .expect(401)
        .end((err, res) => {
            if (err) return done(err);
            done();
        })
    });
    
});

describe('POST /apiv1/ads', () => {
    it('should return 200 with token', (done) => {
        request(app)
        .post('/apiv1/ads')
        .set('Authorization', `Bearer ${process.env.API_KEY}`)
        .field('name', 'office supplies')
        .field('sell', 'true')
        .field('price', '17.55')
        .field('tags', 'work')
        .attach('picture', '')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            done();
        });
    });
    
    it('should return 401 without token', (done) => {
        request(app)
        .post('/apiv1/ads')
        .expect(401)
        .end((err, res) => {
            if (err) return done(err);
            done();
        })
    });
});