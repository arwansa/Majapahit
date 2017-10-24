const validator = require('validator');

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
    },

    pagination: function(query, lastId, isGreaterThan) {
        if (validator.isMongoId(lastId + '')) {
            if (isGreaterThan == true) {
                return {
                    $and: [{
                        _id: {
                            $gt: lastId
                        }
                    }, query]
                };
            } else {
                return {
                    $and: [{
                        _id: {
                            $lt: lastId
                        }
                    }, query]
                }
            }
        }
        return query;
    }
};
module.exports = Formatter;
