const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//Modules
const Poster = require('./models/posterModel');
const User = require('./models/userModel');

//connect 
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf8'));
const posters = JSON.parse(fs.readFileSync(`${__dirname}/_data/posters.json`, 'utf8'));


//Import
const importData = async () => {
    try {
        await User.create(users)
        await Poster.create(posters)

        console.log('Data imorted to DB ...');
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Poster.deleteMany();

        console.log('Data deleted ...')
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

if(process.argv[2] === '-i'){
    importData()
}else if(process.argv[2] === '-d'){
    deleteData()
}