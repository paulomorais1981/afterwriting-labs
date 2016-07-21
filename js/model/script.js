define(function(require) {

    var LazyObject = require('utils/lazy-object/lazy-object'),
        Tokens = require('model/traits/tokens'),
        Lines = require('model/traits/lines'),
        Fountain = require('model/traits/fountain'),
        Import = require('model/traits/import'),
        Config = require('model/traits/config'),
        TitleToken = require('model/traits/title-token'),
        ParsedStats = require('model/traits/parsed-stats'),
        Pdf = require('model/traits/pdf'),
        Format = require('model/traits/format');

    var Script = LazyObject.create({
        config: Config,
        tokens: Tokens,
        lines: Lines,
        fountain: Fountain,
        import_script: Import,
        format: Format,
        title_token: TitleToken,
        pdf: Pdf,
        parsed_stats: ParsedStats
    });

    return Script;

});