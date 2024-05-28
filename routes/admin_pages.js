const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Page = require('../models/pages');

// Validation function
router.post("/add-page", async (req, res) => {
    try {
        const page = new Page({
            title: req.body.title,
            slug: req.body.slug,
            content: req.body.content,
        });

        await page.save();

        req.session.message = {
            type: "success",
            message: "Page added successfully"
        };
        res.redirect("/admin/pages");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});









router.get("/", async (req, res) => {
    try {
        const pages = await Page.find().exec();
        res.render("admin/pages", {
            title: "Home",
            pages: pages,
            
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


router.get("/add-page", (req, res) => {
    res.render("admin/add_page",{
        title:"Home Page",

    });
});

// GET edit page
router.get('/edit-page/:id', async function (req, res) {
    try {
        const page = await Page.findById(req.params.id).exec();
        if (!page) {
            req.flash('danger', 'Page not found.');
            return res.redirect('/admin/pages/');
        }

        res.render('admin/edit-page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// router.post("/update/:id", async (req, res) => {
//     try {
//         let id = req.params.id;

//         // Update the page with new data
//         let result = await Page.findByIdAndUpdate(id, {
//             title: req.body.title,
//             slug: req.body.slug,
//             content: req.body.content,
//         }, { new: true }).exec();

//         // Check if the update was successful
//         if (!result) {
//             res.json({
//                 message: "Page not found",
//                 type: "danger"
//             });
//         } else {
//             req.session.message = {
//                 type: "success",
//                 message: "Page updated successfully"
//             };
//             res.redirect("/admin/pages/");
//         }
//     } catch (err) {
//         res.json({
//             message: err.message,
//             type: "danger"
//         });
//     }
// });


// POST edit page
router.post('/edit-page/:id',  async function (req, res) {
     const errors = validationResult(req);
    const { title, slug, content } = req.body;
    const id = req.params.id;
    let pageSlug = slug ? slug.replace(/\s+/g, '-').toLowerCase() : '';

    if (!pageSlug) {
        pageSlug = title.replace(/\s+/g, '-').toLowerCase();
    }

    if (!errors.isEmpty()) {
        return res.render('admin/edit_page', {
            errors: errors.array(),
            title: title,
            slug: pageSlug,
            content: content,
            id: id
        });
    }

    try {
        let existingPage = await Page.findOne({ slug: pageSlug, _id: { '$ne': id } });
        if (existingPage) {
            // req.flash('danger', 'Page slug exists, choose another.');
            return res.render('admin/edit-page', {
                title: title,
                slug: pageSlug,
                content: content,
                id: id
            });
        }

        const page = await Page.findById(id);
        if (!page) {
            // req.flash('danger', 'Page not found.');
            return res.redirect('/admin/pages/');
        }

        page.title = title;
        page.slug = Slug;
        page.content = content;

        await page.save();

        const pages = await Page.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.pages = pages;
        {
            req.session.message = {
                type: "success",
                message: "Page Edit successfully"
            };
            res.redirect("/admin/pages");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// GET delete page
router.get('/delete-page/:id', async function (req, res) {
    try {
        await Page.findByIdAndDelete(req.params.id);
        const pages = await Page.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.pages = pages;
     {
            req.session.message = {
                type: "success",
                message: "Page Delete successfully"
            };
            res.redirect("/admin/pages");
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
