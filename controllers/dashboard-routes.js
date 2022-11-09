const router= require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

const{ Blog, Comment, User } = require('../models');

// ################################ Get All ################################
router.get('/', withAuth, async(req,res)=> {
    console.log(req.session); // check the session
    try {
        const blogData = await Blog.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id','title','content','created_at'],
            include:[
                {
                model:Comment,
                attributes:['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],

                include: {
                    model:User,
                    attributes:['username']
                }
            },
            {
            model:User,
            attributes:['username'],
            },
        ],
        });

        const blogs = blogData.map(blog => blog.get({ plain:true }));

        res.render('dashboard', {
            blogs,
            loggedIn:true
        });

    } catch (err) {
        res.status(500).json(err);
      }
});

// ################################ Edit a blog by ID ################################
router.get('/edit/:id', withAuth, async (req,res) => {
    try {
        const blogData = await Blog.findOne({
            where: {
                id:req.params.id,
            },
            attributes: ['id','title','content','created_at'],
            include:[
                {
                model:Comment,
                attributes:['id', 'comment_text', 'user_id', 'blog_id', 'created_at'],

                include: {
                    model:User,
                    attributes:['username']
                }
            },
            {
            model:User,
            attributes:['username'],
            },
        ],
        });
        if (!blogData) {
            res.status(400).json({ message: 'No Blog found with this id' });
            return;
        };

        const blog = blogData.get({ plain:true });
        res.render('edit-blog', {
            blog,
            loggedIn:true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// ################################ Create a new Blog ################################
router.get('/create/', withAuth, async(req,res) => {
    try {
        const blogData = await Blog.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id','title','content','created_at'],
            include:[
                {
                model:Comment,
                attributes:['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],

                include: {
                    model:User,
                    attributes:['username']
                }
            },
            {
            model:User,
            attributes:['username'],
            },
        ],
        });
        const blogs = blogData.map(blog => blog.get({ plain:true}));
        res.render('create-blog', {
            blogs,loggedIn:true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;


