const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const logger = require('morgan')
const passport = require('passport')
const cookieSession = require('cookie-session')
const flash = require('connect-flash')

const Category = require('./modals/category')
const Product = require('./modals/product')
const Order = require('./modals/order')
const User = require('./modals/user')


//express
const app = express()
app.use(express.static('./public'))

//view engine
app.set('view engine', 'ejs')
app.set('views', './views')

//Morgan
app.use(logger('dev'))

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//mongoose
mongoose.connect('mongodb+srv://admin:admin1234@cluster0.mbeft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, function (err) {
    if (err) {
        console.log('Mongo connect error: ' + err)
    } else {
        console.log('Mongo connect successfully !')
    }
})

//passport
require('./passport')(passport);

app.use(cookieSession({
    name: 'user-session',
    maxAge: 24 * 60 * 60 * 1000,// a day
    keys: ['aksdfbkasbfKHBKBKDFbbdfkbab&#uib3brjnbljdbfa4ugIGiukYF87o3ueljbf813ekwjdbask']
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.listen(3000, function () {
    console.log('Server have been start at http://localhost:' + 3000)
})

app.get('/', async (req, res) => {
    try {
        let category = await Category.find({Status: 1})
        let product = await Product.find({Status: 1})
        res.render('default', {
            title: 'Trang chủ - Gilly shop',
            page: 'main',
            cate: category,
            product: product,
            allproduct: product,
            user: req.user
        })
    } catch (e) {
        console.log('Đã có lỗi ở trang chủ: ' + e)
        res.sendStatus(404)
    }
})

app.get('/danhmuc/:slug', async (req, res) => {
    try {
        let slug = req.params.slug
        let category = await Category.find({Status: 1})
        let thiscate = await Category.findOne({Slug: slug})
        let product = await Product.find({Parent: thiscate._id})
        let allproduct = await Product.find({Parent: thiscate._id})
        if (product.length > 0) {
            res.render('default', {
                user: req.user,
                title: thiscate.Name + ' - Gilly shop',
                page: 'main',
                cate: category,
                product: product,
                allproduct: allproduct
            })
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log('Đã có lỗi ở danh mục: ' + e)
        res.sendStatus(404)
    }
})

app.get('/sanpham/:slug', async (req, res) => {
    try {
        let slug = req.params.slug
        let product = await Product.findOne({Slug: slug})
        let allproduct = await Product.find({Status: 1})
        res.render('default', {
            user: req.user,
            title: product.Name + ' - Gilly shop',
            page: 'detail',
            product: product,
            allproduct: allproduct
        })

    } catch (e) {
        console.log('Đã có lỗi ở sản phẩm: ' + e)
        res.sendStatus(404)
    }
})

app.get('/thanhtoan', async (req, res) => {
    try {
        let allproduct = await Product.find({Status: 1})
        res.render('default', {
            user: req.user,
            title: 'Thanh toán - Gilly shop',
            page: 'checkout',
            allproduct: allproduct
        })

    } catch (e) {
        console.log('Đã có lỗi ở thanh toán: ' + e)
        res.sendStatus(404)
    }
})

app.post('/thanhtoan', (req, res) => {
    let Name = req.body.Name
    let Phone = req.body.Phone
    let Add = req.body.Add
    let Note = req.body.Note
    let rawCart = req.body.Cart
    let cart = []
    let total = 0
    for (c of rawCart) {
        cart.push({id: c.id, Name: c.Name, Price: c.Price, Size: c.Size, Qty: c.qty})
        total += parseInt(c.Price) * parseInt(c.qty)
    }

    let newOrder = new Order({
        Name: Name,
        Phone: Phone,
        Add: Add,
        Note: Note,
        Cart: cart,
        TotalPrice: parseInt(total),
        Status: 0
    })


    newOrder.save((err) => {
        if (err) {
            console.log(err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
            for (let c of cart) {
                Product.findByIdAndUpdate(c.id, {$inc: {Sales: parseInt(c.Qty)}}, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        }
    })
})

app.get('/dangki', async (req, res) => {
    try {
        let category = await Category.find({Status: 1})
        let product = await Product.find({Status: 1})
        if (req.user) {
            res.redirect('/')
        } else {
            res.render('default', {
                user: req.user,
                title: 'Trang chủ - Gilly shop',
                page: 'register',
                cate: category,
                allproduct: product
            })
        }
    } catch (e) {
        console.log('Đã có lỗi ở trang chủ: ' + e)
        res.sendStatus(404)
    }
})

app.post('/dangki', async (req, res) => {
    let Name = req.body.txtName;
    let Email = req.body.txtEmail;
    let Password = req.body.txtPassword;
    let Phone = req.body.txtPhone;
    let Address = req.body.txtAddress;

    User.findOne({'Email': Email}, function (err, user) {
        if (err) {
            console.log('Error: ' + err);
            res.json({result: 0, errorMsg: 'Vui lòng thử lại sau !'});
        }
        if (user) {
            res.json({result: 0, errorMsg: 'Email đã tồn tại !'});
        } else {
            let newUser = new User({
                Name: Name,
                Email: Email,
                Address: Address,
                Phone: Phone,
                Password: new User().generateHash(Password),
                userGroup: 1,
                Status: 1
            })
            newUser.save(function (err) {
                if (err) {
                    console.log('Lỗi khi thêm tài khoản : ' + err);
                    res.json({result: 0, errorMsg: 'Vui lòng thử lại sau !'});
                } else {
                    res.json({result: 1});
                }
            })
        }
    })
})

app.get('/dangnhap', async (req, res) => {
    if (req.user) {
        res.redirect('/')
    } else {
        try {
            let category = await Category.find({Status: 1})
            let product = await Product.find({Status: 1})
            console.log(req)
            res.render('default', {
                user: req.user,
                title: 'Đăng nhập - Gilly shop',
                page: 'login',
                cate: category,
                allproduct: product,
                user: req.user,
                message: req.flash('loginMessage')
            })

        } catch (err) {
            console.log('Home page get info err: ' + err);
        }
    }
})

app.post('/dangnhap', passport.authenticate('client-login', {
    successRedirect: '/',
    failureRedirect: '/dangnhap',
    failureFlash: true
}))

app.get('/dangxuat', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.get('/admin/sanpham', async (req, res) => {
    try {
        if (req.user && req.user.userGroup === 0) {
            let category = await Category.find()
            let product = await Product.find()
            res.render('addproduct', {
                cate: category,
                product: product,
                user: req.user
            })
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log('Đã có lỗi ở trang chủ: ' + e)
        res.sendStatus(404)
    }
})

app.post('/admin/themsanpham', (req, res) => {
    let Name = req.body.Name
    let Price = req.body.Price
    let Discount = req.body.Discount
    let Size = req.body.Size
    let Slug = req.body.Slug
    let Parent = req.body.Parent
    let Image = req.body.Image
    let Status = req.body.Status

    if (typeof Discount == 'undefined') {
        Discount = 0
    }

    let newProduct = new Product({
        Name: Name,
        Image: Image,
        Price: Price,
        Discount: Discount,
        Parent: Parent,
        Sales: 0,
        Size: Size.split(','),
        Status: Status,
        Slug: Slug,
    })

    newProduct.save((err) => {
        if (err) {
            console.log('Đã có lỗi khi thêm sản phẩm: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })

})

app.post('/admin/suasanpham', (req, res) => {
    let id = req.body.id
    let Name = req.body.Name
    let Price = req.body.Price
    let Discount = req.body.Discount
    let Size = req.body.Size
    let Slug = req.body.Slug
    let Parent = req.body.Parent
    let Image = req.body.Image
    let Status = req.body.Status

    if (typeof Discount == 'undefined') {
        Discount = 0
    }

    Product.findByIdAndUpdate(id, {
        Name: Name,
        Image: Image,
        Price: Price,
        Discount: Discount,
        Parent: Parent,
        Sales: 0,
        Size: Size.split(','),
        Status: Status,
        Slug: Slug
    }, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi sửa sản phẩm: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })

})

app.post('/admin/xoasanpham', (req, res) => {
    let id = req.body.id

    Product.findByIdAndDelete(id, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi xoá sản phẩm: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })
})

app.get('/admin/danhmuc', async (req, res) => {
    try {
        if (req.user && req.user.userGroup === 0) {
            let category = await Category.find()
            let product = await Product.find()
            res.render('addcategory', {
                cate: category,
                product: product,
                user: req.user
            })
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log('Đã có lỗi ở trang chủ: ' + e)
        res.sendStatus(404)
    }
})

app.post('/admin/themdanhmuc', (req, res) => {
    let Name = req.body.Name
    let Status = req.body.Status
    let Slug = req.body.Slug


    let newCategory = new Category({
        Name: Name,
        Status: Status,
        Slug: Slug,
    })

    newCategory.save((err) => {
        if (err) {
            console.log('Đã có lỗi khi thêm danh mục: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })

})

app.post('/admin/suadanhmuc', (req, res) => {
    let id = req.body.id
    let Name = req.body.Name
    let Status = req.body.Status
    let Slug = req.body.Slug


    Category.findByIdAndUpdate(id, {Name: Name,Slug: Slug, Status: Status}, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi sửa danh mục: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })

})

app.post('/admin/xoadanhmuc', (req, res) => {
    let id = req.body.id

    Category.findByIdAndDelete(id, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi xoá danh mục: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })
})

app.get('/admin/taikhoan', async (req, res) => {
    try {
        if (req.user && req.user.userGroup === 0) {
            let user = await User.find()
            res.render('account', {
                alluser: user,
                user: req.user
            })
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log('Đã có lỗi ở trang chủ: ' + e)
        res.sendStatus(404)
    }
})

app.post('/admin/suataikhoan', (req, res) => {
    let id = req.body.id
    let Name = req.body.Name
    let Password = req.body.Password
    let Phone = req.body.Phone
    let Address = req.body.Address
    let userGroup = req.body.userGroup
    let Status = req.body.Status


    User.findByIdAndUpdate(id, {
        Name: Name,
        Address: Address,
        Phone: Phone,
        Password: new User().generateHash(Password),
        userGroup: userGroup,
        Status: Status
    }, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi sửa tài khoản: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })

})

app.post('/admin/xoataikhoan', (req, res) => {
    let id = req.body.id

    User.findByIdAndDelete(id, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi xoá tài khoản: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })
})

app.get('/admin/donhang', async (req, res) => {
    try {
        if (req.user && req.user.userGroup === 0) {
            let order = await Order.find()
            res.render('order', {
                order: order,
                user: req.user
            })
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log('Đã có lỗi ở trang chủ: ' + e)
        res.sendStatus(404)
    }
})

app.post('/admin/suadonhang', (req, res) => {
    let id = req.body.id
    let Name = req.body.Name
    let Phone = req.body.Phone
    let Add = req.body.Add
    let Note = req.body.Note
    let Status = req.body.Status


    Order.findByIdAndUpdate(id, {
        Name: Name,
        Add: Add,
        Phone: Phone,
        Note: Note,
        Status: Status
    }, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi sửa đơn hàng: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })

})

app.post('/admin/xoadonhang', (req, res) => {
    let id = req.body.id

    Order.findByIdAndDelete(id, null, (err) => {
        if (err) {
            console.log('Đã có lỗi khi xoá đơn hàng: ', err)
            res.json({result: 0})
        } else {
            res.json({result: 1})
        }
    })
})