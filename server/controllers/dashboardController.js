const Journal = require("../models/Journal");
const mongoose = require("mongoose");

exports.dashboard = async (req, res) => {

    const locals = {
        title: "Dashboard",
        description: "Journal app"
    };

    let perPage = 5;
    let page = req.query.page || 1;

    try {

        Journal.aggregate([
            {
                $sort: {
                    createAt: -1
                }
            },
            { $match: { user: req.user.id } },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 200] },
                    createAt: { $substr: ["$createAt", 0, 10] }
                }
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec((err, journals) => {

                Journal.count().exec((err, count) => {
                    if (err) return next(err);

                    res.render("dashboard/dashboard", {
                        userName: req.user.lastName,
                        locals,
                        journals,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        // set custom layout //
                        layout: "../views/layouts/dashboard"
                    });
                })
            })


    } catch (err) { console.log(err) }


};

/// get one ///

exports.dashboardViewJournal = async (req, res) => {
    const journal = await Journal.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();

    if (journal) {
        res.render("dashboard/view-journal", {
            journalID: req.params.id,
            journal,
            layout: "../views/layouts/dashboard"
        })
    } else (
        res.send("something went wrong ")
    )
}


/// update one (put)///
exports.dashboardUpdateJournal = async (req, res) => {
    try {
        await Journal.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body }
        ).where({ user: req.user.id })

        res.redirect("/dashboard");
    } catch (err) { console.log(err) }
}

/// Delete one ///
exports.dashboardDeleteJournal = async (req, res) => {
    try {
        await Journal.findByIdAndDelete(
            { _id: req.params.id },
        ).where({ user: req.user.id })

        res.redirect("/dashboard");
    } catch (err) { console.log(err) }
}

/// create page ///
exports.dashboardAddJournal = async (req, res) => {
    try {

        await fetch("https://api.quotable.io/random")
            .then(res => res.json())
            .then(data => {
                const { content, author } = data;
                res.render("dashboard/add", {
                    content,
                    author,
                    layout: "../views/layouts/dashboard"
                });
            });
    } catch (err) { console.log(err) }
}

/// Create ///
exports.dashboardAddJournalSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Journal.create(req.body)

        res.redirect("/dashboard");
    } catch (err) { console.log(err) }
}

/// Search page///
exports.dashboardSearch = async (req, res) => {
    try {
        res.render("dashboard/search", {
            searchResults: "",
            layout: "../views/layouts/dashboard"
        })
    } catch (err) { console.log(err) }
}

exports.dashboardSearchSubmit = async (req, res) => {
    try {
        const searchTerm = req.body.searchTerm;
        const searchTermNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Journal.find({
            $or: [
                { title: { $regex: new RegExp(searchTermNoSpecialChars, "i") } },
                { body: { $regex: new RegExp(searchTermNoSpecialChars, "i") } },
            ]
        }).where({ user: req.user.id })

        res.render("dashboard/search", {
            searchResults,
            layout: "../views/layouts/dashboard"
        })



    } catch (err) { console.log(err) }
}