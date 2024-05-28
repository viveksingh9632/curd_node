const express = require("express");
const router = express.Router(); // Corrected: "Router" should be "express.Router()"

const Page=require("../models/pages")




router.post("/admin/pages/add-page", async (req, res) => {
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
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});









router.get("/", async (req, res) => {
    try {
        const pages = await Page.find().exec();
        res.render("pages", {
            title: "Home",
            pages: pages,
            
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


router.get("/admin/pages/add-page", (req, res) => {
    res.render("add_page",{
        title:"Home Page",

    });
});



// router.get("/edit/:id", async (req, res) => {
//     try {
//         let id = req.params.id;
//         let page = await Page.findById(id).exec();

//         if (page == null) {
//             res.redirect("/"); // Redirect if no page is found
//         } else {
//             res.render("edit_page", {
//                 title: "Edit",
//                 page: page
//             });
//         }
//     } catch (err) {
//         res.redirect("/");
//     }
// });



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
//             res.redirect("/");
//         }
//     } catch (err) {
//         res.json({
//             message: err.message,
//             type: "danger"
//         });
//     }
// });









// router.get("/delete/:id", async (req, res) => {
//     let id = req.params.id;
    
//     try {
//         const result = await Page.findByIdAndDelete(id);
        
//         if (!result) {
//             return res.status(404).json({ message: "Page not found" });
//         }

//         else {
//             req.session.message = {
//                 type: "success",
//                 message: "Page Delete successfully"
//             };
//             res.redirect("/");
//         }
//     } catch (err) {
//         return res.status(500).json({ message: "Error deleting page", error: err.message });
//     }
// });



module.exports = router;












