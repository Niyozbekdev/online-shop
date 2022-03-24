const Poster = require('../models/posterModel')


//@route     Get  /
//@desc      Get home page
//@accses    Puplic
const getHomePage = async (req, res) => {
    const posters = await Poster.find().lean()
    res.render('home', {
        title: 'Home page',
        posters: posters.reverse().slice(0,8),
        user: req.session.user,
        isLogged: req.session.isLogged,
        url: process.env.URL
    });
}

module.exports = {
    getHomePage
}