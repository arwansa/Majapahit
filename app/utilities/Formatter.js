const Formatter = {
    success: function(results, message) {
        const res = {
            success: true,
            message: message
        };
        if (results) {
            res.data = Array.isArray(results) ? results : [results];
        }
        return res;
    },

    error: function(errors, message) {
        const res = {
            success: false,
            message: message
        };
        if (errors) {
            res.errors = Array.isArray(errors) ? errors : [errors];
        }
        return res;
    }
};
module.exports = Formatter;
