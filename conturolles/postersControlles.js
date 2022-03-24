const Poster = require('../models/posterModel');
const User = require('../models/userModel');
const filtering = require('../utils/filtering');

//@route     Get  /posters
//@desc      Get home posters
//@accses    Puplic
const getPostersPage = async (req, res) => {
    try{
       const pagelimit = 10
       const limit = parseInt(req.query.limit)
       const page = parseInt(req.query.page)
       const total = await Poster.countDocuments()

       //Redirect if queires [page, limit] doesn't exist
       if(req.url ==='/'){
           return res.redirect(`?page=1&limit=${pagelimit}`)
       }


        if(req.query.search){
            const { search } = req.query
            const posters = await Poster.searchPartial(search, (err, data) => {
              if(err) throw new Error
            }).lean()
      
            return res.status(200).render('poster/searchRusults', {
              title: 'Search results',
              posters: posters.reverse(),
              user: req.session.user,
              querySearch: req.query.search,
              url: process.env.URL
            })
          }

          if(!req.query.page || !req.query.limit){
              const { category, from, to, region } = req.query
              // $gte $lte $gt $lt
              const filterings = filtering(category, from, to, region)
              const posters = await Poster.find(filterings).lean()

              return res.render('poster/searchRusults', {
                title: 'Filter results',
                posters: posters.reverse(),
                user: req.session.user,
                querySearch: req.query.search,
                url: process.env.URL
              })
            }

        const posters = await Poster
              .find()
              .skip((page * limit) - limit)
              .limit(limit)
              .lean()

        return res.render('poster/posters', {
            title: 'Posters page',
            posters: posters.reverse(),
            pagination: {
                page,
                limit,
                pageCount: Math.ceil(total/limit)
            },
            user: req.session.user,
            url: process.env.URL
        })
    }catch(err){
        console.log(err)
    }
}

//@route     Get  /posters/add
//@desc      Get adding poster page
//@accses    Puplic
const addNewPostersPage = (req, res) => {
    res.render('poster/add-posters', {
        title: 'Yangi elon qushish',
        user: req.session.user,
        url: process.env.URL
    })
}

//@route     Post  /posters/add
//@desc      Post new posters
//@accses    Privete
const addNewPosters = async (req, res) => {
    try{
        const newPoster = new Poster({
            title: req.body.title,
            amount: req.body.amount,
            region: req.body.region, 
            category: req.body.category,
            description: req.body.description,
            image: 'uploads/' + req.file.filename,
            author: req.session.user._id
        })

        await User.findByIdAndUpdate(req.session.user._id,
             {$push: {posters: newPoster._id}},
             {new: true, upsert: true})

             await newPoster.save((err, posterSaved) => {
                if(err) throw err
                const posterId = posterSaved._id
                res.redirect('/posters/' + posterId)
             })
    }catch(err){
        console.log(err)
    }
}

//@route     Post  /posters/add:id
//@desc      Post one poster by id
//@accses    Privete
const getOnePoster = async (req, res) =>{
    try{
        const poster = await Poster
            .findByIdAndUpdate(req.params.id, { $inc: {visits: 1}}, {new: true})
            .populate('author')
            .lean()
        res.render('poster/one', {
            title: poster.title,
            url: process.env.URL,
            user: req.session.user,
            author: poster.author,
            poster
        })
    }catch(err){
        console.log(err)
    }
}


//@route     Get  /posters/add:id/edit
//@desc      Get edit poster page
//@accses    Privete (Own)
const getEditPosterPage = async (req, res) => {
    try{
        const poster = await Poster.findById(req.params.id).lean()
        res.render('poster/edit-poster', {
            title: 'Edit page',
            url: process.env.URL,
            poster
        })
    }catch(err){
        console.log(err)
    }
}

//@route     Post  /posters/:id/edit
//@desc      Edit poster by9 id
//@accses    Privete (Own)
const updatePoster = async (req, res) => {
    try{
        const editedPoster = {
            title: req.body.title,
            amount: req.body.amount,
            image: req.body.image,
            region: req.body.region,
            category: req.body.category,
            description: req.body.description
        }
        await Poster.findByIdAndUpdate(req.params.id, editedPoster)
        res.redirect('/posters')
    }catch(err){
        console.log(err)
    }
}

//@route     Post  /posters/:id/delete
//@desc      delete poster by id
//@accses    Privete (Own)
const deletePoster = async (req, res) => {
    try{
        await Poster.findByIdAndRemove(req.params.id)
        res.redirect('/posters')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getPostersPage,
    addNewPostersPage,
    addNewPosters,
    getOnePoster,
    getEditPosterPage,
    updatePoster,
    deletePoster
}