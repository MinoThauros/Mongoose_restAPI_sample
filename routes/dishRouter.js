const express=require('express');
const dishRouter=express.Router();
const mongoose=require('mongoose');
const Dishes=require('../models/dishes'); 

dishRouter.use(express.json());

dishRouter.route('/')//Will take in an endpoint; "/" is an endpoint
//we need to mount this express router in the index.js file
// '/' acts as a binder between the methods are what will be passed on
// default route is '/'

.get((req,res,next)=>{
    Dishes.find({})
    .then((dishes)=>{
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);//throws dishes as a json in the body
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})//passes err to the overall error handler
})


.post((req, res, next)=>{
    //res.send(`Will add the dish: ${req.body.name} with details: ${req.body.description}`)
    //due to app.use(express.json), we expect the body to be structure as a JSON
    //end defines the endpoint's content
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish created', dish);
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);//throws dishes as a json in the body
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})//passes err to the overall error handler

})


.put((req, res, next)=>{
    res.statusCode=403;//the status code for all should be defined
    res.send('Put operation not supported on /dishes');
})

.delete((req, res, next)=>{//to interact on the collection basd on the model
    Dishes.remove({})
    .then((resp)=>{
        res.send('delete all the dishes');
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})
    //dangerous operation; necessity to define a scope
});


dishRouter.route('/:dishId')//the id needs to simply match the one used as a params

.get((req, res,next)=>{//first the code above will be execute; 
    //res and req will be then passed on from the code from above because of next()
    //res.send(`will send details of the dish: ${req.params.dishId}  to you`)//data will be put here
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})
})

.post((req, res, next)=>{
    res.statusCode=403;
    res.send('Post operations not supported on dishes '+req.params.dishId)
})//it doesn't make sense to post one single dish form the user \
//post is about adding a new element to the database

.put((req, res, next)=>{
    //res.write('Updating the dish' +req.params.dishId + '\n')
    //the information to update it with are in the body of the request
    //res.end('Will Update the dish: '+ req.body.name+ req.body.description)
    //we could use send but send puts the message in the body and write too; 
    //we cant use write and then send
    //this impementation makes it so that the endpoint variable os only called once for all the methods

    Dishes.findByIdAndUpdate(req.params.dishId,
        {$set: req.body},
        {new:true})
        .then((dish)=>{
            res.status=200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err)=>{next(err)})
        .catch((err)=>{next(err)})
//the true flag will return the updated dish
})

.delete((req, res, next)=>{
    //res.send('Deleting dish: '+req.params.dishId)
    //dangerous operation; necessity to define a scope
    //dishId is passed to params as a variable
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})
});




//handling subdocuments
dishRouter.route('/:dishId/comments')
//to handle all comments for a given dishId
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dishes)=>{
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);//throws dishes as a json in the body
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})//passes err to the overall error handler
})

.post((req, res, next)=>{
    //res.send(`Will add the dish: ${req.body.name} with details: ${req.body.description}`)
    //due to app.use(express.json), we expect the body to be structure as a JSON
    //end defines the endpoint's content
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish created', dish);
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);//throws dishes as a json in the body
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})//passes err to the overall error handler

})


.put((req, res, next)=>{
    res.statusCode=403;//the status code for all should be defined
    res.send('Put operation not supported on /dishes');
})

.delete((req, res, next)=>{//to interact on the collection basd on the model
    Dishes.remove({})
    .then((resp)=>{
        res.send('delete all the dishes');
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})
    //dangerous operation; necessity to define a scope
});


dishRouter.route('/:dishId/comments/commentId')
//in order to modify a partucular comment since we have an array of them
.get((req, res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})
})

.post((req, res, next)=>{
    res.statusCode=403;
    res.send('Post operations not supported on dishes '+req.params.dishId)
})//it doesn't make sense to post one single dish form the user \
//post is about adding a new element to the database

.put((req, res, next)=>{
    //res.write('Updating the dish' +req.params.dishId + '\n')
    //the information to update it with are in the body of the request
    //res.end('Will Update the dish: '+ req.body.name+ req.body.description)
    //we could use send but send puts the message in the body and write too; 
    //we cant use write and then send
    //this impementation makes it so that the endpoint variable os only called once for all the methods

    Dishes.findByIdAndUpdate(req.params.dishId,
        {$set: req.body},
        {new:true})
        .then((dish)=>{
            res.status=200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err)=>{next(err)})
        .catch((err)=>{next(err)})
//the true flag will return the updated dish
})

.delete((req, res, next)=>{
    //res.send('Deleting dish: '+req.params.dishId)
    //dangerous operation; necessity to define a scope
    //dishId is passed to params as a variable
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.status=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})
});

module.exports=dishRouter;//the methodes were applied  to this instance of expres.router()