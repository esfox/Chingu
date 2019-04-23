const fetch = require('node-fetch');

const api = 'https://papago.naver.com/apis/n2mt/translate';

class Papago
{
    static async translate(parameters)
    {
        let options = new Options();

        Object.keys(Options).forEach(option =>
        {
            if(this.hasOwnProperty(option))
            {
                options[option] = this[option];
                delete this[option];
            }
        });

        options = resolveParameters(options, parameters);
        
        let response = await requestAPI(options);
        if(!this.toObject)
            return response.translatedText;

        return resolveObject(response);
    }

    static from(language)
    {
        this.source = resolveLanguage(language);
        return this;
    }

    static to(language)
    {
        this.target = resolveLanguage(language);
        return this;
    }

    static noHonorifics()
    {
        this.honorific = false;
        return this;
    }

    static noDictionary()
    {
        this.dict = false;
        return this;
    }

    static dictionaryEntries(number)
    {
        if(this.hasOwnProperty(Options.dict))
            throw Error('Please do not call the "noDictionary()" function'
                + ' to use this function.');

        if(!number)
            throw Error('Please provide a number for how many dictionary'
                + ' entries should be shown.');

        this.dictDisplay = number;
        return this;
    }

    static notInstant()
    {
        this.instant = false;
        return this;
    }   

    static toJSON(getJSON = true)
    {
        this.toObject = getJSON;
        return this;
    }
};

Papago.Korean = 'ko';
Papago.English = 'en';
Papago.Japanese = 'ja';
Papago.Chinese_Simplified = 'zh-CN';
Papago.Chinese_Traditional = 'zh-TW';
Papago.Spanish = 'es';
Papago.French = 'fr';
Papago.German = 'de';
Papago.Russian = 'ru';
Papago.Portuguese = 'pt';
Papago.Italian = 'it';
Papago.Vietnamese = 'vi';
Papago.Thai = 'th';
Papago.Indonesian = 'id';
Papago.Hindi = 'hi';

module.exports = Papago;

class Options
{
    constructor()
    {
        this.dict = true;
        this.dictDisplay = 1;
        this.honorific = true;
        this.instant = true;
        this.source = Papago.Korean;
        this.target = Papago.English;
    }
}

Options.dict = 'dict';
Options.dictDisplay = 'dictDisplay';
Options.honorific = 'honorific';
Options.instant = 'instant';
Options.source = 'source';
Options.target = 'target';
Options.text = 'text';

async function requestAPI(options)
{
    const request = 
    {
        method: 'POST',
        body: `data=${getBase64Data(options)}`,
    };

    const response = await fetch(api, request)
        .then(data => data.json());

    return response;
}

function getBase64Data(options) 
{
    return 'rlWxMKMcL2IWMPV6' + 
        Buffer.from('"",'
            + `"dict":${options.dict},`
            + `"dictDisplay":${options.dictDisplay},`
            + `"honorific":${options.honorific},`
            + `"instant":${options.instant},`
            + `"source":"${options.source}",`
            + `"target":"${options.target}",`
            + `"text":"${options.text}"}`)
                .toString('base64');
}

function resolveParameters(options, parameters)
{
    if(!parameters)
       throw Error('Please provide options or text to translate.');

    if(typeof parameters === 'string')
        options.text = parameters;
    else if(typeof parameters === 'object' && !Array.isArray(parameters))
    {
        Object.keys(parameters).forEach(key =>
        {
            if(!Options.hasOwnProperty(key))
                delete parameters[key];
            else options[key] = parameters[key];
        });
    }

    if(!options.dict)
        options.dictDisplay = 0;

    return options;
}

function resolveLanguage(language)
{
    if(!language)
        throw Error('Please provide a valid language code.');

    const simplifyString = (string) => string
        .toLowerCase()
        .trim()
        .replace(/\s/g, '')
        .replace(/\-|\(|\)|\_|\[|\]|\"|\'|\./g, '');
        
    const compare = (text) =>
        simplifyString(text) === simplifyString(language);

    const code = Object.values(Papago).find(compare);
    if(code) return code;

    const key = Object.keys(Papago).find(compare);
    if(key) return Papago[key];

    throw Error(`"${language}" is not a supported language.`);
}

function resolveObject(response)
{
    const languageFromCode = (code) => 
        Object.keys(Papago).find(key => Papago[key] === code)
            .replace('_', ' ');

    const object = 
    {
        translation: response.translatedText,
        fromLanguage: languageFromCode(response.srcLangType),
        fromLanguageCode: response.srcLangType,
        translatedLanguage: languageFromCode(response.tarLangType),
        translatedLanguageCode: response.tarLangType,
        dictionary:
        {
            fromLanguage: response.dict,
            translatedLanguage: response.tarDict
        },
        recommendedSource: response.recommendedSource
    };

    return object;
}