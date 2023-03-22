
exports.homepage = async (req, res) => {
    const locals = {
        title: "Simple Journal",
        description: "Journal app"
    };


    res.render("index", {
        locals,
        // set custom layout //
        layout: "../views/layouts/home-page"

    })


};

exports.about = async (req, res) => {
    const locals = {
        title: "About",
        description: "Journal app"
    };

    res.render("about", locals);
};