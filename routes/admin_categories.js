const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"

const Category=require("../models/categories")




router.post("/add-category", async (req, res) => {
    try {
        const category = new Category({
            title: req.body.title,
            slug: req.body.slug,
        });

        await category.save();

        req.session.message = {
            type: "success",
            message: "Category added successfully"
        };
        res.redirect("/admin/categories");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});









router.get("/", async (req, res) => {
    try {
        const categories = await Category.find().exec();
        res.render("admin/categories", {
            title: "Home",
            categories: categories,
            
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


router.get("/add-category", (req, res) => {
    res.render("admin/add_category",{
        title:"Home Page",

    });
});

// router.get('/edit-category/:id',  function (req, res) {

//     Category.findById(req.params.id, function (err, category) {
//         if (err)
//             return console.log(err);

//         res.render('admin/edit_category', {
//             title: category.title,
//             id: category._id
//         });
//     });

// });



router.get("/edit/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let page = await Page.findById(id).exec();

        if (page == null) {
            res.redirect("/admin/edit_category"); // Redirect if no page is found
        } else {
            res.render("edit-page", {
                title: "Edit",
                page: page
            });
        }
    } catch (err) {
        res.redirect("/admin/edit_category");
    }
});


router.post("/update/:id", async (req, res) => {
    try {
        let id = req.params.id;

        // Update the page with new data
        let result = await Page.findByIdAndUpdate(id, {
            title: req.body.title,
            slug: req.body.slug,
            content: req.body.content,
        }, { new: true }).exec();

        // Check if the update was successful
        if (!result) {
            res.json({
                message: "Page not found",
                type: "danger"
            });
        } else {
            req.session.message = {
                type: "success",
                message: "Page updated successfully"
            };
            res.redirect("/");
        }
    } catch (err) {
        res.json({
            message: err.message,
            type: "danger"
        });
    }
});









router.get("/delete/:id", async (req, res) => {
    let id = req.params.id;
    
    try {
        const result = await Page.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ message: "Page not found" });
        }

        else {
            req.session.message = {
                type: "success",
                message: "Page Delete successfully"
            };
            res.redirect("/");
        }
    } catch (err) {
        return res.status(500).json({ message: "Error deleting page", error: err.message });
    }
});



module.exports = router;
