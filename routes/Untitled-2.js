const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"

const Page=require("../models/pages")




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

router.get("/admin/pages/edit-page/:id", async (req, res) => {
    try {
        let id = req.params.id;
        console.log("ID:", id); // Debugging statement

        let page = await Page.findById(id).exec();
        console.log("Page:", page); // Debugging statement

        if (page == null) {
            console.log("Page not found"); // Debugging statement
            res.redirect("/admin/pages"); // Redirect if no page is found
        } else {
            res.render("admin/edit-page", {
                title: "Edit",
                page: page
            });
        }
    } catch (err) {
        console.error("Error:", err); // Debugging statement
        res.redirect("/admin/pages");
    }
});





module.exports = router;






const validatePage = [
    body('title', 'Title must have a value.').notEmpty(),
    body('content', 'Content must have a value.').notEmpty()
];

// GET pages index
router.get('/', async function (req, res) {
    try {
        const pages = await Page.find({}).sort({ sorting: 1 }).exec();
        res.render('admin/pages', {
            title: "Home",
            pages: pages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// GET add page
router.get('/add-page', function (req, res) {
    res.render('admin/add_page', {
        title: "",
        slug: "",
        content: ""
    });
});

// POST add page
router.post('/add-page', validatePage, async function (req, res) {
    const errors = validationResult(req);
    const { title, slug, content } = req.body;
    let pageSlug = slug ? slug.replace(/\s+/g, '-').toLowerCase() : '';

    if (!pageSlug) {
        pageSlug = title.replace(/\s+/g, '-').toLowerCase();
    }

    if (!errors.isEmpty()) {
        return res.render('admin/add_page', {
            errors: errors.array(),
            title: title,
            slug: pageSlug,
            content: content
        });
    }

    try {
        let existingPage = await Page.findOne({ slug: pageSlug });
        if (existingPage) {
            // req.flash('danger', 'Page slug exists, choose another.');
            return res.render('admin/add_page', {
                title: title,
                slug: pageSlug,
                content: content
            });
        }

        let newPage = new Page({
            title: title,
            slug: pageSlug,
            content: content,
            sorting: 100
        });

        await newPage.save();

        const pages = await Page.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.pages = pages;
        // req.flash('success', 'Page added!');
        res.redirect('/admin/pages/');

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Sort pages function
async function sortPages(ids) {
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        await Page.findByIdAndUpdate(id, { sorting: i + 1 });
    }
}

// POST reorder pages
router.post('/reorder-pages', async function (req, res) {
    const ids = req.body['id[]'];
    try {
        await sortPages(ids);
        const pages = await Page.find({}).sort({ sorting: 1 }).exec();
        req.app.locals.pages = pages;
        res.status(200).send('Pages reordered');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
