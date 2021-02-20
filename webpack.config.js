/**
 * configuration for moment to ignore loading locales
 */
module.exports.plugins = [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)];
