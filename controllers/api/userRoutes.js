const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// ################################ All users ################################

router.get('/', async (req,res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password']},
        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});
// ################################ users by id ################################
router.get('/:id', async(req,res) =>{
    try {
        const userData = await User.findOne({
            attributes:{ exclude: ['password']},
            where: {
                id:req.params.id,
            },
            include: [{
                model:Blog,
                attributes: ['id', 'title', 'content', 'create_at'],
            },
            {
                model: Comment,
                attributes:['id', 'comment_text','create_at'],
                include: {
                    model:Blog,
                    attributes:['title'],
                }
            }
        ]
        });
        if (!userData) {
            res.status(400).json({ message: 'No user found with this id' });
            return;
          }
          res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});
// ################################ Sign Up ################################
router.post('/', async (req, res) => {
    try {
      const userData = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;
        res.status(200).json(userData);
      });
    } catch (err) {
      res.status(400).json(err);
    }
  });

// ################################ Login ################################
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!userData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
      const validPassword = userData.checkPassword(req.body.password);
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;
        res.status(200).json({ userData, message: 'You are logged in!' });
      });
    } catch (err) {
      res.status(400).json(err);
    }
  });
// ################################ Update User ################################
router.put('/:id', withAuth, async (req, res) => {
    try {
      const userData = User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id,
        },
      });
      if (!userData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
// ################################ user delete ################################
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const userData = User.destroy(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
// ################################ Log out ################################
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

  module.exports = router;
// ################################ users by id ################################
// ################################ users by id ################################