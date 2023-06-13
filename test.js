const app = require('./app');
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const fs = require('fs');

describe('Express App', () => {
  it('should return the home page', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('Simin Zolfi');
  });

  it('should return the about page', async () => {
    const res = await request(app).get('/about');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('About Simin');
  });

  it('should return the contact page', async () => {
    const res = await request(app).get('/contact');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('Contact Simin');
  });

  it('should return a 404 error for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).to.equal(404);
  });
});



describe('Contact Form', () => {
  // Before running the tests, make sure to backup the original contacts.json file
  before(() => {
    fs.renameSync('contacts.json', 'contacts.bak.json');
    
  });

  // After running the tests, restore the original contacts.json file
  after(() => {
    fs.renameSync('contacts.bak.json', 'contacts.json');
  });

  describe('/POST save-contact', () => {
    it('should save contact form data to the contacts.json file', done => {
      const contactData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        message: 'This is a test message'
      };

      chai.request(app)
        .post('/save-contact')
        .send(contactData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').equal('Contact form data saved successfully');
          done();
        });
    });
  });
});