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



//handling subdocuments//

dishRouter.route('/:dishId/comments')
//to handle all comments for a given dishId
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null){
             res.status=200;
             res.setHeader('Content-Type', 'application/json');
             res.json(dish.comments);//throws dishes as a json in the body
        }
        else{
            err=new Error('Dish' + req.params.dishId + 'not found');
            err.status=404;
            return next(err);
            //build the error and pass it  to the overall error handler 
        }  
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})//passes err to the overall error handler
})
.post((req, res, next)=>{
    //to post a new comment for a specific dish
    Dishes.create(req.body)
    //.then((dish)=>{
       // console.log('Dish created', dish);
        //res.status=200;
        //res.setHeader('Content-Type', 'application/json');
       // res.json(dish);//throws dishes as a json in the body
    //}, (err)=>{next(err)})
    //.catch((err)=>{next(err)})//passes err to the overall error handler
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        //we need to push the new comment to the the array of comments within the document
        //the new comment is within the body of the request
        if (dish != null){
            dish.comments.push(req.body);
            dish.save()//will return the dish itself
            .then((dish)=>{
                res.status=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish)
            }, (err)=>{next(err)})
       }
       else{
           err=new Error('Dish' + req.params.dishId + 'not found');
           err.status=404;
           return next(err);
           //build the error and pass it  to the overall error handler 
       }  
        
    },(err)=>next(err))

})

.put((req, res, next)=>{
    res.statusCode=403;
    res.send('Put operation not supported on /dishes/' + req.params.dishId + '/comments');
})

.delete((req, res, next)=>{
    //we wanna remove all comments on a particular dish
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if (dish != null){
            for (var i = (dish.comments.length -1);i>=0; i--){
                dish.comments.id(dish.comments[i]._id).remove();
                //.id(subdocument.id) is how we access a subdocument (its elements)
            };
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err)=>{next(err)               
            })

            
            
       }
       else{
           err=new Error('Dish' + req.params.dishId + 'not found');
           err.status=404;
           return next(err);
           //build the error and pass it  to the overall error handler 
       }  
        
    },(err)=>next(err))
});


  
dishRouter.route('/:dishId/comments/commentId')
// we wanna access a particular comment

/**
 * This endpoint allows us to access a particular comment of a particular document
 * The comment being one amongst an array of other comments
 * Mongoose documentation:
 * -Each subdocument has an _id by default.
 * -Mongoose document arrays have a special id method for searching a document array to find a document with a given _id
 * -Ex:const doc = parent.children.id(_id);
 * =====>In this case, the commentId is the _id of the subdocument and .id is used since we're dealing with an array subdocument
 */
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)//found the correct document
    .then((dish)=>{
        if (dish != null && dish.comments.id(req.params.commentId != null)){
             res.status=200;
             res.setHeader('Content-Type', 'application/json');
             res.json(dish.comments.id(req.params.commentId));
            }
        else if (dish==null){
            err=new Error('Dish' + req.params.dishId + 'not found');
            err.status=404;
            return next(err);
            //build the error and pass it  to the overall error handler 
        }

        else {
            err=new Error('Comment' + req.params.commentId + 'not found');
            err.status=404;
            return next(err);
            //see the req.params as a object that carries all the ___Id as proprieties       
        }
    }, (err)=>{next(err)})
    .catch((err)=>{next(err)})//passes err to the overall error handler
})

.post((req, res, next)=>{
    res.statusCode=403;
    res.send('Post operations not supported on dishes '+req.params.dishId+ '/comments/'+ req.params.commentId);
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