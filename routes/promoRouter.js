const express=require('express')
const promoRouter=express.Router()//we pass in the  router method to an instance
//the method willbe decorated will all the http methods
// then mounted at the core, index.js

promoRouter.route('/')

.all((req, res,next)=>{//middleware: initializing all endpoints
    res.statusCode=200;//configuring response to all ; endpoitn being ./dishes
    res.setHeader('Content-Type', 'text/plain');
    next();//will continue  to look for aditional API endpoints that match dishes
})

.get((req, res,next)=>{//first the code above will be execute; 
    //res and req will be then passed on from the code from above because of next()
    res.send('will send all the promos to you')//data will be put here
})

.post((req, res, next)=>{
    res.send(`Will add the promo: ${req.body.name} with details: ${req.body.description}`)
    //due to app.use(express.json), we expect the body to be structure as a JSON
    //end defines the endpoint's content
})

.put((req, res, next)=>{
    res.statusCode=403;//the status code for all should be defined
    res.send('Put operation not supported on /promos');
})

.delete((req, res, next)=>{
    res.send('delete all the promos')
    //dangerous operation; necessity to define a scope
});

promoRouter.route('/:dishId')
.get((req, res,next)=>{//first the code above will be execute; 
    //res and req will be then passed on from the code from above because of next()
    res.send(`will send details of the promo: ${req.params.dishId}  to you`)//data will be put here
})

.post((req, res, next)=>{
    res.statusCode=403;
    res.send('Post operations not supported on promos '+req.params.dishId)
})//it doesn't make sense to post one single dish form the user \
//post is about adding a new element to the database

.put((req, res, next)=>{
    res.write('Updating the dish' +req.params.dishId + '\n')
    //the information to update it with are in the body of the request
    res.end('Will Update the dish: '+ req.body.name+ req.body.description)
    //we could use send but send puts the message in the body and write too; 
    //we cant use write and then send
//this impementation makes it so that the endpoint variable os only called once for all the methods
})

.delete((req, res, next)=>{
    res.send('Deleting dish: '+req.params.dishId)
    //dangerous operation; necessity to define a scope
    //dishId is passed to params as a variable
});



//this impementation makes it so that the endpoint variable os only called once for all the methods

module.exports=promoRouter;//the methodes were applied  to this instance of expres.router()