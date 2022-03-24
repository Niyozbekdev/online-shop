const User = require('../models/userModel');
const bcrypt = require('bcryptjs')

//@route     Get  /auth/login
//@desc      Get login page
//@accses    Puplic

const getLoginPage = (req, res) =>{
    if(!req.session.isLogged){
        res.render('auth/login', {
            title: 'Login',
            loginError: req.flash('loginError'),
            url: process.env.URL
        })
    }
}


//@route     Get  /auth/signup
//@desc      Get register page
//@accses    Puplic
const getRegisterPage = (req, res) =>{
    if(!req.session.isLogged){
        res.render('auth/signup', {
            title: 'Registratsiya',
            regError: req.flash('regError'),
            url: process.env.URL
        })
    }
}

//@route     Get  /auth/signup
//@desc      Register new user page
//@accses    Puplic
const registerNewUser = async (req, res) => {
    try{
        const { email, username, phone, password, password2 } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const userExist = await User.findOne({email})
        if(userExist){
            req.flash('regError', 'Bunday foydalanuvchi bazada bor')
            return res.redirect('/auth/signup')
        }

        if(email === ''){
            req.flash('regError', 'Iltimos hamma narsan tuladiring')
            return res.redirect('/auth/signup')
        }

        if(password !== password2){
            req.flash('regError', 'Parolar mos tushmayabdi')
            return res.redirect('/auth/signup')
        }

        await User.create({
            email,
            username,
            phone,
            password: hashedPassword
        })

        return res.redirect('/auth/login')


    }catch(err){
        console.log(err)
    }
}

// @route     POST  /auth/login
// @desc      Login user to website
// @accses    Puplic
const loginUser = async (req, res) => {
    try{
        const userExist = await User.findOne({email: req.body.email})
        if(userExist){
            const matchPassword = await bcrypt.compare(req.body.password, userExist.password)
            if(matchPassword){
                req.session.user = userExist
                req.session.isLogged = true
                req.session.save(err => {
                    if(err) throw err
                    res.redirect('/profile/' + req.session.user.username)
                })
            }else{
                req.flash('loginError', 'Notogri malumot kiritildi')
                res.redirect('/auth/login')
            }
        }else{
            req.flash('loginError', 'Bundat foydalanuvchi mavjud emas')
            res.redirect('/auth/login')
        }
    }catch(err){
        console.log(err)
    }
}


// @route     Get  /auth/logout
// @desc      Logout user
// @accses    Private
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}


module.exports = {
    getLoginPage,
    getRegisterPage,
    registerNewUser,
    loginUser,
    logout
} 



