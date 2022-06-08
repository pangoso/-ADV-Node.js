var express = require('express');
const cart = require('../models/cart');
var router = express.Router();
var Product = require('../models/product')
var Cart = require('../models/cart')

router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0]
  var products = Product.find(function(err, docs) {
    res.render('shop/index', { title: 'Shopping cart', products: docs, successMsg: successMsg, noMessages: !successMsg });
  })
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function(error, product) {
    if (error) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    res.redirect('/')
  })
})

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.reduceByOne(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
})

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeItem(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
})

router.get('/removeAll', function(req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {})
  cart.removeAll()
  req.session.cart = cart
  req.flash('success', 'Succesfully removed all products')
  res.redirect('/')
})

router.post('/finalize', async function(req, res, next) {
  var cart = new Cart(req.session.cart)
  var arr = cart.getArray()
  var finalItems = []

  for (var {item,qty} of arr) {
    var obj = await Product.findById({'_id': item._id}).exec()
    finalItems.push(obj)
    
    if (obj.quantity < qty) {
      req.flash('failure', `Not enough product: ${obj.title}`)
      console.log({title:obj.title})
    }
  }

  var successMsg = req.flash('failure')[0]
  if (successMsg) {
    return res.redirect('/shopping-cart')
  }

  for (var item of finalItems) {
    const o = arr.find(i => i.item._id===item._id.toString())
    await Product.updateOne({'_id': item._id}, {quantity: item.quantity - o.qty}).exec()
  }
  
  req.session.cart = null
  req.flash('success', 'Succesfully bought')
  res.redirect('/')

  // var cart = new Cart(req.session.cart ? req.session.cart : {})
  // var arr = cart.getArray()

  // var done = 0
  // var changed = 0
  // var length = arr.length

  // for (var id in arr) {
  //   var quantity = arr[id].qty
  //   if (arr[id].item.quantity < quantity) {
  //     req.flash('failure', `Not enough product ${arr[id].item.title}`)
  //     var successMsg = req.flash('failure')[0]
  //     return res.render('shop/shopping-cart', {products: cart.getArray(), totalPrice: cart.totalPrice, successMsg: successMsg, noMessages: !successMsg})
  //   } else {
  //       done++
  //   }
  // }

  // if (done == length) {
  //   for (var id in arr) {
  //     console.log(arr[id].item.title)
  //     await Product.findOne({'title': arr[id].item.title}, function(err, doc) {
  //       if (err) {
  //         console.error('error, no entry found');
  //       }
  //       console.log(doc, doc.quantity)
  //       // doc.quantity = doc.quantity - arr[id].qty;
  //       // console.log(doc, doc.quantity)
  //       // doc.save();
  //       changed++
  //     })
  //     console.log(changed)
  //   }
  //   console.log("AA", changed, done)
  // }

  // console.log("Tu??")
  // if (changed == done) {
  //     console.log(changed, done)
  //     cart.removeAll()
  //     req.session.cart = cart
  //     req.flash('success', 'Succesfully bought')
  //     res.redirect('/')
  //   }

})

router.get('/shopping-cart', async function(req, res, next) {
  var successMsg = req.flash('failure')[0]
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null, successMsg: successMsg, noMessages: !successMsg})
  }
  var cart = new Cart(req.session.cart)
  var arr = cart.getArray()

  for (var {item,qty} of arr) {
    var obj = await Product.findById({'_id': item._id}).exec()
    if (obj.quantity < qty) {
      req.flash('failure', `Not enough product ${obj.title}`)
      console.log({title:obj.title})
    }
  }

  var successMsg = req.flash('failure')[0]
  console.log({successMsg})

  res.render('shop/shopping-cart', {products: cart.getArray(), totalPrice: cart.totalPrice, successMsg: successMsg, noMessages: !successMsg})
})

module.exports = router;
