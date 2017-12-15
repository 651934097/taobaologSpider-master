var Schema = require('./lib').Schema;
var mySchema = Schema({
    name: String,
    phone: String,
    date: Date,
    isTaobaoJiaMeng: Boolean
}, {
    versionKey: false
});

/* global db */
module.exports = db.model('underwear_pz', mySchema);
