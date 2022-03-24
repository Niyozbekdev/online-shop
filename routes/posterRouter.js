const { Router } = require('express');
const { getPostersPage,
        addNewPostersPage, 
        addNewPosters, 
        getOnePoster,
        getEditPosterPage,
        updatePoster,
        deletePoster
      } = require('../conturolles/postersControlles');
const upload = require('../utils/fileUpload');
const router = Router();
const { protected } = require('../middlewares/auth')

router.get('/', getPostersPage);
router.get('/add', protected, addNewPostersPage); 
router.post('/add', protected, upload.single('image'), addNewPosters);
router.get('/:id', getOnePoster);
router.get('/:id/edit', protected, getEditPosterPage);
router.post('/:id/edit', protected, updatePoster);
router.post('/:id/delete', protected, deletePoster);


module.exports = router;