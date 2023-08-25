const express = require('express')
const a = express()
const PORT = 5001
const path = require('path')

a.set('view engine','hbs')
a.set('views',path.join(__dirname,'src/views'))

a.use(express.static('src/assets'))

a.use(express.urlencoded({ extended: false }))

a.get('/index', home)
a.get('/addmyproject',formMyproject)
a.post('/addmyproject',addMyproject)
a.get('/contact',contact)
a.get('/detail/:id',detail)
a.get('/testimonial',testimonial)

a.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})

function home (req, res){
    res.render('index');
}
function formMyproject (req, res){
    res.render('addmyproject');
}
function contact (req, res){
    res.render('contact');
}
function detail (req, res){
    const {id} = req.params

    const data ={
        id,
        title:'Yoga ganteng banget',
        content:'Seorang manusia bernama yoga sangat ganteng'
    }
    res.render('detail',{data});
}
function testimonial (req, res){
    res.render('testimonial');
}
function addMyproject (req, res){
    const {title,content} = req.body

    console.log(title)
    console.log(content)
     res.redirect('index');
}