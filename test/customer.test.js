const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;
const sinon = require("sinon");
const faker = require("faker");
var CustomerController = require('../app/controller/customerController')
const CustomerModel = require('../app/models/customers');
var token = null;
var email = null;
var password = null;
var id = null;
const flushPromises = () => new Promise(setImmediate);

describe('Signup API', function() {
    it('Should success if customer is added', function(done) {
        request(app)
           .post('/customer/signup')
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .query({
            name: "Hari", 
            gender: "Male", 
            city: "Pune",  
            state: "Maharashtra",  
            phone: "9876543212",
            email: "hari.k@mindtree.com",  
            password: "123456"
           })
           .expect(200)
           .expect('Content-Type', /json/)
           .expect(function(response) {
               email = response.body.data.email;
               password = "123456";
               id = response.body.data._id
              expect(response.body).not.to.be.empty;
              expect(response.body).to.be.an('object');
           })
           .end(done);
    }); 
});
describe('Login API', function() {
    it('Should success if credential is valid', function(done) {
        request(app)
        .post('/customer/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .query({ email: `${email}`, password: `${password}` })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(response) {
            token = response.body.token;
            expect(response.body).not.to.be.empty;
            expect(response.body).to.be.an('object');
        })
        .end(done);
    }); 
});
describe('Update API', function() {
    it('Should success if customer is updated', function(done) {
        request(app)
            .post('/customer/update')
            .set({ "Authorization": `${token}`  })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .query({
            name: "Hari Mali", 
            gender: "Male", 
            city: "Pune",  
            state: "Maharashtra",  
            phone: "9876543212",
            email: "hari.k@mindtree.com",  
            password: "123456",
            id:  `${id}`
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    }); 
});
describe('List API', function() {
    it('Should success if list is retrieved', function(done) {
        request(app)
           .get('/customer/list')
           .set({ "Authorization": `${token}`  })
           .set({ 'Content-Type': 'application/json'  })
           .expect(200)
           .expect(function(response) {
              expect(response.body).not.to.be.empty;
              expect(response.body).to.be.an('object');
           })
           .end(done);
    }); 
});
describe('Customer Details API', function() {
    it('Should success if customer details are retrieved', function(done) {
        request(app)
        .get('/customer/getDetails/'+`${id}`)
        .set({ "Authorization": `${token}`  })
        .set({ 'Content-Type': 'application/json'  })
        .expect(200)
        .expect(function(response) {
            expect(response.body).not.to.be.empty;
            expect(response.body).to.be.an('object');
        })
        .end(done);
    }); 
});



describe('Customer Controller', function () {
    let stubValue = { query: {
        name: faker.name.findName(), 
        gender: faker.name.gender(), 
        city: faker.address.cityName(),  
        state: faker.address.state(),  
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email(),  
        password: faker.internet.password()
    } };

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

    describe("create", function() {
        it("should add a new user to the db", async function() {
          const stub = sinon.stub(CustomerModel, "signupCustomer").returns(stubValue);
        var respnse = {}
        const user = await CustomerController.signupCustomer(stubValue,res);
          expect(stub.calledOnce).to.be.true;
        
        });
      });


});